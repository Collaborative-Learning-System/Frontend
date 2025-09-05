import { useState } from "react";
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
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import NotificationService from "../services/NotificationService";
import { useThemeContext } from "../context/ThemeContext";

const modules = [
  { id: 1, name: "Computer Security" },
  { id: 2, name: "Software Engineering" },
  { id: 3, name: "Business Analysis" },
];

const Workspace = () => {
  const [selectedGroup, setSelectedGroup] = useState(modules[0].id);
  const [activeTab, setActiveTab] = useState(0);

  const navigate = useNavigate();
  const theme = useTheme();
  const { mode } = useThemeContext();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 0:
        return <ChatUI />;
      case 1:
        return <Quiz groupId={selectedGroup} />;
      case 2:
        return <Leaderboard groupId={selectedGroup} />;
      default:
        return <ChatUI />;
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 3,
        gap: 3,
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
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 2, md: 0 },
          }}
        >
          <Box sx={{ flex: 1 }}>
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
                  fontSize: { xs: 28, sm: 32 },
                  color: mode === "dark" ? theme.palette.primary.main : "white",
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  color: mode === "dark" ? theme.palette.primary.main : "white",
                  fontSize: { xs: "1.75rem", sm: "2.125rem" },
                }}
              >
                Semester 5 Workspace
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.9,
                color: mode === "dark" ? "inherit" : "white",
              }}
            >
              A short description of the workspace goes here.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexDirection: { xs: "row", sm: "row" },
              flexWrap: "wrap",
              justifyContent: { xs: "flex-start", md: "flex-end" },
            }}
          >
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
            <Chip
              icon={<GroupIcon sx={{ color: "white" }} />}
              label="12 Members"
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
              sx={{
                borderColor: "rgba(255,255,255,0.5)",
                color: "white",
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
              onClick={() => {
                const confirmed = window.confirm(
                  "Do you really want to leave the workspace?"
                );
                if (confirmed) {
                  NotificationService.showInfo("You have left the workspace.");
                  navigate("/landing");
                }
              }}
            >
              Leave
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 3,
          flex: 1,
          minHeight: 0, // Important for flex children
        }}
      >
        {/* Sidebar */}
        <Card
          elevation={2}
          sx={{
            width: { xs: "100%", lg: 280 },
            height: { xs: "auto", lg: "fit-content" },
            maxHeight: { lg: "100%" },
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent
            sx={{ p: 0, flex: 1, display: "flex", flexDirection: "column" }}
          >
            <Box sx={{ p: 3, pb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <GroupIcon color="primary" />
                <Typography variant="h6" color="primary" fontWeight="600">
                  Groups
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flex: 1, overflow: "auto" }}>
              <List sx={{ px: 2, pb: 2 }}>
                {modules.map((group) => (
                  <ListItem key={group.id} disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      selected={selectedGroup === group.id}
                      onClick={() => setSelectedGroup(group.id)}
                      sx={{
                        borderRadius: 2,
                        minHeight: 48,
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
                              : "action.hover",
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <SchoolIcon
                          sx={{
                            color:
                              selectedGroup === group.id
                                ? "primary.contrastText"
                                : "text.secondary",
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={group.name}
                        primaryTypographyProps={{
                          fontWeight:
                            selectedGroup === group.id ? "600" : "400",
                          fontSize: "0.9rem",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>

            <Divider sx={{ mx: 2 }} />

            <Box sx={{ p: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "500",
                  py: 1,
                }}
              >
                Add Group
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Main Section */}
        <Paper
          elevation={2}
          sx={{
            flex: 1,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            minHeight: { xs: 500, lg: 0 },
            overflow: "hidden",
          }}
        >
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
              sx={{
                px: 3,
                minHeight: 48,
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: "500",
                  fontSize: "0.95rem",
                  minHeight: 48,
                  "&:hover": {
                    color: "primary.main",
                  },
                },
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                },
              }}
            >
              <Tab
                icon={<ChatIcon />}
                label="Chat"
                iconPosition="start"
                sx={{ gap: 1 }}
              />
              <Tab
                icon={<QuizIcon />}
                label="Quiz"
                iconPosition="start"
                sx={{ gap: 1 }}
              />
              <Tab
                icon={<LeaderboardIcon />}
                label="Leaderboard"
                iconPosition="start"
                sx={{ gap: 1 }}
              />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box
            sx={{
              flex: 1,
              p: 3,
              overflow: "auto",
              minHeight: 0, // Important for scrolling
            }}
          >
            {getTabContent()}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Workspace;
