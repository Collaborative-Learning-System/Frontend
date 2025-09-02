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
            main: mode === "light" ? "#407cb7ff" : "#42a5f5",
            dark: mode === "light" ? "#1565c0" : "#1e88e5",
            light: mode === "light" ? "#42a5f5" : "#64b5f6",
          },
          secondary: {
            main: mode === "light" ? "#8ed33eff" : "#b2cf6eff",
            dark: mode === "light" ? "#80bf39ff" : "#6eb027ff",
            light: mode === "light" ? "#81bd69ff" : "#b4d893ff",
          },
          success: {
            main: mode === "light" ? "#2e7d32" : "#4caf50",
            dark: mode === "light" ? "#1b5e20" : "#388e3c",
            light: mode === "light" ? "#4caf50" : "#66bb6a",
          },
          error: {
            main: mode === "light" ? "#d32f2f" : "#f44336",
            dark: mode === "light" ? "#c62828" : "#d32f2f",
            light: mode === "light" ? "#f44336" : "#ef5350",
          },
          warning: {
            main: mode === "light" ? "#ed6c02" : "#ff9800",
            dark: mode === "light" ? "#e65100" : "#f57c00",
            light: mode === "light" ? "#ff9800" : "#ffb74d",
          },
          info: {
            main: mode === "light" ? "#0288d1" : "#29b6f6",
            dark: mode === "light" ? "#01579b" : "#0277bd",
            light: mode === "light" ? "#03a9f4" : "#4fc3f7",
          },
          background: {
            default: mode === "light" ? "#fafafa" : "#121212",
            paper: mode === "light" ? "#ffffff" : "#1e1e1e",
          },
          text: {
            primary: mode === "light" ? "#212121" : "#ffffff",
            secondary: mode === "light" ? "#757575" : "#b0b0b0",
          },
        },

        components: {
          MuiInputBase: {
            styleOverrides: {
              root: {
                "& input:-webkit-autofill": {
                  WebkitBoxShadow: `0 0 0 1000px ${
                    mode === "light" ? "#ffffff" : "#1e1e1e"
                  } inset`,
                  WebkitTextFillColor: mode === "light" ? "#212121" : "#ffffff",
                  transition: "background-color 5000s ease-in-out 0s",
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: "none",
                border:
                  mode === "light" ? "1px solid #e0e0e0" : "1px solid #424242",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                boxShadow: "none",
                border:
                  mode === "light" ? "1px solid #e0e0e0" : "1px solid #424242",
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                boxShadow: "none",
                borderBottom:
                  mode === "light" ? "1px solid #e0e0e0" : "1px solid #424242",
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
