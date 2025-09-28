import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import {
  Box,
  ButtonGroup,
  IconButton,
  Tooltip,
  Divider,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  alpha,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatStrikethrough,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Code,
  Undo,
  Redo,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  Link,
  LinkOff,
  Highlight,
  FormatColorText,
} from '@mui/icons-material';

interface EditorToolbarProps {
  editor: Editor | null;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  const theme = useTheme();
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [colorAnchorEl, setColorAnchorEl] = useState<null | HTMLElement>(null);

  if (!editor) {
    return null;
  }

  const handleAddLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setLinkDialogOpen(false);
    }
  };

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const colors = [
    '#000000', '#333333', '#666666', '#999999', '#cccccc',
    '#ff0000', '#ff6600', '#ffcc00', '#33cc33', '#0066cc',
    '#6600cc', '#cc0066', '#ff3366', '#33ccff', '#66ff66'
  ];

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 1,
          p: 1,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          minHeight: '56px',
        }}
      >
        {/* Heading Selector */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={
              editor.isActive('heading', { level: 1 }) ? 'h1' :
              editor.isActive('heading', { level: 2 }) ? 'h2' :
              editor.isActive('heading', { level: 3 }) ? 'h3' :
              'paragraph'
            }
            onChange={(e) => {
              if (e.target.value === 'paragraph') {
                editor.chain().focus().setParagraph().run();
              } else {
                const level = parseInt(e.target.value.replace('h', ''));
                editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run();
              }
            }}
            displayEmpty
          >
            <MenuItem value="paragraph">Paragraph</MenuItem>
            <MenuItem value="h1">Heading 1</MenuItem>
            <MenuItem value="h2">Heading 2</MenuItem>
            <MenuItem value="h3">Heading 3</MenuItem>
          </Select>
        </FormControl>

        <Divider orientation="vertical" flexItem />

        {/* Text Formatting */}
        <ButtonGroup>
          <Tooltip title="Bold">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleBold().run()}
              color={editor.isActive('bold') ? 'primary' : 'default'}
            >
              <FormatBold />
            </IconButton>
          </Tooltip>
          <Tooltip title="Italic">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              color={editor.isActive('italic') ? 'primary' : 'default'}
            >
              <FormatItalic />
            </IconButton>
          </Tooltip>
          <Tooltip title="Underline">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              color={editor.isActive('underline') ? 'primary' : 'default'}
            >
              <FormatUnderlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="Strikethrough">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              color={editor.isActive('strike') ? 'primary' : 'default'}
            >
              <FormatStrikethrough />
            </IconButton>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem />

        {/* Text Color */}
        <Tooltip title="Text Color">
          <IconButton
            size="small"
            onClick={(e) => setColorAnchorEl(e.currentTarget)}
          >
            <FormatColorText />
          </IconButton>
        </Tooltip>

        <Tooltip title="Highlight">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleHighlight({ color: '#ffff00' }).run()}
            color={editor.isActive('highlight') ? 'primary' : 'default'}
          >
            <Highlight />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        {/* Lists */}
        <ButtonGroup>
          <Tooltip title="Bullet List">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              color={editor.isActive('bulletList') ? 'primary' : 'default'}
            >
              <FormatListBulleted />
            </IconButton>
          </Tooltip>
          <Tooltip title="Numbered List">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              color={editor.isActive('orderedList') ? 'primary' : 'default'}
            >
              <FormatListNumbered />
            </IconButton>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem />

        {/* Text Alignment */}
        <ToggleButtonGroup
          size="small"
          exclusive
          value={
            editor.isActive({ textAlign: 'left' }) ? 'left' :
            editor.isActive({ textAlign: 'center' }) ? 'center' :
            editor.isActive({ textAlign: 'right' }) ? 'right' :
            editor.isActive({ textAlign: 'justify' }) ? 'justify' :
            'left'
          }
          onChange={(_, value) => {
            if (value) {
              editor.chain().focus().setTextAlign(value).run();
            }
          }}
        >
          <ToggleButton value="left">
            <FormatAlignLeft />
          </ToggleButton>
          <ToggleButton value="center">
            <FormatAlignCenter />
          </ToggleButton>
          <ToggleButton value="right">
            <FormatAlignRight />
          </ToggleButton>
          <ToggleButton value="justify">
            <FormatAlignJustify />
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem />

        {/* Other Formatting */}
        <ButtonGroup>
          <Tooltip title="Quote">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              color={editor.isActive('blockquote') ? 'primary' : 'default'}
            >
              <FormatQuote />
            </IconButton>
          </Tooltip>
          <Tooltip title="Code Block">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              color={editor.isActive('codeBlock') ? 'primary' : 'default'}
            >
              <Code />
            </IconButton>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem />

        {/* Links */}
        <ButtonGroup>
          <Tooltip title="Add Link">
            <IconButton
              size="small"
              onClick={() => setLinkDialogOpen(true)}
            >
              <Link />
            </IconButton>
          </Tooltip>
          <Tooltip title="Remove Link">
            <IconButton
              size="small"
              onClick={handleRemoveLink}
              disabled={!editor.isActive('link')}
            >
              <LinkOff />
            </IconButton>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem />

        {/* Undo/Redo */}
        <ButtonGroup>
          <Tooltip title="Undo">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <Undo />
            </IconButton>
          </Tooltip>
          <Tooltip title="Redo">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <Redo />
            </IconButton>
          </Tooltip>
        </ButtonGroup>
      </Box>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Link</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="URL"
            fullWidth
            variant="outlined"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddLink} variant="contained">Add Link</Button>
        </DialogActions>
      </Dialog>

      {/* Color Picker Menu */}
      <Dialog 
        open={Boolean(colorAnchorEl)} 
        onClose={() => setColorAnchorEl(null)}
        maxWidth="xs"
      >
        <DialogTitle>Choose Text Color</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 1 }}>
            {colors.map((color) => (
              <Box
                key={color}
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: color,
                  border: `2px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
                onClick={() => {
                  editor.chain().focus().setColor(color).run();
                  setColorAnchorEl(null);
                }}
              />
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditorToolbar;
