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
  Tabs,
  Tab,

} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  History as HistoryIcon,
  Leaderboard as LeaderboardIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  EmojiEvents as AwardIcon,
} from '@mui/icons-material';
import { QuizAttemptService } from '../services/QuizAttemptService';
import type { UserAttempts, LeaderboardEntry } from '../services/QuizAttemptService';

interface QuizResultsProps {
  quizId: string;
  quizTitle: string;
  userId: string;
  onBack: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`quiz-results-tabpanel-${index}`}
      aria-labelledby={`quiz-results-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const QuizResults: React.FC<QuizResultsProps> = ({ 
  quizId, 
  quizTitle, 
  userId, 
  onBack 
}) => {

  const [tabValue, setTabValue] = useState(0);
  const [userAttempts, setUserAttempts] = useState<UserAttempts | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [quizId, userId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [attemptsData, leaderboardData] = await Promise.all([
        QuizAttemptService.getUserQuizAttempts(userId, quizId),
        QuizAttemptService.getQuizLeaderboard(quizId),
      ]);

      setUserAttempts(attemptsData);
      setLeaderboard(leaderboardData);
    } catch (err: any) {
      console.error('Failed to fetch quiz results:', err);
      setError(err.message || 'Failed to load quiz results');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 70) return 'warning';
    return 'error';
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <TrophyIcon sx={{ color: '#FFD700' }} />;
      case 2:
        return <AwardIcon sx={{ color: '#C0C0C0' }} />;
      case 3:
        return <AwardIcon sx={{ color: '#CD7F32' }} />;
      default:
        return <span>{rank}</span>;
    }
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

      {/* Tabs */}
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            bgcolor: 'grey.50',
            '& .MuiTab-root': {
              fontWeight: 'medium',
              textTransform: 'none',
            },
          }}
        >
          <Tab
            icon={<HistoryIcon />}
            iconPosition="start"
            label="My Attempts"
            id="quiz-results-tab-0"
            aria-controls="quiz-results-tabpanel-0"
          />
          <Tab
            icon={<LeaderboardIcon />}
            iconPosition="start"
            label="Leaderboard"
            id="quiz-results-tab-1"
            aria-controls="quiz-results-tabpanel-1"
          />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {/* User Attempts */}
          {userAttempts && userAttempts.attempts.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Attempt</strong></TableCell>
                    <TableCell><strong>Score</strong></TableCell>
                    <TableCell><strong>Percentage</strong></TableCell>
                    <TableCell><strong>Time Taken</strong></TableCell>
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
                          {attempt.score}/{attempt.totalQuestions}
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
                        <Typography variant="body2">
                          {formatTime(attempt.timeTaken)}
                        </Typography>
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
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Leaderboard */}
          {leaderboard.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Rank</strong></TableCell>
                    <TableCell><strong>User</strong></TableCell>
                    <TableCell><strong>Score</strong></TableCell>
                    <TableCell><strong>Percentage</strong></TableCell>
                    <TableCell><strong>Time</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaderboard.map((entry) => (
                    <TableRow 
                      key={`${entry.userId}-${entry.completedAt}`} 
                      hover
                      sx={{
                        bgcolor: entry.userId === userId ? 'primary.50' : 'inherit',
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getRankIcon(entry.rank)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          fontWeight={entry.userId === userId ? 'bold' : 'normal'}
                        >
                          {entry.userName}
                          {entry.userId === userId && (
                            <Chip 
                              label="You" 
                              size="small" 
                              color="primary" 
                              sx={{ ml: 1 }} 
                            />
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {entry.score}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${Math.round(entry.percentage)}%`}
                          color={getScoreColor(entry.percentage) as any}
                          size="small"
                          variant={entry.userId === userId ? 'filled' : 'outlined'}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatTime(entry.timeTaken)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(entry.completedAt)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <LeaderboardIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No results yet
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Complete the quiz to see the leaderboard
              </Typography>
            </Box>
          )}
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default QuizResults;
