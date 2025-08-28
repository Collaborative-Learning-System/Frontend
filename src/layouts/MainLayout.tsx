import React, { useState } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import SidePanel from "../components/SidePanel";
import TopNavBar from "../components/TopNavBar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      <TopNavBar onSidebarToggle={handleSidebarToggle} />
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          width: "100vw",
          overflow: "hidden",
          position: "relative",
          bgcolor: theme.palette.background.paper,
          marginTop: { xs: "56px", sm: "72px" },
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
            height: `calc(100vh - ${isMobile ? "56px" : "72px"})`,
            marginLeft: 0,
            width: "100vw",
            transition: !isMobile
              ? theme.transitions.create(["margin-left", "width"], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                })
              : "none",
            position: "relative",
            overflow: "auto",
          }}
        >
          <Box
            sx={{
              width: "100%",
              overflowY: "auto",
              overflowX: "hidden",
              bgcolor: theme.palette.background.default,
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MainLayout;
