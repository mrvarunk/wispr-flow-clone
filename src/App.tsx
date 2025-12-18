import React, { useCallback, useMemo, useEffect } from "react";
import { usePushToTalk } from "./hooks/usePushToTalk";
import { useDeepgramRealtime } from "./hooks/useDeepgramRealtime";
import { useRecordingState } from "./hooks/useRecordingState";
import { useTranscriptionText } from "./hooks/useTranscriptionText";
import { useKeyboardShortcut } from "./hooks/useKeyboardShortcut";
import { RecordingIndicator } from "./components/RecordingIndicator";
import { TranscriptionView } from "./components/TranscriptionView";
import { ErrorBanner } from "./components/ErrorBanner";
import { PushToTalkButton } from "./components/PushToTalkButton";
import { APP_CONFIG } from "./constants/config";
import { validateDeepgramApiKey } from "./utils/validation";

const App: React.FC = () => {
  // Text management
  const { finalText, liveText, handleTranscript, updateFinalText, clearAllText } =
    useTranscriptionText();

  // Recording state management
  const {
    status,
    setStatus,
    error,
    handleError,
    clearError,
    micStateRef,
    stopMicRef,
    syncMicState,
    syncStopMic,
  } = useRecordingState();

  const { connectionState, connect, disconnect, sendAudio } =
    useDeepgramRealtime({
      apiKey: APP_CONFIG.DEEPGRAM_API_KEY,
      onTranscript: handleTranscript,
      onError: handleError,
      onDisconnect: () => {
        // Safety cleanup: if DG disconnects unexpectedly, stop mic
        if (micStateRef.current === "recording") {
          stopMicRef.current?.();
        }
        setStatus((prev) => (prev === "error" ? prev : "ready"));
      },
    });

  const { micState, start: startMic, stop: stopMic } = usePushToTalk({
    onChunk: (chunk) => sendAudio(chunk),
    onError: handleError,
  });

  // Sync state refs
  useEffect(() => {
    syncMicState(micState);
  }, [micState, syncMicState]);

  useEffect(() => {
    syncStopMic(stopMic);
  }, [stopMic, syncStopMic]);

  // Determine if actively recording
  const isRecording = useMemo(
    () => micState === "recording" && connectionState === "connected",
    [micState, connectionState]
  );

  const isLoading = status === "recording" && !isRecording;

  // Handle recording toggle (start/stop)
  const handleToggleRecording = useCallback(
    async () => {
      if (isRecording || isLoading) {
        // STOP recording
        setStatus("stopping");
        stopMic();
        setTimeout(() => {
          if (connectionState === "connected") {
            disconnect();
          }
          setStatus("ready");
        }, APP_CONFIG.RECORDING.STOP_DELAY);
      } else {
        // START recording
        if (!validateDeepgramApiKey(APP_CONFIG.DEEPGRAM_API_KEY, handleError)) {
          return;
        }

        setStatus("recording");
        try {
          await connect();
          await startMic();
        } catch (err: any) {
          handleError(err.message || "Failed to start recording.");
          stopMic();
          if (connectionState !== "idle") disconnect();
        }
      }
    },
    [
      isRecording,
      isLoading,
      connectionState,
      stopMic,
      disconnect,
      startMic,
      connect,
      handleError,
      setStatus,
    ]
  );

  // Setup keyboard shortcut (Space key)
  useKeyboardShortcut("Space", handleToggleRecording);

  // UI Render
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-2 xs:p-3 sm:p-4 md:p-6 overflow-hidden font-sans antialiased">
      {/* Animated Background Ambient Glows - hidden on mobile */}
      <div className="absolute top-[-15%] left-[-15%] w-[250px] xs:w-[300px] sm:w-[400px] md:w-[500px] h-[250px] xs:h-[300px] sm:h-[400px] md:h-[500px] bg-blue-600/15 rounded-full blur-[80px] xs:blur-[100px] sm:blur-[120px] md:blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[250px] xs:w-[300px] sm:w-[400px] md:w-[500px] h-[250px] xs:h-[300px] sm:h-[400px] md:h-[500px] bg-purple-600/10 rounded-full blur-[80px] xs:blur-[100px] sm:blur-[120px] md:blur-[140px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/60 rounded-xl xs:rounded-2xl sm:rounded-2xl md:rounded-3xl shadow-lg xs:shadow-lg sm:shadow-xl md:shadow-2xl flex flex-col overflow-hidden transition-all duration-500 hover:border-slate-700/80 hover:shadow-blue-900/20">
        {/* Subtle top gradient */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        
        {/* Header */}
        <header className="px-3 xs:px-4 sm:px-6 md:px-8 py-3 xs:py-4 sm:py-5 md:py-6 border-b border-slate-800/40 bg-gradient-to-r from-slate-900/50 to-slate-800/30 flex items-center justify-between backdrop-blur-sm flex-wrap gap-2 xs:gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-md" />
              <div className="relative w-7 xs:w-8 sm:w-9 md:w-10 h-7 xs:h-8 sm:h-9 md:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-4 xs:w-5 sm:w-5 md:w-6 h-4 xs:h-5 sm:h-5 md:h-6 text-white"
                >
                  <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                  <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
                </svg>
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-300 truncate">
                Wispr Flow
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 truncate">Realtime Voice Transcription</p>
            </div>
          </div>
          
          {/* Connection Status Indicator */}
          <div className={`flex items-center gap-1.5 xs:gap-2 text-xs font-semibold py-1.5 xs:py-2 px-2.5 xs:px-3 sm:px-4 rounded-full border backdrop-blur-sm transition-all duration-300 flex-shrink-0 ${
            connectionState === 'connected' 
              ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300 shadow-lg shadow-emerald-900/20' 
              : connectionState === 'connecting'
              ? 'bg-blue-950/40 border-blue-700/50 text-blue-300'
              : 'bg-slate-800/60 border-slate-700/50 text-slate-400'
          }`}>
            <div className={`w-2.5 h-2.5 rounded-full ${
              connectionState === 'connected' 
                ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse' 
                : connectionState === 'connecting'
                ? 'bg-blue-400 animate-pulse'
                : 'bg-slate-500'
            }`} />
            <span className="tracking-wide text-xs xs:text-xs sm:text-sm">
              {connectionState === 'connected' ? 'Online' : connectionState === 'connecting' ? 'Connecting...' : 'Ready'}
            </span>
          </div>
        </header>

        {/* Body */}
        <div className="p-3 xs:p-4 sm:p-6 md:p-8 flex flex-col gap-3 xs:gap-4 sm:gap-5 md:gap-6 bg-gradient-to-b from-slate-900/40 to-slate-950/40">
          <ErrorBanner message={error} onClear={clearError} />

          {/* Transcription Area */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition duration-700" />
            <div className="relative">
              <TranscriptionView
                finalText={finalText}
                liveText={liveText}
                onClear={clearAllText}
                onTextChange={updateFinalText}
              />
            </div>
          </div>

          {/* Controls Footer */}
          <div className="mt-1 xs:mt-2 sm:mt-3 flex flex-col items-center justify-center gap-2 xs:gap-3 sm:gap-4 md:gap-5">
            {/* Recording Status */}
            <div className="h-5 xs:h-6 sm:h-7 flex items-center">
              <RecordingIndicator isRecording={isRecording} isLoading={isLoading} />
            </div>

            {/* Main Button */}
            <PushToTalkButton
              isRecording={isRecording}
              isLoading={isLoading}
              disabled={status === "error"}
              onClick={handleToggleRecording}
            />
            
            {/* Helper Text */}
            <p className="text-xs uppercase tracking-[0.12em] xs:tracking-[0.15em] text-slate-500 font-semibold transition-colors duration-300 text-center px-2 xs:px-3 sm:px-4 line-clamp-2">
              {isRecording ? "Click to Stop Recording (or press Space)" : isLoading ? "Connecting..." : "Click to Start Recording (or press Space)"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;