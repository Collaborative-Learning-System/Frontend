import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  CircularProgress,
  alpha,
  useTheme,
  IconButton,
  Stack,
  Button,
  Divider,
} from '@mui/material';
import {
  Notifications,
  History,
  ArrowBack,
  AccessTime,
  Circle,
  CheckCircle,
  Refresh,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Notification {
  notificationId: string;
  notification: string;
  timestamp: string;
  userId: string;
  isRead: boolean;
  link?: string;
}

interface Activity {
  activityId: string;
  activity: string;
  timestamp: string;
  userId: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`view-all-tabpanel-${index}`}
      aria-labelledby={`view-all-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `view-all-tab-${index}`,
    'aria-controls': `view-all-tabpanel-${index}`,
  };
}

export default function ViewAll() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { userId } = useContext(AppContext);
  
  const [tabValue, setTabValue] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const fetchNotifications = async () => {
    setNotificationsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/notification/get-notifications/${userId}`
      );

      if (response.data && response.data.success && response.data.data) {
        setNotifications(response.data.data);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const fetchActivities = async () => {
    setActivitiesLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/get-logs-by-user/${userId}`
      );

      if (response.data && response.data.data) {
        setActivities(response.data.data);
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivities([]);
    } finally {
      setActivitiesLoading(false);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/notification/mark-as-read/${notification.notificationId}`
      );
      
      // Update local state
      setNotifications(prevNotifications =>
        prevNotifications.map(n =>
          n.notificationId === notification.notificationId
            ? { ...n, isRead: true }
            : n
        )
      );
      
      if (notification.link) {
        navigate(notification.link);
      }
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      // Mark all unread notifications as read
      const unreadNotifications = notifications.filter(n => !n.isRead);
      
      await Promise.all(
        unreadNotifications.map(notification =>
          axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/notification/mark-as-read/${notification.notificationId}`
          )
        )
      );
      
      // Update local state
      setNotifications(prevNotifications =>
        prevNotifications.map(n => ({ ...n, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      fetchActivities();
    }
  }, [userId]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper
        elevation={1}
        sx={{
          p: 3,
          mb: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: 'white',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ color: 'white' }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              All Activities & Notifications
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>
              Stay updated with all your activities and notifications
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Tabs */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="view all tabs"
            variant="fullWidth"
          >
            <Tab
              icon={<Notifications />}
              label={`Notifications ${unreadCount > 0 ? `(${unreadCount})` : ''}`}
              {...a11yProps(0)}
              sx={{
                minHeight: 72,
                textTransform: 'none',
                fontSize: '1rem',
              }}
            />
            <Tab
              icon={<History />}
              label="Recent Activities"
              {...a11yProps(1)}
              sx={{
                minHeight: 72,
                textTransform: 'none',
                fontSize: '1rem',
              }}
            />
          </Tabs>
        </Box>

        {/* Notifications Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', m: 2, mt: 0 }}>
            <Typography variant="h6" color="text.secondary">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All read'} - {notifications.length} total
            </Typography>
            {unreadCount > 0 && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<CheckCircle />}
                onClick={markAllNotificationsAsRead}
              >
                Mark All as Read
              </Button>
            )}
            <IconButton onClick={fetchNotifications} disabled={notificationsLoading}>
              <Refresh />
            </IconButton>
          </Box>

          {notificationsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : notifications.length === 0 ? (
            <Card sx={{ mx: 2 }}>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Notifications sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Notifications
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  You're all caught up! New notifications will appear here.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <List sx={{ p: 1 }}>
              {notifications
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((notification, index) => (
                  <React.Fragment key={notification.notificationId}>
                    <ListItem
                      component="div"
                            sx={{
                        px: 2,
                        py: 2,
                        borderRadius: 2,
                        backgroundColor: notification.isRead ? 'background.default' : alpha(theme.palette.primary.main, 0.05),
                        '&:hover': {
                          backgroundColor: notification.isRead ? 'action.hover' : alpha(theme.palette.primary.main, 0.1),
                        },
                        cursor: 'pointer',
                        mb: 1,
                      }}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: notification.isRead ? 'grey.400' : 'primary.main',
                            width: 40,
                            height: 40,
                          }}
                        >
                          {!notification.isRead ? (
                            <Circle sx={{ fontSize: 12 }} />
                          ) : (
                            <CheckCircle sx={{ fontSize: 20 }} />
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: notification.isRead ? 400 : 600,
                              color: notification.isRead ? 'text.secondary' : 'text.primary',
                            }}
                          >
                            {notification.notification}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: '0.75rem', mt: 0.5, display: 'block' }}
                          >
                            {notification.timestamp
                              ? formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })
                              : 'No timestamp'}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < notifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
            </List>
          )}
        </TabPanel>

        {/* Recent Activities Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ m: 2, mt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              {activities.length} total activities
            </Typography>
            <IconButton onClick={fetchActivities} disabled={activitiesLoading}>
              <Refresh />
            </IconButton>
          </Box>

          {activitiesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : activities.length === 0 ? (
            <Card sx={{ mx: 2 }}>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <History sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Activities Yet
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Start engaging with workspaces and groups to see your activities here!
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <List sx={{ p: 1 }}>
              {activities
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((activity, index) => (
                  <React.Fragment key={activity.activityId || index}>
                    <ListItem
                      sx={{
                        px: 2,
                        py: 2,
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                        mb: 1,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            width: 40,
                            height: 40,
                          }}
                        >
                          <AccessTime />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {activity.activity || 'No activity description'}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: '0.75rem', mt: 0.5, display: 'block' }}
                          >
                            {activity.timestamp
                              ? formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })
                              : 'No timestamp'}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < activities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
            </List>
          )}
        </TabPanel>
      </Paper>
    </Container>
  );
}