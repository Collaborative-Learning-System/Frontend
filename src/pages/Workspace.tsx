import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ChatUI from "../components/ChatUI";
import Quiz from "../components/Quiz";
import Leaderboard from "../components/Leaderboard";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Tabs,
  Tab,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Drawer,
  useMediaQuery,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Quiz as QuizIcon,
  Leaderboard as LeaderboardIcon,
  Add as AddIcon,
  Group as GroupIcon,
  ExitToApp as ExitIcon,
  AdminPanelSettings as AdminIcon,
  School as SchoolIcon,
  PersonAdd as JoinIcon,
  PersonRemove as LeaveIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import ArticleIcon from "@mui/icons-material/Article";
import { useNavigate } from "react-router-dom";
import NotificationService from "../services/NotificationService";
import { useThemeContext } from "../context/ThemeContext";
import { handleLogging } from "../services/LoggingService";
import RealTimeCollaboration from "../components/RealTimeCollaboration/RealTimeCollaboration";
import { useWorkspace } from "../context/WorkspaceContext";
import { useGroup } from "../context/GroupContext";
import { AppContext } from "../context/AppContext";
import { notifyUsers } from "../services/NotifyService";
import AddMembersModal from "../components/AddMembersModal";
import { getRandomBackground } from "../constants/backgroundImages";

interface WorkspaceData {
  id: string;
  name: string;
  description: string;
  adminId: string;
  adminName: string;
  memberCount: number;
  role: string;
}

interface workspaceMemberData {
  userId: string;
  name: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  workspaceId: string;
  isMember: boolean;
}

