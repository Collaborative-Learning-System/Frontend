import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  useTheme,
  alpha,
  CircularProgress,
} from "@mui/material";
import {
  Folder,
  Group,
  Quiz,
  History,
  Schedule,
  Add,
  AutoFixHigh,
} from "@mui/icons-material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { AppContext } from "../context/AppContext";
import { getUserStudyPlans } from "../services/StudyPlanService";
import StudyPlanCard from "../components/StudyPlanCard";

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { userId } = useContext(AppContext);
  
  const [studyPlans, setStudyPlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  // Fetch user's study plans
  useEffect(() => {
    const fetchStudyPlans = async () => {
      if (!userId) return;
      
      setLoadingPlans(true);
      try {
        const response = await getUserStudyPlans(userId);
        if (response.success) {
          setStudyPlans(response.data.slice(0, 4)); // Show max 4 plans
        }
      } catch (error) {
        console.error('Failed to fetch study plans:', error);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchStudyPlans();
  }, [userId]);

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
      title: "Active Study Plans",
      value: studyPlans.length.toString(),
      icon: <Schedule />,
      color: "#673AB7",
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
        sx={{ mb: 3, p: 1, borderBottom: `2px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center' }}
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

      {/* My Study Plans Section */}
      <Card sx={{ mb: 3 }}>
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
              <Schedule sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="600">
                My Study Plans
              </Typography>
            </Box>
            <Button 
              variant="text" 
              size="small"
              onClick={() => navigate('/study-plans-generator')}
              startIcon={<Add />}
            >
              Create New
            </Button>
          </Box>
          
          {loadingPlans ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : studyPlans.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                gap: 3,
              }}
            >
              {studyPlans.map((plan, index) => (
                <Box key={plan.planId || index}>
                  <StudyPlanCard
                    planId={plan.planId}
                    title={plan.title}
                    subjects={plan.subjects}
                    studyGoal={plan.studyGoal}
                    startDate={plan.startDate}
                    endDate={plan.endDate}
                    dailyHours={plan.dailyHours}
                    createdAt={plan.createdAt}
                    progress={plan.progress || Math.floor(Math.random() * 100)}
                    totalTasks={plan.totalTasks || Math.floor(Math.random() * 20) + 5}
                    completedTasks={plan.completedTasks || Math.floor(Math.random() * 15)}
                    onView={(planId) => {
                      console.log('View plan:', planId);
                      // Navigate to plan details
                    }}
                    onResume={(planId) => {
                      console.log('Resume plan:', planId);
                      // Navigate to plan execution
                    }}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: 6,
                px: 3,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              <AutoFixHigh 
                sx={{ 
                  fontSize: 48, 
                  color: alpha(theme.palette.primary.main, 0.6),
                  mb: 2 
                }} 
              />
              <Typography variant="h6" sx={{ mb: 1, color: theme.palette.text.primary }}>
                No Study Plans Yet
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: theme.palette.text.secondary }}>
                Create your first study plan to start your learning journey
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/study-plans-generator')}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  }
                }}
              >
                Create Study Plan
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

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
