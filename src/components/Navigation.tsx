import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
} from "@mui/material";

export default function Navigation() {
  const navigate = useNavigate();
  const theme = useTheme();
  //  const ThemeContext = useContext(ThemeContext);

  return (
    <AppBar
      position="static"
      sx={{ bgcolor: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            color: theme.palette.primary.main,
            fontWeight: "bold",
          }}
        >
          EduCollab
        </Typography>

        {/* <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            onClick={() => navigate("/contact-us")}
            sx={{ color: theme.palette.primary.main }}
          >
            Contact
          </Button>
        </Box> */}

        <Box sx={{ ml: 2 }}>  
          <Button
            onClick={() => navigate("/auth")}
            variant="contained"
            sx={{
              mr: 1,
              borderColor: theme.palette.primary.main,
            }}
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
