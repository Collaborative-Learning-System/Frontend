import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Avatar,
  Alert,
  InputAdornment,
  CircularProgress,
  Link,
  useTheme,
  IconButton,
} from "@mui/material";
import { Lock, ArrowBack, VisibilityOff, Visibility } from "@mui/icons-material";
import axios from "axios";

const ResetPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Form states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Handle password reset 
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    
    // Validation
    if (!newPassword.trim()) {
      setError("Password cannot be empty");
      setIsLoading(false);
      return;
    }

    if (!confirmPassword.trim()) {
      setError("Please confirm your password");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const email = localStorage.getItem("resetEmail");
      
      if (!email) {
        setError("Email not found. Please go back to forgot password and try again.");
        setIsLoading(false);
        return;
      }

      if (!newPassword.trim()) {
        setError("Password cannot be empty");
        setIsLoading(false);
        return;
      }
      const response = await axios.post(`${backendUrl}/auth/reset-password`, {
        email, newPassword,
      });


      if (response.data.success) {
        setSuccess(
          "Password reset successful! You can now login with your new password."
        );
        setTimeout(() => navigate("/auth"), 3000);
      } else {
        setError(response.data.message || "Failed to reset password");
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: theme.palette.background.default,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        p: 2,
        backgroundImage: 'url("/welcome.png")',
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "500px", ml: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              mx: "auto",
              mb: 2,
              bgcolor: theme.palette.primary.main,
            }}
          >
            <Lock sx={{ fontSize: 32, color: "white" }} />
          </Avatar>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            color={theme.palette.primary.main}
            sx={{ fontWeight: "bold" }}
          >
            Reset Password
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter your new password below
          </Typography>
        </Box>

        {/* Form Card */}
        <Card>
          <CardContent sx={{ p: 4 }}>
            {/* Back to Login Link */}
            <Box sx={{ mb: 2 }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/auth")}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  textDecoration: "none",
                  color: theme.palette.primary.main,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                <ArrowBack fontSize="small" />
                Back to Login
              </Link>
            </Box>

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

            <Box component="form" onSubmit={handleResetPassword} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                variant="outlined"
                margin="normal"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter your new password"
                helperText="Password must be at least 8 characters long, must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
              />

              <TextField
                fullWidth
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                variant="outlined"
                margin="normal"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                placeholder="Confirm your new password"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                onClick={handleResetPassword}
                disabled={
                  isLoading ||
                  !newPassword.trim() ||
                  !confirmPassword.trim() ||
                  newPassword.length < 8 ||
                  newPassword !== confirmPassword
                }
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                {isLoading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    <span>Resetting Password...</span>
                  </Box>
                ) : (
                  "RESET PASSWORD"
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ResetPassword;
