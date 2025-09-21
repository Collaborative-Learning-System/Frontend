import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Stack,
  useTheme,
  alpha,
  Card,
  CardContent,
  IconButton,
  Avatar,
  AvatarGroup,
  Chip,
  Divider,
} from "@mui/material";
import {
  Add,
  Description,
  People,
  MoreVert,
  AccessTime,
  FiberManualRecord,
} from "@mui/icons-material";
import ArticleIcon from "@mui/icons-material/Article";
import { useNavigate } from "react-router-dom";

// Mock documents data
const mockDocuments = [
  {
    id: "doc1",
    title: "Project Proposal - AI Learning Platform",
    lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    collaborators: 3,
    isActive: true,
    content: `<h1>AI Learning Platform Project Proposal</h1>
    <p>This document outlines our vision for creating an innovative AI-powered learning platform that revolutionizes education.</p>
    <h2>Project Overview</h2>
    <p>Our platform aims to provide personalized learning experiences through advanced artificial intelligence algorithms.</p>
    <h3>Key Features</h3>
    <ul>
      <li>Adaptive learning paths</li>
      <li>Real-time progress tracking</li>
      <li>Intelligent content recommendations</li>
      <li>Collaborative learning tools</li>
    </ul>
    <p>This initiative represents a significant step forward in educational technology.</p>`,
  },
  {
    id: "doc2",
    title: "Meeting Notes - Sprint Planning",
    lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    collaborators: 2,
    isActive: true,
    content: `<h1>Sprint Planning Meeting - Week 12</h1>
    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    <p><strong>Attendees:</strong> Development Team</p>
    <h2>Sprint Goals</h2>
    <ul>
      <li>Complete user authentication module</li>
      <li>Implement collaborative document editing</li>
      <li>Fix reported UI bugs</li>
    </ul>
    <h2>Action Items</h2>
    <p>Team members have been assigned specific tasks for the upcoming sprint cycle.</p>`,
  },
  {
    id: "doc3",
    title: "Research Paper - Educational Technology",
    lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    collaborators: 5,
    isActive: false,
    content: `<h1>The Impact of Technology on Modern Education</h1>
    <h2>Abstract</h2>
    <p>This research paper examines the transformative role of technology in contemporary educational systems and its implications for future learning paradigms.</p>
    <h2>Introduction</h2>
    <p>Educational technology has become an integral part of modern teaching methodologies, fundamentally changing how students learn and educators teach.</p>
    <blockquote>
      <p>"Technology is best when it brings people together." - Matt Mullenweg</p>
    </blockquote>
    <p>Our research focuses on the measurable impacts of digital tools in educational environments.</p>`,
  },
  {
    id: "doc4",
    title: "User Interface Design Guidelines",
    lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    collaborators: 4,
    isActive: false,
    content: `<h1>UI Design Guidelines v2.0</h1>
    <p>This document establishes the design standards and best practices for our application's user interface.</p>
    <h2>Design Principles</h2>
    <ol>
      <li><strong>Simplicity:</strong> Keep interfaces clean and intuitive</li>
      <li><strong>Consistency:</strong> Maintain uniform design patterns</li>
      <li><strong>Accessibility:</strong> Ensure usability for all users</li>
    </ol>
    <h2>Color Palette</h2>
    <p>Our primary colors should convey professionalism while maintaining visual appeal.</p>
    <h3>Typography</h3>
    <p>Use consistent font families and sizing throughout the application.</p>`,
  },
];

