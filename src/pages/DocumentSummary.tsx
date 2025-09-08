import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Fade,
  useTheme,
  alpha
} from '@mui/material';
import {
  AutoAwesome,
  Speed,
  Security,
  CloudQueue
} from '@mui/icons-material';
import DocumentSummarizer from '../components/DocumentSummarizer';

const DocumentSummary = () => {
  const theme = useTheme();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const features = [
    {
      icon: <AutoAwesome />,
      title: 'AI-Powered',
      description: 'Leverages Google Gemini AI for intelligent document analysis and summarization'
    },
    {
      icon: <Speed />,
      title: 'Fast Processing',
      description: 'Get comprehensive summaries in seconds, not hours'
    },
    {
      icon: <Security />,
      title: 'Secure & Private',
      description: 'Your documents are processed securely with privacy in mind'
    },
    {
      icon: <CloudQueue />,
      title: 'Multiple Formats',
      description: 'Supports text files, PDFs, and Word documents'
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: "center", mb: 0 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          AI Document Summarizer
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: "auto", mb: 4 }}
        >
          Transform lengthy documents into clear, concise summaries using
          advanced AI technology. Perfect for research papers, reports,
          articles, and study materials.
        </Typography>
      </Box>

      {/* Success Message */}
      {/* <Fade in={showSuccessMessage}>
        <Alert severity="success" sx={{ mb: 0, maxWidth: 600, mx: "auto" }}>
          Summary generated successfully! Your document has been processed and
          summarized.
        </Alert>
      </Fade> */}

      {/* Main Summarizer Component */}
      <DocumentSummarizer />

      {/* Features Section */}
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography
          variant="h5"
          textAlign="center"
          gutterBottom
          sx={{ mb: 4, fontWeight: "bold" }}
        >
          Why Choose Our AI Summarizer?
        </Typography>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Usage Instructions */}
      <Card sx={{ mt: 6, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 3 }}
          >
            How to Use
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  1. Upload or Paste
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload your document or paste the text you want to summarize
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  2. Customize Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose summary length, focus area, and tone to match your
                  needs
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  3. Get Your Summary
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Receive an AI-generated summary that you can copy, download,
                  or share
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card sx={{ mt: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 3 }}
          >
            Tips for Best Results
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>Document Length:</strong> Works best with documents
                between 500-5000 words
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>Clear Text:</strong> Ensure your text is
                well-formatted and readable
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>Language:</strong> Currently optimized for English
                content
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>Focus Area:</strong> Choose the right focus to get
                targeted summaries
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>Summary Length:</strong> Short for overviews, detailed
                for comprehensive analysis
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>File Formats:</strong> .txt files work best for
                immediate processing
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DocumentSummary;
