import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  useTheme,
  alpha,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import {
  Save,
  Share,
  Download,
  MoreVert,
  Edit as EditIcon,
  Delete,
  PersonAdd,
} from "@mui/icons-material";
import EditorToolbar from "../components/RealTimeCollaboration/EditorToolbar";
import CollaboratorsList from "../components/RealTimeCollaboration/CollaboratorsList";
import { useLocation } from "react-router-dom";
import axios from "axios";

interface Collaborator {
  id: string;
  name: string;
  role: string;
}

export default function CollaborativeDocumentEditor() {
  const theme = useTheme();
  const location = useLocation();
  const { documentId, documentTitle, content, readOnly } = location.state || {};

  const [title, setTitle] = useState(documentTitle || "Untitled Document");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Share modal state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailList, setEmailList] = useState<string[]>([]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: content || `<p>Start typing your document here...</p>`,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      // Count words
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      setWordCount(words);

      // Auto-save logic (commented out for now)
      // if (handleSave) {
      //   setTimeout(() => {
      //     handleSave(editor.getJSON());
      //     setLastSaved(new Date());
      //   }, 1000);
      // }
    },
  });

  const fetchCollaborators = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL_WS
        }/collaborators/get-collaborators/${documentId}`
      );
      if (response) {
        console.log(response);
        setCollaborators(response.data.data.collaborators);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCollaborators();
  }, []);

  // Update editor content when the content prop changes
  useEffect(() => {
    if (editor && content !== undefined) {
      editor.commands.setContent(
        content || `<p>Start typing your document here...</p>`
      );
    }
  }, [editor, content]);

  const handleSaveDocument = () => {
    if (editor) {
      const currentContent = editor.getHTML();
      console.log("Saving document:", {
        documentId,
        title,
        content: currentContent,
      });
      setLastSaved(new Date());
      // Here you would implement actual save functionality
    }
  };

  const handleShareDocument = () => {
    setShareModalOpen(true);
  };

  const handleDownloadDocument = () => {
    if (editor) {
      const content = editor.getHTML();
      const blob = new Blob([content], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    // Additional title change logic can be added here
  };

  const handleSave = () => {
    handleSaveDocument();
  };

  // Email collaboration functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddEmail = () => {
    if (emailInput.trim() && validateEmail(emailInput.trim())) {
      if (!emailList.includes(emailInput.trim())) {
        setEmailList([...emailList, emailInput.trim()]);
        setEmailInput("");
      }
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmailList(emailList.filter((email) => email !== emailToRemove));
  };

  const handleShareWithEmails = async () => {
    console.log("Sharing document with emails:", emailList);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/notification/share-document/${documentId}`,
        { emails: emailList }
      );
      if (response.data.success) {
        console.log("Document shared successfully:", response.data);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setShareModalOpen(false);
      setEmailList([]);
      setEmailInput("");
    }
  };

  const formatLastSaved = (date: Date | null) => {
    if (!date) return "Never";
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  if (!editor) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 400,
        }}
      >
        <Typography>Loading editor...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          borderRadius: 0,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
        >
          <Stack direction="row" alignItems="center" gap={2} flex={1}>
            {isEditingTitle ? (
              <TextField
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
                variant="standard"
                autoFocus
                sx={{ fontSize: "1.25rem", fontWeight: "bold" }}
              />
            ) : (
              <Typography
                variant="h5"
                sx={{
                  cursor: readOnly ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  "&:hover": readOnly ? {} : { opacity: 0.7 },
                }}
                onClick={() => !readOnly && setIsEditingTitle(true)}
              >
                {title}
                {!readOnly && (
                  <EditIcon fontSize="small" sx={{ opacity: 0.5 }} />
                )}
              </Typography>
            )}

            <Stack direction="row" spacing={1}>
              {/* <Chip
                icon={readOnly ? <Visibility /> : <EditIcon />}
                label={readOnly ? "View Only" : "Editing"}
                size="small"
                color={readOnly ? "default" : "primary"}
                variant="outlined"
              /> */}
              <Chip
                label={`${wordCount} words`}
                size="small"
                variant="outlined"
              />
            </Stack>
          </Stack>

          <Stack direction="row" alignItems="center" gap={1}>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Last saved: {formatLastSaved(lastSaved)}
            </Typography>

            <Button
              startIcon={<Save />}
              onClick={handleSave}
              size="small"
              disabled={readOnly}
            >
              Save
            </Button>

            <Button
              startIcon={<Share />}
              onClick={handleShareDocument}
              size="small"
              variant="outlined"
            >
              Share
            </Button>

            <Button
              startIcon={<Download />}
              onClick={handleDownloadDocument}
              size="small"
              variant="outlined"
            >
              Export
            </Button>

            <IconButton>
              <MoreVert />
            </IconButton>
          </Stack>
        </Stack>
      </Paper>

      {/* Collaborators */}
      <CollaboratorsList
        collaborators={collaborators}
        currentUserId="current"
      />

      {/* Editor Toolbar */}
      {!readOnly && <EditorToolbar editor={editor} />}

      {/* Editor Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            //   minHeight: "100%",
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            mt: 1,
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              p: 3,
              "& .ProseMirror": {
                outline: "none",
                minHeight: "100%",
                fontSize: "16px",
                lineHeight: 1.7,
                color: theme.palette.text.primary,
                fontFamily: theme.typography.body1.fontFamily,
                "& p": {
                  margin: "0 0 1.2em 0",
                  minHeight: "1.5em",
                },
                "& h1": {
                  fontSize: "2.5em",
                  fontWeight: "bold",
                  margin: "2em 0 0.5em 0",
                  color: theme.palette.primary.main,
                  "&:first-child": { marginTop: 0 },
                },
                "& h2": {
                  fontSize: "2em",
                  fontWeight: "bold",
                  margin: "1.5em 0 0.5em 0",
                  color: theme.palette.primary.main,
                },
                "& h3": {
                  fontSize: "1.5em",
                  fontWeight: "bold",
                  margin: "1.2em 0 0.5em 0",
                  color: theme.palette.primary.main,
                },
                "& ul, & ol": {
                  paddingLeft: "2em",
                  margin: "0 0 1.2em 0",
                },
                "& li": {
                  margin: "0.3em 0",
                },
                "& blockquote": {
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  paddingLeft: "1.5em",
                  margin: "1.5em 0",
                  fontStyle: "italic",
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: "0 8px 8px 0",
                },
                "& pre": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  padding: "1.5em",
                  borderRadius: "8px",
                  overflow: "auto",
                  margin: "1.2em 0",
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                },
                "& code": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  padding: "0.2em 0.4em",
                  borderRadius: "4px",
                  fontSize: "0.9em",
                  fontFamily: "monospace",
                },
                "& a": {
                  color: theme.palette.primary.main,
                  textDecoration: "underline",
                  "&:hover": {
                    opacity: 0.8,
                  },
                },
                // Collaboration cursor styles
                "& .collaboration-cursor__caret": {
                  position: "relative",
                  marginLeft: "-1px",
                  marginRight: "-1px",
                  borderLeft: "2px solid",
                  borderRight: "2px solid",
                  wordBreak: "normal",
                  pointerEvents: "none",
                },
                "& .collaboration-cursor__label": {
                  position: "absolute",
                  top: "-1.8em",
                  left: "-1px",
                  fontSize: "12px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "normal",
                  userSelect: "none",
                  color: "white",
                  padding: "0.2rem 0.4rem",
                  borderRadius: "4px 4px 4px 0",
                  whiteSpace: "nowrap",
                  zIndex: 10,
                },
              },
            }}
          >
            <EditorContent editor={editor} />
          </Box>
        </Paper>
      </Box>

      {/* Share Modal */}
      <Dialog
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" gap={1}>
            <PersonAdd />
            <Typography variant="h6">Share Document</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            Add collaborators by entering their email addresses
          </Typography>

          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="flex-end">
              <TextField
                label="Email Address"
                variant="outlined"
                size="small"
                fullWidth
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddEmail()}
                error={
                  emailInput.trim() !== "" && !validateEmail(emailInput.trim())
                }
                helperText={
                  emailInput.trim() !== "" && !validateEmail(emailInput.trim())
                    ? "Please enter a valid email address"
                    : ""
                }
              />
              <Button
                variant="contained"
                onClick={handleAddEmail}
                disabled={
                  !emailInput.trim() ||
                  !validateEmail(emailInput.trim()) ||
                  emailList.includes(emailInput.trim())
                }
                size="small"
              >
                Add
              </Button>
            </Stack>

            {emailList.length > 0 && (
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, fontWeight: "medium" }}
                >
                  Collaborators to add ({emailList.length}):
                </Typography>
                <List dense>
                  {emailList.map((email, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderRadius: 1,
                        mb: 0.5,
                      }}
                    >
                      <ListItemText primary={email} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="remove"
                          onClick={() => handleRemoveEmail(email)}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareModalOpen(false)}>Cancel</Button>
          <Button
            onClick={handleShareWithEmails}
            variant="contained"
            disabled={emailList.length === 0}
          >
            Share Document
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
