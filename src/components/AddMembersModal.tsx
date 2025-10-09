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
  Chip,
  AlertTitle,
} from "@mui/material";
import {
  PersonAdd,
  Close as CloseIcon,
  Delete,
  Email,
  Add,
  Warning,
  CheckCircle,
  Error,
} from "@mui/icons-material";
import axios from "axios";
import { notifyUsers } from "../services/NotifyService";
import { AppContext } from "../context/AppContext";

interface AddMembersModalProps {
  open: boolean;
  onClose: () => void;
  entityId: string;
  entityName: string;
  entityType: "workspace" | "group" | "document";
  title?: string;
  description?: string;
  onAddSuccess?: () => void;
}

interface AddMembersResult {
  failedUsers: string[];
  alreadyMembers: string[];
}

const AddMembersModal: React.FC<AddMembersModalProps> = ({
  open,
  onClose,
  entityId,
  entityName,
  entityType,
  title,
  description,
  onAddSuccess,
}) => {
  const theme = useTheme();
  const [emailInput, setEmailInput] = useState("");
  const [emailList, setEmailList] = useState<string[]>([]);
  const [isInviting, setIsInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [addMembersResult, setAddMembersResult] =
    useState<AddMembersResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [originalEmailList, setOriginalEmailList] = useState<string[]>([]);
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

  const handleAddMembers = async () => {
    if (emailList.length === 0) {
      setError("Please add at least one email address");
      return;
    }

    setIsInviting(true);
    setError(null);
    setShowResults(false);
    setAddMembersResult(null);

    try {
      setOriginalEmailList([...emailList]);

      // Determine the correct endpoint based on entity type
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/workspaces/add-members/${entityId}`,
        {
          emails: emailList,
        }
      );
      if (response.data.success) {
        const { failedUsers, alreadyMembers } = response.data.data;

        // Set the results data
        setAddMembersResult({
          failedUsers: failedUsers || [],
          alreadyMembers: alreadyMembers || [],
        });

        // Check if all users were successfully added
        const successfullyAdded =
          emailList.length -
          (failedUsers?.length || 0) -
          (alreadyMembers?.length || 0);

        if (successfullyAdded > 0) {
          setSuccess(true);
        }

        const usersToNotify = emailList.filter(
          (email) =>
            !(failedUsers?.includes(email) || alreadyMembers?.includes(email))
        );
        notifyUsers(
          usersToNotify,
          `You have been added to the ${entityType} "${entityName}" by ${
            userData?.fullName || "the admin"
          }`,
          `/${entityType}s/${entityId}`
        );

        // Show results
        setShowResults(true);
        setEmailList([]);

        // Call success callback if provided
        if (onAddSuccess) {
          onAddSuccess();
        }
      } else {
        setError(
          response.data.message || "Failed to add members. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Error adding workspace members:", error);
      setError(
        error.response?.data?.message ||
          "Failed to add members. Please try again."
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
      setShowResults(false);
      setAddMembersResult(null);
      setOriginalEmailList([]);
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
          <Typography variant="h6">
            {title ||
              `Add Members to ${
                entityType.charAt(0).toUpperCase() + entityType.slice(1)
              }`}
          </Typography>
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
          {description ||
            `Add new members to the "${entityName}" ${entityType}.`}
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Members added successfully!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Results Section */}
        {showResults && addMembersResult && (
          <Box sx={{ mb: 2 }}>
            {/* Successfully Added Members */}
            {(() => {
              const totalAttempted =
                addMembersResult.failedUsers.length +
                addMembersResult.alreadyMembers.length;
              const successfullyAdded =
                originalEmailList.length - totalAttempted;
              return (
                successfullyAdded > 0 && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    <AlertTitle>Successfully Added</AlertTitle>
                    {successfullyAdded} member(s) were successfully added to the{" "}
                    {entityType}.
                  </Alert>
                )
              );
            })()}

            {/* Failed Users - Not Registered */}
            {addMembersResult.failedUsers.length > 0 && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                <AlertTitle>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Warning fontSize="small" />
                    Users Not Found ({addMembersResult.failedUsers.length})
                  </Box>
                </AlertTitle>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  The following users are not registered in the system:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {addMembersResult.failedUsers.map((email, index) => (
                    <Chip
                      key={index}
                      label={email}
                      size="small"
                      color="warning"
                      variant="outlined"
                      icon={<Error fontSize="small" />}
                    />
                  ))}
                </Box>
              </Alert>
            )}

            {/* Already Members */}
            {addMembersResult.alreadyMembers.length > 0 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <AlertTitle>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircle fontSize="small" />
                    Already Members ({addMembersResult.alreadyMembers.length})
                  </Box>
                </AlertTitle>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  The following users are already members of this {entityType}:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {addMembersResult.alreadyMembers.map((email, index) => (
                    <Chip
                      key={index}
                      label={email}
                      size="small"
                      color="info"
                      variant="outlined"
                      icon={<CheckCircle fontSize="small" />}
                    />
                  ))}
                </Box>
              </Alert>
            )}
          </Box>
        )}

        {/* Email Input */}
        {!showResults && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: "medium" }}
            >
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
        )}

        {/* Email List */}
        {!showResults && emailList.length > 0 && (
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: "medium" }}
            >
              Adding ({emailList.length} member
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
          {showResults ? "Close" : "Cancel"}
        </Button>
        {!showResults && (
          <Button
            onClick={handleAddMembers}
            variant="contained"
            disabled={emailList.length === 0 || isInviting}
            startIcon={
              isInviting ? <CircularProgress size={16} /> : <PersonAdd />
            }
          >
            {isInviting
              ? "Adding Members..."
              : `Add ${emailList.length} Member${
                  emailList.length !== 1 ? "s" : ""
                }`}
          </Button>
        )}
        {showResults && (
          <Button
            onClick={() => {
              setShowResults(false);
              setAddMembersResult(null);
              setSuccess(false);
              setOriginalEmailList([]);
            }}
            variant="contained"
            startIcon={<PersonAdd />}
          >
            Add More Members
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddMembersModal;
