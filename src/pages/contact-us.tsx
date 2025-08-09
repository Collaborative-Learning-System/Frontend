'use client'

import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Card,
  CardContent
} from '@mui/material'
import {
  ArrowBack,
  Email,
  Phone,
  ChatBubbleOutline
} from '@mui/icons-material'

import ContactForm from '../components/ContactForm'
import ContactInfo from '../components/ContactInfo'
import FAQ from '../components/FAQ'

export default function ContactUsPage() {
  const navigate = useNavigate()

  const handleFormSubmit = async (data: any) => {
    // In real app, this would send data to your backend
    console.log('Form submitted:', data)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const quickActions = [
    {
      icon: <Email sx={{ fontSize: 30, color: '#083c70ff' }} />,
      title: 'Email Support',
      description: 'Get help via email',
      action: 'support@studysync.edu'
    },
    {
      icon: <ChatBubbleOutline sx={{ fontSize: 30, color: '#083c70ff' }} />,
      title: 'Live Chat',
      description: 'Chat with our team',
      action: 'Start Chat'
    },
    {
      icon: <Phone sx={{ fontSize: 30, color: '#083c70ff' }} />,
      title: 'Phone Support',
      description: 'Call us directly',
      action: '+1 (555) 123-SYNC'
    }
  ]

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 1 }}>
        <Toolbar>
          <IconButton onClick={() => navigate('/')} sx={{ color: '#083c70ff', mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#083c70ff', fontWeight: 'bold' }}>
            Contact Us
          </Typography>
          <Button onClick={() => navigate('/')} variant="outlined" sx={{ color: '#083c70ff', borderColor: '#083c70ff' }}>
            Back to Home
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ 
        bgcolor: 'linear-gradient(135deg, #083c70ff 0%, #1565c0 100%)',
        background: 'linear-gradient(135deg, #083c70ff 0%, #1565c0 100%)',
        color: 'white',
        py: 8
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              We're Here to Help
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, mb: 4, maxWidth: 600, mx: 'auto' }}>
              Have questions about StudySync? Need technical support? Want to partner with us? 
              We'd love to hear from you!
            </Typography>
            
            {/* Quick Action Cards */}
            <Grid container spacing={3} sx={{ mt: 4 }}>
              {quickActions.map((action, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={index}>
                  <Card sx={{ 
                    bgcolor: 'rgba(255,255,255,0.1)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.15)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Box sx={{ mb: 2 }}>
                        {action.icon}
                      </Box>
                      <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                        {action.description}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 'medium' }}>
                        {action.action}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <ContactForm onSubmit={handleFormSubmit} />
          </Grid>

          {/* Contact Information */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <ContactInfo />
          </Grid>
        </Grid>

        {/* FAQ Section */}
        <Box sx={{ mt: 6 }}>
          <FAQ />
        </Box>

        {/* Additional Help Section */}
        <Box sx={{ mt: 6 }}>
          <Card>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#083c70ff', fontWeight: 'bold' }}>
                Need Immediate Help?
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Check out our comprehensive help center with tutorials, guides, and troubleshooting tips.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  sx={{ bgcolor: '#083c70ff', '&:hover': { bgcolor: '#0d47a1' } }}
                >
                  Visit Help Center
                </Button>
                <Button 
                  variant="outlined" 
                  sx={{ color: '#083c70ff', borderColor: '#083c70ff' }}
                >
                  Community Forum
                </Button>
                <Button 
                  variant="outlined" 
                  sx={{ color: '#083c70ff', borderColor: '#083c70ff' }}
                >
                  Video Tutorials
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* Footer CTA */}
      <Box sx={{ bgcolor: '#083c70ff', color: 'white', py: 6, mt: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Ready to Transform Your Learning?
            </Typography>
            <Typography variant="h6" paragraph sx={{ opacity: 0.9 }}>
              Join thousands of students already using StudySync to achieve their academic goals.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                bgcolor: 'white', 
                color: '#083c70ff', 
                '&:hover': { bgcolor: '#f5f5f5' },
                px: 4,
                py: 1.5
              }}
            >
              Get Started Free
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
