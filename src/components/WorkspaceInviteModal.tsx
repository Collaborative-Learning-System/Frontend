import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Stack,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  alpha,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  PersonAdd,
  Close as CloseIcon,
  Delete,
  Email,
  Add,
} from "@mui/icons-material";
import axios from "axios";
import { AppContext } from "../context/AppContext";

interface WorkspaceInviteModalProps {
  open: boolean;
  onClose: () => void;
  workspaceId: string;
  workspaceName: string;
  onInviteSuccess?: () => void;
}

const WorkspaceInviteModal: React.FC<WorkspaceInviteModalProps> = ({
  open,
  onClose,
  workspaceId,
  workspaceName,
  onInviteSuccess,
}) => {
  const theme = useTheme();
  const [emailInput, setEmailInput] = useState("");
  const [emailList, setEmailList] = useState<string[]>([]);
  const [isInviting, setIsInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { userData } = useContext(AppContext);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddEmail = () => {
    const trimmedEmail = emailInput.trim().toLowerCase();

    if (!trimmedEmail) return;

    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (emailList.includes(trimmedEmail)) {
      setError("Email already added to the list");
      return;
    }

    setEmailList((prev) => [...prev, trimmedEmail]);
    setEmailInput("");
    setError(null);
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmailList((prev) => prev.filter((email) => email !== emailToRemove));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddEmail();
    }
  };

  const handleInviteMembers = async () => {
    if (emailList.length === 0) {
      setError("Please add at least one email address");
      return;
    }

    setIsInviting(true);
    setError(null);

    try {
      await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/notification/share-workspace/${workspaceId}`,
        {
          emails: emailList,
          invitedBy: userData?.fullName || userData?.email || "ADMIN",
        }
      );

      setSuccess(true);
      setEmailList([]);

      // Call success callback if provided
      if (onInviteSuccess) {
        onInviteSuccess();
      }

      // Close modal after short delay
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error("Error inviting workspace members:", error);
      setError(
        error.response?.data?.message ||
          "Failed to send invitations. Please try again."
      );
    } finally {
      setIsInviting(false);
    }
  };

  const handleClose = () => {
    if (!isInviting) {
      setEmailInput("");
      setEmailList([]);
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
          <PersonAdd color="primary" />
          <Typography variant="h6">Invite Members to Workspace</Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{ color: "text.secondary" }}
          disabled={isInviting}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Invite new members to join the <strong>"{workspaceName}"</strong>{" "}
          workspace. They will receive an email invitation with access
          instructions.
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Invitations sent successfully! Members will receive email
            notifications.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Email Input */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "medium" }}>
            Add Email Addresses
          </Typography>
          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter email address"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isInviting}
              InputProps={{
                startAdornment: (
                  <Email sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={handleAddEmail}
              disabled={isInviting || !emailInput.trim()}
              sx={{ flexShrink: 0 }}
            >
              <Add />
            </Button>
          </Stack>
        </Box>

        {/* Email List */}
        {emailList.length > 0 && (
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: "medium" }}
            >
              Inviting ({emailList.length} member
              {emailList.length !== 1 ? "s" : ""}):
            </Typography>
            <List dense sx={{ maxHeight: 200, overflow: "auto" }}>
              {emailList.map((email, index) => (
                <ListItem
                  key={index}
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: 1,
                    mb: 0.5,
                  }}
                >
                  <ListItemText
                    primary={email}
                    primaryTypographyProps={{
                      variant: "body2",
                    }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="remove"
                      onClick={() => handleRemoveEmail(email)}
                      size="small"
                      disabled={isInviting}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={isInviting}>
          Cancel
        </Button>
        <Button
          onClick={handleInviteMembers}
          variant="contained"
          disabled={emailList.length === 0 || isInviting}
          startIcon={
            isInviting ? <CircularProgress size={16} /> : <PersonAdd />
          }
        >
          {isInviting
            ? "Sending Invitations..."
            : `Invite ${emailList.length} Member${
                emailList.length !== 1 ? "s" : ""
              }`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkspaceInviteModal;
