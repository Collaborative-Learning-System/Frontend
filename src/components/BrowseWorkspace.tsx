import { Close, Groups, Search } from "@mui/icons-material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  IconButton,
  Box,
  useTheme,
  TextField,
  InputAdornment,
  Autocomplete,
  Button,
  alpha,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";

interface BrowseWorkspaceProps {
  onClose: () => void;
}

interface Workspace {
  id: string;
  name: string;
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

  // Fetch workspaces on component mount
  useEffect(() => {
    fetchWorkspaces();
  }, []);

  // Filter workspaces based on search
  useEffect(() => {
    if (searchValue.trim() === "") {
      setFilteredWorkspaces(workspaces);
    } else {
      const filtered = workspaces.filter(workspace =>
        workspace.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredWorkspaces(filtered);
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
        // Remove the joined workspace from the list or refresh the list
        setTimeout(() => {
          fetchWorkspaces();
        }, 1500);
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
    <Card
      sx={{
        width: "100%",
        maxWidth: 600,
        mx: "auto",
        backdropFilter: "blur(5px)",
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        boxShadow: theme.shadows[10],
        maxHeight: "80vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ p: 4, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.secondary.main,
                width: 40,
                height: 40,
              }}
            >
              <Groups />
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              Browse Workspaces
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close
              sx={{
                color: theme.palette.text.secondary,
              }}
            />
          </IconButton>
        </Box>

        {/* Search */}
        <TextField
          label="Search workspaces..."
          variant="outlined"
          fullWidth
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            clearMessages();
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

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
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredWorkspaces.length === 0 ? (
            <Typography 
              variant="body1" 
              color="text.secondary" 
              textAlign="center" 
              sx={{ py: 4 }}
            >
              {searchValue ? "No workspaces found matching your search." : "No workspaces available."}
            </Typography>
          ) : (
            <List sx={{ py: 0 }}>
              {filteredWorkspaces.map((workspace, index) => (
                <React.Fragment key={workspace.id}>
                  <ListItem
                    sx={{
                      py: 2,
                      px: 0,
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        borderRadius: 1,
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="h6" fontWeight="medium">
                          {workspace.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Workspace ID: {workspace.id}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleJoinWorkspace(workspace.id)}
                        disabled={joinLoading === workspace.id}
                        sx={{ minWidth: 80 }}
                      >
                        {joinLoading === workspace.id ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : (
                          "Join"
                        )}
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < filteredWorkspaces.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>

        {/* Refresh Button */}
        <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={fetchWorkspaces}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh Workspaces"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BrowseWorkspace;
