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
  Container,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  alpha,
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
import { useThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import AlertService from "../services/AlertService";
import NotificationService from "../services/NotificationService";

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
        minHeight: "100vh",
        background: theme.palette.background.default,
        p: 1,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Paper
          elevation={3}
          sx={{
            borderRadius: "12px",
            mb: 3,
            mt: 2,
            bgcolor:
              mode === "dark"
                ? theme.palette.background.paper
                : theme.palette.primary.main,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              py: 3,
              px: 3,
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 2, md: 0 },
            }}
          >
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <SchoolIcon
                  sx={{
                    fontSize: { xs: 28, sm: 32 },
                    color:
                      mode === "dark" ? theme.palette.primary.main : "white",
                  }}
                />
                <Typography
                  variant="h4"
                  color={mode === "dark" ? theme.palette.primary.main : "white"}
                >
                  Semester 5 Workspace
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.9, color: "white" }}>
                A short description of the workspace goes here.
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
                width: { xs: "100%", md: "auto" },
              }}
            >
              <Chip
                icon={<AdminIcon sx={{ color: "white" }} />}
                label="Admin"
                color="secondary"
                sx={{
                  bgcolor: alpha(theme.palette.background.paper, 0.3),
                  color: "white",
                }}
              />
              <Chip
                icon={<GroupIcon sx={{ color: "white" }} />}
                label="12 Members"
                color="secondary"
                sx={{
                  bgcolor: alpha(theme.palette.background.paper, 0.3),
                  color: "white",
                }}
              />
              <Button
                variant="outlined"
                color="warning"
                startIcon={<ExitIcon />}
                onClick={async () => {
                  const confirmed = await AlertService.showConfirm(
                    "Do you really want to leave the workspace?",
                    "Confirm Exit",
                    theme.palette.primary.main,
                    theme.palette.error.main
                  );
                  if (confirmed) {
                    NotificationService.showInfo(
                      "You have left the workspace."
                    );
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
            minHeight: 0,
          }}
        >
          <Card
            elevation={3}
            sx={{
              width: { xs: "100%", lg: 270 },
              alignSelf: { xs: "stretch", lg: "flex-start" },
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, pb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <GroupIcon color="primary" />
                  <Typography variant="h6" color="primary">
                    Groups
                  </Typography>
                </Box>
              </Box>

              <List sx={{ px: 2, pb: 2 }}>
                {modules.map((group) => (
                  <ListItem key={group.id} disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      selected={selectedGroup === group.id}
                      onClick={() => setSelectedGroup(group.id)}
                      sx={{
                        borderRadius: 2,
                        "&.Mui-selected": {
                          bgcolor: "primary.light",
                          color: "primary.contrastText",
                          "&:hover": {
                            bgcolor: "primary.light",
                          },
                        },
                      }}
                    >
                      <ListItemIcon>
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
                            selectedGroup === group.id ? "bold" : "medium",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ mx: 2 }} />

              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AddIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "medium",
                  }}
                >
                  Add Group
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Main Section */}
          <Paper
            elevation={3}
            sx={{
              flex: 1,
              borderRadius: 3,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              minHeight: { xs: "70vh", lg: "auto" },
            }}
          >
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{
                  px: 3,
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: "medium",
                    fontSize: "1rem",
                  },
                }}
              >
                <Tab icon={<ChatIcon />} label="Chat" iconPosition="start" />
                <Tab icon={<QuizIcon />} label="Quiz" iconPosition="start" />
                <Tab
                  icon={<LeaderboardIcon />}
                  label="Leaderboard"
                  iconPosition="start"
                />
              </Tabs>
            </Box>

            {/* Tab Content */}
            <Box sx={{ flex: 1, p: 3, overflow: "auto" }}>
              {getTabContent()}
            </Box> 
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Workspace;
