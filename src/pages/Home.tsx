// Remove 'use client' directive for standard React projects
import { useNavigate } from "react-router-dom";
import HomepageImage from '../assets/Homepageimg.png';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

import {
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating
} from '@mui/material'

import {
  Groups,
  School,
  Analytics,
  Quiz,
  CloudUpload,
  Edit,
  ArrowForward,
  CheckCircle
} from '@mui/icons-material'

export default function CollaborativeLearningHomepage() {
  const navigate = useNavigate()

  const features = [
    {
      icon: <Groups sx={{ fontSize: 40, color: '#083c70ff' }} />,
      title: 'Study Groups',
      description: 'Create and join study groups based on subjects and interests. Collaborate with peers who share your learning goals.'
    },
    {
      icon: <CloudUpload sx={{ fontSize: 40, color: '#083c70ff' }} />,
      title: 'Resource Sharing',
      description: 'Upload, organize, and access learning materials with advanced tagging and search capabilities.'
    },
    {
      icon: <Edit sx={{ fontSize: 40, color: '#083c70ff' }} />,
      title: 'Collaborative Editing',
      description: 'Real-time collaborative document editing for notes and study materials within your groups.'
    },
    {
      icon: <School sx={{ fontSize: 40, color: '#083c70ff' }} />,
      title: 'Personalized Study Plans',
      description: 'AI-powered study plan generation tailored to your learning style, pace, and goals.'
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: '#083c70ff' }} />,
      title: 'Progress Tracking',
      description: 'Visual dashboards to monitor your learning progress and identify areas for improvement.'
    },
    {
      icon: <Quiz sx={{ fontSize: 40, color: '#083c70ff' }} />,
      title: 'Interactive Assessments',
      description: 'Create and participate in quizzes with immediate feedback and performance analysis.'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Computer Science Student',
      avatar: '/placeholder.svg?height=50&width=50&text=SC',
      rating: 5,
      comment: 'This platform transformed how I study. The collaborative features helped me connect with amazing study partners!'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Engineering Student',
      avatar: '/placeholder.svg?height=50&width=50&text=MR',
      rating: 5,
      comment: 'The personalized study plans are incredible. It adapts to my learning style and keeps me on track.'
    },
    {
      name: 'Emily Johnson',
      role: 'Medical Student',
      avatar: '/placeholder.svg?height=50&width=50&text=EJ',
      rating: 5,
      comment: 'Resource sharing made group projects so much easier. Everything is organized and accessible.'
    }
  ]

  const stats = [
    { number: '10K+', label: 'Active Students' },
    { number: '500+', label: 'Study Groups' },
    { number: '50K+', label: 'Resources Shared' },
    { number: '95%', label: 'Success Rate' }
  ]

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'white' }}>
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ color: '#083c70ff', fontWeight: 'bold' }}>
              Learn Together, Achieve More
            </Typography>
            <Typography variant="h5" paragraph sx={{ color: 'text.secondary', mb: 4 }}>
              Join the ultimate collaborative learning platform where students connect, share resources, and create personalized study plans powered by AI.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                onClick={() => navigate('/auth')}
                variant="contained" 
                size="large" 
                endIcon={<ArrowForward />}
                sx={{ bgcolor: '#083c70ff', '&:hover': { bgcolor: '#0d47a1' } }}
              >
                Get Started Free
              </Button>
              <Button variant="outlined" size="large" sx={{ color: '#083c70ff', borderColor: '#083c70ff' }}>
                Watch Demo
              </Button>
            </Box>
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle sx={{ color: '#4caf50', mr: 1 }} />
                <Typography variant="body2">Free to start</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle sx={{ color: '#4caf50', mr: 1 }} />
                <Typography variant="body2">No credit card required</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ position: 'relative', textAlign: 'center' }}>
              <img 
                src={HomepageImage} 
                alt="Students collaborating" 
                style={{ width: '100%', maxWidth: 500, height: 'auto', borderRadius: 16 }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid size={{ xs: 6, md: 3 }} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: '#083c70ff', fontWeight: 'bold' }}>
                    {stat.number}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ color: '#083c70ff', fontWeight: 'bold' }}>
            Everything You Need to Excel
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
            Comprehensive tools designed to enhance your learning experience and boost academic success
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card sx={{ height: '100%', p: 2, '&:hover': { boxShadow: 4 } }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ color: '#083c70ff', fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ color: '#083c70ff', fontWeight: 'bold' }}>
              What Students Say
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Join thousands of students who have transformed their learning experience
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Card sx={{ height: '100%', p: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar src={testimonial.avatar} sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      "{testimonial.comment}"
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', bgcolor: '#083c70ff', color: 'white', p: 6, borderRadius: 2 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Ready to Transform Your Learning?
          </Typography>
          <Typography variant="h6" paragraph sx={{ opacity: 0.9, mb: 4 }}>
            Join StudySync today and experience the power of collaborative learning
          </Typography>
          <Button 
            onClick={() => navigate('/auth')}
            variant="contained" 
            size="large" 
            sx={{ bgcolor: 'white', color: '#083c70ff', '&:hover': { bgcolor: '#f5f5f5' } }}
            endIcon={<ArrowForward />}
          >
            Start Learning Now
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  )
}
