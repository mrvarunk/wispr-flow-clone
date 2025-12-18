import { useCallback, useEffect, useRef, useState } from "react";

export type DeepgramConnectionState =
  | "idle"
  | "connecting"
  | "connected"
  | "error";

export interface DeepgramTranscriptEvent {
  isFinal: boolean;
  text: string;
}

interface UseDeepgramRealtimeOptions {
  apiKey: string;
  language?: string;
  model?: string;
  onTranscript?: (event: DeepgramTranscriptEvent) => void;
  onError?: (message: string) => void;
  onDisconnect?: () => void;
}

/**
 * Handles WebSocket connection to Deepgram's realtime API.
 * Exposes a `sendAudio` function for raw binary audio chunks.
 */
export function useDeepgramRealtime({
  apiKey,
  language = "en-US",
  model = "general",
  onTranscript,
  onError,
  onDisconnect,
}: UseDeepgramRealtimeOptions) {
  const [connectionState, setConnectionState] =
    useState<DeepgramConnectionState>("idle");
  const socketRef = useRef<WebSocket | null>(null);
  const wasConnectedRef = useRef<boolean>(false);

  // Create & connect the websocket
  const connect = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Validate API key format (should be non-empty string)
      if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length === 0) {
        const errorMsg = "Missing or invalid Deepgram API key. Please check your .env file.";
        console.error(errorMsg);
        onError?.(errorMsg);
        reject(new Error(errorMsg));
        return;
      }

      // If already connected, resolve immediately
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      // If connecting, wait for existing connection
      if (socketRef.current && socketRef.current.readyState === WebSocket.CONNECTING) {
        const checkConnection = setInterval(() => {
          if (socketRef.current?.readyState === WebSocket.OPEN) {
            clearInterval(checkConnection);
            resolve();
          } else if (socketRef.current?.readyState === WebSocket.CLOSED) {
            clearInterval(checkConnection);
            reject(new Error("Connection failed"));
          }
        }, 100);
        return;
      }

      // Close any existing socket before creating a new one
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }

      setConnectionState("connecting");

      // Deepgram browser auth via subprotocol: ['token', API_KEY]
      const url = `wss://api.deepgram.com/v1/listen?model=${encodeURIComponent(
        model
      )}&language=${encodeURIComponent(language)}&punctuate=true&interim_results=true`;

      let connectionTimeout: NodeJS.Timeout;
      let connectionRejected = false;

      const cleanup = () => {
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
        }
      };

      const rejectWithError = (errorMsg: string) => {
        if (connectionRejected) return;
        connectionRejected = true;
        cleanup();
        setConnectionState("error");
        wasConnectedRef.current = false;
        console.error("Deepgram connection error:", errorMsg);
        onError?.(errorMsg);
        reject(new Error(errorMsg));
      };

      // Set connection timeout (10 seconds)
      connectionTimeout = setTimeout(() => {
        if (socketRef.current?.readyState === WebSocket.CONNECTING) {
          socketRef.current.close();
          rejectWithError("Deepgram connection timed out. Check your network connection.");
        }
      }, 10000);

      try {
        const socket = new WebSocket(url, ["token", apiKey]);
        socketRef.current = socket;

        socket.onopen = () => {
          if (connectionRejected) return;
          cleanup();
          setConnectionState("connected");
          wasConnectedRef.current = true;
          console.log("Deepgram WebSocket connected");
          resolve();
        };

        socket.onerror = (event) => {
          // onerror fires before onclose, so we'll handle the error in onclose
          // with the close code for better diagnostics
          console.error("Deepgram WebSocket error event", event);
        };

        socket.onclose = (event) => {
          cleanup();
          
          // Get error message from close code
          let errorMsg: string | null = null;
          if (!wasConnectedRef.current) {
            // Connection closed before opening - this is an auth/connection failure
            switch (event.code) {
              case 1006:
                errorMsg = "Deepgram connection failed. Check your API key and network connection.";
                break;
              case 1002:
                errorMsg = "Deepgram API error: Invalid protocol or authentication.";
                break;
              case 1008:
                errorMsg = "Deepgram API error: Invalid API key or unauthorized access.";
                break;
              default:
                if (event.code !== 1000) {
                  errorMsg = `Deepgram connection failed (code: ${event.code}). Check your API key.`;
                }
            }
          } else if (event.wasClean === false) {
            // Abnormal close after connection was established
            errorMsg = "Deepgram connection closed unexpectedly.";
          }

          const wasConnected = wasConnectedRef.current;
          wasConnectedRef.current = false;
          setConnectionState("idle");
          socketRef.current = null;

          // Show error if connection failed before opening
          if (errorMsg && !wasConnected) {
            rejectWithError(errorMsg);
          } else if (errorMsg && wasConnected) {
            onError?.(errorMsg);
          }

          // Notify that we disconnected (so app can stop mic if needed)
          if (wasConnected) {
            onDisconnect?.();
          }
        };

        socket.onmessage = (message: MessageEvent) => {
          try {
            const data = JSON.parse(message.data);
            const transcript =
              data?.channel?.alternatives?.[0]?.transcript ?? "";

            if (!transcript) return;

            const isFinal = data?.is_final ?? false;
            onTranscript?.({ isFinal, text: transcript });
          } catch (err) {
            console.error("Error parsing Deepgram message", err);
          }
        };
      } catch (err: any) {
        cleanup();
        const errorMsg = `Failed to create WebSocket: ${err.message || "Unknown error"}`;
        rejectWithError(errorMsg);
      }
    });
  }, [apiKey, language, model, onError, onTranscript, onDisconnect]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  }, []);

  const sendAudio = useCallback((chunk: ArrayBuffer) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(chunk);
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  return {
    connectionState,
    connect,
    disconnect,
    sendAudio,
  };
}