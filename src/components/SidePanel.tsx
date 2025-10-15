import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Avatar,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
  alpha,
  Tooltip,
} from "@mui/material";
import {
  ChevronLeft,
  Home,
  AutoFixHigh,
  Logout,
  AutoAwesome,
  Dashboard,
} from "@mui/icons-material";
import { AppContext } from "../context/AppContext";

interface SidePanelProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ open, onToggle, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, logout } = useContext(AppContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (err) {
      // ignore — logout handles navigation / errors
    } finally {
      setIsLoggingOut(false);
    }
  };

  const drawerWidthOpen = 260;
  const drawerWidthClosed = 70;

  const menuItems = [
    {
      text: "Home",
      icon: (
        <Tooltip title="Home">
          <Home />
        </Tooltip>
      ),
      path: "/landing",
    },
    {
      text: "Dashboard",
      icon: (
        <Tooltip title="Dashboard">
          <Dashboard />
        </Tooltip>
      ),
      path: "/dashboard",
    },
    {
      text: "Study Plans",
      icon: (
        <Tooltip title="Study Plans">
          <AutoFixHigh />
        </Tooltip>
      ),
      path: "/study-plans-generator",
    },
    {
      text: "Document Summary",
      icon: (
        <Tooltip title="Document Summary">
          <AutoAwesome />
        </Tooltip>
      ),
      path: "/document-summary",
    },
  ];

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    if (isMobile) onClose();
  };

  const drawerContent = (
    <Box
      sx={{
        width: open ? drawerWidthOpen : drawerWidthClosed,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.background.paper,
        transition: theme.transitions.create(["width"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          borderBottom: `1px solid ${theme.palette.divider}`,
          minHeight: 64,
        }}
      >
        {open ? (
          <>
            <Box
              component="img"
              src="/EduCollab.png"
              alt="EduCollab Logo"
              sx={{
                width: 35,
                height: 35,
                borderRadius: 0,
                objectFit: "cover",
                animation: "logoFloat 2s ease-in-out infinite",
                "@keyframes logoFloat": {
                  "0%, 100%": {
                    transform: "translateY(0px) rotate(0deg)",
                  },
                  "50%": {
                    transform: "translateY(-4px) rotate(-10deg)",
                  },
                },
                "&:hover": {
                  animation: "logoSpin 0.8s ease-in-out",
                  "@keyframes logoSpin": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                  },
                },
              }}
            />
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
              
            >
              EDUCollab
            </Typography>
            <IconButton onClick={onToggle} size="small">
              <ChevronLeft sx={{ color: theme.palette.primary.main }} />
            </IconButton>
          </>
        ) : (
          <Box
            component="img"
            src="/EduCollab.png"
            alt="EduCollab Logo"
            onClick={onToggle}
            sx={{
              width: 40,
              height: 40,
              borderRadius: 12,
              objectFit: "cover",
              cursor: "pointer",
              animation: "logoFloat 3s ease-in-out infinite",
              "@keyframes logoFloat": {
                "0%, 100%": {
                  transform: "translateY(0px) rotate(0deg)",
                },
                "50%": {
                  transform: "translateY(-3px) rotate(2deg)",
                },
              },
              "&:hover": {
                animation: "logoSpin 0.8s ease-in-out",
                "@keyframes logoSpin": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" },
                },
              },
            }}
          />
        )}
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        <List sx={{ px: 1, py: 2 }}>
          {menuItems.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={isSelected}
                  onClick={() => handleMenuItemClick(item.path)}
                  sx={{
                    borderRadius: 2,
                    justifyContent: open ? "initial" : "center",
                    px: open ? 2 : 1,
                    minHeight: 48,
                    "&:hover": { backgroundColor: theme.palette.action.hover },
                    "&.Mui-selected": {
                      backgroundColor: theme.palette.action.focus,
                      "&:hover": {
                        backgroundColor: theme.palette.action.focus,
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: open ? 40 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={item.text}
                      sx={{ ml: 1, opacity: open ? 1 : 0 }}
                      primaryTypographyProps={{
                        fontSize: "0.9rem",
                        fontWeight: isSelected ? 600 : 500,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Bottom Section - Profile and Logout */}
      <Box
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          p: open ? 2 : 1,
        }}
      >
        {/* Profile Section */}
        {open ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              borderRadius: 2,
              cursor: "pointer",
              "&:hover": { backgroundColor: theme.palette.action.hover },
            }}
            onClick={() => navigate("/profile")}
          >
            <Avatar
              src={userData?.profilePicture || ""}
              sx={{
                width: 40,
                height: 40,
                fontSize: "1rem",
                mr: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }}
            >
              {userData?.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </Avatar>

            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography 
                variant="subtitle2" 
                fontWeight="bold"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >
                {userData?.fullName}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block"
                }}
              >
                {userData?.email}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 1,
              borderRadius: 2,
              cursor: "pointer",
              "&:hover": { backgroundColor: theme.palette.action.hover },
            }}
            onClick={() => navigate("/profile")}
          >
            <Tooltip title="View Profile">
              <Avatar
                src={userData?.profilePicture || ""}
                sx={{
                  width: 40,
                  height: 40,
                  fontSize: "1rem",
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }}
              >
                {userData?.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar>
            </Tooltip>
          </Box>
        )}
        <Divider sx={{ my: 1 }} />
        {/* Logout Button */}
        <ListItemButton
          onClick={handleLogout}
          disabled={isLoggingOut}
          sx={{
            borderRadius: 2,
            justifyContent: open ? "initial" : "center",
            px: open ? 2 : 1,
            minHeight: 48,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
              color: theme.palette.error.contrastText,
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: theme.palette.error.main,
              minWidth: open ? 40 : "auto",
              justifyContent: "center",
            }}
          >
            {isLoggingOut ? (
              <CircularProgress size={20} sx={{ color: theme.palette.error.main }} />
            ) : (
              <Tooltip title="Log Out">
                <Logout />
              </Tooltip>
            )}
          </ListItemIcon>
          {open && (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.error.main,
              }}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Typography>
          )}
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"}
      anchor="left"
      open={isMobile ? open : true}
      onClose={isMobile ? onClose : undefined}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: open ? drawerWidthOpen : drawerWidthClosed,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidthOpen : drawerWidthClosed,
          boxSizing: "border-box",
          zIndex: theme.zIndex.drawer,
          bgcolor: theme.palette.background.paper,
          transition: theme.transitions.create(["width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: "hidden",
          border: "none",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default SidePanel;
