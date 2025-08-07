import React, { useState } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import SidePanel from "../components/SidePanel";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default to open

//   const drawerWidthOpen = 260;
//   const drawerWidthClosed = 70;

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Calculate the margin based on sidebar state
//   const getMainContentMarginLeft = () => {
//     if (isMobile) {
//       return 0; // No margin on mobile
//     }
//     return sidebarOpen ? 0 : 0;
//   };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
        bgcolor: theme.palette.background.default,
      }}
    >
      <SidePanel
        open={sidebarOpen}
        onToggle={handleSidebarToggle}
        onClose={handleSidebarClose}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          marginLeft: 0,
          width: "100vw",
          transition: !isMobile
            ? theme.transitions.create(["margin-left", "width"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              })
            : "none",
          position: "relative",
          overflow: "hidden",
          ...(isMobile && {
            marginTop: "64px", // Account for mobile app bar
            height: "calc(100vh - 64px)",
          }),
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            padding: 0,
            margin: 0,
            bgcolor: theme.palette.background.default,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
