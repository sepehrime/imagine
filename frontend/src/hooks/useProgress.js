import { createContext, useContext, useState, useEffect, useCallback } from "react";

// Filled by <ProgressProvider> (src/context/ProgressContext.jsx)
export const ProgressContext = createContext(null);

const STORAGE_KEY = "inside_network_progress";
const TOTAL_SECTIONS = 5;

// Keep only valid section ids (guards against hand-edited or stale storage)
function sanitize(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((id) => typeof id === "number" && id >= 1 && id <= TOTAL_SECTIONS);
}

/**
 * Custom Hook: useProgressStore (the state itself — mounted ONCE by <ProgressProvider>)
 *
 * SWE Design Patterns applied:
 * 1. Storage Abstraction Layer: Encapsulates all localStorage read/write logic behind
 *    a clean, predictable JavaScript API. UI components never touch window.localStorage directly.
 * 2. Defensive Error Handling: Gracefully catches JSON deserialization errors or browser
 *    security exceptions (e.g. cookies/storage disabled in incognito mode).
 * 3. Cross-Tab State Synchronization: Listens to the window `storage` event so progress
 *    updates in one browser tab reflect immediately in other open tabs.
 * 4. Derived State Computation: Computes `completedCount`, `isAllComplete`, and `percentage`
 *    reactively from the core list of completed section IDs.
 * 5. Single Instance via Context: only <ProgressProvider> calls this. Before Phase 9 every
 *    page called it directly and got its OWN copy of the state, so a component in the
 *    layout (the confetti) never saw a page mark a section complete.
 */
export function useProgressStore() {
  const [completedSections, setCompletedSections] = useState(() => {
    if (typeof window === "undefined" || !window.localStorage) {
      return [];
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return sanitize(JSON.parse(stored));
      }
    } catch (err) {
      console.warn("Failed to load progress from localStorage:", err);
    }
    return [];
  });

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedSections));
    } catch (err) {
      console.warn("Failed to save progress to localStorage:", err);
    }
  }, [completedSections]);

  // Synchronize across multiple browser tabs
  useEffect(() => {
    function handleStorageChange(event) {
      if (event.key !== STORAGE_KEY) return;
      // newValue is null when another tab removed the key (e.g. Reset Progress)
      if (event.newValue === null) {
        setCompletedSections([]);
        return;
      }
      try {
        setCompletedSections(sanitize(JSON.parse(event.newValue)));
      } catch (err) {
        console.warn("Failed to sync cross-tab progress:", err);
      }
    }
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const isCompleted = useCallback(
    (sectionId) => completedSections.includes(sectionId),
    [completedSections]
  );

  const markCompleted = useCallback((sectionId) => {
    setCompletedSections((prev) => {
      if (prev.includes(sectionId)) return prev;
      return [...prev, sectionId].sort((a, b) => a - b);
    });
  }, []);

  const toggleCompleted = useCallback((sectionId) => {
    setCompletedSections((prev) => {
      if (prev.includes(sectionId)) {
        return prev.filter((id) => id !== sectionId);
      }
      return [...prev, sectionId].sort((a, b) => a - b);
    });
  }, []);

  const resetProgress = useCallback(() => {
    setCompletedSections([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn("Failed to clear progress from localStorage:", err);
    }
  }, []);

  const completedCount = completedSections.length;
  const percentage = Math.round((completedCount / TOTAL_SECTIONS) * 100);
  const isAllComplete = completedCount === TOTAL_SECTIONS;

  return {
    completedSections,
    completedCount,
    totalSections: TOTAL_SECTIONS,
    percentage,
    isAllComplete,
    isCompleted,
    markCompleted,
    toggleCompleted,
    resetProgress,
  };
}

/**
 * Custom Hook: useProgress — what components call to read/update progress.
 *
 * SWE Design Pattern: Context Consumer with Fail-Fast Guard. Throws if used
 * outside <ProgressProvider>, so a missing provider is a loud error instead of
 * silently-unshared state.
 */
export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return ctx;
}
