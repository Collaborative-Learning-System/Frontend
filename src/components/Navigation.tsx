import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useThemeContext } from "../context/ThemeContext";

export default function Navigation() {
   const { mode, toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const theme = useTheme();
  

  return (
    <AppBar
      position="fixed"
      sx={{ bgcolor: theme.palette.background.default, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
    >
      <Toolbar>
        <Typography
          variant="h5"
          component="div"
          sx={{
            flexGrow: 1,
            color: theme.palette.primary.main,
            fontWeight: "bold",
          }}
        >
          EduCollab
        </Typography>

        {/* <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            onClick={() => navigate("/contact-us")}
            sx={{ color: theme.palette.primary.main }}
          >
            Contact
          </Button>
        </Box> */}

        <Box sx={{ ml: 2, gap: 3, display: "flex", alignItems: "center" }}>
          <Tooltip
            title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
          >
            <IconButton
              onClick={toggleTheme}
              size="large"
              sx={{ color: theme.palette.primary.main }}
            >
              {mode === "light" ? <DarkMode /> : <LightMode />}
            </IconButton>
          </Tooltip>
          <Button
            onClick={() => navigate("/auth")}
            variant="contained"
            sx={{
              mr: 1,
              borderColor: theme.palette.primary.main,
            }}
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
