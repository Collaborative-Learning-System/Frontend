import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Avatar,
  alpha,
  CircularProgress,
  Fade,
  LinearProgress,
  Chip,
} from "@mui/material";
import { Close, Groups, Error } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

interface WorkspaceCreationProps {
  onClose: () => void;
  onCreateWorkspace: (workspacename: string, description: string) => Promise<any>;
}

const WorkspaceCreation: React.FC<WorkspaceCreationProps> = ({ onClose, onCreateWorkspace }) => {
  const theme = useTheme();
  const [workspaceName, setWorkspaceName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  
  const maxDescriptionLength = 200;
  const isFormValid = workspaceName.trim().length >= 3 && !nameError;

  const validateWorkspaceName = (name: string) => {
    if (name.trim().length < 3) {
      setNameError("Workspace name must be at least 3 characters long");
    } else if (name.trim().length > 50) {
      setNameError("Workspace name must be less than 50 characters");
    } else {
      setNameError(null);
    }
  };

  const handleWorkspaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWorkspaceName(value);
    validateWorkspaceName(value);
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;
    
    setError(null);
    setLoading(true);
    try {
      const result = await onCreateWorkspace(workspaceName, description);
      if (!result.success) {
        setError(result.message || "Failed to create workspace.");
        setLoading(false);
        return;
      }
      onClose();
    } catch (e) {
      setError("An error occurred.");
      setLoading(false);
    }
  };

  return (
    <Fade in={true} timeout={300}>
      <Card
        sx={{
          width: "100%",
          maxWidth: 500,
          mx: "auto",
          backdropFilter: "blur(10px)",
          backgroundColor: alpha(theme.palette.background.paper, 0.95),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 0,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            opacity: 0.8,
          },
        }}
      >
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
            pt: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                width: 48,
                height: 48,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              <Groups sx={{ fontSize: 24 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
                Create Workspace
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Set up your collaborative environment
              </Typography>
            </Box>
          </Box>
          <IconButton 
            onClick={onClose} 
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.grey[500], 0.1),
              "&:hover": {
                bgcolor: alpha(theme.palette.grey[500], 0.2),
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Close />
          </IconButton>
        </Box>

        {/* Form */}
        <Stack spacing={3}>
          <Box>
            <TextField
              label="Workspace Name"
              variant="outlined"
              fullWidth
              value={workspaceName}
              onChange={handleWorkspaceNameChange}
              placeholder="e.g., Team Alpha Project"
              required
              error={!!nameError}
              helperText={nameError || "Minimum 3 characters required"}
              sx={{
                "& .MuiOutlinedInput-root": {
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  "&.Mui-focused": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderWidth: 2,
                    },
                  },
                },
              }}
            />
          </Box>

          <Box>
            <TextField
              label="Description (Optional)"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= maxDescriptionLength) {
                  setDescription(e.target.value);
                }
              }}
              placeholder="Describe your workspace purpose, goals, and what your team will work on..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                },
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Help your team understand the workspace purpose
              </Typography>
              <Chip
                label={`${description.length}/${maxDescriptionLength}`}
                size="small"
                variant="outlined"
                sx={{
                  height: 20,
                  fontSize: "0.7rem",
                  color: description.length > maxDescriptionLength * 0.8 
                    ? theme.palette.warning.main 
                    : theme.palette.text.secondary,
                }}
              />
            </Box>
          </Box>

          {error && (
            <Fade in={!!error}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                }}
              >
                <Error sx={{ color: theme.palette.error.main, fontSize: 20 }} />
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              </Box>
            </Fade>
          )}

          {loading && (
            <LinearProgress
              sx={{
                borderRadius: 1,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              }}
            />
          )}

          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button 
              variant="outlined" 
              onClick={onClose} 
              sx={{ 
                flex: 1,
                py: 1.5,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: `0 4px 12px ${alpha(theme.palette.grey[500], 0.2)}`,
                },
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!isFormValid || loading}
              sx={{ 
                flex: 1,
                py: 1.5,
                position: "relative",
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                },
                "&:disabled": {
                  background: alpha(theme.palette.grey[400], 0.3),
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={16} color="inherit" />
                  Creating...
                </Box>
              ) : (
                "Create Workspace"
              )}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
    </Fade>
  );
};

export default WorkspaceCreation;
