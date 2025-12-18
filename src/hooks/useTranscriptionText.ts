import { useState, useCallback } from "react";

/**
 * Custom hook for managing transcription text state
 * Handles final text and live text separately
 */
export function useTranscriptionText() {
  const [finalText, setFinalText] = useState("");
  const [liveText, setLiveText] = useState("");

  const handleTranscript = useCallback(
    ({ isFinal, text }: { isFinal: boolean; text: string }) => {
      if (isFinal) {
        // Add final text to the collection
        setFinalText((prev) => (prev ? `${prev} ${text}` : text));
        setLiveText("");
      } else {
        // Update live/interim text
        setLiveText(text);
      }
    },
    []
  );

  const updateFinalText = useCallback((text: string) => {
    setFinalText(text);
  }, []);

  const clearAllText = useCallback(() => {
    setFinalText("");
    setLiveText("");
  }, []);

  return {
    finalText,
    liveText,
    handleTranscript,
    updateFinalText,
    clearAllText,
  };
}
