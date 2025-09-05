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
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
          position: "relative",
          bgcolor: theme.palette.background.paper,
          paddingTop: { xs: "56px", sm: "72px" }, 
          boxSizing: "border-box",
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
            boxSizing: "border-box",
            transition: !isMobile
              ? theme.transitions.create(["margin-left", "width"], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                })
              : "none",
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              overflowY: "auto",
              overflowX: "hidden",
              bgcolor: theme.palette.background.default,
              boxSizing: "border-box",
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
