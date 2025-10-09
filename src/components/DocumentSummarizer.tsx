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
import axios from 'axios';

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

    
    const supportedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    const supportedExtensions = ['.txt', '.pdf', '.docx', '.doc'];
    
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    const isSupported = supportedTypes.includes(file.type) || supportedExtensions.includes(fileExtension);
    
    if (!isSupported) {
      setError('Unsupported file type. Please upload .txt, .pdf, .doc, or .docx files.');
      return;
    }

    
    setDocumentText('');
    setWordCount(0);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    setDocumentText(text);
    setWordCount(text.split(/\s+/).filter(word => word.length > 0).length);
    setError('');
  };

  const handleSummarizeUnified = async () => {
    
    const file = fileInputRef.current?.files?.[0];
    
    if (file) {
    
      await handlesummerizefile();
    } else if (documentText.trim()) {
    
      await handleSummarize();
    } else {
      setError('Please provide text to summarize or upload a file');
    }
  };

  const handleSummarize = async () => {
    if (!documentText.trim()) {
      setError('Please provide text to summarize');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/study-plans/summarize/text`,
        {
          text: documentText,
          Length: settings.summaryLength,
          focus: settings.focusArea,
          tone: settings.tone
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

     
      
      if (response.data && response.data.success && response.data.data && response.data.data.summary) {
        
        setSummary(response.data.data.summary);
      } else {
        console.log('Response structure:', response.data);
        setError(response.data?.message || 'Failed to generate summary');
      }
    } catch (error: any) {
      console.error('Summarization error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(`Network error: ${error.message}`);
      } else {
        setError('Failed to generate summary. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlesummerizefile = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError('Please select a file to summarize');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/study-plans/summarize/file?length=${settings.summaryLength}&focus=${settings.focusArea}&tone=${settings.tone}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (response.data && response.data.success && response.data.data && response.data.data.summary) {
        setSummary(response.data.data.summary);
        
        if (response.data.data.originalText) {
          setDocumentText(response.data.data.originalText);
          setWordCount(response.data.data.originalLength || 0);
        }
      } else {
        console.log('Full response:', response.data);
        setError(response.data?.message || 'Failed to generate summary');
      }
    } catch (error: any) {
      console.error('File summarization error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(`Network error: ${error.message}`);
      } else {
        setError('Failed to summarize file. Please try again.');
      }
    } finally {
      setLoading(false);
    }
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
    <Box sx={{ maxWidth: 1300, mx: 'auto', }}>
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
                  <Box sx={{ mt: 1 }}>
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
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" display="block" color="text.secondary">
                      File ready for summarization. Click "Generate Summary" to process.
                    </Typography>
                  </Box>
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
                disabled={loading || (!documentText.trim() && !fileInputRef.current?.files?.[0])}
                startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesome />}
                sx={{ mt: 3, width: '100%' }}
                onClick={handleSummarizeUnified}
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
                    <IconButton size="small" onClick={handleSummarizeUnified} title="Regenerate summary" disabled={loading}>
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
