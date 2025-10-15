import { Close, Search, Refresh, PersonAdd, WorkOutline, PeopleOutline, TrendingUp, Explore } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Box,
  useTheme,
  TextField,
  Button,
  alpha,
  CircularProgress,
  Alert,
  InputAdornment,
  Chip,
  Fade,
  Slide,
  Paper,
  Stack,
  Tooltip,
  Badge,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { handleLogging } from "../services/LoggingService";

interface BrowseWorkspaceProps {
  onClose: () => void;
}

interface Workspace {
  id: string;
  name: string;
  description?: string;
  memberCount?: number;
  isActive?: boolean;
  lastActivity?: string;
  tags?: string[];
}

interface JoinResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    description: string;
    adminId: string;
    memberCount: number;
    role: string;
  } | {
    success: boolean;
    statusCode: number;
    message: string;
    timestamp: string;
  };
}

const BrowseWorkspace: React.FC<BrowseWorkspaceProps> = ({ onClose }) => {
  const theme = useTheme();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [filteredWorkspaces, setFilteredWorkspaces] = useState<Workspace[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Fetch workspaces on component mount
  useEffect(() => {
    fetchWorkspaces();
  }, []);

  // Filter workspaces based on search
  useEffect(() => {
    if (searchValue.trim() === "") {
      setFilteredWorkspaces(workspaces);
      setShowSearchResults(false);
    } else {
      const filtered = workspaces.filter(workspace =>
        workspace.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        workspace.description?.toLowerCase().includes(searchValue.toLowerCase()) ||
        workspace.id.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredWorkspaces(filtered);
      setShowSearchResults(true);
    }
  }, [searchValue, workspaces]);

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await fetch("http://localhost:3000/api/workspaces/available", {
        method: "GET",
        credentials: "include", // Include cookies
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setWorkspaces(data.data.workspaces);
        setFilteredWorkspaces(data.data.workspaces);
      } else {
        setError("Failed to fetch workspaces");
      }
    } catch (err) {
      setError("Error fetching workspaces. Please try again.");
      console.error("Error fetching workspaces:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinWorkspace = async (workspaceId: string) => {
    try {
      setJoinLoading(workspaceId);
      setError("");
      setSuccessMessage("");

      const response = await fetch("http://localhost:3000/api/workspaces/join", {
        method: "POST",
        credentials: "include", // Include cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workspaceId }),
      });

      const data: JoinResponse = await response.json();

      if (data.success && "role" in data.data) {
        setSuccessMessage(`Successfully joined "${data.data.name}" workspace!`);
        handleLogging(`Joined with workspace ${data.data.name}`);
        setTimeout(() => {
          fetchWorkspaces();
        }, 1000);
      } else if ("message" in data.data) {
        setError(data.data.message);
      } else {
        setError("Failed to join workspace");
      }
    } catch (err) {
      setError("Error joining workspace. Please try again.");
      console.error("Error joining workspace:", err);
    } finally {
      setJoinLoading(null);
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccessMessage("");
  };

  return (
    <Fade in timeout={300}>
      <Card
        sx={{
          width: "100%",
          maxWidth: 500,
          mx: "auto",
          backdropFilter: "blur(20px)",
          backgroundColor: alpha(theme.palette.background.paper, 0.95),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          boxShadow: `0 20px 40px -12px ${alpha(theme.palette.primary.main, 0.3)}`,
          borderRadius: 2,
          maxHeight: "75vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "0px",
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          },
        }}
      >
      <CardContent sx={{ p: 2.5, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2.5,
            position: "relative",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Badge
              badgeContent={filteredWorkspaces.length}
              color="secondary"
              max={99}
              sx={{
                "& .MuiBadge-badge": {
                  right: -2,
                  top: 6,
                  fontSize: "0.7rem",
                  minWidth: 16,
                  height: 16,
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  width: 45,
                  height: 45,
                  boxShadow: `0 3px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              >
                <Explore sx={{ fontSize: 20 }} />
              </Avatar>
            </Badge>
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 0.25,
                fontSize: "1.3rem",
                ml: 1,
              }}>
                Discover Workspaces
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                Find and join collaborative spaces
              </Typography>
            </Box>
          </Box>
          <Tooltip title="Close" placement="left">
            <IconButton 
              onClick={onClose} 
              size="medium"
              sx={{
                bgcolor: alpha(theme.palette.error.main, 0.1),
                width: 36,
                height: 36,
                "&:hover": {
                  bgcolor: alpha(theme.palette.error.main, 0.2),
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <Close sx={{ color: theme.palette.error.main, fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Search */}
        <Paper
          elevation={0}
          sx={{
            p: 0.25,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            borderRadius: 1.5,
            mb: 2,
            backgroundColor: alpha(theme.palette.background.default, 0.5),
            "&:focus-within": {
              borderColor: theme.palette.primary.main,
              boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          <TextField
            placeholder="Search workspaces..."
            variant="outlined"
            fullWidth
            size="small"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              clearMessages();
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: theme.palette.primary.main, fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                border: "none",
                "& fieldset": {
                  border: "none",
                },
              },
              "& .MuiInputBase-input": {
                fontSize: "0.9rem",
                py: 0.75,
              },
            }}
          />
        </Paper>

        {/* Search Results Info */}
        {showSearchResults && (
          <Fade in>
            <Box sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                size="small"
                label={`${filteredWorkspaces.length} result${filteredWorkspaces.length !== 1 ? 's' : ''} for "${searchValue}"`}
                color="primary"
                variant="outlined"
                sx={{
                  fontWeight: "medium",
                  height: 22,
                  "& .MuiChip-label": {
                    fontSize: "0.7rem",
                    px: 1,
                  },
                }}
              />
              {filteredWorkspaces.length > 0 && (
                <Typography variant="caption" color="text.secondary">
                  • Press Enter to focus first result
                </Typography>
              )}
            </Box>
          </Fade>
        )}

        {/* Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearMessages}>
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={clearMessages}>
            {successMessage}
          </Alert>
        )}

        {/* Content */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {loading ? (
            <Box 
              sx={{ 
                display: "flex", 
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 4,
                gap: 1.5,
              }}
            >
              <CircularProgress 
                size={40}
                thickness={4}
                sx={{
                  color: theme.palette.primary.main,
                  animationDuration: "1.5s",
                }}
              />
              <Typography variant="body1" color="text.secondary" fontWeight="medium" >
                   Discovering workspaces...
              </Typography>
              <Typography variant="caption" color="text.secondary" textAlign="center">
                Finding collaborative spaces for you
              </Typography>
            </Box>
          ) : filteredWorkspaces.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                backgroundColor: alpha(theme.palette.background.default, 0.3),
                borderRadius: 1.5,
                border: `1px dashed ${alpha(theme.palette.divider, 0.3)}`,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  width: 50,
                  height: 50,
                  mx: "auto",
                  mb: 1.5,
                }}
              >
                <Search sx={{ fontSize: 24 }} />
              </Avatar>
              <Typography variant="body1" fontWeight="bold" sx={{ mb: 0.75 }}>
                {searchValue ? "No Results Found" : "No Workspaces Available"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 300, mx: "auto" }}>
                {searchValue 
                  ? `No workspaces match "${searchValue}". Try adjusting your search.`
                  : "No workspaces available. Check back later or create your own."
                }
              </Typography>
              {searchValue && (
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => setSearchValue("")}
                  startIcon={<Close sx={{ fontSize: 16 }} />}
                  sx={{ 
                    mt: 0.5,
                    textTransform: "none",
                    fontSize: "0.8rem",
                  }}
                >
                  Clear Search
                </Button>
              )}
            </Paper>
          ) : (
            <Stack spacing={1.5} sx={{ py: 0 }}>
              {filteredWorkspaces.map((workspace, index) => (
                <Slide in timeout={200 + index * 100} key={workspace.id} direction="up">
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      borderRadius: 1.5,
                      background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.primary.main, 0.02)})`,
                      transition: "all 0.3s ease-in-out",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.12)}`,
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                        "& .join-button": {
                          transform: "scale(1.03)",
                        },
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "3px",
                        height: "100%",
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Box sx={{ flex: 1, mr: 1.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.75 }}>
                          <Avatar
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              width: 45,
                              height: 45,
                            }}
                          >
                            <WorkOutline sx={{ fontSize: 18 }} />
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="bold" sx={{ mb: 0.25, fontSize: "1.05rem" }}>
                              {workspace.name}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                              <Chip
                                size="small"
                                label={`ID: ${workspace.id.slice(0, 6)}...`}
                                variant="outlined"
                                sx={{
                                  fontSize: "0.65rem",
                                  height: 18,
                                  borderColor: alpha(theme.palette.primary.main, 0.3),
                                  "& .MuiChip-label": {
                                    px: 0.75,
                                  },
                                }}
                              />
                              {workspace.memberCount !== undefined && (
                                <Chip
                                  size="small"
                                  icon={<PeopleOutline sx={{ fontSize: 12 }} />}
                                  label={`${workspace.memberCount} members`}
                                  variant="outlined"
                                  sx={{
                                    fontSize: "0.65rem",
                                    height: 18,
                                    borderColor: alpha(theme.palette.secondary.main, 0.3),
                                    "& .MuiChip-label": {
                                      px: 0.75,
                                    },
                                  }}
                                />
                              )}
                              {workspace.isActive && (
                                <Chip
                                  size="small"
                                  icon={<TrendingUp sx={{ fontSize: 12 }} />}
                                  label="Active"
                                  color="success"
                                  variant="outlined"
                                  sx={{
                                    fontSize: "0.65rem",
                                    height: 18,
                                    "& .MuiChip-label": {
                                      px: 0.75,
                                    },
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                        </Box>
                        {workspace.description && (
                          <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            sx={{ 
                              mt: 0.75, 
                              pl: 4.75,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              lineHeight: 1.3,
                            }}
                          >
                            {workspace.description}
                          </Typography>
                        )}
                      </Box>
                      
                      <Tooltip title={`Join ${workspace.name}`} placement="top">
                        <Button
                          className="join-button"
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleJoinWorkspace(workspace.id)}
                          disabled={joinLoading === workspace.id}
                          startIcon={joinLoading === workspace.id ? null : <PersonAdd sx={{ fontSize: 16 }} />}
                          sx={{ 
                            minWidth: 90,
                            borderRadius: 1.5,
                            textTransform: "none",
                            fontWeight: "bold",
                            fontSize: "0.8rem",
                            py: 0.75,
                            px: 2,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            boxShadow: `0 3px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                            },
                            "&:disabled": {
                              background: alpha(theme.palette.action.disabled, 0.12),
                            },
                          }}
                        >
                          {joinLoading === workspace.id ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            "Join"
                          )}
                        </Button>
                      </Tooltip>
                    </Box>
                  </Paper>
                </Slide>
              ))}
            </Stack>
          )}
        </Box>

        {/* Refresh Button */}
        <Box sx={{ 
          mt: 2, 
          pt: 2, 
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.5)}, ${alpha(theme.palette.primary.main, 0.02)})`,
          borderRadius: 1.5,
          p: 1.5,
        }}>
          <Button
            variant="outlined"
            fullWidth
            size="small"
            onClick={fetchWorkspaces}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={14} /> : <Refresh sx={{ fontSize: 16 }} />}
            sx={{
              py: 1,
              borderRadius: 1.5,
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "0.85rem",
              borderColor: alpha(theme.palette.primary.main, 0.3),
              color: theme.palette.primary.main,
              "&:hover": {
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                transform: "translateY(-1px)",
              },
              "&:disabled": {
                borderColor: alpha(theme.palette.action.disabled, 0.12),
                color: theme.palette.action.disabled,
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            {loading ? "Refreshing..." : "Refresh Workspaces"}
          </Button>
        </Box>
      </CardContent>
    </Card>
    </Fade>
  );
};

export default BrowseWorkspace;
