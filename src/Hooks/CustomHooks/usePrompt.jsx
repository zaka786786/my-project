// src/hooks/usePrompt.js
import { useContext, useEffect } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

export function usePrompt(when, message) {
  const navigator = useContext(NavigationContext).navigator;

  useEffect(() => {
    if (!when) return;

    const unblock = navigator.block((tx) => {
      if (window.confirm(message)) {
        unblock(); // Unblock navigation
        tx.retry(); // Retry navigation
      }
    });

    return unblock; // Cleanup on unmount
  }, [navigator, when, message]);
}
