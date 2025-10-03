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
  Divider,
  CircularProgress,
  Skeleton,
  Alert,
} from "@mui/material";
import { Add, Description, People, AccessTime } from "@mui/icons-material";
import ArticleIcon from "@mui/icons-material/Article";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { handleLogging } from "../../services/LoggingService";

interface Documents {
  documentId: string;
  documentTitle: string;
  createdAt: Date;
  ownerId: string;
  collaboratorCount: number;
}

interface RealTimeCollaborationProps {
  groupId?: string;
}

export default function RealTimeCollaboration({
  groupId,
}: RealTimeCollaborationProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { userId } = useContext(AppContext);
  const [isCreatingDocument, setIsCreatingDocument] = useState(false);
  const [documents, setDocuments] = useState<Documents[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [documentError, setDocumentError] = useState<string | null>(null);

  useEffect(() => {
    // Clear previous data immediately when groupId changes
    setDocuments([]);
    setDocumentError(null);
    fetchDocuments();
  }, [groupId]);

  const fetchDocuments = async () => {
    setIsLoadingDocuments(true);
    setDocumentError(null);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL_WS
        }/documents/get-documents/${groupId}`
      );
      setDocuments(response.data.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocumentError("Failed to load documents. Please try again.");
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  const handleCreateDocument = async () => {
    if (isCreatingDocument) return;

    setIsCreatingDocument(true);
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL_WS
        }/documents/create-document/${groupId}`,
        { userId: userId }
      );
      handleLogging("Created a new collaborative document")
      const newDocId = response.data.document.docId;
      const docData = {
        documentId: newDocId,
        groupId: groupId,
      }
      navigate(`/documents/${newDocId}`, { state: docData });
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreatingDocument(false);
    }
  };

  const handleRetryFetchDocuments = () => {
    fetchDocuments();
  };

  const handleSelectDocument = async (docId: string) => {
    const selectedDoc = documents.find((doc) => doc.documentId === docId);
    if (!selectedDoc) return;

    // Check owner for THIS document
    const isOwner = selectedDoc.ownerId === userId;

    if (!isOwner) {
      try {
        await axios.post(
          `${
            import.meta.env.VITE_BACKEND_URL_WS
          }/collaborators/add-collaborator/${docId}`,
          { userId }
        );
      } catch (error) {
        console.error("Failed to add collaborator", error);
      }
    }
    handleLogging(`Joined with collaborative document: ${selectedDoc.documentTitle}`)
    // Navigate to editor
    const docData = {
      documentId: selectedDoc?.documentId,
      groupId: groupId,
    };
    navigate(`/documents/${docId}`, { state: docData });
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ArticleIcon
              sx={{
                color: theme.palette.primary.main,
                fontSize: { xs: 28, sm: 32 },
              }}
            />
            <Typography variant={"h4"} component="h2" fontWeight="bold">
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
        {documentError ? (
          /* Error State */
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              bgcolor: alpha(theme.palette.error.main, 0.05),
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
            }}
          >
            <Alert severity="error" sx={{ mb: 2 }}>
              {documentError}
            </Alert>
            <Button
              variant="contained"
              onClick={handleRetryFetchDocuments}
              color="primary"
            >
              Retry
            </Button>
          </Paper>
        ) : isLoadingDocuments ? (
          /* Loading State */
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
            {[...Array(6)].map((_, index) => (
              <Card
                key={index}
                sx={{
                  height: 200,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{ mb: 2 }}
                  >
                    <Skeleton variant="circular" width={28} height={28} />
                    <Skeleton variant="text" width="60%" height={24} />
                  </Stack>
                  <Skeleton
                    variant="text"
                    width="100%"
                    height={32}
                    sx={{ mb: 2 }}
                  />
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 1 }}
                  >
                    <Skeleton variant="circular" width={16} height={16} />
                    <Skeleton variant="text" width="70%" height={16} />
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Skeleton variant="circular" width={16} height={16} />
                    <Skeleton variant="text" width="50%" height={16} />
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          /* Documents Content */
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
                      {/* <Chip
                          label={document.ownerId}
                          size="small"
                          color="success"
                          sx={{ mb: 1, fontSize: "0.7rem", height: 20 }}
                        /> */}
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
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <People
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {document.collaboratorCount} collaborator
                          {document.collaboratorCount !== 1 ? "s" : ""}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            ))}

            {/* Empty State */}
            {documents.length === 0 && !isLoadingDocuments && (
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
              </Paper>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
}
