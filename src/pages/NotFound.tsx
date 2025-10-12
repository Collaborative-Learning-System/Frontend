import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, useTheme, Paper, Stack } from "@mui/material";
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  ErrorOutline as ErrorIcon,
} from "@mui/icons-material";
import { useThemeContext } from "../context/ThemeContext";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode } = useThemeContext();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        backgroundColor:
          mode === "dark"
            ? theme.palette.background.default
            : theme.palette.grey[50],
      }}
    >
      <Paper
        elevation={mode === "dark" ? 2 : 1}
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 2,
          backgroundColor:
            mode === "dark"
              ? theme.palette.grey[900]
              : theme.palette.background.paper,
          border:
            mode === "dark"
              ? `1px solid ${theme.palette.grey[700]}`
              : `1px solid ${theme.palette.grey[300]}`,
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Stack spacing={3} alignItems="center">
          {/* Error Icon */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor:
                mode === "dark"
                  ? theme.palette.error.dark
                  : theme.palette.error.light,
              color: theme.palette.error.contrastText,
            }}
          >
            <ErrorIcon sx={{ fontSize: 40 }} />
          </Box>

          {/* 404 Title */}
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "3rem", sm: "4rem" },
              fontWeight: "bold",
              color:
                mode === "dark"
                  ? theme.palette.primary.light
                  : theme.palette.primary.main,
              lineHeight: 1,
            }}
          >
            404
          </Typography>

          {/* Error Message */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 1,
            }}
          >
            Page Not Found
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              lineHeight: 1.5,
              mb: 2,
            }}
          >
            The page you're looking for doesn't exist.
          </Typography>

          {/* Action Buttons */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mt: 2 }}
          >
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
              size="medium"
              sx={{
                px: 3,
                py: 1,
                borderRadius: 1.5,
                fontWeight: 500,
                "&:hover": {
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Home
            </Button>

            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              size="medium"
              sx={{
                px: 3,
                py: 1,
                borderRadius: 1.5,
                fontWeight: 500,
                "&:hover": {
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Back
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

export default NotFound;
