import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Box,
  useTheme,
  useMediaQuery,
  Typography,
} from "@mui/material";
import {
  Notifications,
  LightMode,
  DarkMode,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useThemeContext } from "../context/ThemeContext";

interface TopNavBarProps {
  onSidebarToggle?: () => void;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ onSidebarToggle }) => {
  const { mode, toggleTheme } = useThemeContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer - 1,
        bgcolor: theme.palette.background.paper
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 56, sm: 72 },
          px: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isMobile && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Open menu">
                <IconButton
                  onClick={onSidebarToggle}
                  size="large"
                  edge="start"
                  sx={{ mr: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              </Tooltip>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
                >
                  EduCollab
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip
            title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
          >
            <IconButton onClick={toggleTheme}  size="large">
              {mode === "light" ? <DarkMode /> : <LightMode />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton  size="large">
              <Notifications />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavBar;
