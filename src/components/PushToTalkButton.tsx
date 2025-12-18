import React from "react";

interface PushToTalkButtonProps {
  isRecording: boolean;
  isLoading: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export const PushToTalkButton: React.FC<PushToTalkButtonProps> = React.memo(({
  isRecording,
  isLoading,
  disabled,
  onClick,
}) => {
  const baseClasses =
    "relative h-16 w-16 xs:h-20 xs:w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-full flex items-center justify-center transition-all duration-500 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-900 active:scale-[0.95] transform-gpu";

  let stateClasses = "";
  let glowClasses = "";
  let ringClasses = "";

  if (disabled) {
    stateClasses = "bg-slate-800/50 text-slate-500 cursor-not-allowed border-2 border-slate-700/50 shadow-lg";
  } else if (isRecording) {
    stateClasses = "bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 border-2 border-red-400/50 shadow-2xl shadow-red-500/30";
    // Multiple pulsing glow rings
    glowClasses = "absolute -inset-4 bg-red-500/30 rounded-full blur-2xl animate-pulse";
    ringClasses = "absolute -inset-2 border-2 border-red-400/40 rounded-full animate-ping";
  } else if (isLoading) {
    stateClasses = "bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-2 border-blue-400/50 shadow-xl";
    glowClasses = "absolute -inset-4 bg-blue-500/20 rounded-full blur-2xl";
  } else {
    stateClasses = "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 border-2 border-blue-400/50 hover:border-blue-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/30";
    glowClasses = "absolute -inset-4 bg-blue-500/0 hover:bg-blue-500/20 rounded-full blur-2xl transition-all duration-500";
  }

  return (
    <div className="relative group flex items-center justify-center">
      {/* Outer glow effect */}
      {!disabled && <div className={glowClasses} />}
      {isRecording && <div className={ringClasses} />}
      
      {/* Button */}
      <button
        type="button"
        disabled={disabled || isLoading}
        onClick={onClick}
        className={`${baseClasses} ${stateClasses}`}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {isLoading ? (
          // Loading Spinner with gradient
          <div className="relative">
            <div className="absolute inset-0 rounded-full border-4 border-blue-400/20" />
            <svg 
              className="animate-spin h-7 xs:h-8 sm:h-10 w-7 xs:w-8 sm:w-10 text-white" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : isRecording ? (
          // Stop Square Icon with animation
          <div className="relative">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-7 xs:w-8 sm:w-10 md:w-12 h-7 xs:h-8 sm:h-10 md:h-12 drop-shadow-lg animate-pulse"
            >
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          </div>
        ) : (
          // Mic/Start Icon
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-8 xs:w-9 sm:w-11 md:w-12 h-8 xs:h-9 sm:h-11 md:h-12 drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
          >
            <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
            <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
          </svg>
        )}
      </button>
    </div>
  );
});