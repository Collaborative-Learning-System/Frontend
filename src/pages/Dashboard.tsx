import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  useTheme,
  alpha,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Skeleton,
} from "@mui/material";
import {
  Group,
  History,
  Schedule,
  Add,
  Dashboard as DashboardIcon,
  AutoFixHigh,
  WorkspacePremium,
  Groups,
  Timeline,
  Lightbulb,
} from "@mui/icons-material";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import {
  getUserStudyPlans,
  deleteStudyPlan,
} from "../services/StudyPlanService";
import StudyPlanCard from "../components/StudyPlanCard";
import StudyPlanViewModal from "../components/StudyPlanViewModal";
import PageHeader from "../components/PageHeader";
import { handleLogging } from "../services/LoggingService";

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

interface SuggestedWorkspace {
  workspaceId: string;
  workspaceName: string;
  description: string;
  memberCount?: number;
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
  const navigate = useNavigate();

  const [suggestedWorkspaces, setSuggestedWorkspaces] = useState<
    SuggestedWorkspace[]
  >([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const [studyPlans, setStudyPlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  // Modal state for viewing study plans
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [noSuggestions, setNoSuggestions] = useState(false);

  // Reusable Empty State Component
  const EmptyStateMessage = ({
    icon,
    title,
    description,
    actionButton,
    fullWidth = false,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    actionButton?: React.ReactNode;
    fullWidth?: boolean;
  }) => (
    <Box
      sx={{
        textAlign: "center",
        py: { xs: 1, sm: 3 },
        px: 3,
        borderRadius: 3,
        bgcolor: alpha(theme.palette.primary.main, 0.02),
        border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
        width: fullWidth ? "100%" : "auto",
        gridColumn: fullWidth ? "1 / -1" : "auto",
        minHeight: "200px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        transition: "all 0.3s ease",
        "&:hover": {
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          borderColor: alpha(theme.palette.primary.main, 0.3),
        },
      }}
    >
      <Box
        sx={{
          mb: 3,
          p: 2,
          borderRadius: "50%",
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          "& .MuiSvgIcon-root": {
            fontSize: { xs: 48, sm: 56 },
            color: theme.palette.primary.main,
          },
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          color: theme.palette.text.primary,
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: actionButton ? 3 : 0,
          color: theme.palette.text.secondary,
          maxWidth: 400,
          lineHeight: 1.6,
        }}
      >
        {description}
      </Typography>
      {actionButton}
    </Box>
  );

  // Handler functions for study plan modal
  const handleViewPlan = (planId: number) => {
    setSelectedPlanId(planId);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedPlanId(null);
  };

  // Handler functions for delete functionality
  const handleDeletePlan = (planId: number) => {
    setPlanToDelete(planId);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setPlanToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!planToDelete) return;

    setIsDeleting(true);
    try {
      const response = await deleteStudyPlan(planToDelete);
      if (response.success) {
        // Remove the deleted plan from the local state
        setStudyPlans((prev) =>
          prev.filter((plan) => plan.planId !== planToDelete)
        );
        console.log("Study plan deleted successfully");
        // You could show a success toast here
      }
    } catch (error: any) {
      console.error("Failed to delete study plan:", error);
      // You could show an error toast here
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setPlanToDelete(null);
    }
  };

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
        console.error("Failed to fetch study plans:", error);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchStudyPlans();
  }, [userId]);

