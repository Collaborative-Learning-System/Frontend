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
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Groups,
  Add,
  Person,
  AccessTime,
} from "@mui/icons-material";
import WorkspaceCreation from "../components/WorkspaceCreation";
import BrowseWorkspace from "../components/BrowseWorkspace";

const Landing = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [createWs, setCreateWs] = useState(false);
  const [browseWS, setBrowseWS] = useState(false);

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
      name: "Machine Learning Enthusiasts",
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
      time: "2 hours ago",
      description: "User1 created a new workspace: React Study Group",
    },
    {
      time: "1 hour ago",
      description: "User1 joined the workspace: React Study Group",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: theme.palette.background.paper,
        p: 1,
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: 6,
            pt: 2,
          }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome to EduCollab
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 600, mx: "auto" }}
          >
            Your platform for collaborative learning and personalized study
            plans
          </Typography>
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
              background:theme.palette.background.paper,
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
              {mockWorkspaces.map((workspace) => (
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
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Person fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {workspace.members} members
                      </Typography>
                      <Button 
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/workspace');
                        }}
                      >
                        Join Workspace
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
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

          <Box>
            {mockActivities.map((activity) => (
              <Stack
                spacing={{ xs: 0, md: 2 }}
                direction={{ xs: "column", md: "row" }}
                bgcolor={alpha(theme.palette.background.paper, 0.3)}
                padding={0.5}
              >
                <Box
                  sx={{
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IconButton>
                    <AccessTime fontSize="small" color="primary" />
                  </IconButton>
                  <Typography variant="body1">{activity.time}</Typography>
                </Box>
                <Box sx={{ p: 1, alignItems: "center", display: "flex" }}>
                  <Typography variant="body1">
                    {activity.description}
                  </Typography>
                </Box>
              </Stack>
            ))}
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
          <BrowseWorkspace onClose={() => setBrowseWS(false)} />
        </Box>
      </Backdrop>
    </Box>
  );
};

export default Landing;
