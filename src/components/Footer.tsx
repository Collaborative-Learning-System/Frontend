import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Login,
  Dashboard,
  School,
  AutoFixHigh,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useContactModal } from '../context/ContactModalContext';

export default function Footer() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { openContactModal } = useContactModal();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.paper,
        py: { xs: 6, md: 8 },
        borderTop: `1px solid ${theme.palette.divider}`,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Company Info */}
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                mb: 2,
              }}
            >
              EduCollab
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                mb: 3,
                lineHeight: 1.6,
              }}
            >
              Revolutionizing education through collaborative learning, AI-powered study plans, and real-time collaboration tools for students worldwide.
            </Typography>
           
          </Grid>

          {/* Platform Links */}
          <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ 
                fontWeight: 'bold', 
                mb: 3,
                color: theme.palette.text.primary 
              }}
            >
              Platform
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button
                startIcon={<Login fontSize="small" />}
                onClick={() => handleNavigation('/auth')}
                sx={{
                  justifyContent: 'flex-start',
                  p: 0.5,
                  textAlign: 'left',
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                  '&:hover': { 
                    color: 'primary.main',
                    bgcolor: `${theme.palette.primary.main}08`
                  },
                }}
              >
                Sign In / Register
              </Button>
              <Button
                startIcon={<Dashboard fontSize="small" />}
                onClick={() => handleNavigation('/dashboard')}
                sx={{
                  justifyContent: 'flex-start',
                  p: 0.5,
                  textAlign: 'left',
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                  '&:hover': { 
                    color: 'primary.main',
                    bgcolor: `${theme.palette.primary.main}08`
                  },
                }}
              >
                Dashboard
              </Button>
            </Box>
          </Grid>

          {/* Features Links */}
          <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ 
                fontWeight: 'bold', 
                mb: 3,
                color: theme.palette.text.primary 
              }}
            >
              Features
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button
                startIcon={<AutoFixHigh fontSize="small" />}
                onClick={() => handleNavigation('/document-summary')}
                sx={{
                  justifyContent: 'flex-start',
                  p: 0.5,
                  textAlign: 'left',
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                  '&:hover': { 
                    color: 'primary.main',
                    bgcolor: `${theme.palette.primary.main}08`
                  },
                }}
              >
                Document Summarizer
              </Button>
              <Button
                startIcon={<School fontSize="small" />}
                onClick={() => handleNavigation('/study-plan-generator')}
                sx={{
                  justifyContent: 'flex-start',
                  p: 0.5,
                  textAlign: 'left',
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                  '&:hover': { 
                    color: 'primary.main',
                    bgcolor: `${theme.palette.primary.main}08`
                  },
                }}
              >
                Study Plan Generator
              </Button>
            </Box>
          </Grid>

          {/* Support Links */}
          <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ 
                fontWeight: 'bold', 
                mb: 3,
                color: theme.palette.text.primary 
              }}
            >
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button
                onClick={openContactModal}
                sx={{
                  justifyContent: 'flex-start',
                  p: 0.5,
                  textAlign: 'left',
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                  '&:hover': { 
                    color: 'primary.main',
                    bgcolor: `${theme.palette.primary.main}08`
                  },
                }}
              >
                Contact Us
              </Button>
            </Box>
          </Grid>



        </Grid>

        <Divider sx={{ my: 6, bgcolor: theme.palette.divider }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', textAlign: 'center' }}
          >
            © 2025 EduCollab. All rights reserved. Built with ❤️ for collaborative learning.
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', textAlign: 'center' }}
          >
            Empowering {' '}
            <Box component="span" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              10,000+
            </Box>
            {' '} students worldwide
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
