import React, { use, useContext } from "react";
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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ChevronLeft,
  Home,
  AutoFixHigh,
  SmartToy,
  Logout,
  AccountCircle,
} from "@mui/icons-material";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import NotificationService from "../services/NotificationService";

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
  const { userData, setUserData, setUserId } = useContext(AppContext);

  const drawerWidthOpen = 260;
  const drawerWidthClosed = 70;

  const menuItems = [
    { text: "Home", icon: <Home />, path: "/landing" },
    {
      text: "Study Plans",
      icon: <AutoFixHigh />,
      path: "/study-plans-generator",
    },
    { text: "AI Assistant", icon: <SmartToy />, path: "/ai-assistant" },
  ];

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    if (isMobile) onClose();
  };

  const handleLogout = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    try {
      const response = await axios.post(
        `${backendUrl}/auth/logout/${userData?.userId}`
      );
      console.log("response", response);
      if (response.data.success) {
        NotificationService.showSuccess("Logged out successfully");
        setTimeout(() => {
          navigate("/auth");
          setUserData(null);
          setUserId("");
        }, 1000);
      }
    } catch (error) {
      NotificationService.showError("Failed to log out");
    }
  };

  const handleProfile = () => {
    navigate("/profile");
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
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
            >
              EduCollab
            </Typography>
            <IconButton onClick={onToggle} size="small">
              <ChevronLeft sx={{ color: theme.palette.primary.main }} />
            </IconButton>
          </>
        ) : (
          <IconButton
            onClick={onToggle}
            size="small"
            sx={{
              color: theme.palette.primary.main,
              fontSize: "1.2rem",
              fontWeight: "bold",
              width: 40,
              height: 40,
              border: `2px solid ${theme.palette.primary.main}`,
              borderRadius: "8px",
            }}
          >
            E
          </IconButton>
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
                      //color: theme.palette.primary.main,

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
                        // color: isSelected
                        //   ? theme.palette.primary.main
                        //   : theme.palette.text.primary,
                        //color: theme.palette.primary.main,
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
            onClick={handleProfile}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                mr: 2,
                //bgcolor: theme.palette.primary.main,
              }}
            >
              <AccountCircle />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                // sx={{ color: theme.palette.primary.main }}
              >
                {userData?.fullName}
              </Typography>
              <Typography
                variant="caption"
                // sx={{ color: theme.palette.primary.main }}
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
            onClick={handleProfile}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: theme.palette.primary.main,
              }}
            >
              <AccountCircle />
            </Avatar>
          </Box>
        )}
        <Divider sx={{ my: 1 }} />
        {/* Logout Button */}
        <ListItemButton
          onClick={handleLogout}
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
            <Logout />
          </ListItemIcon>
          {open && (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.error.main,
              }}
              onClick={handleLogout}
            >
              Logout
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
          boxShadow: theme.shadows[2],
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default SidePanel;
