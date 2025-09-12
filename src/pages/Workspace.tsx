import { useState, useEffect } from "react";
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
  DialogActions,
  TextField,
  Drawer,
  useMediaQuery,
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
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import NotificationService from "../services/NotificationService";
import { useThemeContext } from "../context/ThemeContext";
import { handleLogging } from "../services/LoggingService";

interface WorkspaceData {
  id: string;
  name: string;
  description: string;
  adminId: string;
  memberCount: number;
  role: string;
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
  const [workspaceData, setWorkspaceData] = useState<WorkspaceData | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const [joiningGroups, setJoiningGroups] = useState<Set<string>>(new Set());
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
          "http://localhost:3000/api/workspaces/details",
          { workspaceId: workspaceId },
          { withCredentials: true }
        );

        if (response.data.success) {
          setWorkspaceData(response.data.data);
          setError(null);
        } else {
          throw new Error(response.data.message || "Failed to fetch workspace details");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch workspace details");
        console.error("Error fetching workspace details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaceDetails();
  }, [workspaceId]);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!workspaceId) return;

      try {
        setGroupsLoading(true);
        const response = await axios.get(
          `http://localhost:3000/api/workspaces/${workspaceId}/groups`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setGroups(response.data.data.groups);
          // Set the first joined group as selected, or first group if none joined
          const joinedGroups = response.data.data.groups.filter((group: Group) => group.isMember);
          if (joinedGroups.length > 0) {
            setSelectedGroup(joinedGroups[0].id);
          } else if (response.data.data.groups.length > 0) {
            setSelectedGroup(response.data.data.groups[0].id);
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
      setJoiningGroups(prev => new Set(prev).add(groupId));
      
      const response = await axios.post(
        "http://localhost:3000/api/workspaces/groups/join-leave",
        { groupId },
        { withCredentials: true }
      );

      if (response.data.success) {
        NotificationService.showInfo(response.data.message);
        handleLogging(`${response.data.data.action === "joined" ? "Joined" : "Left"} the group ${groups.find(g => g.id === groupId)?.name || ''} in the workspace ${workspaceData?.name}`);
        // Update the groups list
        setGroups(prevGroups =>
          prevGroups.map(group =>
            group.id === groupId
              ? { ...group, isMember: response.data.data.action === "joined" }
              : group
          )
        );

        // If user left the currently selected group, switch to first available joined group
        if (response.data.data.action === "left" && selectedGroup === groupId) {
          const remainingJoinedGroups = groups.filter(group => 
            group.id !== groupId && group.isMember
          );
          if (remainingJoinedGroups.length > 0) {
            setSelectedGroup(remainingJoinedGroups[0].id);
          } else {
            setSelectedGroup(groups.length > 0 ? groups[0].id : null);
          }
        }
      } else {
        throw new Error(response.data.message || "Failed to join/leave group");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to join/leave group";
      NotificationService.showError(errorMessage);
      console.error("Error joining/leaving group:", err);
    } finally {
      setJoiningGroups(prev => {
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
        `http://localhost:3000/api/workspaces/${workspaceId}/groups`,
        {
          groupname: groupName.trim(),
          description: groupDescription.trim(),
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        NotificationService.showInfo("Group created successfully");
        handleLogging(`Created the group ${groupName.trim()} in the workspace ${workspaceData?.name}`);
        
        // Add the new group to the list and select it
        const newGroup: Group = {
          id: response.data.data.id,
          name: response.data.data.name,
          description: response.data.data.description,
          workspaceId: response.data.data.workspaceId,
          isMember: response.data.data.isMember,
        };
        
        setGroups(prevGroups => [...prevGroups, newGroup]);
        setSelectedGroup(newGroup.id);
        
        // Close dialog and reset form
        setCreateGroupOpen(false);
        setGroupName("");
        setGroupDescription("");
      } else {
        throw new Error(response.data.message || "Failed to create group");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create group";
      NotificationService.showError(errorMessage);
      console.error("Error creating group:", err);
    } finally {
      setCreatingGroup(false);
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
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ p: { xs: 2, sm: 3}, pb: 2, flexShrink: 0 }}>
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

      <Box sx={{ flex: 1, overflow: "auto", minHeight: 0}}>
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
                      setSelectedGroup(group.id);
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
                  <Box sx={{ ml: { xs: 0.5, sm: 1 } }}>
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
      default:
        return <ChatUI groupId={selectedGroup} />;
    }
  };

  const handleLeaveWorkspace = async () => {
    const confirmed = window.confirm(
      "Do you really want to leave the workspace?"
    );
    
    if (!confirmed) return;

    if (!workspaceId) {
      NotificationService.showError("Workspace ID not found");
      return;
    }

    try {
      setIsLeaving(true);
      
      const response = await axios.post(
        "http://localhost:3000/api/workspaces/leave",
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
      const errorMessage = err instanceof Error ? err.message : "Failed to leave workspace";
      NotificationService.showError(errorMessage);
      console.error("Error leaving workspace:", err);
    } finally {
      setIsLeaving(false);
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
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: { xs: 1.5, sm: 2, md: 3 },
        gap: { xs: 2, sm: 3 },
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          bgcolor:
            mode === "dark"
              ? theme.palette.background.paper
              : theme.palette.primary.main,
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
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
          overflow: "hidden",
        }}
      >
        {/* Desktop Sidebar - Hidden on mobile */}
        {!isMobile && (
          <Card
            elevation={2}
            sx={{
              width: { md: 300, lg: 320 },
              height: "fit-content",
              maxHeight: "calc(100vh - 200px)",
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
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
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
            minHeight: { xs: "60vh", md: "calc(100vh - 250px)" },
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
                <IconButton
                  onClick={handleDrawerToggle}
                  sx={{ mr: 1 }}
                >
                  <MenuIcon />
                </IconButton>
                <GroupIcon color="primary" />
                <Typography variant="h6" sx={{ fontSize: "1rem" }}>
                  {selectedGroup 
                    ? groups.find(g => g.id === selectedGroup)?.name || "Select Group"
                    : "Select Group"
                  }
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
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 2, sm: 3 },
              overflow: "auto",
              minHeight: 0,
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
          }
        }}
      >
        <DialogTitle sx={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          pb: 1,
          px: { xs: 2, sm: 3 },
          pt: { xs: 2, sm: 3 },
        }}>
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
        
        <DialogContent sx={{ 
          pt: 2, 
          px: { xs: 2, sm: 3 },
          pb: { xs: 1, sm: 2 },
        }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 3 } }}>
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
        
        <DialogActions sx={{ 
          px: { xs: 2, sm: 3 }, 
          pb: { xs: 2, sm: 3 }, 
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
        }}>
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
            startIcon={creatingGroup ? <CircularProgress size={16} /> : <AddIcon />}
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
    </Box>
  );
};

export default Workspace;
