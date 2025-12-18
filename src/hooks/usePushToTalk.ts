import { useCallback, useRef, useState } from "react";

export type MicState = "idle" | "requesting" | "recording" | "error";

interface UsePushToTalkOptions {
  onChunk: (chunk: ArrayBuffer) => void;
  onError?: (message: string) => void;
}

/**
 * Handles microphone capture with push-to-talk semantics.
 * Starts recording on `start()`, stops on `stop()`.
 * Emits raw audio chunks via `onChunk`.
 */
export function usePushToTalk({ onChunk, onError }: UsePushToTalkOptions) {
  const [micState, setMicState] = useState<MicState>("idle");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
  };

  const start = useCallback(async () => {
    if (micState === "recording" || micState === "requesting") return;

    setMicState("requesting");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Browser-friendly codec that Deepgram supports (WebM Opus).
      const mimeType = "audio/webm;codecs=opus";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        onError?.("Browser does not support required audio format (webm/opus).");
        setMicState("error");
        return;
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = async (event: BlobEvent) => {
        try {
          if (event.data && event.data.size > 0) {
            const buf = await event.data.arrayBuffer();
            onChunk(buf);
          }
        } catch (err) {
          console.error("Error converting audio chunk", err);
        }
      };

      recorder.onerror = (event) => {
        console.error("MediaRecorder error", event);
        onError?.("Recording error occurred.");
        setMicState("error");
      };

      recorder.start(250); // 250ms chunks
      setMicState("recording");
    } catch (err: any) {
      console.error("getUserMedia error", err);

      if (err?.name === "NotAllowedError") {
        onError?.("Microphone permission denied.");
      } else if (err?.name === "NotFoundError") {
        onError?.("No microphone found.");
      } else {
        onError?.("Unable to access microphone.");
      }
      setMicState("error");
      cleanupStream();
    }
  }, [micState, onChunk, onError]);

  const stop = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    cleanupStream();
    if (micState !== "error") {
      setMicState("idle");
    }
  }, [micState]);

  return {
    micState,
    start,
    stop,
  };
}