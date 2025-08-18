import { useNavigate } from 'react-router-dom';

import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Divider,
  useTheme
} from '@mui/material';

export default function Footer() {
    const navigate = useNavigate();
    const theme = useTheme();

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              EduCollab
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Empowering students through collaborative learning and personalized study experiences.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Typography variant="h6" gutterBottom>
              Product
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button sx={{ justifyContent: 'flex-start', p: 0 }}>Features</Button>
              <Button sx={{ justifyContent: 'flex-start', p: 0 }}>Pricing</Button>
              <Button sx={{ justifyContent: 'flex-start', p: 0 }}>Security</Button>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Typography variant="h6" gutterBottom>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button sx={{ justifyContent: 'flex-start', p: 0 }}>About</Button>
              <Button sx={{ justifyContent: 'flex-start', p: 0 }}>Careers</Button>
              <Button onClick={() => navigate('/contact-us')} sx={{ justifyContent: 'flex-start', p: 0 }}>Contact</Button>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Typography variant="h6" gutterBottom>
              Resources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button sx={{ justifyContent: 'flex-start', p: 0 }}>Blog</Button>
              <Button sx={{ justifyContent: 'flex-start', p: 0 }}>Help Center</Button>
              <Button sx={{ justifyContent: 'flex-start', p: 0 }}>Community</Button>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Typography variant="h6" gutterBottom>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button sx={{ justifyContent: 'flex-start', p: 0 }}>Privacy</Button>
              <Button sx={{ justifyContent: 'flex-start', p: 0 }}>Terms</Button>
              <Button sx={{ justifyContent: 'flex-start', p: 0 }}>Cookies</Button>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4, bgcolor: 'rgba(255,255,255,0.2)' }} />
        <Typography variant="body2" sx={{ textAlign: 'center', opacity: 0.8 }}>
          © 2025 EduCollab. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
