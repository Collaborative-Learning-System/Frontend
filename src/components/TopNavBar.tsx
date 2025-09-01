import React from "react";
import {
  AppBar,
  Toolbar,
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
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Badge, { badgeClasses } from "@mui/material/Badge";
import { useThemeContext } from "../context/ThemeContext";

interface TopNavBarProps {
  onSidebarToggle?: () => void;
}

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
  }
`;

const TopNavBar: React.FC<TopNavBarProps> = ({ onSidebarToggle }) => {
  const { mode, toggleTheme } = useThemeContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar
      position="fixed"
      elevation={1}
      color="transparent"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer - 1,
        bgcolor: theme.palette.background.paper,
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
                  variant="h5"
                  sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
                >
                  EduCollab
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
         
          {/* <Box
            sx={{
              display: { xs: "none", sm: "flex" }, // hidden on xs (mobile)
              alignItems: "center",
            }}
          >
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </Box>

        
          <Box
            sx={{
              display: { xs: "flex", sm: "none" }, // show only on mobile
            }}
          >
            <IconButton>
              <SearchIcon />
            </IconButton>
          </Box> */}
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
          <Tooltip title="Notifications">
            <IconButton size="large" sx={{ color: theme.palette.primary.main }}>
              <Notifications />
              <CartBadge badgeContent={2} color="warning" overlap="circular" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavBar;
