import { useState, useEffect, useContext, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";
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
  ArrowBack,
} from "@mui/icons-material";
import EditorToolbar from "./EditorToolbar";
import CollaboratorsList from "./CollaboratorsList";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { socket } from "../../WebSocket";

interface Collaborator {
  id: string;
  name: string;
  role: string;
}

interface GroupMembers {
  id: string;
  fullname: string;
  email: string;
}

export default function CollaborativeDocumentEditor() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useContext(AppContext);
  const documentId = location.state?.documentId;
  const docId = useParams().docId || documentId;
  const groupId = location.state?.groupId;

  const [documentData, setDocumentData] = useState<any>(null);
  const [title, setTitle] = useState(
    documentData?.title || "Untitled Document"
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [groupMembers, setGroupMembers] = useState<GroupMembers[]>([]);

  // Share modal state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [emailList, setEmailList] = useState<string[]>([]);

  const ydocRef = useRef<Y.Doc>(new Y.Doc());
  if (!ydocRef.current) {
    ydocRef.current = new Y.Doc();
  }
  const ydoc = ydocRef.current;

  if (!docId) {
    navigate("/workspace");
    return null;
  }

  // -- SOCKET.IO CONNECTION -- //
  useEffect(() => {
    if (!userId || !docId) {
      return;
    }

    // Connect to socket server
    socket.on("connect", () => {
      // join a document
      socket.emit("joinDoc", { docId: docId, userId: userId });
    });

    // Listen for initialDoc send by the server when user join a document
    socket.on("initDoc", (data: { update: Uint8Array }) => {
      console.log("Received initial document from server");
      if (data.update) {
        Y.applyUpdate(ydoc, new Uint8Array(data.update));
      }
    });

    socket.on("syncUpdate", (data: { content: Uint8Array }) => {
      console.log("Received update from server");
      if (data.content) {
        Y.applyUpdate(ydoc, new Uint8Array(data.content));
      }
    });

    return () => {
      socket.off("connect");
      socket.off("initDoc");
      socket.off("syncUpdate");
    };
  }, [docId, userId]);

  // --- SEND LOCAL YJS UPDATES TO SERVER --- //
  useEffect(() => {
    if (!userId || !docId) {
      return;
    }
    const updateHandler = (update: Uint8Array) => {
      socket.emit("syncUpdate", {
        docId: docId,
        content: update,
        userId: userId,
      });
    };
    ydoc.on("update", updateHandler);

    return () => {
      ydoc.off("update", updateHandler);
    };
  }, [ydoc, docId, userId]);

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
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider: { awareness: new Awareness(ydoc) },
        user: {
          userId: userId,
          name: "User " + userId,
          color: "#" + Math.floor(Math.random() * 16777215).toString(16),
        },
      }),
    ],
    editable: true,
    onUpdate: ({ editor }) => {
      // Count words
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      setWordCount(words);
    },
  });

  // --Fetch Collaborators and Doc data -- //
  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL_WS
          }/collaborators/get-collaborators/${docId}`
        );

        setCollaborators(response.data.data.collaborators);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchDocData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL_WS
          }/documents/get-document-data/${docId}`
        );
        setDocumentData(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchGroupMembers = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/workspaces/get-group-members/${groupId}`
        );
        setGroupMembers(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDocData();
    fetchCollaborators();
    fetchGroupMembers();
  }, [docId]);

  const handleSaveDocument = () => {};

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
  };

  const handleSave = () => {
    handleSaveDocument();
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setGroupMembers(
      groupMembers.filter((member) => member.email !== emailToRemove)
    );
  };

  const handleShareWithEmails = async () => {
    try {
      const newEmails = groupMembers
        .map((member) => member.email)
        .filter((email) => !emailList.includes(email));
      await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/notification/share-document/${docId}`,
        { emails: newEmails }
      );
    } catch (error) {
      console.error(error);
    } finally {
      setShareModalOpen(false);
      setEmailList([]);
    }
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
    <Box
      sx={{ height: "100%", display: "flex", flexDirection: "column", p: 1 }}
    >
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
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  "&:hover": { opacity: 0.7 },
                }}
                onClick={() => setIsEditingTitle(true)}
              >
                {title}

                <EditIcon fontSize="small" sx={{ opacity: 0.5 }} />
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
            {/* <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Last saved: {formatLastSaved(lastSaved)}
            </Typography> */}

            <Button startIcon={<Save />} onClick={handleSave} size="small">
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
      <CollaboratorsList collaborators={collaborators} currentUserId={userId} />

      {/* Editor Toolbar */}
      <EditorToolbar editor={editor} />

      {/* Editor Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minHeight: "100vh",
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
                  "&:first-of-type": { marginTop: 0 },
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
            Share with group members
          </Typography>

          <Stack spacing={2}>
            {groupMembers.length > 0 && (
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, fontWeight: "medium" }}
                >
                  Collaborators ({groupMembers.length}):
                </Typography>
                <List dense>
                  {groupMembers.map((member, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderRadius: 1,
                        mb: 0.5,
                      }}
                    >
                      <ListItemText primary={member.email} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="remove"
                          onClick={() => handleRemoveEmail(member.email)}
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
            disabled={groupMembers.length === 0}
          >
            Share Document
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Back Button */}
      <IconButton
        onClick={() => navigate(-1)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          backgroundColor: theme.palette.primary.main,
          color: "white",
          boxShadow: theme.shadows[6],
          zIndex: 1000,
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: theme.palette.primary.dark,
            transform: "scale(1.1)",
            boxShadow: theme.shadows[12],
          },
          "&:active": {
            transform: "scale(0.95)",
          },
        }}
      >
        <ArrowBack />
      </IconButton>
    </Box>
  );
}
