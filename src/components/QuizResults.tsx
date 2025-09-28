import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Container,
  Stack,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,

} from '@mui/material';
import {
  History as HistoryIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { QuizAttemptService } from '../services/QuizAttemptService';
import type { UserAttempts } from '../services/QuizAttemptService';

interface QuizResultsProps {
  quizId: string;
  quizTitle: string;
  userId: string;
  onBack: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ 
  quizId, 
  quizTitle, 
  userId, 
  onBack 
}) => {

  const [userAttempts, setUserAttempts] = useState<UserAttempts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [quizId, userId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const attemptsData = await QuizAttemptService.getUserQuizAttempts(userId, quizId);
      setUserAttempts(attemptsData);
    } catch (err: any) {
      console.error('Failed to fetch quiz results:', err);
      setError(err.message || 'Failed to load quiz results');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 70) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert 
          severity="error"
          action={
            <Button onClick={fetchData} size="small">
              <RefreshIcon sx={{ mr: 1 }} />
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Quiz Results
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              {quizTitle}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.5)',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Back
          </Button>
        </Box>
      </Paper>

      {/* Summary Cards */}
      {userAttempts && (
        <Box sx={{ mb: 3 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Card sx={{ flex: 1 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary.main" fontWeight="bold">
                  {userAttempts.totalAttempts}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Total Attempts
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="success.main" fontWeight="bold">
                  {userAttempts.bestScore}%
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Best Score
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="warning.main" fontWeight="bold">
                  {Math.round(userAttempts.averageScore)}%
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Average Score
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      )}

      {/* My Attempts */}
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon color="primary" />
            <Typography variant="h6" fontWeight="medium">
              My Quiz Attempts
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 0 }}>
          {userAttempts && userAttempts.attempts.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Attempt</strong></TableCell>
                    <TableCell><strong>Score</strong></TableCell>
                    <TableCell><strong>Percentage</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userAttempts.attempts.map((attempt, index) => (
                    <TableRow key={attempt.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          #{userAttempts.attempts.length - index}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {attempt.score}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${Math.round(attempt.percentage)}%`}
                          color={getScoreColor(attempt.percentage) as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(attempt.completedAt)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <HistoryIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No attempts yet
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Take the quiz to see your results here
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default QuizResults;
