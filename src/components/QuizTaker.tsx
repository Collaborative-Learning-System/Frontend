import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import {
  AccessTime as TimeIcon,
  ArrowBack as ArrowBackIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Check as CheckIcon,
  Quiz as QuizIcon,
} from "@mui/icons-material";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  questions: number;
  timeLimit: number;
  completed: boolean;
  score?: number;
  maxScore: number;
}

interface QuizTakerProps {
  quiz: Quiz;
  onComplete: (quizId: number, score: number) => void;
  onBack: () => void;
}

const mockQuestions: { [key: number]: Question[] } = {
  1: [
    // Network Security Basics
    {
      id: 1,
      question: "What does SSL stand for?",
      options: [
        "Secure Socket Layer",
        "Simple Socket Layer",
        "Secure System Layer",
        "Safe Socket Layer",
      ],
      correctAnswer: 0,
    },
    {
      id: 2,
      question: "Which port is commonly used for HTTPS?",
      options: ["80", "443", "22", "21"],
      correctAnswer: 1,
    },
    {
      id: 3,
      question: "What is a firewall primarily used for?",
      options: [
        "Data encryption",
        "Network traffic filtering",
        "Password management",
        "File compression",
      ],
      correctAnswer: 1,
    },
    {
      id: 4,
      question: "Which of the following is NOT a type of malware?",
      options: ["Virus", "Trojan", "Worm", "Firewall"],
      correctAnswer: 3,
    },
    {
      id: 5,
      question: "What does VPN stand for?",
      options: [
        "Virtual Private Network",
        "Very Private Network",
        "Verified Private Network",
        "Visual Private Network",
      ],
      correctAnswer: 0,
    },
  ],
  2: [
    // Cryptography Advanced
    {
      id: 6,
      question: "What is the key size of AES-256?",
      options: ["128 bits", "192 bits", "256 bits", "512 bits"],
      correctAnswer: 2,
    },
    {
      id: 7,
      question: "Which is an example of asymmetric encryption?",
      options: ["AES", "DES", "RSA", "Blowfish"],
      correctAnswer: 2,
    },
  ],
  4: [
    // SDLC Fundamentals
    {
      id: 8,
      question: "What does SDLC stand for?",
      options: [
        "Software Development Life Cycle",
        "System Development Life Cycle",
        "Software Design Life Cycle",
        "System Design Life Cycle",
      ],
      correctAnswer: 0,
    },
    {
      id: 9,
      question: "Which phase comes first in the SDLC?",
      options: ["Design", "Implementation", "Requirements Analysis", "Testing"],
      correctAnswer: 2,
    },
  ],
};

const QuizTaker: React.FC<QuizTakerProps> = ({ quiz, onComplete, onBack }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  const questions = mockQuestions[quiz.id] || [];

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [timeLeft, quizCompleted]);

  useEffect(() => {
    if (timeLeft <= 300 && timeLeft > 0) {
      // Show warning at 5 minutes
      setShowWarning(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeColor = () => {
    if (timeLeft <= 300) return "error"; // Red for last 5 minutes
    if (timeLeft <= 600) return "warning"; // Orange for last 10 minutes
    return "primary";
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    setScore(correctAnswers);
    setQuizCompleted(true);
    onComplete(quiz.id, correctAnswers);
  };

  const getAnsweredCount = () => {
    return selectedAnswers.filter((answer) => answer !== undefined).length;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
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
                {score}/{questions.length}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                ({percentage}%)
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  You answered {score} out of {questions.length} questions
                  correctly.
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
                    bgcolor: "grey.200",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 6,
                    },
                  }}
                  color={
                    isExcellent ? "success" : isGood ? "primary" : "warning"
                  }
                />
              </Box>

              <Button
                variant="contained"
                fullWidth
                startIcon={<ArrowBackIcon />}
                onClick={onBack}
                size="large"
                sx={{
                  mt: 2,
                  borderRadius: 3,
                  py: 1.5,
                  fontSize: "1.1rem",
                  textTransform: "none",
                }}
              >
                Back to Quizzes
              </Button>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredProgress = (getAnsweredCount() / questions.length) * 100;

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
                  Question {currentQuestion + 1} of {questions.length}
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
                    Answered: {getAnsweredCount()}/{questions.length}
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
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                  lineHeight: 1.4,
                  mb: 3,
                }}
              >
                {currentQ.question}
              </Typography>

              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={selectedAnswers[currentQuestion] ?? ""}
                  onChange={(e) => handleAnswerSelect(Number(e.target.value))}
                >
                  <Stack spacing={2}>
                    {currentQ.options.map((option, index) => (
                      <Paper
                        key={index}
                        elevation={
                          selectedAnswers[currentQuestion] === index ? 3 : 1
                        }
                        sx={{
                          borderRadius: 2,
                          transition: "all 0.2s ease-in-out",
                          border: "2px solid",
                          borderColor:
                            selectedAnswers[currentQuestion] === index
                              ? "primary.main"
                              : "transparent",
                          "&:hover": {
                            borderColor: "primary.light",
                          },
                        }}
                      >
                        <FormControlLabel
                          value={index}
                          control={<Radio sx={{ ml: 1 }} />}
                          label={
                            <Typography
                              variant="body1"
                              sx={{
                                py: 1,
                                pr: 2,
                                fontWeight:
                                  selectedAnswers[currentQuestion] === index
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
                                  bgcolor:
                                    selectedAnswers[currentQuestion] === index
                                      ? "primary.main"
                                      : "grey.300",
                                  color:
                                    selectedAnswers[currentQuestion] === index
                                      ? "white"
                                      : "text.secondary",
                                  fontSize: "0.75rem",
                                  fontWeight: "bold",
                                  mr: 2,
                                }}
                              >
                                {String.fromCharCode(65 + index)}
                              </Box>
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
            </Paper>
          </Fade>
        )}

        {/* Navigation */}
        <Paper elevation={3} sx={{ p: 2, borderRadius: 3, bgcolor: "grey.50" }}>
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
              disabled={currentQuestion === 0}
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
                onClick={onBack}
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

            {currentQuestion === questions.length - 1 ? (
              <Button
                variant="contained"
                startIcon={<CheckIcon />}
                onClick={handleSubmitQuiz}
                disabled={selectedAnswers[currentQuestion] === undefined}
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
                Submit
              </Button>
            ) : (
              <Button
                variant="contained"
                endIcon={<NextIcon />}
                onClick={handleNext}
                disabled={selectedAnswers[currentQuestion] === undefined}
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
    </Box>
  );
};

export default QuizTaker;