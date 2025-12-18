import React, { useEffect, useRef, useState } from "react";

interface TranscriptionViewProps {
  finalText: string;
  liveText: string;
  onClear?: () => void;
  onTextChange?: (text: string) => void;
}

export const TranscriptionView: React.FC<TranscriptionViewProps> = React.memo(({
  finalText,
  liveText,
  onClear,
  onTextChange,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasAnyText = Boolean(finalText || liveText);
  const [copied, setCopied] = useState(false);

  // Auto-scroll to bottom when text changes
  useEffect(() => {
    if (liveText || finalText) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [finalText, liveText]);

  const handleCopy = async () => {
    const textToCopy = finalText + (liveText ? " " + liveText : "");
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="relative rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-xl border border-slate-800/60 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-950/90 p-2.5 xs:p-3 sm:p-4 md:p-6 h-[140px] xs:h-[160px] sm:h-[220px] md:h-[280px] overflow-y-auto shadow-inner backdrop-blur-sm scrollbar-thin scrollbar-thumb-slate-700/50 scrollbar-track-transparent hover:scrollbar-thumb-slate-600/70 transition-all duration-300">
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      
      {!hasAnyText && (
        <div className="h-full flex flex-col items-center justify-center text-slate-500/60 text-center px-2 xs:px-3">
          <div className="relative mb-2 xs:mb-3 sm:mb-4">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-8 xs:w-10 sm:w-12 h-8 xs:h-10 sm:h-12 text-slate-600 relative"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" 
              />
            </svg>
          </div>
          <p className="text-xs xs:text-xs sm:text-sm font-medium tracking-wide">Ready to transcribe</p>
          <p className="text-xs text-slate-600 mt-0.5 xs:mt-1 sm:mt-2">Click the button or press Space</p>
        </div>
      )}

      {hasAnyText && (
        <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 relative z-10">
          {finalText && (
            <textarea
              value={finalText}
              onChange={(e) => onTextChange?.(e.target.value)}
              className="w-full min-h-[50px] xs:min-h-[60px] sm:min-h-[80px] md:min-h-[100px] bg-slate-900/20 text-xs xs:text-sm sm:text-base leading-[1.8] font-[450] text-slate-100/95 resize-none border border-slate-700/30 rounded-lg outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 p-1.5 xs:p-2 sm:p-3 transition-all duration-200"
              placeholder="Edit your transcription here..."
              rows={Math.max(2, Math.min(4, finalText.split('\n').length))}
            />
          )}
          {liveText && (
            <div className="relative inline-block">
              <span className="text-blue-400 font-medium relative">
                {liveText}
                <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-blue-400/40 animate-pulse" />
              </span>
              {/* Typing cursor */}
              <span className="inline-block w-0.5 h-5 bg-blue-400 ml-1 animate-pulse" />
            </div>
          )}
        </div>
      )}
      
      {/* Action buttons */}
      {hasAnyText && (
        <div className="flex items-center justify-between gap-1.5 xs:gap-2 sm:gap-3 mt-2 xs:mt-2.5 sm:mt-3 md:mt-4 pt-2 xs:pt-2.5 sm:pt-3 md:pt-4 border-t border-slate-800/40 flex-wrap justify-center xs:justify-start">
          <button
            onClick={handleCopy}
            className="flex items-center gap-0.5 xs:gap-1 sm:gap-2 px-1.5 xs:px-2 sm:px-3 py-1 xs:py-1.5 sm:py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-slate-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-xs"
            title="Copy to clipboard"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-3 xs:w-3 sm:w-4 h-3 xs:h-3 sm:h-4"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" 
              />
            </svg>
            <span className="hidden xs:inline">{copied ? "Copied!" : "Copy"}</span>
          </button>
          
          {onClear && (
            <button
              onClick={onClear}
              className="flex items-center gap-0.5 xs:gap-1 sm:gap-2 px-1.5 xs:px-2 sm:px-3 py-1 xs:py-1.5 sm:py-2 rounded-lg bg-red-900/40 hover:bg-red-800/60 text-red-300 hover:text-red-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 text-xs"
              title="Clear all text"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-3 xs:w-3 sm:w-4 h-3 xs:h-3 sm:h-4"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" 
                />
              </svg>
              <span className="hidden xs:inline">Clear</span>
            </button>
          )}
        </div>
      )}
      
      {/* Dummy element for scrolling to bottom */}
      <div ref={bottomRef} className="h-2" />
    </div>
  );
});