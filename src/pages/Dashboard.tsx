import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  useTheme,
  alpha,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  Group,
  Quiz,
  AccessTime,
  History,
  Schedule,
  Add,
  Workspaces,
  LocalActivity,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

interface WorkspaceData {
  count: number;
  workspaces: {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    role: string;
  }[];
}

interface GroupData {
  count: number;
  groups: {
    id: string;
    name: string;
  }[];
}

const Dashboard = () => {
  const theme = useTheme();
  const { userId } = useContext(AppContext);

  const [workspaceData, setWorkspaceData] = useState<WorkspaceData | null>(
    null
  );
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const stats = [
    {
      title: "Workspaces",
      value: workspaceData?.count || 0,
      icon: <DashboardIcon />,
      color: "#2196F3",
    },
    {
      title: "Groups Joined",
      value: groupData?.count || 0,
      icon: <Group />,
      color: "#4CAF50",
    },
    {
      title: "Completed Quizzes",
      value: "23",
      icon: <Quiz />,
      color: "#FF9800",
    },
    {
      title: "Total Study Hours",
      value: "147",
      icon: <AccessTime />,
      color: "#9C27B0",
    },
  ];

  // Upcoming activities data
  const upcomingActivities = [
    {
      task: "React Components Quiz",
      dueDate: "Today, 3:00 PM",
      type: "Quiz",
      color: "#4CAF50",
    },
    {
      task: "Complete Node.js Tutorial",
      dueDate: "Tomorrow",
      type: "Study",
      color: "#ff9800",
    },
  ];

  // Suggested workspaces data
  const suggestedWorkspaces = [
    {
      name: "Advanced React Patterns",
      description: "Learn advanced React concepts and patterns",
      members: 124,
      category: "Frontend",
    },
    {
      name: "Machine Learning Basics",
      description: "Introduction to ML algorithms and concepts",
      members: 89,
      category: "AI/ML",
    },
    {
      name: "Full Stack Development",
      description: "Complete web development bootcamp",
      members: 156,
      category: "Full Stack",
    },
  ];

  const getWorkspaceData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/get-workspace-data/${userId}`
      );
      if (response.data.result.success) {
        setWorkspaceData(response.data.result.data);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const getGroupData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/get-group-data/${userId}`
      );
      if (response.data.result.success) {
        setGroupData(response.data.result.data);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      if (!localStorage.getItem("userId")) {
        console.warn("User ID not available");
        return;
      }
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/user/get-logs-by-user/${localStorage.getItem("userId")}`
      );

      if (response) {
        setLogs(response.data.data);
      } else {
        setLogs([]);
      }
    } catch (error) {
      setLogs([]);
    }
  };

  useEffect(() => {
    getWorkspaceData();
    getGroupData();
    fetchLogs();
  }, []);

  return (
    <Box
      sx={{
          background: `linear-gradient(135deg, 
                ${alpha(theme.palette.primary.main, 0.03)} 0%, 
                ${alpha(theme.palette.secondary.main, 0.02)} 50%,
                ${alpha(theme.palette.background.default, 0.95)} 100%)`,
          p: 3,
          minHeight: "100vh",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 20% 80%, ${alpha(
              theme.palette.primary.main,
              0.1
            )} 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, ${alpha(
                          theme.palette.secondary.main,
                          0.1
                        )} 0%, transparent 50%)`,
            pointerEvents: "none",
          },
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          mb: 3,
          p: 1,
          borderBottom: `2px solid ${theme.palette.divider}`,
          display: "flex",
          alignItems: "center",
        }}
      >
        <AssessmentIcon
          sx={{ fontSize: 30, color: theme.palette.primary.main, mr: 1 }}
        />
        <Typography variant="h5" fontWeight={700} display="inline">
          Dashboard Overview
        </Typography>
      </Box>

      {/* Top 4 Stats Cards */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          mb: 4,
          "& > *": {
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 12px)",
              md: "1 1 calc(25% - 18px)",
            },
          },
        }}
      >
        {stats.map((stat, index) => (
          <Card
            key={index}
            sx={{
              background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
              border: `1px solid ${stat.color}30`,
              height: "120px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {!loading ? (
              <CardContent sx={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h3"
                      fontWeight="700"
                      color={stat.color}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {stat.title}
                    </Typography>
                  </Box>
                  <Box sx={{ color: stat.color, opacity: 0.7, fontSize: 40 }}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                <CircularProgress />
              </Box>
            )}
          </Card>
        ))}
      </Box>

      {/* Workspaces and Groups joined */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          mb: 4,
        }}
      >
        {/* Workspaces - Left Side */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: "400px" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <DashboardIcon
                  sx={{ mr: 1, color: theme.palette.primary.main }}
                />
                <Typography variant="h6" fontWeight="600">
                  Active Workspaces
                </Typography>
              </Box>
              <List sx={{ p: 0, maxHeight: "300px", overflow: "auto" }}>
                {!loading ? (
                  workspaceData?.workspaces.map((workspace, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1.5 }}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            fontSize: "1rem",
                            bgcolor: theme.palette.secondary.main,
                          }}
                        >
                          {workspace.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={workspace.name}
                        secondary={workspace.role}
                        primaryTypographyProps={{
                          variant: "body2",
                          fontWeight: 500,
                        }}
                        secondaryTypographyProps={{
                          variant: "caption",
                          color: "text.secondary",
                        }}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderRadius: "20px",
                        }}
                      >
                        {workspace.memberCount || 0} members
                      </Button>
                    </ListItem>
                  ))
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      p: 2,
                    }}
                  >
                    <CircularProgress size={60} />
                  </Box>
                )}
                {workspaceData?.workspaces.length === 0 && (
                  <Paper
                    elevation={3}
                    sx={{
                      mt: 3,
                      p: { xs: 4, sm: 6 },
                      textAlign: "center",
                      borderRadius: 3,
                    }}
                  >
                    <Workspaces
                      sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                    />
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      No Active Workspaces Yet
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Join workspaces to collaborate and learn with peers!
                    </Typography>
                  </Paper>
                )}
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Groups Joined - Right Side */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: "400px" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Group sx={{ mr: 1, color: theme.palette.secondary.main }} />
                <Typography variant="h6" fontWeight="600">
                  Active Groups
                </Typography>
              </Box>
              <Box sx={{ maxHeight: "300px", overflow: "auto" }}>
                {!loading ? (
                  groupData?.groups.length !== 0 &&
                  groupData?.groups.map((group, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1.5 }}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            fontSize: "1rem",
                            bgcolor: theme.palette.success.main,
                          }}
                        >
                          {group.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={group.name}
                        //secondary={workspace.role}
                        primaryTypographyProps={{
                          variant: "body2",
                          fontWeight: 500,
                        }}
                        secondaryTypographyProps={{
                          variant: "caption",
                          color: "text.secondary",
                        }}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      p: 2,
                    }}
                  >
                    <CircularProgress size={60} />
                  </Box>
                )}
                {groupData?.groups.length === 0 && (
                  <Paper
                    elevation={3}
                    sx={{
                      mt: 3,
                      p: { xs: 4, sm: 6 },
                      textAlign: "center",
                      borderRadius: 3,
                    }}
                  >
                    <Group
                      sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                    />
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      No Active Groups Yet
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Join groups to collaborate and learn with peers!
                    </Typography>
                  </Paper>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Recent Activities and Upcoming Activities */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          mb: 4,
        }}
      >
        {/* Recent Activities - Left Side */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: "400px" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <History sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6" fontWeight="600">
                  Recent Activities
                </Typography>
              </Box>
              <List sx={{ p: 0, maxHeight: "300px", overflow: "auto" }}>
                {!loading ? (
                  logs
                    .sort(
                      (a, b) =>
                        new Date(b.timestamp).getTime() -
                        new Date(a.timestamp).getTime()
                    ) // newest first
                    .filter((log) => {
                      const logTime = new Date(log.timestamp);
                      return (
                        new Date().getTime() - logTime.getTime() <=
                        24 * 60 * 60 * 1000
                      ); // last 24 hour
                    })
                    .map((activity, index) => (
                      <ListItem key={index} sx={{ px: 0, py: 1.5 }}>
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              fontSize: "1rem",
                              bgcolor: theme.palette.primary.main,
                            }}
                          >
                            {activity.activity.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.activity}
                          secondary={
                            activity.timestamp
                              ? formatDistanceToNow(
                                  new Date(activity.timestamp),
                                  {
                                    addSuffix: true,
                                  }
                                )
                              : "No timestamp"
                          }
                          primaryTypographyProps={{
                            variant: "body2",
                            fontWeight: 500,
                          }}
                          secondaryTypographyProps={{
                            variant: "caption",
                            color: "text.secondary",
                          }}
                        />
                      </ListItem>
                    ))
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      p: 2,
                    }}
                  >
                    <CircularProgress size={60} />
                  </Box>
                )}
                {logs.length === 0 && (
                  <Paper
                    elevation={3}
                    sx={{
                      mt: 3,
                      p: { xs: 4, sm: 6 },
                      textAlign: "center",
                      borderRadius: 3,
                    }}
                  >
                    <LocalActivity
                      sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                    />
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      No Recent Activites Yet
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Your recent activities will appear here. Start engaging
                      with your workspaces and groups!
                    </Typography>
                  </Paper>
                )}
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Upcoming Activities - Right Side */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: "400px" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Schedule sx={{ mr: 1, color: theme.palette.secondary.main }} />
                <Typography variant="h6" fontWeight="600">
                  Upcoming Activities
                </Typography>
              </Box>
              <Box sx={{ maxHeight: "300px", overflow: "auto" }}>
                {upcomingActivities.map((activity, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderLeft: `4px solid ${activity.color}`,
                      backgroundColor: alpha(activity.color, 0.05),
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: alpha(activity.color, 0.1),
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Chip
                        label={activity.type}
                        size="small"
                        sx={{
                          bgcolor: activity.color,
                          color: "white",
                          fontSize: "0.75rem",
                          height: 20,
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      fontWeight="500"
                      sx={{ mb: 0.5 }}
                    >
                      {activity.task}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Due: {activity.dueDate}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Suggested Workspaces */}
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Add sx={{ mr: 1, color: theme.palette.success.main }} />
              <Typography variant="h6" fontWeight="600">
                Suggested Workspaces to Join
              </Typography>
            </Box>
            <Button variant="text" size="small">
              View All
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              "& > *": {
                flex: {
                  xs: "1 1 100%",
                  sm: "1 1 calc(50% - 12px)",
                  md: "1 1 calc(25% - 18px)",
                },
              },
            }}
          >
            {suggestedWorkspaces.map((workspace, index) => (
              <Card
                key={index}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  "&:hover": {
                    boxShadow: theme.shadows[4],
                    transform: "translateY(-2px)",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                    {workspace.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {workspace.description}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Chip
                      label={workspace.category}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "0.75rem" }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {workspace.members} members
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    size="small"
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      "&:hover": {
                        bgcolor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    Join Workspace
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
