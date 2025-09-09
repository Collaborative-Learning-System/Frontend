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
} from "@mui/material";
import {
  Folder,
  Group,
  Quiz,
  AccessTime,
  History,
  Schedule,
  Add,
} from "@mui/icons-material";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";

const Dashboard = () => {
  const theme = useTheme();
  const { userData } = useContext(AppContext);

  const stats = [
    {
      title: "Workspaces",
      value: "8",
      icon: <Folder />,
      color: "#2196F3",
    },
    {
      title: "Groups Joined",
      value: "5",
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

  // Recent activities data
  const recentActivities = [
    {
      action: "Completed Quiz: JavaScript Fundamentals",
      time: "2 hours ago",
      avatar: "Q",
      color: "#2196F3",
    },
    {
      action: "Joined Workspace: React Development",
      time: "5 hours ago",
      avatar: "W",
      color: "#2196F3",
    },
  ];

  // Upcoming activities data
  const upcomingActivities = [
    {
      task: "React Components Quiz",
      dueDate: "Today, 3:00 PM",
      type: "Quiz",
      color: "#f44336",
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
      {/* Header */}
      <Box
        sx={{
          mb: 2,
          p: 2,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        <Typography
          variant="h3"
          fontWeight="700"
          sx={{
            typography: { xs: "h4", sm: "h3" },
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          Hi, {userData?.fullName || "User"}!{" "}
          <span
            style={{
              background: "none",
              WebkitTextFillColor: "initial",
              backgroundClip: "initial",
              WebkitBackgroundClip: "initial",
            }}
          >
            👋
          </span>
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            fontSize: "1.2rem",
            fontWeight: 400,
          }}
        >
          Here's your learning overview.
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
            <CardContent sx={{ width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h3" fontWeight="700" color={stat.color}>
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
          </Card>
        ))}
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
                {recentActivities.map((activity, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 1.5 }}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          fontSize: "1rem",
                          bgcolor: activity.color,
                        }}
                      >
                        {activity.avatar}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.action}
                      secondary={activity.time}
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
                ))}
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
