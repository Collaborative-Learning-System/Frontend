import React, { useContext } from "react";
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
  alpha,
  Tooltip,
} from "@mui/material";
import {
  ChevronLeft,
  Home,
  AutoFixHigh,
  Logout,
  ContactPhoneRounded,
  AutoAwesome,
} from "@mui/icons-material";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
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
  const { userData,logout } = useContext(AppContext);

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
    {
      text: "Real-Time Collaboration",
      icon: (
        <Tooltip title="Real-Time Collaboration">
          <GroupWorkIcon />
        </Tooltip>
      ),
      path: "/real-time-collaboration",
    },
    {
      text: "Contact Us",
      icon: (
        <Tooltip title="Contact Us">
          <ContactPhoneRounded />
        </Tooltip>
      ),
      path: "/contact-us",
    },
  ];

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    if (isMobile) onClose();
  };

   const handleLogging = async () => {
     const loggingData = {
       userId: localStorage.getItem("userId"),
       activity: "User logged out from the system",
       timestamp: new Date().toISOString(),
     };
     try {
       if (
         !loggingData.userId ||
         !loggingData.activity ||
         !loggingData.timestamp
       )
         return;
       const response = await axios.post(
         `${import.meta.env.VITE_BACKEND_URL}/notification/log-activity`,
         loggingData
       );
       if (response) {
         console.log("Logging response:", response.data);
       }
     } catch (error) {
       console.error("Error logging activity:", error);
     }
   };

  const handleLogout = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    try {
      const response = await axios.post(
        `${backendUrl}/auth/logout/${userData?.userId}`
      );
      if (response.data.success) {
           handleLogging();
        NotificationService.showSuccess("Logged out successfully");
        setTimeout(() => {
          navigate("/auth");
          logout();
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
            <Box
              component="img"
              src="/EduCollab.png"
              alt="EduCollab Logo"
              sx={{
                width: 40,
                height: 40,
                borderRadius: 12,
                objectFit: "cover",
              }}
            />
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
            >
              EduCollab
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
              src={""}
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

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {userData?.fullName}
              </Typography>
              <Typography variant="caption">{userData?.email}</Typography>
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
            <Tooltip title="View Profile">
              <Avatar
                src={""}
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
            <Tooltip title="Log Out">
              <Logout />
            </Tooltip>
          </ListItemIcon>
          {open && (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.error.main,
              }}
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
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default SidePanel;