const Workspace = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [workspaceData, setWorkspaceData] = useState<WorkspaceData | null>(
    null
  );
  const [workspaceMembers, setWorkspaceMembers] = useState<
    workspaceMemberData[]
  >([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const [joiningGroups, setJoiningGroups] = useState<Set<string>>(new Set());
  const [deletingGroups, setDeletingGroups] = useState<Set<string>>(new Set());
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  // Admin menu states
  const [adminMenuAnchor, setAdminMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [adminRoleModalOpen, setAdminRoleModalOpen] = useState(false);
  const [assigningAdmin, setAssigningAdmin] = useState<string | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // Leave confirmation dialog state
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);


  const { userId } = useContext(AppContext);
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { setWorkspaceData: setGlobalWorkspaceData } = useWorkspace();
  const { setSelectedGroup: setGlobalSelectedGroup } = useGroup();

  const updateSelectedGroup = (groupId: string | null) => {
    setSelectedGroup(groupId);

    if (groupId) {
      const groupData = groups.find((g) => g.id === groupId);
      console.log("groupData", groupData);
      if (groupData) {
        setGlobalSelectedGroup(groupData);
      } else {
        setGlobalSelectedGroup(null);
      }
    } else {
      setGlobalSelectedGroup(null);
    }
  };

  useEffect(() => {
    const fetchWorkspaceDetails = async () => {
      if (!workspaceId) {
        setError("Workspace ID not found in URL");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/workspaces/details`,
          { workspaceId: workspaceId },
          { withCredentials: true }
        );

        if (response.data.success) {
          console.log("Workspace data fetched:", response.data.data);
          setWorkspaceData(response.data.data);
          setGlobalWorkspaceData(response.data.data);
          console.log("Global workspace data set:", response.data.data);
          setError(null);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch workspace details"
          );
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch workspace details"
        );
        console.error("Error fetching workspace details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaceDetails();
  }, [workspaceId]);

  useEffect(() => {
    const fetchWorkspaceMembers = async () => {
      if (!workspaceId) return;
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/workspaces/get-workspace-members/${workspaceId}`
        );

        setWorkspaceMembers(response.data.data);
        console.log(response.data.data);
      } catch (error) {}
    };

    fetchWorkspaceMembers();
  }, [workspaceId]);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!workspaceId) return;

      try {
        setGroupsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/workspaces/${workspaceId}/groups`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setGroups(response.data.data.groups);
          // Set the first joined group as selected, or first group if none joined
          const joinedGroups = response.data.data.groups.filter(
            (group: Group) => group.isMember
          );
          if (joinedGroups.length > 0) {
            updateSelectedGroup(joinedGroups[0].id);
          } else if (response.data.data.groups.length > 0) {
            // updateSelectedGroup(response.data.data.groups[0].id);
            setSelectedGroup(null);
          }
        } else {
          throw new Error(response.data.message || "Failed to fetch groups");
        }
      } catch (err) {
        console.error("Error fetching groups:", err);
        NotificationService.showError("Failed to load groups");
      } finally {
        setGroupsLoading(false);
      }
    };

    if (workspaceId) {
      fetchGroups();
    }
  }, [workspaceId]);

  const handleJoinLeaveGroup = async (groupId: string) => {
    try {
      setJoiningGroups((prev) => new Set(prev).add(groupId));

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/workspaces/groups/join-leave`,
        { groupId },
        { withCredentials: true }
      );

      if (response.data.success) {
        NotificationService.showInfo(response.data.message);
        handleLogging(
          `${
            response.data.data.action === "joined" ? "Joined" : "Left"
          } the group ${
            groups.find((g) => g.id === groupId)?.name || ""
          } in the workspace ${workspaceData?.name}`
        );
        // Update the groups list
        setGroups((prevGroups) =>
          prevGroups.map((group) =>
            group.id === groupId
              ? { ...group, isMember: response.data.data.action === "joined" }
              : group
          )
        );

        // If user left the currently selected group, switch to first available joined group
        if (response.data.data.action === "left" && selectedGroup === groupId) {
          const remainingJoinedGroups = groups.filter(
            (group) => group.id !== groupId && group.isMember
          );
          if (remainingJoinedGroups.length > 0) {
            updateSelectedGroup(remainingJoinedGroups[0].id);
          } else {
            // updateSelectedGroup(groups.length > 0 ? groups[0].id : null);
            setSelectedGroup(null);
          }
        }
      } else {
        throw new Error(response.data.message || "Failed to join/leave group");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to join/leave group";
      NotificationService.showError(errorMessage);
      console.error("Error joining/leaving group:", err);
    } finally {
      setJoiningGroups((prev) => {
        const newSet = new Set(prev);
        newSet.delete(groupId);
        return newSet;
      });
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || !workspaceId) {
      NotificationService.showError("Group name is required");
      return;
    }

    try {
      setCreatingGroup(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/workspaces/${workspaceId}/groups`,
        {
          groupname: groupName.trim(),
          description: groupDescription.trim(),
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        NotificationService.showInfo("Group created successfully");
        handleLogging(
          `Created the group ${groupName.trim()} in the workspace ${
            workspaceData?.name
          }`
        );

        // Add the new group to the list and select it
        const newGroup: Group = {
          id: response.data.data.id,
          name: response.data.data.name,
          description: response.data.data.description,
          workspaceId: response.data.data.workspaceId,
          isMember: response.data.data.isMember,
        };

        setGroups((prevGroups) => [...prevGroups, newGroup]);
        updateSelectedGroup(newGroup.id);

        // Close dialog and reset form
        setCreateGroupOpen(false);
        setGroupName("");
        setGroupDescription("");
      } else {
        throw new Error(response.data.message || "Failed to create group");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create group";
      NotificationService.showError(errorMessage);
      console.error("Error creating group:", err);
    } finally {
      setCreatingGroup(false);
    }
  };

  // Add missing handleDeleteGroup function
  const handleDeleteGroup = async (groupId: string) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;
    if (!workspaceId) {
      NotificationService.showError("Workspace ID not found");
      return;
    }
    try {
      setDeletingGroups((prev) => new Set(prev).add(groupId));
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/workspaces/${workspaceId}/groups/${groupId}/delete`,
        { withCredentials: true }
      );
      if (response.data.success) {
        NotificationService.showInfo("Group deleted successfully");
        handleLogging(
          `Deleted the group ${
            groups.find((g) => g.id === groupId)?.name || ""
          } in the workspace ${workspaceData?.name}`
        );
        setGroups((prevGroups) =>
          prevGroups.filter((group) => group.id !== groupId)
        );
        if (selectedGroup === groupId) {
          const joinedGroups = groups.filter(
            (group) => group.id !== groupId && group.isMember
          );
          setSelectedGroup(joinedGroups.length > 0 ? joinedGroups[0].id : groups.length > 0 ? groups[0].id : null);
        }
      } else {
        throw new Error(response.data.message || "Failed to delete group");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete group";
      NotificationService.showError(errorMessage);
      console.error("Error deleting group:", err);
    } finally {
      setDeletingGroups((prev) => {
        const newSet = new Set(prev);
        newSet.delete(groupId);
        return newSet;
      });
    }
  };

  const handleCloseCreateDialog = () => {
    setCreateGroupOpen(false);
    setGroupName("");
    setGroupDescription("");
  };

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const renderGroupsList = (isInDrawer = false) => (
    <Box
      sx={{
        width: isInDrawer ? 280 : "100%",
        height: isInDrawer ? "100vh" : "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ p: { xs: 2, sm: 3 }, pb: 2, flexShrink: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <GroupIcon color="primary" />
          <Typography
            variant="h6"
            color="primary"
            fontWeight="600"
            sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
          >
            Groups
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
        {groupsLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : groups.length > 0 ? (
          <List sx={{ px: { xs: 1, sm: 2 }, pb: 2 }}>
            {groups.map((group) => (
              <ListItem key={group.id} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  selected={selectedGroup === group.id}
                  onClick={() => {
                    if (group.isMember) {
                      updateSelectedGroup(group.id);
                      if (isInDrawer) setMobileDrawerOpen(false);
                    }
                  }}
                  sx={{
                    borderRadius: 2,
                    minHeight: { xs: 44, sm: 48 },
                    px: { xs: 1, sm: 2 },
                    opacity: group.isMember ? 1 : 0.6,
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    },
                    "&:hover": {
                      bgcolor:
                        selectedGroup === group.id
                          ? "primary.dark"
                          : group.isMember
                          ? "action.hover"
                          : "transparent",
                    },
                    "&.Mui-disabled": {
                      opacity: 0.6,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: { xs: 32, sm: 40 } }}>
                    <SchoolIcon
                      sx={{
                        color:
                          selectedGroup === group.id
                            ? "primary.contrastText"
                            : group.isMember
                            ? "text.secondary"
                            : "text.disabled",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={group.name}
                    secondary={group.isMember ? null : "Not joined"}
                    primaryTypographyProps={{
                      fontWeight: selectedGroup === group.id ? "600" : "400",
                      fontSize: { xs: "0.8rem", sm: "0.9rem" },
                      noWrap: true,
                    }}
                    secondaryTypographyProps={{
                      fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    }}
                  />
                  <Box sx={{ ml: { xs: 0.5, sm: 1 }, display: "flex", gap: 0.5 }}>
                    {joiningGroups.has(group.id) ? (
                      <CircularProgress size={16} />
                    ) : group.isMember ? (
                      <Tooltip title="Leave Group">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinLeaveGroup(group.id);
                          }}
                          sx={{
                            color:
                              selectedGroup === group.id
                                ? "primary.contrastText"
                                : "text.secondary",
                            p: { xs: 0.5, sm: 1 },
                            "&:hover": {
                              bgcolor: "rgba(0,0,0,0.1)",
                            },
                          }}
                        >
                          <LeaveIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Join Group">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinLeaveGroup(group.id);
                          }}
                          sx={{
                            color: "primary.main",
                            p: { xs: 0.5, sm: 1 },
                            "&:hover": {
                              bgcolor: "#1F51FF",
                              color: "primary.contrastText",
                              transform: "scale(1.1)",
                              animation: "bounce 0.3s",
                            },
                            "@keyframes bounce": {
                              "0%": { transform: "scale(1)" },
                              "50%": { transform: "scale(1.2)" },
                              "100%": { transform: "scale(1)" },
                            },
                          }}
                        >
                          <JoinIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                        </IconButton>
                      </Tooltip>
                    )}
                    {/* Delete button - only for workspace admins */}
                    {workspaceData?.role === "admin" && (
                      <Tooltip title="Delete Group">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGroup(group.id);
                          }}
                          disabled={deletingGroups.has(group.id)}
                          sx={{
                            color:
                              selectedGroup === group.id
                                ? "primary.contrastText"
                                : "error.main",
                            p: { xs: 0.5, sm: 1 },
                            "&:hover": {
                              bgcolor: "rgba(211, 47, 47, 0.1)",
                            },
                            "&.Mui-disabled": {
                              opacity: 0.5,
                            },
                          }}
                        >
                          {deletingGroups.has(group.id) ? (
                            <CircularProgress size={16} />
                          ) : (
                            <DeleteIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                          )}
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ p: { xs: 2, sm: 3 }, textAlign: "center" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
            >
              No groups available
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ mx: { xs: 1, sm: 2 } }} />

      {/* Only show Add Group button for admins */}
      {workspaceData?.role === "admin" && (
        <Box sx={{ p: { xs: 1.5, sm: 2 }, flexShrink: 0 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              setCreateGroupOpen(true);
              if (isInDrawer) setMobileDrawerOpen(false);
            }}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "500",
              py: { xs: 0.75, sm: 1 },
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
            }}
          >
            Create Group
          </Button>
        </Box>
      )}
    </Box>
  );

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getTabContent = () => {
    if (!selectedGroup) {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No group selected
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please select a group from the sidebar to continue
          </Typography>
        </Box>
      );
    }

    switch (activeTab) {
      case 0:
        return <ChatUI groupId={selectedGroup} />;
      case 1:
        return <Quiz groupId={selectedGroup} />;
      case 2:
        return <Leaderboard groupId={selectedGroup} />;
      case 3:
        return <RealTimeCollaboration groupId={selectedGroup} />;
      default:
        return <ChatUI groupId={selectedGroup} />;
    }
  };

  const handleLeaveWorkspace = async () => {
    if (workspaceData?.adminId === userId) {
      return NotificationService.showError(
        "Workspace admins cannot leave the workspace. Please transfer admin rights or delete the workspace."
      );
    }
    
    setLeaveDialogOpen(true);
  };

  const handleCloseLeaveDialog = () => {
    setLeaveDialogOpen(false);
  };

  const handleConfirmLeave = async () => {
    if (!workspaceId) {
      NotificationService.showError("Workspace ID not found");
      setLeaveDialogOpen(false);
      return;
    }

    try {
      setIsLeaving(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/workspaces/leave`,
        { workspaceId: workspaceId },
        { withCredentials: true }
      );

      if (response.data.success) {
        NotificationService.showInfo("You have left the workspace.");
        handleLogging("Left the workspace " + workspaceData?.name);

        navigate("/landing");
      } else {
        throw new Error(response.data.message || "Failed to leave workspace");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to leave workspace";
      NotificationService.showError(errorMessage);
      console.error("Error leaving workspace:", err);
    } finally {
      setIsLeaving(false);
      setLeaveDialogOpen(false);
    }
  };

  // Admin menu handlers
  const handleAdminMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAdminMenuAnchor(event.currentTarget);
  };

  const handleAdminMenuClose = () => {
    setAdminMenuAnchor(null);
  };

  const handleOpenAdminRoleModal = () => {
    setAdminRoleModalOpen(true);
    handleAdminMenuClose();
  };

  const handleCloseAdminRoleModal = () => {
    setAdminRoleModalOpen(false);
    setAssigningAdmin(null);
  };

  const handleOpenInviteModal = () => {
    setInviteModalOpen(true);
    handleAdminMenuClose();
  };

  const handleCloseInviteModal = () => {
    setInviteModalOpen(false);
  };

  const handleInviteSuccess = async () => {
    // Refresh workspace members after successful invitations
    if (!workspaceId) return;
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/workspaces/get-workspace-members/${workspaceId}`
      );
      setWorkspaceMembers(response.data.data);
    } catch (error) {
      console.error("Error refreshing workspace members:", error);
    }
  };

  const handleMakeAdmin = async (memberId: string) => {
    if (!workspaceId) {
      NotificationService.showError("Workspace ID not found");
      return;
    }

    try {
      setAssigningAdmin(memberId);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/workspaces/assign-admin`,
        {
          workspaceId: workspaceId,
          newAdminId: memberId,
        }
      );

      if (response.data.success) {
        NotificationService.showSuccess("Admin role assigned successfully!");
        handleLogging(
          `Assigned admin role to member ${memberId} in workspace ${workspaceData?.name}`
        );
        let users: string[] = [];
        users.push(memberId);
        notifyUsers(
          users,
          "You have been assigned as the new admin of the workspace " +
            workspaceData?.name,
          `/workspace/${workspaceData?.id}`
        );
        // Refresh workspace data to reflect changes
        window.location.reload();
      } else {
        throw new Error(response.data.message || "Failed to assign admin role");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to assign admin role";
      NotificationService.showError(errorMessage);
      console.error("Error assigning admin role:", err);
    } finally {
      setAssigningAdmin(null);
      setAdminRoleModalOpen(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !workspaceData) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          {error || "Workspace not found"}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        maxHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        p: { xs: 1.5, sm: 2, md: 3 },
        gap: { xs: 2, sm: 3 },
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          background: workspaceId ? `url(${getRandomBackground(workspaceId)})` : 
            (mode === "dark"
              ? theme.palette.background.paper
              : theme.palette.primary.main),
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: mode === "dark" 
              ? "rgba(0, 0, 0, 0.6)" 
              : "rgba(0, 0, 0, 0.4)",
            zIndex: 1,
          },
        }}
      >
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 },
            position: "relative",
            zIndex: 2,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
                flexWrap: "wrap",
              }}
            >
              <SchoolIcon
                sx={{
                  fontSize: { xs: 24, sm: 28, md: 32 },
                  color: mode === "dark" ? theme.palette.primary.main : "white",
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  color: mode === "dark" ? theme.palette.primary.main : "white",
                  fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" },
                  wordBreak: "break-word",
                }}
              >
                {workspaceData.name}
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.9,
                color: mode === "dark" ? "inherit" : "white",
                fontSize: { xs: "0.875rem", sm: "1rem" },
                wordBreak: "break-word",
              }}
            >
              {workspaceData.description || "No description available"}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 1.5 },
              flexDirection: { xs: "column", sm: "row" },
              flexWrap: "wrap",
              justifyContent: { xs: "stretch", sm: "flex-end" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {workspaceData.role === "admin" && (
              <Chip
                icon={<AdminIcon sx={{ color: "white" }} />}
                label="Admin"
                color="secondary"
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  "& .MuiChip-icon": { color: "white" },
                }}
              />
            )}
            {workspaceData.role !== "admin" && (
              <Tooltip
                title={`Workspace Admin: ${workspaceData.adminName}`}
                arrow
              >
                <Chip
                  icon={<AdminIcon sx={{ color: "white" }} />}
                  label={workspaceData.adminName}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: "rgba(255,255,255,0.3)",
                    color: "white",
                    "& .MuiChip-icon": { color: "white" },
                    maxWidth: "150px",
                    "& .MuiChip-label": {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                />
              </Tooltip>
            )}
            <Chip
              icon={<GroupIcon sx={{ color: "white" }} />}
              label={`${workspaceData.memberCount} Members`}
              color="secondary"
              size="small"
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                "& .MuiChip-icon": { color: "white" },
              }}
            />
            <Button
              variant="outlined"
              color="warning"
              size="small"
              startIcon={<ExitIcon />}
              disabled={isLeaving}
              sx={{
                borderColor: "rgba(255,255,255,0.5)",
                color: "white",
                minWidth: { xs: "100%", sm: "auto" },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
                "&:disabled": {
                  borderColor: "rgba(255,255,255,0.3)",
                  color: "rgba(255,255,255,0.5)",
                },
              }}
              onClick={handleLeaveWorkspace}
            >
              {isLeaving ? "Leaving..." : "Leave"}
            </Button>

            {workspaceData.role === "admin" && (
              <Tooltip title="Admin Options" arrow>
                <IconButton
                  onClick={handleAdminMenuClick}
                  sx={{
                    color: "white",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 2, md: 3 },
          flex: 1,
          minHeight: 0,
          maxHeight: "100%",
          overflow: "hidden",
        }}
      >
        {/* Desktop Sidebar - Hidden on mobile */}
        {!isMobile && (
          <Card
            elevation={2}
            sx={{
              width: { md: 300, lg: 320 },
              height: "100%",
              maxHeight: "100%",
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <CardContent
              sx={{
                p: 0,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {renderGroupsList()}
            </CardContent>
          </Card>
        )}

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileDrawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 280,
            },
          }}
        >
          {renderGroupsList(true)}
        </Drawer>

        {/* Main Section */}
        <Paper
          elevation={2}
          sx={{
            flex: 1,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            maxHeight: "100%",
            overflow: "hidden",
          }}
        >
          {/* Mobile Group Selector Header */}
          {isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                borderBottom: 1,
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={handleDrawerToggle} sx={{ mr: 1 }}>
                  <MenuIcon />
                </IconButton>
                <GroupIcon color="primary" />
                <Typography variant="h6" sx={{ fontSize: "1rem" }}>
                  {selectedGroup
                    ? groups.find((g) => g.id === selectedGroup)?.name ||
                      "Select Group"
                    : "Select Group"}
                </Typography>
              </Box>
              {workspaceData?.role === "admin" && (
                <IconButton
                  onClick={() => setCreateGroupOpen(true)}
                  color="primary"
                  size="small"
                >
                  <AddIcon />
                </IconButton>
              )}
            </Box>
          )}

          {/* Tabs */}
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              flexShrink: 0,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                px: { xs: 1, sm: 3 },
                minHeight: { xs: 40, sm: 48 },
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: "500",
                  fontSize: { xs: "0.8rem", sm: "0.95rem" },
                  minHeight: { xs: 40, sm: 48 },
                  minWidth: { xs: 60, sm: 80 },
                  px: { xs: 1, sm: 2 },
                  "&:hover": {
                    color: "primary.main",
                  },
                },
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                },
                "& .MuiTabs-scrollButtons": {
                  "&.Mui-disabled": {
                    opacity: 0.3,
                  },
                },
              }}
            >
              <Tab
                icon={<ChatIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />}
                label="Chat"
                iconPosition="start"
                sx={{ gap: { xs: 0.5, sm: 1 } }}
              />
              <Tab
                icon={<QuizIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />}
                label="Quiz"
                iconPosition="start"
                sx={{ gap: { xs: 0.5, sm: 1 } }}
              />
              <Tab
                icon={<LeaderboardIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />}
                label="Leaderboard"
                iconPosition="start"
                sx={{ gap: { xs: 0.5, sm: 1 } }}
              />
              <Tab
                icon={
                  <ArticleIcon
                    sx={{
                      fontSize: { xs: 18, sm: 24 },
                    }}
                  />
                }
                label="Collaboration"
                iconPosition="start"
                sx={{ gap: { xs: 0.5, sm: 1 } }}
              />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 2, sm: 3 },
              overflow: "hidden",
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {getTabContent()}
          </Box>
        </Paper>
      </Box>

      {/* Create Group Dialog */}
      <Dialog
        open={createGroupOpen}
        onClose={handleCloseCreateDialog}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: 3 },
            m: { xs: 0, sm: 2 },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1,
            px: { xs: 2, sm: 3 },
            pt: { xs: 2, sm: 3 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <GroupIcon color="primary" />
            <Typography
              variant="h6"
              color="primary"
              fontWeight="600"
              sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
            >
              Create New Group
            </Typography>
          </Box>
          <IconButton
            onClick={handleCloseCreateDialog}
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            pt: 2,
            px: { xs: 2, sm: 3 },
            pb: { xs: 1, sm: 2 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, sm: 3 },
            }}
          >
            <TextField
              label="Group Name"
              variant="outlined"
              fullWidth
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              required
              size={isMobile ? "small" : "medium"}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={isMobile ? 2 : 3}
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder="Enter group description (optional)"
              size={isMobile ? "small" : "medium"}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: { xs: 2, sm: 3 },
            pb: { xs: 2, sm: 3 },
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Button
            onClick={handleCloseCreateDialog}
            variant="outlined"
            fullWidth={isMobile}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "500",
              order: { xs: 2, sm: 1 },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateGroup}
            variant="contained"
            disabled={!groupName.trim() || creatingGroup}
            startIcon={
              creatingGroup ? <CircularProgress size={16} /> : <AddIcon />
            }
            fullWidth={isMobile}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "500",
              minWidth: { xs: "100%", sm: 120 },
              order: { xs: 1, sm: 2 },
            }}
          >
            {creatingGroup ? "Creating..." : "Create Group"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Admin Menu */}
      <Menu
        anchorEl={adminMenuAnchor}
        open={Boolean(adminMenuAnchor)}
        onClose={handleAdminMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 200,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          },
        }}
      >
        <MenuItem onClick={handleOpenInviteModal}>
          <JoinIcon sx={{ mr: 1 }} />
          Add Members
        </MenuItem>
        <MenuItem onClick={handleOpenAdminRoleModal}>
          <AdminIcon sx={{ mr: 1 }} />
          Grant Admin Role
        </MenuItem>
      </Menu>

      {/* Admin Role Management Modal */}
      <Dialog
        open={adminRoleModalOpen}
        onClose={handleCloseAdminRoleModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: "80vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AdminIcon color="primary" />
            <Typography variant="h6">Grant Admin Role</Typography>
          </Box>
          <IconButton
            onClick={handleCloseAdminRoleModal}
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select a member to grant admin privileges to this workspace.
          </Typography>

          {workspaceMembers.length === 1 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No members found in this workspace.
              </Typography>
            </Box>
          ) : (
            <List sx={{ maxHeight: 400, overflow: "auto" }}>
              {workspaceMembers
                .filter((member) => member.userId !== userId) // Don't show current user
                .map((member) => (
                  <ListItem
                    key={member.userId}
                    sx={{
                      bgcolor: "background.paper",
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      mb: 1,
                      "&:last-child": { mb: 0 },
                    }}
                  >
                    <ListItemIcon>
                      <GroupIcon color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={member.name}
                      secondary={`User ID: ${member.userId}`}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      disabled={assigningAdmin === member.userId}
                      startIcon={
                        assigningAdmin === member.userId ? (
                          <CircularProgress size={16} />
                        ) : (
                          <AdminIcon />
                        )
                      }
                      onClick={() => handleMakeAdmin(member.userId)}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        minWidth: 120,
                      }}
                    >
                      {assigningAdmin === member.userId
                        ? "Assigning..."
                        : "Make Admin"}
                    </Button>
                  </ListItem>
                ))}
            </List>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleCloseAdminRoleModal}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "500",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Leave Workspace Confirmation Dialog */}
      <Dialog
        open={leaveDialogOpen}
        onClose={handleCloseLeaveDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: theme.palette.error.main, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ExitIcon />
          Leave Workspace
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to leave "{workspaceData?.name}"? You will lose access to all groups, 
            conversations, and collaborative content in this workspace.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleCloseLeaveDialog}
            variant="outlined"
            disabled={isLeaving}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "500",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmLeave}
            variant="contained"
            color="error"
            disabled={isLeaving}
            startIcon={isLeaving ? <CircularProgress size={16} /> : <ExitIcon />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "500",
            }}
          >
            {isLeaving ? "Leaving..." : "Leave Workspace"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Members Modal */}
      <AddMembersModal
        open={inviteModalOpen}
        onClose={handleCloseInviteModal}
        entityId={workspaceId || ""}
        entityName={workspaceData?.name || ""}
        entityType="workspace"
        title="Add Members to Workspace"
        description={`Add new members to the "${workspaceData?.name || ""}" workspace.`}
        onAddSuccess={handleInviteSuccess}
      />
    </Box>
  );
};

export default Workspace;
