import React from "react";

interface ErrorBannerProps {
  message: string | null;
  onClear?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = React.memo(({
  message,
  onClear,
}) => {
  if (!message) return null;

  return (
    <div className="relative overflow-hidden rounded-lg xs:rounded-lg sm:rounded-xl border border-red-500/40 bg-gradient-to-r from-red-950/80 via-red-900/70 to-red-950/80 backdrop-blur-sm px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3.5 text-xs xs:text-xs sm:text-sm text-red-100 shadow-lg shadow-red-900/20 animate-in slide-in-from-top-2 duration-300">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.3),transparent_50%)]" />
      
      <div className="relative flex items-start gap-2 xs:gap-3 sm:gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5 hidden xs:block">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/30 rounded-full blur-sm animate-pulse" />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-4 xs:w-5 sm:w-5 h-4 xs:h-5 sm:h-5 text-red-400 relative"
            >
              <path 
                fillRule="evenodd" 
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold mb-0.5 xs:mb-1 text-red-100 text-xs xs:text-xs sm:text-sm">Error</div>
          <div className="text-red-200/90 text-xs leading-relaxed break-words line-clamp-3">{message}</div>
        </div>
        
        {/* Dismiss button */}
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="flex-shrink-0 ml-1 xs:ml-2 p-1 xs:p-1.5 rounded-lg text-red-300/70 hover:text-red-100 hover:bg-red-900/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            aria-label="Dismiss error"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth={2}
              className="w-3.5 xs:w-4 sm:w-4 h-3.5 xs:h-4 sm:h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
});