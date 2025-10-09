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
import { Lock, ArrowBack, Email, Check } from "@mui/icons-material";
import axios from "axios";

const ForgotPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Form states
  const [resetEmail, setResetEmail] = useState("");

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Handle reset email sent logic
  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!resetEmail) {
        setError("Please enter your email");
        setIsLoading(false);
        return;
      }

      const response = await axios.post(`${backendUrl}/notification/reset-password`, {
        email: resetEmail
      });

      if (response.data.success) {
          setSuccess("Reset email sent! Please check your inbox.");
      } else {
        setError(response.data.message || "Failed to send reset email");
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
        backgroundImage: `url('${
          theme.palette.mode === "light" ? "/welcome.png" : "/welcome_dark.png"
        }')`,
        backgroundSize: "fit",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "500px", ml: 4 }}>
        {/* Form Card */}
        <Card>
          {/* Header */}
          <Box sx={{ textAlign: "center", mt: 2 }}>
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
              variant="h4"
              component="h1"
              gutterBottom
              color={theme.palette.primary.main}
              sx={{ fontWeight: "bold" }}
            >
              Reset Password
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Enter your email below
            </Typography>
          </Box>
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

            <Box
              component="form"
              onSubmit={handleSendResetEmail}
              sx={{ mt: 2 }}
            >
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                margin="normal"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter your email"
                // helperText="This should be your previously registered email"
                helperText={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton size="small" disabled>
                      <Check sx={{ color: "green" }} />
                    </IconButton>
                    <Typography variant="caption" color="green">
                      This should be your previously registered email
                    </Typography>
                  </Box>
                }
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSendResetEmail}
                disabled={isLoading}
                sx={{ mt: 2, mb: 2, py: 1.5 }}
              >
                {isLoading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    <span>Sending Reset Email...</span>
                  </Box>
                ) : (
                  "SEND RESET LINK"
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
