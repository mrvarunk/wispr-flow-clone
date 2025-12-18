// Application Configuration

export const APP_CONFIG = {
  DEEPGRAM_API_KEY: import.meta.env.VITE_DEEPGRAM_API_KEY as string,
  
  // Recording settings
  RECORDING: {
    STOP_DELAY: 200, // ms delay before disconnecting after stopping
  },
  
  // UI settings
  UI: {
    COPY_FEEDBACK_DURATION: 2000, // ms to show "Copied!" message
  },
} as const;

export const DEEPGRAM_CONFIG = {
  language: "en-US",
  model: "general",
} as const;
