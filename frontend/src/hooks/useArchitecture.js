import { useState, useEffect, useCallback } from "react";
import { sanitizeArchitecture } from "../utils/architecture";

const STORAGE_KEY = "inside_network_architecture";

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? sanitizeArchitecture(JSON.parse(raw)) : null;
  } catch (err) {
    console.warn("Failed to load architecture from localStorage:", err);
    return null;
  }
}

/**
 * Custom Hook: useArchitecture
 *
 * Holds the architecture "locked" in Section 2 so Section 3 (Forward Pass)
 * can reuse it. `locked` is null until the learner locks one.
 *
 * SWE Design Patterns applied:
 * 1. Storage Abstraction Layer: components call lock()/unlock(); only this
 *    hook touches localStorage (same pattern as useProgress).
 * 2. Validate at the Boundary: stored data goes through sanitizeArchitecture,
 *    so a hand-edited or outdated value falls back to null, not a crash.
 * 3. Cross-Tab Sync: listens to the `storage` event, including the
 *    `newValue === null` case when another tab clears the key.
 */
export function useArchitecture() {
  const [locked, setLocked] = useState(readStored);

  useEffect(() => {
    function handleStorage(event) {
      if (event.key !== STORAGE_KEY) return;
      if (event.newValue === null) {
        setLocked(null);
        return;
      }
      try {
        setLocked(sanitizeArchitecture(JSON.parse(event.newValue)));
      } catch {
        setLocked(null);
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const lock = useCallback((config) => {
    const clean = sanitizeArchitecture(config);
    if (!clean) return;
    setLocked(clean);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    } catch (err) {
      console.warn("Failed to save architecture to localStorage:", err);
    }
  }, []);

  const unlock = useCallback(() => {
    setLocked(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn("Failed to clear architecture from localStorage:", err);
    }
  }, []);

  return { locked, lock, unlock };
}
