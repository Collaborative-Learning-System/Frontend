import { useState, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  IconButton,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  alpha
} from '@mui/material';
import {
  CloudUpload,
  Clear,
  Description,
  AutoAwesome,
  FileCopy,
  Download,
  Refresh
} from '@mui/icons-material';

interface SummarySettings {
  summaryLength: 'short' | 'medium' | 'detailed';
  focusArea: 'general' | 'keypoints' | 'actionitems' | 'technical';
  tone: 'formal' | 'casual' | 'academic';
}

const DocumentSummarizer = () => {
  const theme = useTheme();
  const [documentText, setDocumentText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [settings, setSettings] = useState<SummarySettings>({
    summaryLength: 'medium',
    focusArea: 'general',
    tone: 'formal'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

  
    setUploadedFileName(file.name);
    setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setDocumentText(text);
      setWordCount(text.split(/\s+/).filter(word => word.length > 0).length);
    };

    if (file.type === 'text/plain') {
      reader.readAsText(file);
    } else {
      // For other file types, show message that text extraction is needed
      setError('PDF and Word document parsing requires backend integration. Please paste text manually or upload a .txt file.');
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    setDocumentText(text);
    setWordCount(text.split(/\s+/).filter(word => word.length > 0).length);
    setError('');
  };

  

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    // You could add a toast notification here
  };

  const downloadSummary = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary_${uploadedFileName || 'document'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setDocumentText('');
    setSummary('');
    setUploadedFileName('');
    setWordCount(0);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AutoAwesome color="primary" />
        Document Summarizer
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Upload a document or paste text to generate an AI-powered summary using Google Gemini
      </Typography>

      <Grid container spacing={3}>
        {/* Input Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Input Document
              </Typography>
              
              {/* File Upload */}
              <Box sx={{ mb: 3 }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ mb: 2, width: '100%' }}
                >
                  Upload Document
                </Button>
                
                {uploadedFileName && (
                  <Chip
                    label={uploadedFileName}
                    onDelete={() => {
                      setUploadedFileName('');
                      setDocumentText('');
                      setWordCount(0);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>

              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              {/* Text Input */}
              <TextField
                multiline
                rows={10}
                fullWidth
                placeholder="Paste your document text here..."
                value={documentText}
                onChange={handleTextChange}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Word count: {wordCount}
                </Typography>
                <Button
                  startIcon={<Clear />}
                  onClick={clearAll}
                  size="small"
                  color="secondary"
                >
                  Clear All
                </Button>
              </Box>

              {/* Summary Settings */}
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Summary Settings
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Length</InputLabel>
                    <Select
                      value={settings.summaryLength}
                      label="Length"
                      onChange={(e) => setSettings({...settings, summaryLength: e.target.value as any})}
                    >
                      <MenuItem value="short">Short</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="detailed">Detailed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Focus</InputLabel>
                    <Select
                      value={settings.focusArea}
                      label="Focus"
                      onChange={(e) => setSettings({...settings, focusArea: e.target.value as any})}
                    >
                      <MenuItem value="general">General</MenuItem>
                      <MenuItem value="keypoints">Key Points</MenuItem>
                      <MenuItem value="actionitems">Action Items</MenuItem>
                      <MenuItem value="technical">Technical</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Tone</InputLabel>
                    <Select
                      value={settings.tone}
                      label="Tone"
                      onChange={(e) => setSettings({...settings, tone: e.target.value as any})}
                    >
                      <MenuItem value="formal">Formal</MenuItem>
                      <MenuItem value="casual">Casual</MenuItem>
                      <MenuItem value="academic">Academic</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Button
                variant="contained"
                size="large"
                disabled={loading || !documentText.trim()}
                startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesome />}
                sx={{ mt: 3, width: '100%' }}
              >
                {loading ? 'Generating Summary...' : 'Generate Summary'}
              </Button>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Output Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Generated Summary
                </Typography>
                {summary && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" onClick={copyToClipboard} title="Copy to clipboard">
                      <FileCopy />
                    </IconButton>
                    <IconButton size="small" onClick={downloadSummary} title="Download summary">
                      <Download />
                    </IconButton>
                    <IconButton size="small" title="Regenerate summary">
                      <Refresh />
                    </IconButton>
                  </Box>
                )}
              </Box>

              {loading ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  py: 8,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 1
                }}>
                  <CircularProgress sx={{ mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    AI is analyzing your document...
                  </Typography>
                </Box>
              ) : summary ? (
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 3, 
                    minHeight: 400,
                    bgcolor: alpha(theme.palette.success.main, 0.02),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                  }}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.8
                    }}
                  >
                    {summary}
                  </Typography>
                </Paper>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  py: 8,
                  color: 'text.secondary'
                }}>
                  <Description sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
                  <Typography variant="body1" textAlign="center">
                    Your AI-generated summary will appear here
                  </Typography>
                  <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
                    Upload a document or paste text to get started
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DocumentSummarizer;
