import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Fade,
  useTheme,
  useMediaQuery,
  IconButton,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,

} from "@mui/material";
import {
  AccessTime as TimeIcon,
  ArrowBack as ArrowBackIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Check as CheckIcon,
  Quiz as QuizIcon,
  Warning as WarningIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import QuizResults from "./QuizResults";
import { QuizAttemptService } from "../services/QuizAttemptService";
import type { 
  QuizDetails, 
  Question, 
  QuizAttemptResponse, 
  QuizCompletionResponse,
  AnswerSubmission
} from "../services/QuizAttemptService";

interface QuizTakerProps {
  quizId: string;
  onComplete: (results: QuizCompletionResponse) => void;
  onBack: () => void;
}

interface UserAnswer {
  questionId: string;
  answer: string; 
  selectedOptionId?: string; 
  saved: boolean;
}

const QuizTakerNew: React.FC<QuizTakerProps> = ({ quizId, onComplete, onBack }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


  const [quiz, setQuiz] = useState<QuizDetails | null>(null);
  const [attempt, setAttempt] = useState<QuizAttemptResponse | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState<QuizCompletionResponse | null>(null);
  const [showDetailedResults, setShowDetailedResults] = useState(false);

  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autoSaveEnabled] = useState(true);

  
  const initializingRef = useRef<boolean>(false);
  const initializedRef = useRef<boolean>(false);

 
  useEffect(() => {
    initializeQuiz();
  }, [quizId]);

 
  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted && attempt) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && attempt && !quizCompleted) {
      handleAutoSubmit();
    }
  }, [timeLeft, quizCompleted, attempt]);

  
  useEffect(() => {
    if (timeLeft <= 300 && timeLeft > 0 && !showWarning) {
      setShowWarning(true);
    }
  }, [timeLeft, showWarning]);

  
  useEffect(() => {
    if (autoSaveEnabled && attempt) {
      const interval = setInterval(() => {
        saveCurrentAnswer();
      }, 30000); 

      return () => clearInterval(interval);
    }
  }, [autoSaveEnabled, attempt, currentQuestion]);

  const initializeQuiz = async () => {
    
    if (initializingRef.current || initializedRef.current) {
      console.log('Quiz initialization already in progress or completed - skipping');
      return;
    }

    try {
      initializingRef.current = true;
      setLoading(true);
      setError(null);

      
      if (!quizId || quizId === 'undefined' || quizId.trim() === '') {
        throw new Error(`Quiz ID is required. Received: ${quizId} (type: ${typeof quizId})`);
      }

      
      const quizDetails = await QuizAttemptService.getQuizDetails(quizId);
      
      
      if (!quizDetails || !quizDetails.questions || !Array.isArray(quizDetails.questions)) {
        throw new Error('Invalid quiz data: missing questions');
      }
      
      setQuiz(quizDetails);

     
      const initialAnswers: UserAnswer[] = quizDetails.questions.map(q => ({
        questionId: q.id,
        answer: '',
        saved: false
      }));
      setUserAnswers(initialAnswers);

    
      const attemptResponse = await QuizAttemptService.startQuizAttempt(quizId);
      
      setAttempt(attemptResponse);

    
      setTimeLeft(quizDetails.timeLimit * 60);

      setLoading(false);
      initializedRef.current = true;
      
    } catch (err: any) {
      console.error('Failed to initialize quiz:', err);
      setError(err.message || 'Failed to load quiz');
      setLoading(false);
    } finally {
      initializingRef.current = false;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeColor = () => {
    if (timeLeft <= 300) return "error";
    if (timeLeft <= 600) return "warning";
    return "primary";
  };

  const handleAnswerChange = (answer: string, optionId?: string) => {
    const updatedAnswers = [...userAnswers];
    const questionIndex = updatedAnswers.findIndex(
      a => a.questionId === quiz?.questions[currentQuestion]?.id
    );

    if (questionIndex !== -1) {
      updatedAnswers[questionIndex] = {
        ...updatedAnswers[questionIndex],
        answer,
        selectedOptionId: optionId, 
        saved: false
      };
      setUserAnswers(updatedAnswers);
    }
  };

  const saveCurrentAnswer = useCallback(async () => {
    if (!attempt || !quiz || saving) return;

   

    const currentAnswer = userAnswers.find(
      a => a.questionId === quiz.questions[currentQuestion]?.id
    );

    if (!currentAnswer || currentAnswer.saved || !currentAnswer.answer.trim()) {
      return;
    }

    try {
      setSaving(true);
      
      
      const actualAttemptId = attempt.attemptId || (attempt as any).id;
      if (!actualAttemptId) {
        
        throw new Error('Attempt ID is missing. Please restart the quiz.');
      }

      const answerData: AnswerSubmission = {
        attemptId: actualAttemptId,
        questionId: currentAnswer.questionId
      };

      
      const currentQuestion_obj = quiz.questions[currentQuestion];
      
      
      if ((currentQuestion_obj.questionType === 'MCQ' || currentQuestion_obj.questionType === 'TRUE_FALSE') && currentAnswer.selectedOptionId) {
        answerData.selectedOptionId = currentAnswer.selectedOptionId;
        
      } else {
        answerData.userAnswer = currentAnswer.answer;
        
      }

      const response = await QuizAttemptService.saveAnswer(answerData);
      console.log('✅ Save response:', response);

      const updatedAnswers = [...userAnswers];
      const answerIndex = updatedAnswers.findIndex(
        a => a.questionId === currentAnswer.questionId
      );
      if (answerIndex !== -1) {
        updatedAnswers[answerIndex].saved = true;
        setUserAnswers(updatedAnswers);
      }
    } catch (err: any) {
      console.error('Failed to save answer:', err);
    } finally {
      setSaving(false);
    }
  }, [attempt, quiz, currentQuestion, userAnswers, saving]);

  const handleNext = async () => {
    await saveCurrentAnswer();
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = async () => {
    await saveCurrentAnswer();
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    
    
    
    
    if (!attempt) {
     
      setError('Quiz attempt not found. Please restart the quiz.');
      return;
    }

   
    const actualAttemptId = attempt.attemptId || (attempt as any).id;
    if (!actualAttemptId) {
      
      setError('Attempt ID is missing. Please restart the quiz.');
      return;
    }

    try {
      setLoading(true);
      
      
      
      await saveCurrentAnswer();
      
     
      const completionResults = await QuizAttemptService.completeQuiz(actualAttemptId);
      
      console.log('✅ Results structure check:', {
        hasResults: !!completionResults.results,
        resultsType: typeof completionResults.results,
        isArray: Array.isArray(completionResults.results),
        resultsLength: completionResults.results ? completionResults.results.length : 'N/A'
      });
      
      setResults(completionResults);
      setQuizCompleted(true);
    
      
      onComplete(completionResults);
    } catch (err: any) {
      
      setError(err.message || 'Failed to submit quiz');
      alert(`Error submitting quiz: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSubmit = async () => {
   
    
    try {
      await handleSubmitQuiz();
    } catch (err) {
      
      alert(`Auto-submit failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleExitQuiz = () => {
    setShowExitDialog(true);
  };

  const confirmExit = () => {
    setShowExitDialog(false);
    onBack();
  };

  const getAnsweredCount = () => {
    return userAnswers.filter(answer => answer.answer.trim() !== '').length;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "error";
      default:
        return "primary";
    }
  };

  const renderQuestionInput = (question: Question) => {
    const currentAnswer = userAnswers.find(a => a.questionId === question.id);

    if (question.questionType === 'MCQ' && question.options) {
      return (
        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            value={currentAnswer?.answer || ""}
            onChange={(e) => {
              const selectedOption = question.options?.find(opt => opt.optionText === e.target.value);
              handleAnswerChange(e.target.value, selectedOption?.id);
            }}
          >
            <Stack spacing={2}>
              {question.options.map((option, index) => (
                <Paper
                  key={option.id}
                  elevation={currentAnswer?.answer === option.optionText ? 3 : 1}
                  sx={{
                    borderRadius: 2,
                    transition: "all 0.2s ease-in-out",
                    border: "2px solid",
                    borderColor: currentAnswer?.answer === option.optionText
                      ? "primary.main"
                      : "transparent",
                    "&:hover": {
                      borderColor: "primary.light",
                    },
                  }}
                >
                  <FormControlLabel
                    value={option.optionText}
                    control={<Radio sx={{ ml: 1 }} />}
                    label={
                      <Typography
                        variant="body1"
                        sx={{
                          py: 1,
                          pr: 2,
                          fontWeight: currentAnswer?.answer === option.optionText
                            ? "medium"
                            : "normal",
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            bgcolor: currentAnswer?.answer === option.optionText
                              ? "primary.main"
                              : "background.default",
                            color: currentAnswer?.answer === option.optionText
                              ? "white"
                              : "text.primary",
                            border: currentAnswer?.answer === option.optionText
                              ? "none"
                              : "1px solid",
                            borderColor: "divider",
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            mr: 2,
                          }}
                        >
                          {String.fromCharCode(65 + index)}
                        </Box>
                        {option.optionText}
                      </Typography>
                    }
                    sx={{
                      width: "100%",
                      m: 0,
                      "& .MuiFormControlLabel-label": {
                        width: "100%",
                      },
                    }}
                  />
                </Paper>
              ))}
            </Stack>
          </RadioGroup>
        </FormControl>
      );
    } else if (question.questionType === 'TRUE_FALSE') {
      return (
        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            value={currentAnswer?.answer || ""}
            onChange={(e) => {
              const selectedOption = question.options?.find(opt => opt.optionText === e.target.value);
              handleAnswerChange(e.target.value, selectedOption?.id);
            }}
          >
            <Stack spacing={2}>
              {['True', 'False'].map((option) => (
                <Paper
                  key={option}
                  elevation={currentAnswer?.answer === option ? 3 : 1}
                  sx={{
                    borderRadius: 2,
                    transition: "all 0.2s ease-in-out",
                    border: "2px solid",
                    borderColor: currentAnswer?.answer === option
                      ? "primary.main"
                      : "transparent",
                    "&:hover": {
                      borderColor: "primary.light",
                    },
                  }}
                >
                  <FormControlLabel
                    value={option}
                    control={<Radio sx={{ ml: 1 }} />}
                    label={
                      <Typography
                        variant="body1"
                        sx={{
                          py: 1,
                          pr: 2,
                          fontWeight: currentAnswer?.answer === option
                            ? "medium"
                            : "normal",
                        }}
                      >
                        {option}
                      </Typography>
                    }
                    sx={{
                      width: "100%",
                      m: 0,
                      "& .MuiFormControlLabel-label": {
                        width: "100%",
                      },
                    }}
                  />
                </Paper>
              ))}
            </Stack>
          </RadioGroup>
        </FormControl>
      );
    } else if (question.questionType === 'SHORT_ANSWER') {
      return (
        <TextField
          fullWidth
          multiline
          rows={4}
          value={currentAnswer?.answer || ""}
          onChange={(e) => handleAnswerChange(e.target.value)}
          placeholder="Enter your answer here..."
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      );
    }
  };

  // Loading state
  if (loading && !quiz) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading Quiz...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error && !quiz) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          action={
            <Button onClick={initializeQuiz} size="small">
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

  // Quiz completed state
  if (quizCompleted && results) {
    // Show detailed results if requested
    if (showDetailedResults && quiz) {
      const userId = localStorage.getItem('userId') || '';
      return (
        <QuizResults
          quizId={quiz.id}
          quizTitle={quiz.title}
          userId={userId}
          onBack={() => setShowDetailedResults(false)}
        />
      );
    }

    const percentage = Math.round(results.percentage);
    const isExcellent = percentage >= 90;
    const isGood = percentage >= 70;

    return (
      <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
        <Fade in={true}>
          <Card elevation={6} sx={{ borderRadius: 4, overflow: "hidden" }}>
            <Box
              sx={{
                bgcolor: isExcellent
                  ? "success.main"
                  : isGood
                  ? "primary.main"
                  : "warning.main",
                color: "white",
                p: 4,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h3"
                sx={{ mb: 1, fontSize: { xs: "2rem", sm: "3rem" } }}
              >
                {isExcellent ? "🎉" : isGood ? "👍" : "📚"}
              </Typography>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Quiz Completed!
              </Typography>
              <Typography
                variant="h2"
                fontWeight="bold"
                sx={{ fontSize: { xs: "2.5rem", sm: "4rem" } }}
              >
                {results.score}/{results.totalQuestions}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                ({percentage}%)
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  You scored {results.score} out of {results.totalQuestions} questions correctly.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Time taken: {Math.floor(results.timeTaken / 60)}:{(results.timeTaken % 60).toString().padStart(2, '0')}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  {percentage >= 90 ? (
                    <Chip
                      label="🎉 Outstanding Performance!"
                      color="success"
                      variant="filled"
                      sx={{ fontSize: "1rem", py: 2, px: 3 }}
                    />
                  ) : percentage >= 80 ? (
                    <Chip
                      label="🌟 Excellent Work!"
                      color="primary"
                      variant="filled"
                      sx={{ fontSize: "1rem", py: 2, px: 3 }}
                    />
                  ) : percentage >= 70 ? (
                    <Chip
                      label="👍 Good Job!"
                      color="warning"
                      variant="filled"
                      sx={{ fontSize: "1rem", py: 2, px: 3 }}
                    />
                  ) : (
                    <Chip
                      label="📚 Keep Studying!"
                      color="error"
                      variant="filled"
                      sx={{ fontSize: "1rem", py: 2, px: 3 }}
                    />
                  )}
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    mt: 3,
                    height: 12,
                    borderRadius: 6,
                    bgcolor: "background.default",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 6,
                    },
                  }}
                  color={
                    isExcellent ? "success" : isGood ? "primary" : "warning"
                  }
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<StarIcon />}
                  onClick={() => setShowDetailedResults(true)}
                  size="large"
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    fontSize: "1.1rem",
                    textTransform: "none",
                  }}
                >
                  View Detailed Results
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<ArrowBackIcon />}
                  onClick={onBack}
                  size="large"
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    fontSize: "1.1rem",
                    textTransform: "none",
                  }}
                >
                  Back to Quizzes
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error">
          Quiz data is not available or has no questions.
        </Alert>
      </Box>
    );
  }

  // Safety check for current question index
  if (currentQuestion >= quiz.questions.length) {
    setCurrentQuestion(0);
    return null;
  }

  const currentQ = quiz.questions[currentQuestion];
  
  // Additional safety check for current question
  if (!currentQ) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error">
          Current question not found. Please refresh the page.
        </Alert>
      </Box>
    );
  }

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const answeredProgress = (getAnsweredCount() / quiz.questions.length) * 100;

  return (
    <Box sx={{ width: "100%", height: "100%", overflow: "auto" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            mb: 3,
            bgcolor: "primary.main",
            color: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <QuizIcon />
                <Typography variant="h5" fontWeight="bold">
                  {quiz.title}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                  flexWrap: "wrap",
                }}
              >
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </Typography>
                <Chip
                  label={quiz.difficulty.toUpperCase()}
                  color={getDifficultyColor(quiz.difficulty) as any}
                  size="small"
                  variant="outlined"
                  sx={{ color: "white", borderColor: "rgba(255,255,255,0.5)" }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Progress
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    {Math.round(progress)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: "rgba(255,255,255,0.3)",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "rgba(255,255,255,0.9)",
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Answered: {getAnsweredCount()}/{quiz.questions.length}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    {Math.round(answeredProgress)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={answeredProgress}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: "rgba(255,255,255,0.3)",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "success.main",
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "rgba(255,255,255,0.1)",
                borderRadius: 2,
                p: 1.5,
                minWidth: 120,
                justifyContent: "center",
              }}
            >
              <TimeIcon
                sx={{
                  color: getTimeColor() === "error" ? "error.main" : "white",
                }}
              />
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  color: getTimeColor() === "error" ? "error.main" : "white",
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                }}
              >
                {formatTime(timeLeft)}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Warning Alert */}
        {showWarning && (
          <Fade in={showWarning}>
            <Alert
              severity="warning"
              sx={{ mb: 2, borderRadius: 2 }}
              action={
                <Button onClick={() => setShowWarning(false)} size="small">
                  Dismiss
                </Button>
              }
            >
              <Typography variant="body2" fontWeight="medium">
                ⏰ Less than 5 minutes remaining!
              </Typography>
            </Alert>
          </Fade>
        )}

        {/* Question */}
        {currentQ && (
          <Fade in={true} key={currentQ.id}>
            <Paper
              elevation={3}
              sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3, mb: 3 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    fontSize: { xs: "1.1rem", sm: "1.25rem" },
                    lineHeight: 1.4,
                    flex: 1,
                  }}
                >
                  {currentQ.question}
                </Typography>
                
                {currentQ.points > 0 && (
                  <Chip 
                    label={`${currentQ.points} ${currentQ.points === 1 ? 'point' : 'points'}`}
                    color="primary" 
                    size="small"
                    sx={{ ml: 2 }}
                  />
                )}
              </Box>

              {renderQuestionInput(currentQ)}

              {/* Save indicator */}
              {attempt && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {saving ? (
                      <CircularProgress size={16} />
                    ) : (
                      <SaveIcon 
                        sx={{ 
                          fontSize: 16, 
                          color: userAnswers.find(a => a.questionId === currentQ.id)?.saved 
                            ? 'success.main' 
                            : 'text.disabled' 
                        }} 
                      />
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {saving 
                        ? 'Saving...' 
                        : userAnswers.find(a => a.questionId === currentQ.id)?.saved 
                          ? 'Saved' 
                          : 'Auto-save enabled'
                      }
                    </Typography>
                  </Box>
                  
                  <Button
                    size="small"
                    onClick={saveCurrentAnswer}
                    disabled={saving || !userAnswers.find(a => a.questionId === currentQ.id)?.answer.trim()}
                    startIcon={<SaveIcon />}
                  >
                    Save Now
                  </Button>
                </Box>
              )}
            </Paper>
          </Fade>
        )}

        {/* Navigation */}
        <Paper elevation={3} sx={{ p: 2, borderRadius: 3, bgcolor: "background.default" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<PrevIcon />}
              onClick={handlePrevious}
              disabled={currentQuestion === 0 || loading}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                minWidth: { xs: 80, sm: 120 },
              }}
            >
              {isMobile ? "Prev" : "Previous"}
            </Button>

            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <IconButton
                onClick={handleExitQuiz}
                sx={{
                  color: "text.secondary",
                  "&:hover": { color: "error.main" },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="caption" color="text.secondary">
                Exit
              </Typography>
            </Box>

            {currentQuestion === quiz.questions.length - 1 ? (
              <Button
                variant="contained"
                startIcon={<CheckIcon />}
                onClick={handleSubmitQuiz}
                disabled={loading || saving}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  minWidth: { xs: 80, sm: 120 },
                  bgcolor: "success.main",
                  "&:hover": {
                    bgcolor: "success.dark",
                  },
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Submit"}
              </Button>
            ) : (
              <Button
                variant="contained"
                endIcon={<NextIcon />}
                onClick={handleNext}
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  minWidth: { xs: 80, sm: 120 },
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </Paper>
      </Container>

      {/* Exit Confirmation Dialog */}
      <Dialog
        open={showExitDialog}
        onClose={() => setShowExitDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon color="warning" />
            Exit Quiz?
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to exit the quiz? Your current progress will be saved, 
            but you'll need to restart the attempt later.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExitDialog(false)}>
            Continue Quiz
          </Button>
          <Button onClick={confirmExit} color="error" variant="contained">
            Exit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuizTakerNew;
