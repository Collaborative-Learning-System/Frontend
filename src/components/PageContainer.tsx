import React from "react";
import { Box, Container, useTheme, alpha } from "@mui/material";

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullHeight?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = "lg",
  fullHeight = true,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, 
                   ${alpha(theme.palette.primary.main, 0.03)} 0%, 
                   ${alpha(theme.palette.secondary.main, 0.02)} 50%,
                   ${alpha(theme.palette.background.default, 0.95)} 100%)`,
        minHeight: fullHeight ? "100vh" : "auto",
        position: "relative",
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
      <Container
        maxWidth={maxWidth}
        sx={{
          py: 4,
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default PageContainer;
