"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
}

interface ThemeProviderState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    resolvedTheme?: "light" | "dark"; // Actual theme being applied
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
    undefined
);

export function ThemeProvider({
                                  children,
                                  defaultTheme = "system",
                                  storageKey = "vite-ui-theme", // Or any key you prefer
                              }: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window !== "undefined") {
            return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
        }
        return defaultTheme;
    });
    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        const root = window.document.documentElement;
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const applyTheme = (currentTheme: Theme) => {
            let newResolvedTheme: "light" | "dark";

            if (currentTheme === "system") {
                newResolvedTheme = mediaQuery.matches ? "dark" : "light";
            } else {
                newResolvedTheme = currentTheme;
            }

            root.classList.remove("light", "dark");
            root.classList.add(newResolvedTheme);
            setResolvedTheme(newResolvedTheme);
        };

        applyTheme(theme); // Apply theme on initial load

        const handleChange = () => {
            if (theme === "system") {
                applyTheme("system");
            }
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        if (typeof window !== "undefined") {
            localStorage.setItem(storageKey, newTheme);
        }
        setThemeState(newTheme);
    };

    return (
        <ThemeProviderContext.Provider value={{ theme, setTheme, resolvedTheme }}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};