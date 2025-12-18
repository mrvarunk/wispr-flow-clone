import { useState, useCallback, useRef } from "react";

type RecordingStatus = "idle" | "ready" | "recording" | "stopping" | "error";

/**
 * Custom hook for managing recording state and lifecycle
 */
export function useRecordingState() {
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  // Refs for cleanup callbacks
  const micStateRef = useRef<string>("idle");
  const stopMicRef = useRef<(() => void) | null>(null);

  const handleError = useCallback((message: string) => {
    console.error(message);
    setError(message);
    setStatus("error");
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    if (status === "error") setStatus("idle");
  }, [status]);

  const syncMicState = useCallback((micState: string) => {
    micStateRef.current = micState;
  }, []);

  const syncStopMic = useCallback((stopMic: () => void) => {
    stopMicRef.current = stopMic;
  }, []);

  return {
    status,
    setStatus,
    error,
    setError,
    handleError,
    clearError,
    micStateRef,
    stopMicRef,
    syncMicState,
    syncStopMic,
  };
}
