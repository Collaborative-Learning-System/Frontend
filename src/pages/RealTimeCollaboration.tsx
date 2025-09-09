import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Chip,
  Stack,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  useTheme,
  alpha,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Save,
  Share,
  People,
  Download,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  Undo,
  Redo,
  MoreVert,
  Add,
  Circle,
} from '@mui/icons-material';

// Mock data for demonstration
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', avatar: 'JD', color: '#1976d2', isOnline: true },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatar: 'JS', color: '#388e3c', isOnline: true },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', avatar: 'BJ', color: '#f57c00', isOnline: false },
];

const mockDocuments = [
  { id: 1, title: 'Project Proposal', lastModified: '2 minutes ago', collaborators: 3 },
];

interface Cursor {
  id: number;
  name: string;
  color: string;
  position: number;
}

const RealTimeCollaboration = () => {
  const theme = useTheme();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [documentContent, setDocumentContent] = useState('');
  const [currentDocument, setCurrentDocument] = useState(mockDocuments[0]);
  const [connectedUsers, setConnectedUsers] = useState(mockUsers.filter(u => u.isOnline));
  const [cursors, setCursors] = useState<Cursor[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [shareMenuAnchor, setShareMenuAnchor] = useState<null | HTMLElement>(null);
  const [formatMenuAnchor, setFormatMenuAnchor] = useState<null | HTMLElement>(null);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [documentTitle, setDocumentTitle] = useState(currentDocument.title);


  // Initialize with some sample content
  useEffect(() => {
    setDocumentContent(`# ${currentDocument.title}
Welcome to the collaborative document editor! This is where multiple users can work together in real-time.

## Features:
- Real-time collaborative editing
- Live cursor tracking
- Document versioning
- User presence indicators
- Auto-save functionality

## Getting Started:
1. Start typing to see real-time collaboration in action
2. Share the document with other users
3. See live cursors and edits from other collaborators
4. All changes are automatically saved
`);
  }, [currentDocument]);

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = event.target.value;
    const cursorPosition = event.target.selectionStart;
    
    setDocumentContent(newContent);
    setIsEditing(true);
    
    // Simulate sending cursor position to other users
    // In a real implementation, this would be sent via WebSocket
    console.log('Cursor position:', cursorPosition);
    
    // Auto-save simulation
    setTimeout(() => {
      setIsEditing(false);
      setLastSaved(new Date());
    }, 1500);
  };

  const handleSave = () => {
    setLastSaved(new Date());
    setIsEditing(false);
    // Implement save logic
    console.log('Document saved');
  };

  const handleShare = (event: React.MouseEvent<HTMLElement>) => {
    setShareMenuAnchor(event.currentTarget);
  };


  const formatText = (type: string) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = documentContent.substring(start, end);
    
    let formattedText = selectedText;
    switch (type) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      default:
        break;
    }

    const newContent = documentContent.substring(0, start) + formattedText + documentContent.substring(end);
    setDocumentContent(newContent);
    setFormatMenuAnchor(null);
  };

  const addCollaborator = () => {
    // Simulate adding a new collaborator
    const offlineUsers = mockUsers.filter(u => !u.isOnline);
    if (offlineUsers.length > 0) {
      const newUser = offlineUsers[0];
      setConnectedUsers(prev => [...prev, { ...newUser, isOnline: true }]);
      setCursors(prev => [...prev, {
        id: newUser.id,
        name: newUser.name,
        color: newUser.color,
        position: Math.floor(Math.random() * documentContent.length)
      }]);
    }
  };
  return (
    <Box sx={{ p: 3, maxWidth: '100%', mx: 'auto' }}>
      {/* Header */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              {documentTitle}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                {isEditing ? 'Editing...' : `Last saved: ${lastSaved.toLocaleTimeString()}`}
              </Typography>
              {isEditing && (
                <Chip
                  label="Saving..."
                  size="small"
                  color="primary"
                  sx={{ fontSize: '0.7rem' }}
                />
              )}
            </Stack>
          </Box>
          
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={!isEditing}
            >
              Save
            </Button>
            <Button
              variant="contained"
              startIcon={<Share />}
              onClick={handleShare}
            >
              Share
            </Button>
            <IconButton onClick={() => setShowDocumentDialog(true)}>
              <MoreVert />
            </IconButton>
          </Stack>
        </Stack>
      </Paper>

      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
        {/* Main Editor */}
        <Box sx={{ flex: 1 }}>
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            {/* Toolbar */}
            <Box sx={{ 
              p: 1, 
              borderBottom: 1, 
              borderColor: 'divider',
              bgcolor: alpha(theme.palette.primary.main, 0.05)
            }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip title="Bold">
                  <IconButton size="small" onClick={() => formatText('bold')}>
                    <FormatBold />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Italic">
                  <IconButton size="small" onClick={() => formatText('italic')}>
                    <FormatItalic />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Underline">
                  <IconButton size="small" onClick={() => formatText('underline')}>
                    <FormatUnderlined />
                  </IconButton>
                </Tooltip>
                <Divider orientation="vertical" flexItem />
                <Tooltip title="Bullet List">
                  <IconButton size="small">
                    <FormatListBulleted />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Numbered List">
                  <IconButton size="small">
                    <FormatListNumbered />
                  </IconButton>
                </Tooltip>
                <Divider orientation="vertical" flexItem />
                <Tooltip title="Undo">
                  <IconButton size="small">
                    <Undo />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Redo">
                  <IconButton size="small">
                    <Redo />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>

            {/* Editor Area */}
            <Box sx={{ position: 'relative' }}>
              <TextField
             //   ref={editorRef}
                multiline
                fullWidth
                value={documentContent}
                onChange={handleContentChange}
                placeholder="Start typing your document..."
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { border: 'none' },
                  },
                  '& .MuiInputBase-input': {
                    minHeight: '400px',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    lineHeight: 1.5,
                  }
                }}
              />
              
              {/* Live Cursors */}
              {cursors.map(cursor => (
                <Box
                  key={cursor.id}
                  sx={{
                    position: 'absolute',
                    top: Math.floor(cursor.position / 80) * 21 + 16, // Approximate line height
                    left: (cursor.position % 80) * 8.5 + 14, // Approximate character width
                    zIndex: 10,
                  }}
                >
                  <Box
                    sx={{
                      width: 2,
                      height: 20,
                      bgcolor: cursor.color,
                      animation: 'blink 1s infinite',
                    }}
                  />
                  <Chip
                    label={cursor.name}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -30,
                      left: -10,
                      bgcolor: cursor.color,
                      color: 'white',
                      fontSize: '0.7rem',
                      height: 20,
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Sidebar */}
        <Box sx={{ width: { xs: '100%', lg: 300 } }}>
          {/* Connected Users */}
          <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <People />
                Collaborators ({connectedUsers.length})
              </Typography>
              <IconButton size="small" onClick={addCollaborator}>
                <Add />
              </IconButton>
            </Stack>
            
            <Stack spacing={1}>
              {connectedUsers.map(user => (
                <Stack key={user.id} direction="row" alignItems="center" spacing={2}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Circle sx={{ color: '#4caf50', fontSize: 12 }} />
                    }
                  >
                    <Avatar 
                      sx={{ 
                        bgcolor: user.color, 
                        width: 32, 
                        height: 32,
                        fontSize: '0.8rem'
                      }}
                    >
                      {user.avatar}
                    </Avatar>
                  </Badge>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {user.email}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Paper>

          {/* Document History */}
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Documents
            </Typography>
            <Stack spacing={1}>
              {mockDocuments.map(doc => (
                <Box
                  key={doc.id}
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    cursor: 'pointer',
                    bgcolor: doc.id === currentDocument.id ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                    }
                  }}
                  onClick={() => setCurrentDocument(doc)}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {doc.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {doc.lastModified} • {doc.collaborators} collaborators
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Box>
      </Stack>

      {/* Share Menu */}
      <Menu
        anchorEl={shareMenuAnchor}
        open={Boolean(shareMenuAnchor)}
        onClose={() => setShareMenuAnchor(null)}
      >
        <MenuItem onClick={() => setShareMenuAnchor(null)}>
          <ListItemIcon><Share /></ListItemIcon>
          <ListItemText>Share via link</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setShareMenuAnchor(null)}>
          <ListItemIcon><People /></ListItemIcon>
          <ListItemText>Invite collaborators</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setShareMenuAnchor(null)}>
          <ListItemIcon><Download /></ListItemIcon>
          <ListItemText>Export document</ListItemText>
        </MenuItem>
      </Menu>

      {/* Document Settings Dialog */}
      <Dialog open={showDocumentDialog} onClose={() => setShowDocumentDialog(false)}>
        <DialogTitle>Document Settings</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Document Title"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <FormControl fullWidth>
            <InputLabel>Access Level</InputLabel>
            <Select value="edit" label="Access Level">
              <MenuItem value="view">View Only</MenuItem>
              <MenuItem value="comment">Can Comment</MenuItem>
              <MenuItem value="edit">Can Edit</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDocumentDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setShowDocumentDialog(false)}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* CSS for cursor animation */}
      <style>
        {`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}
      </style>
    </Box>
  );
};

export default RealTimeCollaboration;
