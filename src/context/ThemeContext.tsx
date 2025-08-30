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
            main: mode === "light" ? "#083c70" : "#5da2f0ff",
            dark: mode === "light" ? "#062951" : "#4a8acc",
            light: mode === "light" ? "#1a5490" : "#70b2f3",
          },
          secondary: {
            main: mode === "light" ? "#083c70" : "#63a5f1ff",
            dark: mode === "light" ? "#062951" : "#4f87d1",
            light: mode === "light" ? "#1a5490" : "#7bb4f4",
          },
          success: {
            main: mode === "light" ? "#4caf50" : "#66bb6a",
            dark: mode === "light" ? "#388e3c" : "#4a9c4e",
            light: mode === "light" ? "#66bb6a" : "#81c784",
          },
          background: {
            default: mode === "light" ? "#f7f6f4ff" : "#181818ff",
           // default: mode === "light" ? "#f7f6f4ff" : "#d10303ff",
            paper: mode === "light" ? "#fdfbfbff" : "#1e1e1e",
          },
        },
        components: {
          MuiInputBase: {
            styleOverrides: {
              root: {
                "& input:-webkit-autofill": {
                  WebkitBoxShadow: `0 0 0 1000px ${
                    mode === "light" ? "#fdfbfbff" : "#1e1e1e"
                  } inset`,
                  WebkitTextFillColor: mode === "light" ? "#181818ff" : "#fff",
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
