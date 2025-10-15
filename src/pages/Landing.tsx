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
  CircularProgress,
  Fade,
  Slide,
  Zoom,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Groups,
  Add,
  Person,
  AccessTime,
  TrendingUp,
  Dashboard,
  ArrowForward,
} from "@mui/icons-material";
import WorkspaceCreation from "../components/WorkspaceCreation";
import BrowseWorkspace from "../components/BrowseWorkspace";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { formatDistanceToNow } from "date-fns";
import { handleLogging } from "../services/LoggingService";
import { backgroundImages, getRandomBackground } from "../constants/backgroundImages";

// Define interface for workspace data
interface Workspace {
  id: string;
  name: string;
  description: string;
  adminId: string;
  memberCount: number;
  role: string;
}

interface CreateWorkspaceResponse {
  success: boolean;
  message?: string;
  data?: any;
}

// Define interface for workspace data
interface Workspace {
  id: string;
  name: string;
  description: string;
  adminId: string;
  memberCount: number;
  role: string;
}

interface CreateWorkspaceResponse {
  success: boolean;
  message?: string;
  data?: any;
}

const Landing = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  const [createWs, setCreateWs] = useState(false);
  const [browseWS, setBrowseWS] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);


  // Function to fetch workspaces
  const fetchWorkspaces = async () => {
    try {
      setLoadingWorkspaces(true);
      setWorkspaceError(null);

      const response = await axios.get("http://localhost:3000/api/workspaces", {
        withCredentials: true,
      });

      if (response.data.success) {
        setWorkspaces(response.data.data.workspaces);
      } else {
        setWorkspaceError(
          response.data.message || "Failed to fetch workspaces"
        );
      }
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      setWorkspaceError("Failed to load workspaces. Please try again later.");
    } finally {
      setLoadingWorkspaces(false);
    }
  };

  // Function for creating workspace
  const handleCreateWorkspace = async (
    workspacename: string,
    description: string
  ): Promise<CreateWorkspaceResponse> => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/workspaces",
        {
          workspacename,
          description,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Refresh workspaces list after successful creation
        await fetchWorkspaces();
        await handleLogging(`Created a new workspace ${workspacename}`);
        await fetchLogs();

        setCreateWs(false);
        return { success: true, data: response.data };
      } else {
        return {
          success: false,
          message: response.data.message || "Failed to create workspace",
        };
      }
    } catch (error) {
      // setLogs([]);
      return {
        success: false,
        message: "Failed to create workspace due to an error",
      };
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


  // Update current date time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Fetch workspaces on component mount
  useEffect(() => {
    fetchWorkspaces();
    setMounted(true);
    fetchLogs();
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

  // Get avatar text from workspace name
  const getAvatarText = (name: string) => {
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };



  // Glassmorphism card styles with reduced curviness
  const glassCardStyles = {
    background: alpha(theme.palette.background.paper, 0.85),
    backdropFilter: "blur(20px)",
    borderRadius: "12px", // Reduced from 24px
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      transform: "translateY(-8px) scale(1.02)",
      boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.2)}`,
      background: alpha(theme.palette.background.paper, 0.95),

    },
  };

  const glassBackdropStyles = {
    background: `linear-gradient(135deg, 
      ${alpha(theme.palette.primary.main, 0.1)} 0%, 
      ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
    backdropFilter: "blur(10px)",
    borderRadius: "12px", // Reduced from 20px
    border: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
  };


  


  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.main, 0.03)} 0%, 
          ${alpha(theme.palette.secondary.main, 0.02)} 50%,
          ${alpha(theme.palette.background.default, 0.95)} 100%)`,
        position: "relative",
        overflow: "hidden",
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
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, py: 4 }}>
        {/* Welcome Section */}
        <Fade in={mounted} timeout={800}>
          <Box
            sx={{
              ...glassBackdropStyles,
              p: 4,
              mb: 4,
              textAlign: "center",
            }}
          >
            <Slide in={mounted} direction="down" timeout={1000}>
              <Box>
                <Typography
                  variant="h3"
                  fontWeight="700"
                  sx={{
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.main})`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 2,
                    fontSize: { xs: "2rem", md: "3rem" },
                  }}
                >
                  Welcome back, {userData?.fullName || "User"}!{" "}
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
                    opacity: 0.8,
                  }}
                >
                  {formatDateTime(currentDateTime)}
                </Typography>
              </Box>
            </Slide>
          </Box>
        </Fade>

        {/* Action Cards */}
        <Fade in={mounted} timeout={1200}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 4,
              mb: 6,
            }}
          >
            <Zoom in={mounted} timeout={1000}>
              <Card sx={glassCardStyles}>
                <CardContent sx={{ p: 5, textAlign: "center" }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      mx: "auto",
                      mb: 3,
                      boxShadow: `0 8px 24px ${alpha(
                        theme.palette.primary.main,
                        0.3
                      )}`,
                    }}
                  >
                    <Add fontSize="large" />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Create Workspace
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 4, lineHeight: 1.6 }}
                  >
                    Start a new collaborative workspace and invite your peers to
                    learn together
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => setCreateWs(true)}
                    startIcon={<Groups />}
                    sx={{
                      borderRadius: "30px", // Reduced from 50px
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.main})`,
                      boxShadow: `0 4px 20px ${alpha(
                        theme.palette.primary.main,
                        0.4
                      )}`,
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 6px 25px ${alpha(
                          theme.palette.primary.main,
                          0.5
                        )}`,
                      },
                    }}
                  >
                    Create Workspace
                  </Button>
                </CardContent>
              </Card>
            </Zoom>

            <Zoom in={mounted} timeout={1200}>
              <Card sx={glassCardStyles}>
                <CardContent sx={{ p: 5, textAlign: "center" }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                      mx: "auto",
                      mb: 3,
                      boxShadow: `0 8px 24px ${alpha(
                        theme.palette.secondary.main,
                        0.3
                      )}`,
                    }}
                  >
                    <Groups fontSize="large" />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Join Workspace
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 4, lineHeight: 1.6 }}
                  >
                    Connect with existing workspaces and collaborate with peers
                    on shared learning goals
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    onClick={() => setBrowseWS(true)}
                    startIcon={<Groups />}
                    sx={{
                      borderRadius: "30px", // Reduced from 50px
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.main})`,
                      boxShadow: `0 4px 20px ${alpha(
                        theme.palette.secondary.main,
                        0.4
                      )}`,
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 6px 25px ${alpha(
                          theme.palette.secondary.main,
                          0.5
                        )}`,
                      },
                    }}
                  >
                    Browse Workspaces
                  </Button>
                </CardContent>
              </Card>
            </Zoom>
          </Box>
        </Fade>

        {/* Current Workspaces Section */}
        <Fade in={mounted} timeout={1400}>
          <Box sx={{ mb: 6 }}>
            <Box sx={{ ...glassBackdropStyles, p: 4, mb: 4 }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                sx={{
                  background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                <Dashboard sx={{ mr: 2, verticalAlign: "middle" }} />
                Your Workspaces
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: "1.1rem" }}
              >
                Continue your collaborative learning journey
              </Typography>
            </Box>

            {loadingWorkspaces ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
                <CircularProgress size={60} thickness={4} />
              </Box>
            ) : workspaceError ? (
              <Card sx={glassCardStyles}>
                <CardContent sx={{ textAlign: "center", p: 4 }}>
                  <Typography variant="h6" color="error">
                    {workspaceError}
                  </Typography>
                </CardContent>
              </Card>
            ) : workspaces.length > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                  },
                  gap: 3,
                }}
              >
                {workspaces.map((workspace, index) => (
                  <Zoom
                    in={mounted}
                    timeout={1600 + index * 100}
                    key={workspace.id}
                  >
                    <Card
                      onClick={() => navigate(`/workspace/${workspace.id}`)}
                      sx={{
                        ...glassCardStyles,
                        cursor: "pointer",
                        height: "100%",
                        position: "relative",
                        overflow: "visible",
                      }}
                    >
                      {/* Top Section - Background with name and role */}
                      <Box
                        sx={{
                          height: "120px",
                          background: `url(${getRandomBackground(workspace.id)})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          borderRadius: "12px 12px 0 0",
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          p: 3,
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "rgba(0, 0, 0, 0.3)",
                            borderRadius: "12px 12px 0 0",
                          },
                        }}
                      >
                        {/* Workspace Avatar - positioned to show 3/4 in top, 1/4 in bottom */}
                        <Avatar
                          sx={{
                            bgcolor: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            width: 90,
                            height: 90,
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            position: "absolute",
                            left: "24px",
                            bottom: "-20px",
                            border: "2px solid white",
                            zIndex: 2,
                            boxShadow: `0 4px 12px ${alpha(
                              theme.palette.common.black,
                              0.3
                            )}`,
                          }}
                        >
                          {getAvatarText(workspace.name)}
                        </Avatar>

                        {/* Content overlay */}
                        <Box
                          sx={{
                            position: "relative",
                            zIndex: 1,
                            flex: 1,
                            ml: 12,
                          }}
                        >
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                              color: "white",
                              mb: 0,
                              textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                            }}
                          >
                            {workspace.name}
                          </Typography>
                          <Chip
                            label={workspace.role}
                            size="small"
                            sx={{
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.9
                              ),
                              color: "white",
                              borderRadius: "12px",
                              fontWeight: 400,
                              fontSize: "0.75rem",
                              boxShadow: `0 2px 8px ${alpha(
                                theme.palette.common.black,
                                0.3
                              )}`,
                            }}
                          />
                        </Box>
                      </Box>

                      {/* Bottom Section - Description, member count, and open button */}
                      <CardContent
                        sx={{
                          p: 3,
                          pt: 4,
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                        }}
                      >
                        {/* Description */}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 1,
                            flex: 1,
                            lineHeight: 1.6,
                            minHeight: "50px",
                          }}
                        >
                          {workspace.description || "No description available"}
                        </Typography>

                        {/* Footer */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Person fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {workspace.memberCount} member
                              {workspace.memberCount !== 1 ? "s" : ""}
                            </Typography>
                          </Box>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/workspace/${workspace.id}`);
                            }}
                            sx={{
                              borderRadius: "16px",
                              px: 3,
                              "&:hover": {
                                transform: "scale(1.05)",
                              },
                            }}
                          >
                            Open
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Zoom>
                ))}
              </Box>
            ) : (
              <Card sx={glassCardStyles}>
                <CardContent sx={{ textAlign: "center", p: 6 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    No workspaces available
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Create or join a workspace to get started.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Fade>

        {/* Recent Activities Section */}
        <Fade in={mounted} timeout={1800}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ ...glassBackdropStyles, p: 4, mb: 4 }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                sx={{
                  background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${theme.palette.secondary.main})`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                <TrendingUp sx={{ mr: 2, verticalAlign: "middle" }} />
                Recent Activities
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: "1.1rem" }}
              >
                Stay updated with the latest activities
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {logs.length > 0 ? (
                <>
                  {logs
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
                    .slice(0, 5) // Limit to 5 recent activities
                    .map((activity, index) => (
                    <Slide
                      in={mounted}
                      direction="up"
                      timeout={2000 + index * 100}
                      key={activity.activityId || index}
                    >
                      <Card sx={glassCardStyles}>
                        <CardContent sx={{ py: 3, px: 4 }}>
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={3}
                            alignItems="center"
                          >
                            <Avatar
                              sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                width: 48,
                                height: 48,
                              }}
                            >
                              <AccessTime />
                            </Avatar>
                            <Box
                              sx={{
                                flex: 1,
                                textAlign: { xs: "center", sm: "left" },
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                {activity.timestamp
                                  ? formatDistanceToNow(
                                      new Date(activity.timestamp),
                                      {
                                        addSuffix: true,
                                      }
                                    )
                                  : "No timestamp"}
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 500 }}
                              >
                                {activity.activity || "No activity description"}
                              </Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                      </Slide>
                    ))}
                  
                  {/* View All Button */}
                  {logs.length > 5 && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                      <Button
                        variant="outlined"
                        endIcon={<ArrowForward />}
                        onClick={() => navigate("/view-all")}
                        sx={{
                          borderRadius: 2,
                          px: 3,
                          py: 1,
                          textTransform: "none",
                          fontSize: "1rem",
                          fontWeight: 500,
                        }}
                      >
                        View All Activities
                      </Button>
                    </Box>
                  )}
                </>
              ) : (
                <Card sx={glassCardStyles}>
                  <CardContent sx={{ textAlign: "center", p: 4 }}>
                    <Typography variant="body1">
                      {logs.length === 0
                        ? "No recent activities to display."
                        : "Loading activities..."}

                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Box>
        </Fade>
      </Container>

      {/* Workspace Creation Modal */}
      <Backdrop
        open={createWs}
        onClick={() => setCreateWs(false)}
        sx={{
          zIndex: theme.zIndex.modal,
          backgroundColor: alpha(theme.palette.background.default, 0.8),
          backdropFilter: "blur(8px)",
        }}
      >
        <Zoom in={createWs} timeout={300}>
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
            <WorkspaceCreation
              onClose={() => setCreateWs(false)}
              onCreateWorkspace={handleCreateWorkspace}
            />
          </Box>
        </Zoom>
      </Backdrop>

      {/* Browse Workspaces Modal */}
      <Backdrop
        open={browseWS}
        onClick={() => setBrowseWS(false)}
        sx={{
          zIndex: theme.zIndex.modal,
          backgroundColor: alpha(theme.palette.background.default, 0.8),
          backdropFilter: "blur(8px)",
        }}
      >
        <Zoom in={browseWS} timeout={300}>
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
        </Zoom>
      </Backdrop>
    </Box>
  );
};

export default Landing;
