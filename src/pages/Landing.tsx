import React from "react";
import { Box, alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Landing = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
              minHeight: "100vh",
          minWidth: "100vw",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.light,
          0.1
        )} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <h1>Welcome to EduCollab</h1>
      <p>
        Your platform for collaborative learning and personalized study plans.
      </p>
    </Box>
  );
};

export default Landing;