  // Custom scrollbar styles for better UI
  const customScrollbarStyles = {
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(0, 0, 0, 0.05)",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.2)"
          : "rgba(0, 0, 0, 0.2)",
      borderRadius: "10px",
      "&:hover": {
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.3)"
            : "rgba(0, 0, 0, 0.3)",
      },
    },
    // Firefox scrollbar
    scrollbarWidth: "thin",
    scrollbarColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.05)",
  };

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

  const fetchSuggestedWorkspaces = useCallback(async () => {
    if (!userId) return;

    console.log("Fetching suggested workspaces for user:", userId);
    setLoadingSuggestions(true);

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/user/get-suggested-workspaces/${userId}`
      );
      console.log(response.data.data);
      if (response.data.success) {
        setSuggestedWorkspaces(response.data.data.suggestedWorkspacesForYou);
        if (response.data.data.source === "no_suggestions_available" || response.data.data.suggestedWorkspacesForYou.length === 0) {
          setNoSuggestions(true);
        }
      }
    } catch (error) {
      console.error("Error fetching suggested workspaces:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  }, [userId]);

  const handleJoinWorkspace = async (workspaceId: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/workspaces/join`,
        {
          workspaceId,
        }
      );
      if (response.data.success) {
        handleLogging(`You joined with workspace ${response.data.data.name}`);
        navigate(`/workspace/${workspaceId}`); // Redirect to workspaces page
      }
    } catch (err) {
      console.error("Error joining workspace:", err);
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
      <PageHeader
        title="Dashboard Overview"
        subtitle="Track your learning progress, manage study plans, and stay connected with your collaborative workspace"
        //  icon={<AssessmentIcon fontSize="large" />}
        gradient={true}
        centerAlign={true}
      />

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
              <CardContent sx={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Skeleton variant="text" width={60} height={48} />
                    <Skeleton
                      variant="text"
                      width={100}
                      height={20}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <Skeleton variant="circular" width={40} height={40} />
                </Box>
              </CardContent>
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
              <List
                sx={{
                  p: 0,
                  maxHeight: "300px",
                  overflow: "auto",
                  ...customScrollbarStyles,
                }}
              >
                {!loading ? (
                  workspaceData?.workspaces.map((workspace, index) => (
                    <ListItem key={index} sx={{ px: 2, py: 1.5 }}>
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
                  <>
                    {[1, 2, 3, 4].map((item) => (
                      <ListItem key={item} sx={{ px: 2, py: 1.5 }}>
                        <ListItemAvatar>
                          <Skeleton variant="circular" width={40} height={40} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Skeleton variant="text" width="60%" height={24} />
                          }
                          secondary={
                            <Skeleton variant="text" width="40%" height={16} />
                          }
                        />
                        <Skeleton variant="rounded" width={80} height={32} />
                      </ListItem>
                    ))}
                  </>
                )}
                {workspaceData?.workspaces.length === 0 && (
                  <EmptyStateMessage
                    icon={<WorkspacePremium />}
                    title="No Active Workspaces"
                    description="Join collaborative workspaces to connect with peers, share knowledge, and learn together in a supportive environment."
                  
                  />
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
              <Box
                sx={{
                  maxHeight: "300px",
                  overflow: "auto",
                  ...customScrollbarStyles,
                }}
              >
                {!loading ? (
                  groupData?.groups.length !== 0 &&
                  groupData?.groups.map((group, index) => (
                    <ListItem key={index} sx={{ px: 2, py: 1.5 }}>
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
                  <>
                    {[1, 2, 3, 4].map((item) => (
                      <ListItem key={item} sx={{ px: 2, py: 1.5 }}>
                        <ListItemAvatar>
                          <Skeleton variant="circular" width={40} height={40} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Skeleton variant="text" width="70%" height={24} />
                          }
                          secondary={
                            <Skeleton variant="text" width="50%" height={16} />
                          }
                        />
                      </ListItem>
                    ))}
                  </>
                )}
                {groupData?.groups.length === 0 && (
                  <EmptyStateMessage
                    icon={<Groups />}
                    title="No Active Groups"
                    description="Join study groups to collaborate on projects, share resources, and engage in meaningful discussions with like-minded learners."
                    
                  />
                )}
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
              onClick={() => navigate("/study-plans-generator")}
              startIcon={<Add />}
            >
              Create New
            </Button>
          </Box>

          {loadingPlans ? (
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
              {Array.from({ length: 4 }).map((_, index) => (
                <Card
                  key={index}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.1
                    )}`,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    {/* Header with title and status */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Skeleton variant="text" width="60%" height={24} />
                      <Skeleton variant="rounded" width={60} height={20} />
                    </Box>

                    {/* Study Goal */}
                    <Skeleton
                      variant="text"
                      width="80%"
                      height={20}
                      sx={{ mb: 1.5 }}
                    />

                    {/* Subjects */}
                    <Box sx={{ mb: 1.5 }}>
                      <Skeleton
                        variant="text"
                        width="30%"
                        height={16}
                        sx={{ mb: 0.5 }}
                      />
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        <Skeleton variant="rounded" width={50} height={20} />
                        <Skeleton variant="rounded" width={60} height={20} />
                        <Skeleton variant="rounded" width={45} height={20} />
                      </Box>
                    </Box>

                    {/* Schedule Info */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Skeleton variant="text" width="45%" height={16} />
                      <Skeleton variant="text" width="25%" height={16} />
                    </Box>

                    {/* Days remaining */}
                    <Skeleton
                      variant="text"
                      width="40%"
                      height={16}
                      sx={{ mb: 1 }}
                    />
                  </CardContent>

                  {/* Action buttons */}
                  <Box sx={{ p: 2, pt: 0, display: "flex", gap: 1 }}>
                    <Skeleton variant="rounded" width="100%" height={32} />
                  </Box>
                </Card>
              ))}
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
                    totalTasks={
                      plan.totalTasks || Math.floor(Math.random() * 20) + 5
                    }
                    completedTasks={
                      plan.completedTasks || Math.floor(Math.random() * 15)
                    }
                    onView={(planId) => {
                      handleViewPlan(planId);
                    }}
                    onResume={(planId) => {
                      console.log("Resume plan:", planId);
                      // Navigate to plan execution
                    }}
                    onDelete={(planId) => {
                      handleDeletePlan(planId);
                    }}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <EmptyStateMessage
              icon={<Schedule />}
              title="No Study Plans Created"
              description="Create personalized study plans to organize your learning goals, track progress, and stay motivated on your educational journey."
              actionButton={
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate("/study-plans-generator")}
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    "&:hover": {
                      bgcolor: theme.palette.primary.dark,
                    },
                  }}
                >
                  Create Study Plan
                </Button>
              }
              fullWidth={true}
            />
          )}
        </CardContent>
      </Card>

      {/* Suggested Workspaces */}
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
              <Add sx={{ mr: 1, color: theme.palette.success.main }} />
              <Typography variant="h6" fontWeight="600">
                Suggested Workspaces to Join
              </Typography>
            </Box>
            <Button
              variant="text"
              size="small"
              onClick={fetchSuggestedWorkspaces}
              disabled={loadingSuggestions}
              startIcon={
                loadingSuggestions ? <CircularProgress size={16} /> : undefined
              }
            >
              {loadingSuggestions ? "Loading..." : "Get Suggestions"}
            </Button>
          </Box>
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
            {loadingSuggestions ? (
              // Show skeleton cards while loading
              <>
                {[1, 2, 3].map((item) => (
                  <Card
                    key={item}
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <CardContent>
                      <Skeleton
                        variant="text"
                        width="80%"
                        height={32}
                        sx={{ mb: 1 }}
                      />
                      <Skeleton
                        variant="text"
                        width="100%"
                        height={20}
                        sx={{ mb: 1 }}
                      />
                      <Skeleton
                        variant="text"
                        width="90%"
                        height={20}
                        sx={{ mb: 2 }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Skeleton variant="text" width="40%" height={16} />
                      </Box>
                      <Skeleton variant="rounded" width="100%" height={36} />
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : suggestedWorkspaces.length !== 0 ? (
              suggestedWorkspaces.map((workspace, index) => (
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
                      {workspace.workspaceName}
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
                      <Typography variant="caption" color="text.secondary">
                        {workspace.memberCount} members
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      size="small"
                      onClick={() => handleJoinWorkspace(workspace.workspaceId)}
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
              ))
            ) : noSuggestions ? (
              <EmptyStateMessage
                icon={<AutoFixHigh />}
                title="No Personalized Suggestions"
                description="We couldn't find personalized workspace suggestions based on your current activity. Join more workspaces and engage with content to get better recommendations!"
                actionButton={
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate("/landing")}
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      "&:hover": {
                        bgcolor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    Discover Workspaces
                  </Button>
                }
                fullWidth={true}
              />
            ) : (
              <EmptyStateMessage
                icon={<Lightbulb />}
                title="Getting Suggestions Ready"
                description="Click 'Get Suggestions' to discover workspaces that match your interests and learning goals."
                actionButton={
                  <Button
                    variant="outlined"
                    startIcon={<AutoFixHigh />}
                    onClick={fetchSuggestedWorkspaces}
                    disabled={loadingSuggestions}
                    sx={{
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        borderColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    Get Suggestions
                  </Button>
                }
                fullWidth={true}
              />
            )}
          </Box>
        </CardContent>
      </Card>

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
              <List
                sx={{
                  p: 0,
                  maxHeight: "300px",
                  overflow: "auto",
                  ...customScrollbarStyles,
                }}
              >
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
                  <>
                    {[1, 2, 3, 4, 5].map((item) => (
                      <ListItem key={item} sx={{ px: 0, py: 1.5 }}>
                        <ListItemAvatar>
                          <Skeleton variant="circular" width={40} height={40} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Skeleton variant="text" width="80%" height={24} />
                          }
                          secondary={
                            <Skeleton variant="text" width="30%" height={16} />
                          }
                        />
                      </ListItem>
                    ))}
                  </>
                )}
                {logs.length === 0 && (
                  <EmptyStateMessage
                    icon={<Timeline />}
                    title="No Recent Activities"
                    description="Your activity timeline will appear here. Start engaging with workspaces, groups, and study plans to see your learning journey unfold."
                    actionButton={
                      <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => navigate("/view-all")}
                        sx={{
                          borderColor: theme.palette.primary.main,
                          color: theme.palette.primary.main,
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            borderColor: theme.palette.primary.dark,
                          },
                        }}
                      >
                        Start Exploring
                      </Button>
                    }
                  />
                )}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Study Plan View Modal */}
      <StudyPlanViewModal
        open={viewModalOpen}
        onClose={handleCloseViewModal}
        planId={selectedPlanId}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: theme.palette.error.main }}>
          Delete Study Plan
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this study plan? This action cannot
            be undone. All your progress and tasks will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} /> : null}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
