import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Divider,
  useTheme,
  IconButton,
  Stack,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  LinkedIn,
  GitHub,
  Login,
  Dashboard,
  Quiz,
  School,
  AutoFixHigh,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const theme = useTheme();
  const navigate = useNavigate();

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
          <Grid size={{ xs: 12, md: 4 }}>
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
            <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
              <IconButton
                color="primary"
                aria-label="Facebook"
                size="medium"
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    bgcolor: `${theme.palette.primary.main}15`,
                    borderColor: theme.palette.primary.main,
                    transform: 'translateY(-2px)'
                  },
                }}
              >
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton
                color="primary"
                aria-label="Twitter"
                size="medium"
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    bgcolor: `${theme.palette.primary.main}15`,
                    borderColor: theme.palette.primary.main,
                    transform: 'translateY(-2px)'
                  },
                }}
              >
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton
                color="primary"
                aria-label="LinkedIn"
                size="medium"
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    bgcolor: `${theme.palette.primary.main}15`,
                    borderColor: theme.palette.primary.main,
                    transform: 'translateY(-2px)'
                  },
                }}
              >
                <LinkedIn fontSize="small" />
              </IconButton>
              <IconButton
                color="primary"
                aria-label="GitHub"
                size="medium"
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    bgcolor: `${theme.palette.primary.main}15`,
                    borderColor: theme.palette.primary.main,
                    transform: 'translateY(-2px)'
                  },
                }}
              >
                <GitHub fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>

          {/* Platform Links */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                startIcon={<Quiz fontSize="small" />}
                onClick={() => handleNavigation('/quiz-creator')}
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
                Quiz Creator
              </Button>
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
