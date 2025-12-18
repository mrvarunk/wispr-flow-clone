import React from "react";

interface RecordingIndicatorProps {
  isRecording: boolean;
  isLoading?: boolean;
}

export const RecordingIndicator: React.FC<RecordingIndicatorProps> = React.memo(({
  isRecording,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 text-xs xs:text-xs sm:text-sm font-medium">
        <div className="relative flex items-center justify-center flex-shrink-0">
          <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-md animate-pulse" />
          <span className="relative flex h-2.5 xs:h-3 w-2.5 xs:w-3 sm:h-3 sm:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 xs:h-3 w-2.5 xs:w-3 sm:h-3 sm:w-3 bg-blue-500 ring-2 ring-blue-500/50" />
          </span>
        </div>
        <span className="text-blue-400 tracking-wide hidden xs:inline">Connecting...</span>
        <span className="text-blue-400 tracking-wide inline xs:hidden text-xs">...</span>
      </div>
    );
  }

  if (!isRecording) {
    return (
      <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 text-xs xs:text-xs sm:text-sm font-medium">
        <div className="relative flex-shrink-0">
          <span className="h-2.5 xs:h-3 w-2.5 xs:w-3 sm:h-3 sm:w-3 rounded-full bg-slate-600 ring-2 ring-slate-700/50 inline-block" />
        </div>
        <span className="text-slate-400 tracking-wide hidden xs:inline">Standby</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 text-xs xs:text-xs sm:text-sm font-bold">
      <div className="relative flex items-center justify-center flex-shrink-0">
        <div className="absolute inset-0 bg-red-500/40 rounded-full blur-md animate-pulse" />
        <span className="relative flex h-3 xs:h-3.5 w-3 xs:w-3.5 sm:h-3.5 sm:w-3.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex h-3 xs:h-3.5 w-3 xs:w-3.5 sm:h-3.5 sm:w-3.5 rounded-full bg-red-500 ring-2 ring-red-500/40 shadow-lg shadow-red-500/50" />
        </span>
      </div>
      <span className="text-red-400 uppercase tracking-wider animate-pulse hidden xs:inline">Recording</span>
      <span className="text-red-400 uppercase tracking-wider animate-pulse inline xs:hidden text-xs">REC</span>
    </div>
  );
});