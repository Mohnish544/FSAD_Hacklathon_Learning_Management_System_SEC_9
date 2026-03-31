"use client";

import { useEffect, useState } from "react";

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    // Initialize dark mode from localStorage or system preference
    const stored = localStorage.getItem("darkMode");
    let darkMode: boolean;

    if (stored) {
      darkMode = stored === "true";
    } else {
      darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    setIsDark(darkMode);
    applyDarkMode(darkMode);
  }, []);

  const applyDarkMode = (dark: boolean) => {
    const htmlElement = document.documentElement;
    if (dark) {
      htmlElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      htmlElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  };

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    applyDarkMode(newIsDark);
  };

  if (isDark === null) {
    // Don't render anything until hydration is complete
    return <div className="h-10 w-10" />;
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2.5 transition hover:bg-slate-100 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:border-slate-600"
      aria-label="Toggle dark mode"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <svg
          className="h-5 w-5 text-amber-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      ) : (
        <svg
          className="h-5 w-5 text-slate-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.657-9.193a1 1 0 00-1.414 0l-.707.707A1 1 0 005.05 6.464l.707-.707a1 1 0 001.414-1.414zm0 18.386a1 1 0 001.414 0l.707-.707a1 1 0 00-1.414-1.414l-.707.707a1 1 0 000 1.414zM5.05 6.464a1 1 0 00-1.414-1.414l-.707.707A1 1 0 106.464 5.05l-.707-.707z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}
