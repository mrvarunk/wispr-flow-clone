import { useEffect, useCallback } from "react";

/**
 * Custom hook for handling keyboard shortcuts
 * @param key - The keyboard key code to listen for (e.g., "Space")
 * @param callback - Function to execute when key is pressed
 * @param excludeTagNames - HTML tag names to exclude from triggering (e.g., INPUT, TEXTAREA)
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  excludeTagNames: string[] = ["INPUT", "TEXTAREA"]
): void {
  const memoizedCallback = useCallback(callback, [callback]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const targetTag = (event.target as HTMLElement).tagName;
      
      // Only trigger if not in an excluded element
      if (event.code === key && !excludeTagNames.includes(targetTag)) {
        event.preventDefault();
        memoizedCallback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, memoizedCallback]);
}
