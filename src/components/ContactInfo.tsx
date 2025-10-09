'use client'

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider
} from '@mui/material'
import {
  Email,
  Phone,
  LocationOn,
  Schedule,
  Support,
  School,
  Business
} from '@mui/icons-material'

export default function ContactInfo() {
  const contactMethods = [
    {
      icon: <Email sx={{ fontSize: 30, color: '#083c70ff' }} />,
      title: 'Email Support',
      primary: 'support@studysync.edu',
      secondary: 'We typically respond within 2-4 hours',
      available: '24/7'
    },
    {
      icon: <Phone sx={{ fontSize: 30, color: '#083c70ff' }} />,
      title: 'Phone Support',
      primary: '+1 (555) 123-SYNC',
      secondary: 'Speak directly with our support team',
      available: 'Mon-Fri, 9AM-6PM PST'
    },
    {
      icon: <LocationOn sx={{ fontSize: 30, color: '#083c70ff' }} />,
      title: 'Office Address',
      primary: '123 Education Street',
      secondary: 'San Francisco, CA 94105',
      available: 'Visit by appointment'
    }
  ]

  const departments = [
    {
      icon: <Support sx={{ color: '#083c70ff' }} />,
      name: 'Technical Support',
      email: 'tech@studysync.edu',
      description: 'Platform issues, bugs, and technical assistance'
    },
    {
      icon: <School sx={{ color: '#083c70ff' }} />,
      name: 'Academic Partnerships',
      email: 'academic@studysync.edu',
      description: 'University partnerships and institutional accounts'
    },
    {
      icon: <Business sx={{ color: '#083c70ff' }} />,
      name: 'Business Inquiries',
      email: 'business@studysync.edu',
      description: 'Enterprise solutions and custom implementations'
    }
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Main Contact Methods */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#083c70ff', fontWeight: 'bold', mb: 3 }}>
            Get in Touch
          </Typography>
          
          <Grid container spacing={3}>
            {contactMethods.map((method, index) => (
              <Grid size={{ xs: 12 }} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: '#f8f9fa', 
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {method.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {method.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#083c70ff', fontWeight: 'medium', mb: 0.5 }}>
                      {method.primary}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {method.secondary}
                    </Typography>
                    <Chip 
                      label={method.available} 
                      size="small" 
                      sx={{ bgcolor: '#e8f5e8', color: '#2e7d32' }}
                    />
                  </Box>
                </Box>
                {index < contactMethods.length - 1 && <Divider sx={{ mt: 3 }} />}
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Department Contacts */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#083c70ff', fontWeight: 'bold', mb: 3 }}>
            Department Contacts
          </Typography>
          
          <Grid container spacing={2}>
            {departments.map((dept, index) => (
              <Grid size={{ xs: 12 }} key={index}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  p: 2,
                  bgcolor: '#f8f9fa',
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#e3f2fd' },
                  transition: 'background-color 0.2s'
                }}>
                  {dept.icon}
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {dept.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#083c70ff', mb: 0.5 }}>
                      {dept.email}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {dept.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Schedule sx={{ color: '#083c70ff' }} />
            <Typography variant="h6" sx={{ color: '#083c70ff', fontWeight: 'bold' }}>
              Business Hours
            </Typography>
          </Box>
          
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" gutterBottom>Support Hours</Typography>
              <Typography variant="body2" color="text.secondary">
                Monday - Friday: 9:00 AM - 6:00 PM PST<br />
                Saturday: 10:00 AM - 4:00 PM PST<br />
                Sunday: Closed
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" gutterBottom>Emergency Support</Typography>
              <Typography variant="body2" color="text.secondary">
                Critical issues: 24/7 via email<br />
                Response time: Within 2 hours<br />
                For institutional partners only
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}
