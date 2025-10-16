import { useNavigate } from "react-router-dom";
import HomepageImage from "../assets/Homepageimg.png";
import Footer from "../components/Footer";

import {
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
  useTheme,
  Paper,
  Chip,
} from "@mui/material";

import {
  Groups,
  School,
  Analytics,
  Quiz,
  CloudUpload,
  Edit,
  ArrowForward,
  CheckCircle,
  TrendingUp,
} from "@mui/icons-material";
import Navigation from "../components/Navigation";

export default function CollaborativeLearningHomepage() {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <Groups sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Study Groups",
      description:
        "Create and join study groups based on subjects and interests. Collaborate with peers who share your learning goals.",
    },
    {
      icon: (
        <CloudUpload sx={{ fontSize: 40, color: theme.palette.primary.main }} />
      ),
      title: "Resource Sharing",
      description:
        "Upload, organize, and access learning materials with advanced tagging and search capabilities.",
    },
    {
      icon: <Edit sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Collaborative Editing",
      description:
        "Real-time collaborative document editing for notes and study materials within your groups.",
    },
    {
      icon: <School sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Personalized Study Plans",
      description:
        "AI-powered study plan generation tailored to your learning style, pace, and goals.",
    },
    {
      icon: (
        <Analytics sx={{ fontSize: 40, color: theme.palette.primary.main }} />
      ),
      title: "Progress Tracking",
      description:
        "Visual dashboards to monitor your learning progress and identify areas for improvement.",
    },
    {
      icon: <Quiz sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Interactive Assessments",
      description:
        "Create and participate in quizzes with immediate feedback and performance analysis.",
    },
  ];

  const testimonials = [
    {
      name: "Kasun Bandra",
      role: "Computer Science Student",
      avatar: "/placeholder.svg?height=50&width=50&text=SC",
      rating: 5,
      comment:
        "This platform transformed how I study. The collaborative features helped me connect with amazing study partners!",
    },
    {
      name: "Vimal Perera",
      role: "Engineering Student",
      avatar: "/placeholder.svg?height=50&width=50&text=MR",
      rating: 5,
      comment:
        "The personalized study plans are incredible. It adapts to my learning style and keeps me on track.",
    },
    {
      name: "Nalaka Silva",
      role: "Medical Student",
      avatar: "/placeholder.svg?height=50&width=50&text=EJ",
      rating: 5,
      comment:
        "Resource sharing made group projects so much easier. Everything is organized and accessible.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Students" },
    { number: "500+", label: "Study Groups" },
    { number: "50K+", label: "Resources Shared" },
    { number: "95%", label: "Success Rate" },
  ];

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <Navigation />

      {/* Hero Section */}
      <Box sx={{ py: { xs: 6, md: 13 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{ color: theme.palette.primary.main, fontWeight: "bold", mb: 4}}
              >
                Welcome to EduCollab
              </Typography>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ color: theme.palette.primary.main, fontWeight: "bold", mb: 3 }}
              >
                Learn Together, Achieve More
              </Typography>
              <Typography
                variant="h5"
                paragraph
                sx={{ color: "text.secondary", mb: 5 }}
              >
                Join the ultimate collaborative learning platform where students
                connect, share resources, and create personalized study plans
                powered by AI.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  onClick={() => navigate("/auth")}
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    "&:hover": { bgcolor: theme.palette.primary.light },
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    color: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main,
                  }}
                >
                  Watch Demo
                </Button>
              </Box>
              <Box
                sx={{ mt: 4, display: "flex", alignItems: "center", gap: 2 }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CheckCircle
                    sx={{
                      color:
                        theme.palette.success?.main ||
                        theme.palette.primary.main,
                      mr: 1,
                    }}
                  />
                  <Typography variant="body2">Free to start</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CheckCircle
                    sx={{
                      color:
                        theme.palette.success?.main ||
                        theme.palette.primary.main,
                      mr: 1,
                    }}
                  />
                  <Typography variant="body2">
                    No credit card required
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ position: "relative", textAlign: "center" }}>
                <img
                  src={HomepageImage}
                  alt="Students collaborating"
                  style={{
                    width: "100%",
                    maxWidth: 500,
                    height: "auto",
                    borderRadius: 16,
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box
        sx={{
          py: 6,
          bgcolor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Chip
              icon={<TrendingUp />}
              label="Platform Statistics"
              color="primary"
              sx={{ mb: 2 }}
            />
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ color: theme.palette.primary.main, fontWeight: "bold" }}
            >
              Trusted by Students Worldwide
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid size={{ xs: 6, md: 3 }} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    height: "100%",
                    bgcolor: "transparent",
                    border: `2px solid ${theme.palette.divider}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      transform: "translateY(-4px)",
                      bgcolor: theme.palette.action.hover,
                    },
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: "bold",
                      mb: 1,
                      fontSize: { xs: "2.5rem", md: "3rem" },
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Chip label="Platform Features" color="primary" sx={{ mb: 3 }} />
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ color: theme.palette.primary.main, fontWeight: "bold" }}
            >
              Everything You Need to Excel
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "text.secondary", maxWidth: 600, mx: "auto" }}
            >
              Comprehensive tools designed to enhance your learning experience
              and boost academic success
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    p: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow:
                        theme.palette.mode === "light"
                          ? "0 12px 40px rgba(0,0,0,0.1)"
                          : "0 12px 40px rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 0 }}>
                    <Box
                      sx={{
                        mb: 3,
                        p: 2,
                        borderRadius: "50%",
                        bgcolor: `${theme.palette.primary.main}15`,
                        width: 80,
                        height: 80,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: "bold",
                        mb: 2,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box
        sx={{
          bgcolor: theme.palette.background.paper,
          py: 8,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Chip label="Student Reviews" color="primary" sx={{ mb: 3 }} />
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ color: theme.palette.primary.main, fontWeight: "bold" }}
            >
              What Students Say
            </Typography>
            <Typography variant="h6" sx={{ color: "text.secondary" }}>
              Join thousands of students who have transformed their learning
              experience
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Card sx={{ height: "100%", p: 3 }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar src={testimonial.avatar} sx={{ mr: 2 }} />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          {testimonial.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Rating
                      value={testimonial.rating}
                      readOnly
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="body2" sx={{ fontStyle: "italic" }}>
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
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Paper
            sx={{
              textAlign: "center",
              p: { xs: 4, md: 8 },
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
            >
              Ready to Transform Your Learning?
            </Typography>

            <Typography
              variant="h6"
              paragraph
              sx={{
                mb: 4,
                color: theme.palette.text.secondary,
                maxWidth: 600,
                mx: "auto",
              }}
            >
              Join EduCollab today and experience the power of collaborative
              learning with thousands of students worldwide
            </Typography>

            <Button
              onClick={() => navigate("/auth")}
              variant="contained"
              size="large"
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.getContrastText(
                  theme.palette.primary.main
                ),
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "light"
                      ? theme.palette.primary.dark
                      : theme.palette.primary.light,
                },
              }}
              endIcon={<ArrowForward />}
            >
              Start Learning Now
            </Button>
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}
