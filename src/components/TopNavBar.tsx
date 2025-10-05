import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Tooltip,
  Box,
  useTheme,
  useMediaQuery,
  Typography,
  Menu,
  MenuItem,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Notifications,
  LightMode,
  DarkMode,
  Menu as MenuIcon,
  Circle,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Badge, { badgeClasses } from "@mui/material/Badge";
import { useThemeContext } from "../context/ThemeContext";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface TopNavBarProps {
  onSidebarToggle?: () => void;
}

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
  }
`;

interface Notification {
  notificationId: string;
  notification: string;
  timestamp: string;
  userId: string;
  isRead: boolean;
  link?: string;
}

  const TopNavBar: React.FC<TopNavBarProps> = ({ onSidebarToggle }) => {
  const { mode, toggleTheme } = useThemeContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { userId } = useContext(AppContext);
  const navigate = useNavigate();

  // Notification state
  const [notificationAnchor, setNotificationAnchor] =
    useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Calculate unread notifications count
  const unreadCount = notifications.filter(n => !n.isRead).length; 
  const handleNotificationClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const getNotifications = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/notification/get-notifications/${userId}`
      );

      // Access the data array from the response
      if (response.data && response.data.success && response.data.data) {
        setNotifications(response.data.data);
      } else {
        setNotifications([]);
      }
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };

  useEffect(() => {
    if (userId) {
      getNotifications();
    }
  }, [userId]);

  const handleNotificationRedirect = async (notification: Notification) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/notification/mark-as-read/${
          notification.notificationId
        }`
      );
      
      // Update local state to mark notification as read
      setNotifications(prevNotifications =>
        prevNotifications.map(n =>
          n.notificationId === notification.notificationId
            ? { ...n, isRead: true }
            : n
        )
      );
      
      if (notification.link) {
        navigate(`${notification.link}`);
      }
      handleNotificationClose();
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

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
                  <MenuIcon sx={{ color: theme.palette.primary.main }} />
                </IconButton>
              </Tooltip>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.primary.main,
                  }}
                >
                  EduCollab
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
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
            <IconButton
              size="large"
              sx={{ color: theme.palette.primary.main }}
              onClick={handleNotificationClick}
            >
              <Notifications />
              <CartBadge
                badgeContent={unreadCount}
                color="error"
                overlap="circular"
              />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* Notification Dropdown Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 320,
            maxWidth: { xs: "90vw", sm: 400 },
            maxHeight: 500,
            mt: 1,
            overflow: "hidden",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box
          sx={{
            p: 2,
            pb: 1,
            overflow: "hidden",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            Notifications
          </Typography>
          {notifications.length > 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {unreadCount > 0 ? `${unreadCount} unread` : "All read"} •{" "}
              {notifications.length} total
            </Typography>
          )}
        </Box>
        {notifications.length > 0 && [
          <Divider key="divider" />,
          <Box key="view-all" sx={{ p: 1 }}>
            <MenuItem
              onClick={() => {
                navigate("/view-all");
                handleNotificationClose();
              }}
              sx={{
                justifyContent: "center",
                color: "primary.main",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "primary.light",
                  color: "primary.contrastText",
                },
              }}
            >
              View all notifications
            </MenuItem>
          </Box>,
        ]}
        <Divider />

        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              maxHeight: 400,
              overflow: "auto",
              overflowX: "hidden",
              px: 1,
              py: 0.5,
            }}
          >
            {notifications.map((notification, index) => (
              <Box key={notification.notificationId}>
                <MenuItem
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderRadius: 1,
                    alignItems: "flex-start",
                    backgroundColor: notification.isRead
                      ? "background.default"
                      : "action.hover",
                    "&:hover": {
                      backgroundColor: notification.isRead
                        ? "action.hover"
                        : "action.selected",
                    },
                    minWidth: 0, // Allow shrinking
                    width: "100%", // Take full width
                    minHeight: "auto", // Allow natural height
                    whiteSpace: "normal", // Allow text wrapping
                  }}
                  onClick={() => handleNotificationRedirect(notification)}
                >
                  <ListItemText
                    sx={{
                      margin: 0,
                      minWidth: 0, // Allow shrinking
                    }}
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1,
                          minWidth: 0, // Allow shrinking
                          width: "100%", // Take full width
                        }}
                      >
                        {!notification.isRead && (
                          <Circle
                            sx={{
                              fontSize: 8,
                              color: "primary.main",
                              mt: 0.5,
                              flexShrink: 0, // Don't shrink the dot
                            }}
                          />
                        )}
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: notification.isRead ? 400 : 600,
                            opacity: notification.isRead ? 0.7 : 1,
                            flex: 1,
                            minWidth: 0, // Allow shrinking
                            wordBreak: "break-word", // Break long words
                            overflowWrap: "break-word", // Break long words
                            hyphens: "auto", // Add hyphens for better wrapping
                            lineHeight: 1.4, // Better line spacing
                          }}
                        >
                          {notification.notification}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          fontSize: "0.75rem",
                          opacity: notification.isRead ? 0.6 : 0.8,
                          display: "block",
                          mt: 0.5,
                          wordBreak: "break-word", // Break long words
                          overflowWrap: "break-word", // Break long words
                        }}
                      >
                        {notification.timestamp
                          ? formatDistanceToNow(
                              new Date(notification.timestamp),
                              {
                                addSuffix: true,
                              }
                            )
                          : "No timestamp"}
                      </Typography>
                    }
                  />
                </MenuItem>
                {index < notifications.length - 1 && <Divider />}
              </Box>
            ))}
            
          </Box>
        )}
      </Menu>
    </AppBar>
  );
};

export default TopNavBar;
