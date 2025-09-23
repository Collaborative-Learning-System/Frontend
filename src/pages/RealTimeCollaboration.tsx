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
  CircularProgress,
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
import { io } from "socket.io-client";
import { use, useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

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
];

interface Documents {
  documentId: string;
  documentTitle: string;
  createdAt: Date;
  role: string;
  collaboratorCount: number;
}

export default function RealTimeCollaboration() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { userId } = useContext(AppContext);
  const [isCreatingDocument, setIsCreatingDocument] = useState(false);
  const [documents, setDocuments] = useState<Documents[]>([]);

  // const formatTimeAgo = (date: Date) => {
  //   const now = new Date();
  //   const diffInMinutes = Math.floor(
  //     (now.getTime() - date.getTime()) / (1000 * 60)
  //   );

  //   if (diffInMinutes < 1) return "Just now";
  //   if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  //   const diffInHours = Math.floor(diffInMinutes / 60);
  //   if (diffInHours < 24) return `${diffInHours}h ago`;

  //   const diffInDays = Math.floor(diffInHours / 24);
  //   if (diffInDays < 7) return `${diffInDays}d ago`;

  //   const diffInWeeks = Math.floor(diffInDays / 7);
  //   return `${diffInWeeks}w ago`;
  // };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL_WS
        }/documents/get-documents/${userId}`
      );
      if (response.data.success) {
        console.log(response.data.data);
        setDocuments(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleCreateDocument = async () => {
    if (isCreatingDocument) return; // Prevent multiple clicks

    setIsCreatingDocument(true);
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL_WS
        }/documents/create-document/${userId}`
      );
      if (response.data.success) {
        console.log("response from create doc:", response.data);
        const newDocId = response.data.document.docId;
        const title = response.data.document.title;
        const newDocumentData = {
          documentId: newDocId,
          documentTitle: title,
          content: null,
          readOnly: false,
          isNew: true,
        };

        const socket = io(`${import.meta.env.VITE_SOCKET_URL}`, {
          transports: ["websocket"],
        });
        socket.on("connect", () => {
          console.log("user/", userId, " connected with socket id:", socket.id);
        });
        socket.emit("joinDoc", { docId: newDocId, userId: userId });
        navigate(`/documents/${newDocId}`, { state: newDocumentData });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsCreatingDocument(false);
    }
  };

  const handleSelectDocument = (docId: string) => {
    const selectedDoc = documents.find((doc) => doc.documentId === docId);
    console.log("test1");
    const socket = io(`${import.meta.env.VITE_SOCKET_URL}`, {
      transports: ["websocket"],
    });
    // Handle connection
    socket.on("connect", () => {
      console.log("Connected with socket id:", socket.id);

      // join a document
      socket.emit("joinDoc", { docId: selectedDoc?.documentId, userId: userId });
      if (selectedDoc) {
        const documentData = {
          documentId: selectedDoc.documentId,
          documentTitle: selectedDoc.documentTitle,
          readOnly: false,
          isNew: false,
        };
        navigate(`/documents/${docId}`, { state: documentData });
      }
    });
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
                startIcon={
                  isCreatingDocument ? <CircularProgress size={20} /> : <Add />
                }
                onClick={handleCreateDocument}
                disabled={isCreatingDocument}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  "&:hover": { bgcolor: theme.palette.primary.dark },
                }}
              >
                {isCreatingDocument ? "Creating..." : "New Document"}
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
          {documents.map((document) => (
            <Card
              key={document.documentId}
              sx={{
                height: "100%",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
              onClick={() => handleSelectDocument(document.documentId)}
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
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 1,
                      flex: 1,
                    }}
                  >
                    <Description
                      sx={{ color: theme.palette.primary.main, fontSize: 28 }}
                    />
                    <Chip
                      label={document.role}
                      size="small"
                      color="success"
                      sx={{ mb: 1, fontSize: "0.7rem", height: 20 }}
                    />
                  </Box>
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
                  {document.documentTitle}
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
                      created{" "}
                      {document.createdAt
                        ? formatDistanceToNow(new Date(document.createdAt), {
                            addSuffix: true,
                          })
                        : "No timestamp"}
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
                        {document.collaboratorCount} collaborator
                        {document.collaboratorCount !== 1 ? "s" : ""}
                      </Typography>
                    </Box>

                    {/* <AvatarGroup
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
                    </AvatarGroup> */}
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
                startIcon={
                  isCreatingDocument ? <CircularProgress size={20} /> : <Add />
                }
                onClick={handleCreateDocument}
                disabled={isCreatingDocument}
                size="large"
              >
                {isCreatingDocument
                  ? "Creating Document..."
                  : "Create New Document"}
              </Button>
            </Paper>
          )}
        </Box>
      </Container>
    </Box>
  );
}
