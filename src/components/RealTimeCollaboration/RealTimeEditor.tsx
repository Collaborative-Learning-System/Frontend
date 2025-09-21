import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import {
  Box,
  Paper,
  useTheme,
  alpha
} from '@mui/material';

interface RealTimeEditorProps {
  documentId: string;
  userName: string;
  userColor: string;
  onContentChange?: (content: any) => void;
}

const RealTimeEditor: React.FC<RealTimeEditorProps> = ({ 
  documentId, 
  userName, 
  userColor,
  onContentChange 
}) => {
  const theme = useTheme();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: '<p>Start collaborating...</p>',
    onUpdate: ({ editor }) => {
      if (onContentChange) {
        onContentChange(editor.getJSON());
      }
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <Paper
      elevation={1}
      sx={{
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          '& .ProseMirror': {
            outline: 'none',
            minHeight: '100%',
            fontSize: '16px',
            lineHeight: 1.6,
            color: theme.palette.text.primary,
            '& p': {
              margin: '0 0 1em 0',
            },
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              margin: '1.5em 0 0.5em 0',
              color: theme.palette.primary.main,
            },
            '& ul, & ol': {
              paddingLeft: '2em',
              margin: '0 0 1em 0',
            },
            '& li': {
              margin: '0.2em 0',
            },
            '& blockquote': {
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              paddingLeft: '1em',
              margin: '0 0 1em 0',
              fontStyle: 'italic',
            },
            '& pre': {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              padding: '1em',
              borderRadius: '4px',
              overflow: 'auto',
              margin: '0 0 1em 0',
            },
            '& code': {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              padding: '0.2em 0.4em',
              borderRadius: '3px',
              fontSize: '0.9em',
            },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Paper>
  );
};

export default RealTimeEditor;
