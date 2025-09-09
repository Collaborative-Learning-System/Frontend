import { useContext, useState } from "react";
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
} from "@mui/material";
import {
  Person,
  Email,
  Edit,
  Save,
  Cancel,
  PhotoCamera,
  Lock
} from "@mui/icons-material";
import { AppContext } from "../context/AppContext";
import axios from "axios";

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const theme = useTheme();

  const { userData, setUserData } = useContext(AppContext);

  const [editData, setEditData] = useState(userData);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      console.log("User Data:", userData);
      console.log("Updating profile with data:", editData);
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
        setUserData(editData);
        setIsEditing(false);
      }
    } catch (err) {
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

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        p: 4,
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
              src={""}
              sx={{
                width: 100,
                height: 100,
                fontSize: "2rem",
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }}
            >
              {userData?.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </Avatar>
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                bottom: -5,
                right: -5,
                bgcolor: theme.palette.primary.main,
                color: "white",
                "&:hover": { bgcolor: theme.palette.primary.dark },
              }}
            >
              <PhotoCamera fontSize="small" />
            </IconButton>
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
              <Person sx={{ color: theme.palette.primary.main }} />
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
            <Button variant="outlined" color="primary" disabled={isEditing} onClick={() =>
            {
              setSuccess("Reset Email Sent to your registered email address");
              setTimeout(() => setSuccess(""), 3000);
            }}>
              Reset Password
            </Button>
          </Box>

        </Stack>
      </Box>
    </Box>
  );
}

          