export default function RealTimeCollaboration() {
  const theme = useTheme();
  const navigate = useNavigate();

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  const handleCreateDocument = () => {
    const newDocId = `doc${Date.now()}`;
    const newDocumentData = {
      documentId: newDocId,
      documentTitle: "Untitled Document",
      content: null, // New document has no content
      readOnly: false,
      isNew: true,
    };

    navigate(`/documents/${newDocId}`, { state: newDocumentData });
  };

  const handleSelectDocument = (docId: string) => {
    const selectedDoc = mockDocuments.find((doc) => doc.id === docId);

    if (selectedDoc) {
      const documentData = {
        documentId: selectedDoc.id,
        documentTitle: selectedDoc.title,
        content: selectedDoc.content,
        readOnly: false,
        isNew: false,
        lastModified: selectedDoc.lastModified,
        collaborators: selectedDoc.collaborators,
      };

      navigate(`/documents/${docId}`, { state: documentData });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 1,
              alignItems: "center",
              gap: 1,
            }}
          >
            <ArticleIcon
              sx={{ fontSize: 30, color: theme.palette.primary.main }}
            />
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Real-Time Collaborative Documents
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: 600,
              textAlign: "center",
              mx: "auto",
            }}
          >
            Create, edit, and collaborate on documents in real-time with your
            team members
          </Typography>

          <Divider sx={{ my: 2 }} />
        </Box>

        {/* Action Bar */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            mb: 4,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.05
            )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Typography variant="h6" sx={{ fontWeight: "medium" }}>
              Your Documents
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateDocument}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  "&:hover": { bgcolor: theme.palette.primary.dark },
                }}
              >
                New Document
              </Button>
              {/* <Button variant="outlined" startIcon={<Folder />}>
                Import
              </Button> */}
            </Stack>
          </Stack>
        </Paper>

        {/* Documents Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {mockDocuments.map((document) => (
            <Card
              key={document.id}
              sx={{
                height: "100%",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
              onClick={() => handleSelectDocument(document.id)}
            >
              <CardContent
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Document Header */}
                <Stack
                  direction="row"
                  alignItems="flex-start"
                  justifyContent="space-between"
                  sx={{ mb: 2 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flex: 1,
                    }}
                  >
                    <Description
                      sx={{ color: theme.palette.primary.main, fontSize: 28 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      {document.isActive && (
                        <Chip
                          icon={<FiberManualRecord sx={{ fontSize: 12 }} />}
                          label="Live"
                          size="small"
                          color="success"
                          sx={{ mb: 1, fontSize: "0.7rem", height: 20 }}
                        />
                      )}
                    </Box>
                  </Box>
                  <IconButton size="small" sx={{ mt: -1, mr: -1 }}>
                    <MoreVert />
                  </IconButton>
                </Stack>

                {/* Document Title */}
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: "medium",
                    color: theme.palette.text.primary,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {document.title}
                </Typography>

                {/* Document Info */}
                <Box sx={{ mt: "auto" }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 2 }}
                  >
                    <AccessTime
                      sx={{ fontSize: 16, color: "text.secondary" }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {formatTimeAgo(document.lastModified)}
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <People sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {document.collaborators} collaborator
                        {document.collaborators !== 1 ? "s" : ""}
                      </Typography>
                    </Box>

                    <AvatarGroup
                      max={3}
                      sx={{
                        "& .MuiAvatar-root": {
                          width: 24,
                          height: 24,
                          fontSize: 12,
                        },
                      }}
                    >
                      {Array.from(
                        { length: Math.min(document.collaborators, 3) },
                        (_, i) => (
                          <Avatar
                            key={i}
                            sx={{ bgcolor: `hsl(${i * 120}, 60%, 50%)` }}
                          >
                            {String.fromCharCode(65 + i)}
                          </Avatar>
                        )
                      )}
                    </AvatarGroup>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          ))}

          {/* Empty State */}
          {mockDocuments.length === 0 && (
            <Paper
              sx={{
                p: 8,
                textAlign: "center",
                bgcolor: alpha(theme.palette.primary.main, 0.02),
                gridColumn: "1 / -1",
              }}
            >
              <Description
                sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                No documents yet
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", mb: 3 }}
              >
                Create your first collaborative document to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateDocument}
                size="large"
              >
                Create New Document
              </Button>
            </Paper>
          )}
        </Box>
      </Container>
    </Box>
  );
}
