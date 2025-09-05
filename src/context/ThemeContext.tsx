import { createContext, useMemo, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import type { PaletteMode } from "@mui/material";

interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error("useThemeContext must be used within ThemeContextProvider");
  return context;
};

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<PaletteMode>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as PaletteMode;
    if (savedTheme) {
      setMode(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#2563eb",      // Main blue for actions
            light: "#60a5fa",     // Lighter blue for hover/focus
            dark: "#1e40af",      // Darker blue for emphasis
          },
          secondary: {
            main: "#2563eb",      // Use same blue for secondary
            light: "#93c5fd",     // Even lighter blue for subtle accents
            dark: "#1e3a8a",      // Deep blue for strong emphasis
          },
          background: {
            default: mode === "light" ? "#f8fafc" : "#18181b", // Neutral gray/white
            paper: mode === "light" ? "#ffffff" : "#23272f",   // Surface color
          },
          text: {
            primary: mode === "light" ? "#1e293b" : "#f1f5f9",   // Dark for light mode, light for dark mode
            secondary: mode === "light" ? "#64748b" : "#cbd5e1", // Medium gray
            disabled: mode === "light" ? "#94a3b8" : "#475569",  // Subtle gray
          },
          divider: mode === "light" ? "#e2e8f0" : "#334155",     // Border color
        },
        components: {
          MuiInputBase: {
            styleOverrides: {
              root: {
                "& input:-webkit-autofill": {
                  WebkitBoxShadow: `0 0 0 1000px ${
                    mode === "light" ? "#ffffff" : "#23272f"
                  } inset`,
                  WebkitTextFillColor: mode === "light" ? "#1e293b" : "#f1f5f9",
                  transition: "background-color 5000s ease-in-out 0s",
                },
              },
            },
          },
        },
      }),
    [mode]
  );


  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
