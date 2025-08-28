import {
  Box,
  Typography,
  alpha,
  Container,
  Button,
  Card,
  CardContent,
  Backdrop,
  Avatar,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect, useContext } from "react";
import {
  Groups,
  Add,
  Person,
  AccessTime,
} from "@mui/icons-material";
import WorkspaceCreation from "../components/WorkspaceCreation";
import BrowseWorkspace from "../components/BrowseWorkspace";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Landing = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  const [createWs, setCreateWs] = useState(false);
  const [browseWS, setBrowseWS] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());


  // Update current date time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Format date and time
  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const mockWorkspaces = [
    {
      id: 1,
      name: "React Study Group",
      description: "Learning React fundamentals and advanced concepts",
      isPrivate: false,
      members: 12,
      tags: ["React", "JavaScript", "Frontend"],
      lastActivity: "2 hours ago",
      avatar: "R",
    },
    {
      id: 2,
      name: "CS301 - Data Structures",
      description: "Course workspace for Data Structures and Algorithms",
      isPrivate: true,
      members: 8,
      tags: ["Computer Science", "Algorithms", "Programming"],
      lastActivity: "1 day ago",
      avatar: "CS",
    },
    {
      id: 3,
      name: "Machine Learning ",
      description: "Exploring ML concepts and working on projects together",
      isPrivate: false,
      members: 25,
      tags: ["Machine Learning", "Python", "AI"],
      lastActivity: "3 hours ago",
      avatar: "ML",
    },
    {
      id: 1,
      name: "React Study Group",
      description: "Learning React fundamentals and advanced concepts",
      isPrivate: false,
      members: 12,
      tags: ["React", "JavaScript", "Frontend"],
      lastActivity: "2 hours ago",
      avatar: "R",
    },
    {
      id: 2,
      name: "CS301 - Data Structures",
      description: "Course workspace for Data Structures and Algorithms",
      isPrivate: true,
      members: 8,
      tags: ["Computer Science", "Algorithms", "Programming"],
      lastActivity: "1 day ago",
      avatar: "CS",
    },
    {
      id: 3,
      name: "Machine Learning ",
      description: "Exploring ML concepts and working on projects together",
      isPrivate: false,
      members: 25,
      tags: ["Machine Learning", "Python", "AI"],
      lastActivity: "3 hours ago",
      avatar: "ML",
    },
  ];

  const mockActivities = [
    {
      id: 1,
      time: "2 hours ago",
      description: "User1 created a new workspace: React Study Group",
      type: "create",
    },
    {
      id: 2,
      time: "1 hour ago",
      description: "User2 joined the workspace: React Study Group",
      type: "join",
    },
    {
      id: 3,
      time: "30 minutes ago",
      description: "User3 completed a quiz in CS301 workspace",
      type: "quiz",
    },
    {
      id: 4,
      time: "15 minutes ago",
      description: "User4 started a study session in ML Basics",
      type: "study",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: theme.palette.background.default,
        p: 1,
      }}
    >
      <Container maxWidth="lg">
        {/* Welcome Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            pt: 2,
            pb: 2,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight="600"
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                mb: 1,
              }}
            >
              Welcome back, {userData?.fullName}!
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: "1.1rem" }}
            >
              {formatDateTime(currentDateTime)}
            </Typography>
          </Box>
        </Box>

        {/* Action Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },
            gap: 3,
            mb: 6,
          }}
        >
          <Card
            sx={{
              height: "100%",
              background: theme.palette.background.paper,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              transition: "transform 0.2s ease-in-out, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: theme.shadows[8],
              },
            }}
          >
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: theme.palette.primary.main,
                  mx: "auto",
                  mb: 2,
                }}
              >
                <Add fontSize="large" />
              </Avatar>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Create Workspace
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Start a new collaborative workspace and invite your peers to
                learn together
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => setCreateWs(true)}
                startIcon={<Groups />}
              >
                Create Workspace
              </Button>
            </CardContent>
          </Card>

          <Card
            sx={{
              height: "100%",
              background: theme.palette.background.paper,
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
              transition: "transform 0.2s ease-in-out, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: theme.shadows[8],
              },
            }}
          >
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: theme.palette.secondary.main,
                  mx: "auto",
                  mb: 2,
                }}
              >
                <Groups fontSize="large" />
              </Avatar>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Join Workspace
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Connect with existing workspaces and collaborate with peers on
                shared learning goals
              </Typography>
              <Button
                variant="contained"
                size="large"
                color="secondary"
                onClick={() => setBrowseWS(true)}
                startIcon={<Groups />}
              >
                Browse Workspace
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Current Workspaces Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Your Workspaces
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Continue your collaborative learning journey
          </Typography>

          {mockWorkspaces.length !== 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                  lg: "1fr 1fr 1fr",
                },
                gap: 3,
              }}
            >
              {mockWorkspaces.length!= 0 && mockWorkspaces.map((workspace) => (
                <Card
                  key={workspace.id}
                  onClick={() => navigate('/workspace')}
                  sx={{
                    height: "100%",
                    background: theme.palette.background.paper,
                    transition: "transform 0.2s ease-in-out, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: theme.shadows[4],
                    },
                    cursor: "pointer",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    {/* Header */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: theme.palette.primary.main,
                            width: 40,
                            height: 40,
                          }}
                        >
                          {workspace.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {workspace.name}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, minHeight: 40 }}
                    >
                      {workspace.description}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Person fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {workspace.members} members
                      </Typography>
                      <Button variant="outlined">Join Workspace</Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
              {mockWorkspaces.length === 0 && (
                <Box sx={{ textAlign: "center", p: 4 }}>
                  <Typography variant="body1">
                    No workspaces available. Create or join a workspace to get
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", p: 4 }}>
              <Typography variant="body1">
                No workspaces available. Create or join a workspace to get
                started.
              </Typography>
            </Box>
          )}
        </Box>

        {/* Recent Activities Section */}

        <Box
          sx={{
            mb: 4,
            //backgroundColor: alpha(theme.palette.background.default, 0.8),
            pt: 1,
            pb: 1,
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Recent Activities
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Stay updated with the latest activities
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {mockActivities.length !== 0 &&
              mockActivities.map((activity) => (
                <Card
                  key={activity.id}
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.1
                    )}`,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      transform: "translateY(-1px)",
                      boxShadow: 2,
                    },
                  }}
                >
                  <CardContent sx={{ py: 2 }}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                      <AccessTime
                        fontSize="small"
                        sx={{ color: theme.palette.primary.main }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ minWidth: "80px" }}
                      >
                        {activity.time}
                      </Typography>
                      <Typography variant="body1" sx={{ flex: 1 }}>
                        {activity.description}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            {mockActivities.length === 0 && (
              <Box sx={{ textAlign: "center", p: 4 }}>
                <Typography variant="body1">
                  No recent activities to display.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Container>

      {/* Workspace Creation Modal */}
      <Backdrop
        open={createWs}
        onClick={() => setCreateWs(false)}
        sx={{
          zIndex: theme.zIndex.modal,
          // backdropFilter: "blur(8px)",
          backgroundColor: alpha(theme.palette.background.default, 0.7),
        }}
      >
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            p: 2,
          }}
        >
          <WorkspaceCreation onClose={() => setCreateWs(false)} />
        </Box>
      </Backdrop>

      {/* Browse Workspaces Modal */}
      <Backdrop
        open={browseWS}
        onClick={() => setBrowseWS(false)}
        sx={{
          zIndex: theme.zIndex.modal,
          backgroundColor: alpha(theme.palette.background.default, 0.7),
        }}
      >
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            p: 2,
          }}
        >
          <BrowseWorkspace onClose={() => setBrowseWS(false)} />
        </Box>
      </Backdrop>
    </Box>
  );
};

export default Landing;
