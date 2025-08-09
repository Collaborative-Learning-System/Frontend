import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Menu } from '@mui/icons-material';

export default function Navigation() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#083c70ff', fontWeight: 'bold' }}>
          StudySync
        </Typography>
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button sx={{ color: '#083c70ff' }}>Features</Button>
            <Button sx={{ color: '#083c70ff' }}>About</Button>
            <Button sx={{ color: '#083c70ff' }}>Pricing</Button>
            <Button onClick={() => navigate('/contact-us')} sx={{ color: '#083c70ff' }}>Contact</Button>
          </Box>
        )}
        <Box sx={{ ml: 2 }}>
          <Button 
            onClick={() => navigate('/auth')} 
            variant="outlined" 
            sx={{ mr: 1, color: '#083c70ff', borderColor: '#083c70ff' }}
          >
            Login
          </Button>
          <Button 
            onClick={() => navigate('/auth')} 
            variant="contained" 
            sx={{ bgcolor: '#083c70ff', '&:hover': { bgcolor: '#0d47a1' } }}
          >
            Sign Up
          </Button>
        </Box>
        {isMobile && (
          <IconButton sx={{ color: '#083c70ff' }}>
            <Menu />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}
