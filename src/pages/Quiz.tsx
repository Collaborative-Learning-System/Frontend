import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Chip,
  Avatar,
  Paper,
  Divider,
  IconButton,
  Alert,
} from "@mui/material";
import {
  Quiz as QuizIcon,
  Timer,
  CheckCircle,
  Cancel,
  Refresh,
  Share,
  EmojiEvents,
  School,
} from "@mui/icons-material";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizData {
  id: number;
  title: string;
  description: string;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeLimit: number; // in minutes
  questions: Question[];
  totalPoints: number;
}

const Quiz = () => {
  // Sample quiz data
  const quizData: QuizData = {
    id: 1,
    title: "Introduction to React Fundamentals",
    description:
      "Test your knowledge of React basics including components, state, and props.",
    subject: "Computer Science",
    difficulty: "Medium",
    timeLimit: 1,
    totalPoints: 100,
    questions: [
      {
        id: 1,
        question: "What is JSX in React?",
        options: [
          "A JavaScript library for building user interfaces",
          "A syntax extension for JavaScript",
          "A CSS framework",
          "A database query language",
        ],
        correctAnswer: 1,
        explanation:
          "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.",
      },
      {
        id: 2,
        question:
          "Which method is used to update state in a functional component?",
        options: [
          "this.setState()",
          "updateState()",
          "useState() hook",
          "changeState()",
        ],
        correctAnswer: 2,
        explanation:
          "The useState() hook is used to manage state in functional components.",
      },
      {
        id: 3,
        question: "What is the purpose of useEffect hook?",
        options: [
          "To manage component state",
          "To handle side effects in functional components",
          "To create context",
          "To optimize performance",
        ],
        correctAnswer: 1,
        explanation:
          "useEffect hook is used to handle side effects like API calls, subscriptions, or manually changing the DOM.",
      },
      {
        id: 4,
        question: "How do you pass data from parent to child component?",
        options: ["Using state", "Using context", "Using props", "Using refs"],
        correctAnswer: 2,
        explanation:
          "Props are used to pass data from parent components to child components.",
      },
      {
        id: 5,
        question: "What is the virtual DOM?",
        options: [
          "A copy of the real DOM kept in memory",
          "A new version of HTML",
          "A CSS framework",
          "A JavaScript library",
        ],
        correctAnswer: 0,
        explanation:
          "The virtual DOM is a programming concept where a virtual representation of the UI is kept in memory and synced with the real DOM.",
      },
    ],
  };

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number;
  }>({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quizData.timeLimit * 10); // in seconds
  const [showResults, setShowResults] = useState(false);

  // Timer effect
  React.useEffect(() => {
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleSubmitQuiz();
    }
  }, [quizStarted, quizCompleted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setQuizCompleted(true);
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    quizData.questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: quizData.questions.length,
      percentage: Math.round((correct / quizData.questions.length) * 100),
      points: Math.round(
        (correct / quizData.questions.length) * quizData.totalPoints
      ),
    };
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "success";
      case "Medium":
        return "warning";
      case "Hard":
        return "error";
      default:
        return "primary";
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "success";
    if (percentage >= 60) return "warning";
    return "error";
  };

  // Quiz Start Screen
  if (!quizStarted) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "primary.main",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <QuizIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                {quizData.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {quizData.description}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: 3,
                mb: 4,
              }}
            >
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <School sx={{ fontSize: 30, color: "primary.main", mb: 1 }} />
                <Typography variant="h6">{quizData.subject}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Subject
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Timer sx={{ fontSize: 30, color: "warning.main", mb: 1 }} />
                <Typography variant="h6">
                  {quizData.timeLimit} minutes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Time Limit
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <QuizIcon sx={{ fontSize: 30, color: "info.main", mb: 1 }} />
                <Typography variant="h6">
                  {quizData.questions.length} Questions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Questions
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <EmojiEvents
                  sx={{ fontSize: 30, color: "success.main", mb: 1 }}
                />
                <Typography variant="h6">
                  {quizData.totalPoints} Points
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Points
                </Typography>
              </Paper>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                mb: 4,
              }}
            >
              <Chip
                label={quizData.difficulty}
                color={getDifficultyColor(quizData.difficulty) as any}
                variant="filled"
              />
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                • Read each question carefully before selecting your answer
                <br />
                • You can navigate between questions using Next/Previous buttons
                <br />
                • Make sure to submit your quiz before time runs out
                <br />• Good luck!
              </Typography>
            </Alert>

            <Box sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleStartQuiz}
                startIcon={<QuizIcon />}
                sx={{ px: 4, py: 1.5, fontSize: "1.1rem" }}
              >
                Start Quiz
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Quiz Results Screen
  if (showResults) {
    const score = calculateScore();
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: getScoreColor(score.percentage) + ".main",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <EmojiEvents sx={{ fontSize: 50 }} />
              </Avatar>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                Quiz Completed!
              </Typography>
              <Typography
                variant="h2"
                color={getScoreColor(score.percentage) + ".main"}
                fontWeight="bold"
              >
                {score.percentage}%
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 3,
                mb: 4,
              }}
            >
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h4" color="success.main">
                  {score.correct}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Correct
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h4" color="error.main">
                  {score.total - score.correct}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Incorrect
                </Typography>
              </Paper>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Question Review:
              </Typography>
              {quizData.questions.map((question, index) => {
                const isCorrect =
                  selectedAnswers[question.id] === question.correctAnswer;
                const userAnswer = selectedAnswers[question.id];
                return (
                  <Paper key={question.id} sx={{ p: 2, mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      {isCorrect ? (
                        <CheckCircle color="success" />
                      ) : (
                        <Cancel color="error" />
                      )}
                      <Typography variant="body1" fontWeight="bold">
                        Question {index + 1}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {question.question}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your answer:{" "}
                      {userAnswer !== undefined
                        ? question.options[userAnswer]
                        : "Not answered"}
                    </Typography>
                    {!isCorrect && (
                      <Typography variant="body2" color="success.main">
                        Correct answer:{" "}
                        {question.options[question.correctAnswer]}
                      </Typography>
                    )}
                  </Paper>
                );
              })}
            </Box>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => window.location.reload()}
              >
                Retake Quiz
              </Button>
              <Button variant="contained" startIcon={<Share />}>
                Share Results
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Quiz Questions Screen
  const currentQ = quizData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">{quizData.title}</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Timer color="warning" />
            <Typography variant="h6" color="warning.main">
              {formatTime(timeLeft)}
            </Typography>
          </Box>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 8, borderRadius: 4 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Question {currentQuestion + 1} of {quizData.questions.length}
        </Typography>
      </Paper>

      {/* Question Card */}
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            {currentQ.question}
          </Typography>

          <FormControl component="fieldset" sx={{ width: "100%", mt: 3 }}>
            <RadioGroup
              value={selectedAnswers[currentQ.id] || ""}
              onChange={(e) =>
                handleAnswerSelect(currentQ.id, parseInt(e.target.value))
              }
            >
              {currentQ.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={index}
                  control={<Radio />}
                  label={
                    <Typography variant="body1" sx={{ py: 1 }}>
                      {option}
                    </Typography>
                  }
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    mb: 1,
                    mx: 0,
                    px: 2,
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <Divider sx={{ my: 3 }} />

          {/* Navigation Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            <Typography variant="body2" color="text.secondary">
              {Object.keys(selectedAnswers).length} of{" "}
              {quizData.questions.length} answered
            </Typography>

            {currentQuestion === quizData.questions.length - 1 ? (
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmitQuiz}
                size="large"
              >
                Submit Quiz
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNextQuestion}>
                Next
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Question Navigation */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Quick Navigation:
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {quizData.questions.map((_, index) => (
            <IconButton
              key={index}
              size="small"
              onClick={() => setCurrentQuestion(index)}
              sx={{
                width: 40,
                height: 40,
                border: "1px solid",
                borderColor:
                  currentQuestion === index ? "primary.main" : "divider",
                bgcolor:
                  selectedAnswers[quizData.questions[index].id] !== undefined
                    ? "success.light"
                    : currentQuestion === index
                    ? "primary.light"
                    : "transparent",
                color:
                  currentQuestion === index ? "primary.main" : "text.primary",
              }}
            >
              {index + 1}
            </IconButton>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default Quiz;
