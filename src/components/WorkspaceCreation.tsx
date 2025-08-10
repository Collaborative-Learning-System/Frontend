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
} from "@mui/material";
import { Close, Groups } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

interface WorkspaceCreationProps {
  onClose: () => void;
}

const WorkspaceCreation: React.FC<WorkspaceCreationProps> = ({ onClose }) => {
  const theme = useTheme();
  const [workspaceName, setWorkspaceName] = useState("");
  const [description, setDescription] = useState("");




  const handleSubmit = () => {
    console.log({
      workspaceName,
      description,

    });
    onClose();
  };

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 500,
        mx: "auto",
        backdropFilter: "blur(10px)",
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        boxShadow: theme.shadows[10],
      }}
    >
      <CardContent sx={{ p: 4 }}>
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
                bgcolor: theme.palette.primary.main,
                width: 40,
                height: 40,
              }}
            >
              <Groups />
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              Create Workspace
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        {/* Form */}
        <Stack spacing={3}>
          {/* Workspace Name */}
          <TextField
            label="Workspace Name"
            variant="outlined"
            fullWidth
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            placeholder="Enter workspace name"
            required
          />

          {/* Description */}
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your workspace purpose and goals"
          />

         

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button variant="outlined" onClick={onClose} sx={{ flex: 1 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!workspaceName.trim()}
              sx={{ flex: 1 }}
            >
              Create Workspace
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default WorkspaceCreation;
