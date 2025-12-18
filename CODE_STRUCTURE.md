o
# Wispr Flow - Code Structure Guide

## Project Organization

### 📁 Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── ErrorBanner.tsx
│   ├── PushToTalkButton.tsx
│   ├── RecordingIndicator.tsx
│   └── TranscriptionView.tsx
├── hooks/              # Custom React hooks for logic
│   ├── useDeepgramRealtime.ts    # Deepgram API integration
│   ├── useKeyboardShortcut.ts    # Keyboard event handling
│   ├── usePushToTalk.ts          # Microphone recording
│   ├── useRecordingState.ts      # Recording state management
│   └── useTranscriptionText.ts   # Text state management
├── constants/          # Application configuration
│   └── config.ts
├── utils/             # Utility functions
│   └── validation.ts
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## Key Modules

### Custom Hooks

#### `useKeyboardShortcut`
Handles keyboard shortcuts globally without cluttering components.
```tsx
useKeyboardShortcut("Space", handleToggleRecording);
```

#### `useTranscriptionText`
Manages text state (final + live) with clean API.
```tsx
const { finalText, liveText, handleTranscript, updateFinalText, clearAllText } = useTranscriptionText();
```

#### `useRecordingState`
Encapsulates all recording-related state.
```tsx
const { status, error, handleError, clearError, setStatus } = useRecordingState();
```

#### `useDeepgramRealtime`
Handles Deepgram WebSocket connection and transcription.

#### `usePushToTalk`
Manages microphone recording and audio chunks.

### Configuration

#### `constants/config.ts`
Centralized configuration for easy maintenance:
- API keys
- Recording delays
- UI timing

### Utilities

#### `utils/validation.ts`
Reusable validation functions:
- `isValidApiKey()` - Check if API key is valid
- `validateDeepgramApiKey()` - Full validation with error handling

## Component Props

All components accept only necessary props for clarity:

- **ErrorBanner**: `message`, `onClear`
- **PushToTalkButton**: `isRecording`, `isLoading`, `disabled`, `onClick`
- **RecordingIndicator**: `isRecording`, `isLoading`
- **TranscriptionView**: `finalText`, `liveText`, `onClear`, `onTextChange`

## Data Flow

```
App Component
    ├─ useRecordingState()        → Status, error management
    ├─ useTranscriptionText()     → Text state management
    ├─ useDeepgramRealtime()      → WebSocket connection
    ├─ usePushToTalk()            → Mic recording
    └─ useKeyboardShortcut()      → Space key listener
         ↓
    Components (UI rendering)
```

## Benefits of This Structure

1. **Separation of Concerns**: Logic is separate from UI
2. **Reusability**: Hooks and utilities can be used in other components
3. **Testability**: Each hook can be tested independently
4. **Maintainability**: Easy to find and update specific functionality
5. **Scalability**: Easy to add new features without cluttering App.tsx
6. **Performance**: Memoized components prevent unnecessary re-renders
7. **Clarity**: Clear purpose for each file and function

## Adding New Features

### To add a new keyboard shortcut:
1. Use `useKeyboardShortcut` hook in the component

### To add a new UI element:
1. Create component in `components/`
2. Export it and import in App.tsx

### To add new configuration:
1. Add to `constants/config.ts`
2. Import and use in hooks or components

### To add validation:
1. Create utility in `utils/validation.ts`
2. Use in relevant hooks or components
