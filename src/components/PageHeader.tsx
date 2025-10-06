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

  return (
    <Box
      sx={{
        mb: 4,
        p: 3,
        borderRadius: 2,
        borderBottom: `2px solid ${theme.palette.divider}`,
        background: gradient
          ? `linear-gradient(135deg, 
              ${alpha(theme.palette.primary.main, 0.1)} 0%, 
              ${alpha(theme.palette.secondary.main, 0.05)} 100%)`
          : "transparent",
        textAlign: centerAlign ? "center" : "left",
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
