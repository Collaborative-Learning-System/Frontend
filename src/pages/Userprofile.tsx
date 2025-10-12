import { useContext, useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  useTheme,
  alpha,
  Stack,
  Divider,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Person,
  Email,
  Edit,
  Save,
  Cancel,
  PhotoCamera,
  Lock,
} from "@mui/icons-material";
import InfoIcon from "@mui/icons-material/Info";

import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { handleLogging } from "../services/LoggingService";

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const theme = useTheme();

  const { userData, setUserData } = useContext(AppContext);
  const navigate = useNavigate();

  const [editData, setEditData] = useState(userData);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profilePicture, setProfilePicture] = useState<string>("");

  // Update local profile picture state when context userData changes
  useEffect(() => {
    if (userData?.profilePicture) {
      setProfilePicture(userData.profilePicture);
    }
  }, [userData?.profilePicture]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(userData);
  };

  const handleSave = async () => {
    try {
      if (!editData) {
        setError("Profile Updation Failed. Please try again later.");
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/update-profile`,
        {
          userId: editData?.userId,
          fullName: editData?.fullName,
          email: editData?.email,
          bio: editData?.bio,
        }
      );
      if (response.status === 200) {
        setSuccess("Profile updated successfully!");
        handleLogging(`You updated your profile successfully`);
        setUserData(editData);
        setIsEditing(false);
      }
    } catch (err) {
      handleLogging(`A failed profile update attempt was detected`);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message);
      } else {
        setError("Profile Updation Failed. Please try again later.");
      }
      setIsEditing(false);
      setUserData(userData);
    } finally {
      setTimeout(() => {
        setError(""), setSuccess("");
      }, 4000);
    }
  };

  // const handleRemoveAccount = async () => {
  //   try {
  //     if (!userData?.userId) {
  //       setError("Account Deletion Failed. Please try again later.");
  //       handleLogging(`A failed account deletion attempt was detected`);
  //       return;
  //     }
  //     const response = await axios.delete(
  //       `${import.meta.env.VITE_BACKEND_URL}/auth/delete-account/${
  //         userData?.userId
  //       }`
  //     );
  //     if (response.data.success) {
  //       setSuccess("Account deleted successfully!");
  //       setTimeout(() => {
  //         navigate("/auth");
  //       }, 2000);
  //     }
  //   } catch (error) {
  //     handleLogging(`A failed account deletion attempt was detected`);
  //     setError("Account Deletion Failed. Please try again later.");
  //   }
  // };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB.");
        return;
      }

      setIsUploading(true);
      setError("");
      setSuccess("");

      try {
        // Create FormData to send file to backend
        const formData = new FormData();
        formData.append("image", file);
        formData.append("userId", userData?.userId || "");

        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/update-profile-picture`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.success) {
          // Update profile picture with the URL returned from backend
          setProfilePicture(response.data.data.profilePicUrl);
          setSuccess("Profile picture updated successfully!");
          handleLogging(`You updated your profile picture successfully`);
          if (userData) {
            setUserData({
              ...userData,
              profilePicture: response.data.data.profilePicUrl,
            });
          }
        }
      } catch (err) {
        handleLogging(`A failed profile picture update attempt was detected`);
        if (axios.isAxiosError(err) && err.response) {
          setError(
            err.response.data.message || "Failed to upload profile picture."
          );
        } else {
          setError("Failed to upload profile picture. Please try again.");
        }
      } finally {
        setIsUploading(false);
        setTimeout(() => {
          setError("");
          setSuccess("");
        }, 4000);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.main, 0.03)} 0%, 
          ${alpha(theme.palette.secondary.main, 0.02)} 50%,
          ${alpha(theme.palette.background.default, 0.95)} 100%)`,
        p: 4,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 80%, ${alpha(
            theme.palette.primary.main,
            0.1
          )} 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, ${alpha(
                                theme.palette.secondary.main,
                                0.1
                              )} 0%, transparent 50%)`,
          pointerEvents: "none",
        },
      }}
    >
      {/* Profile Header */}
      <Box
        sx={{
          mb: 4,
          p: 4,
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Stack direction="row" spacing={3} alignItems="center">
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={profilePicture || ""}
              sx={{
                width: 100,
                height: 100,
                fontSize: "2rem",
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                opacity: isUploading ? 0.6 : 1,
                transition: theme.transitions.create(["opacity"]),
              }}
            >
              {!profilePicture &&
                userData?.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
            </Avatar>

            {/* Loading spinner overlay */}
            {isUploading && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 100,
                  height: 100,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: alpha(theme.palette.background.paper, 0.8),
                  borderRadius: "50%",
                }}
              >
                <CircularProgress size={24} thickness={4} />
              </Box>
            )}

            <IconButton
              size="small"
              onClick={handleProfilePictureClick}
              disabled={isUploading}
              sx={{
                position: "absolute",
                bottom: -5,
                right: -5,
                bgcolor: theme.palette.primary.main,
                color: "white",
                "&:hover": { bgcolor: theme.palette.primary.dark },
                "&:disabled": {
                  bgcolor: theme.palette.action.disabled,
                  color: theme.palette.action.disabled,
                },
              }}
            >
              {isUploading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <PhotoCamera fontSize="small" />
              )}
            </IconButton>
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="600" sx={{ mb: 1 }}>
              {userData?.fullName}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {userData?.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userData?.bio || ""}
            </Typography>
          </Box>
          {/* <Box>
            <Button
              variant="outlined"
              color="error"
              onClick={handleRemoveAccount}
            >
              Remove Account
            </Button>
          </Box> */}
        </Stack>
      </Box>

      <Box
        sx={{
          mb: 4,
          p: 4,
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box
          sx={{
            mb: 4,
            display: { xs: "block", sm: "flex" },
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ mb: { xs: 3, sm: 0 } }}
          >
            User Information
          </Typography>
          {!isEditing ? (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleEdit}
              sx={{ ml: "auto" }}
            >
              Edit Profile
            </Button>
          ) : (
            <Stack direction="row" spacing={2} sx={{ ml: "auto" }}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
              >
                Save
              </Button>
            </Stack>
          )}
        </Box>

        <Divider sx={{ mb: 4 }} />
        <Box>
          {/* Error/Success Messages */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
        </Box>
        <Stack spacing={3}>
          {/* Name Field */}
          <Box>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Person sx={{ color: theme.palette.primary.main }} />
              <Typography variant="subtitle2" color="text.secondary">
                Full Name
              </Typography>
            </Stack>
            {isEditing ? (
              <TextField
                fullWidth
                variant="outlined"
                value={editData?.fullName}
                onChange={(e) =>
                  setEditData((prev) =>
                    prev ? { ...prev, fullName: e.target.value } : prev
                  )
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              />
            ) : (
              <Typography variant="body1" sx={{ ml: 4 }}>
                {userData?.fullName}
              </Typography>
            )}
          </Box>

          {/* Email Field */}
          <Box>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Email sx={{ color: theme.palette.primary.main }} />
              <Typography variant="subtitle2" color="text.secondary">
                Email Address
              </Typography>
            </Stack>
            {isEditing ? (
              <TextField
                fullWidth
                variant="outlined"
                type="email"
                value={editData?.email}
                onChange={(e) =>
                  setEditData((prev) =>
                    prev ? { ...prev, email: e.target.value } : prev
                  )
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              />
            ) : (
              <Typography variant="body1" sx={{ ml: 4 }}>
                {userData?.email}
              </Typography>
            )}
          </Box>

          {/* Bio Field */}
          <Box>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <InfoIcon sx={{ color: theme.palette.primary.main }} />
              <Typography variant="subtitle2" color="text.secondary">
                Bio
              </Typography>
            </Stack>
            {isEditing ? (
              <TextField
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                value={editData?.bio || ""}
                onChange={(e) =>
                  setEditData((prev) =>
                    prev ? { ...prev, bio: e.target.value } : prev
                  )
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              />
            ) : (
              <Typography variant="body1" sx={{ ml: 4, lineHeight: 1.6 }}>
                {userData?.bio || "No bio available"}
              </Typography>
            )}
          </Box>

          {/* Password Field */}
          <Box>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Lock sx={{ color: theme.palette.primary.main }} />
              <Typography variant="subtitle2" color="text.secondary">
                Reset Password
              </Typography>
            </Stack>
            <Button
              variant="outlined"
              color="primary"
              disabled={isEditing}
              onClick={() => {
                navigate(`/reset-password/${userData?.userId}`);
              }}
            >
              Reset Password
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
