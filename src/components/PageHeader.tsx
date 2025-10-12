import React from "react";
import { Box, Typography, useTheme, alpha } from "@mui/material";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  gradient?: boolean;
  centerAlign?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  gradient = false,
  centerAlign = false,
}) => {
  const theme = useTheme();

  const glassBackdropStyles = {
    background: `linear-gradient(135deg, 
      ${alpha(theme.palette.primary.main, 0.1)} 0%, 
      ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    border: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
  };

  return (
    <Box
      sx={{
        mb: 4,
        p: 4,
        borderRadius: gradient ? "12px" : 2,
        borderBottom: gradient ? "none" : `2px solid ${theme.palette.divider}`,
        background: gradient ? "transparent" : "transparent",
        textAlign: centerAlign ? "center" : "left",
        ...(gradient && glassBackdropStyles),
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: centerAlign ? "center" : "flex-start",
          mb: subtitle ? 2 : 0,
        }}
      >
        {icon && (
          <Box
            sx={{
              mr: centerAlign ? 0 : 2,
              mb: centerAlign ? 1 : 0,
              color: theme.palette.primary.main,
              fontSize: 32,
              display: "flex",
              alignItems: "center",
            }}
          >
            {icon}
          </Box>
        )}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: gradient ? "transparent" : theme.palette.text.primary,
            background: gradient
              ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
              : "none",
            backgroundClip: gradient ? "text" : "initial",
            WebkitBackgroundClip: gradient ? "text" : "initial",
            WebkitTextFillColor: gradient ? "transparent" : "initial",
          }}
        >
          {title}
        </Typography>
      </Box>

      {subtitle && (
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            maxWidth: centerAlign ? 800 : "none",
            mx: centerAlign ? "auto" : 0,
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default PageHeader;
