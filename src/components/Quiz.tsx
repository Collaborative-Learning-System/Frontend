    import React, { useState } from "react";
    import QuizTaker from "./QuizTaker";
    import {
      Box,
      Paper,
      Typography,
      Button,
      Chip,
      Card,
      CardContent,
      CardActions,
      Container,
      LinearProgress,
      Fade,
      useTheme,
      useMediaQuery,
      Stack,
      Badge,
    } from "@mui/material";
    import {
      Quiz as QuizIcon,
      AccessTime as TimeIcon,
      Assignment as AssignmentIcon,
      PlayArrow as PlayIcon,
      Refresh as RefreshIcon,
      CheckCircle as CheckIcon,
      Star as StarIcon,
      TrendingUp as TrendingIcon,
    } from "@mui/icons-material";

    interface Quiz {
      id: number;
      title: string;
      description: string;
      difficulty: "easy" | "medium" | "hard";
      questions: number;
      timeLimit: number; // in minutes
      completed: boolean;
      score?: number;
      maxScore: number;
    }

    interface QuizProps {
      groupId: number;
    }

    const mockQuizzes: { [key: number]: Quiz[] } = {
      1: [
        // Computer Security
        {
          id: 1,
          title: "Network Security Basics",
          description:
            "Test your knowledge of network security fundamentals including firewalls, VPNs, and encryption",
          difficulty: "easy",
          questions: 10,
          timeLimit: 15,
          completed: true,
          score: 8,
          maxScore: 10,
        },
        {
          id: 2,
          title: "Cryptography Advanced",
          description:
            "Advanced concepts in cryptography and encryption algorithms, digital signatures, and key management",
          difficulty: "hard",
          questions: 15,
          timeLimit: 25,
          completed: false,
          maxScore: 15,
        },
        {
          id: 3,
          title: "Web Application Security",
          description:
            "Common vulnerabilities and security measures for web applications including OWASP Top 10",
          difficulty: "medium",
          questions: 12,
          timeLimit: 20,
          completed: true,
          score: 10,
          maxScore: 12,
        },
      ],
      2: [
        // Software Engineering
        {
          id: 4,
          title: "SDLC Fundamentals",
          description:
            "Software Development Life Cycle basics, methodologies, and best practices",
          difficulty: "easy",
          questions: 8,
          timeLimit: 12,
          completed: false,
          maxScore: 8,
        },
        {
          id: 5,
          title: "Design Patterns",
          description:
            "Common software design patterns and their applications in modern development",
          difficulty: "medium",
          questions: 14,
          timeLimit: 22,
          completed: true,
          score: 11,
          maxScore: 14,
        },
      ],
      3: [
        // Business Analysis
        {
          id: 6,
          title: "Requirements Gathering",
          description:
            "Techniques for gathering and analyzing requirements in business analysis",
          difficulty: "medium",
          questions: 10,
          timeLimit: 18,
          completed: false,
          maxScore: 10,
        },
      ],
    };

    const Quiz: React.FC<QuizProps> = ({ groupId }) => {
      const theme = useTheme();
      const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
      const isTablet = useMediaQuery(theme.breakpoints.down("md"));
      const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
      const [quizzes, setQuizzes] = useState(mockQuizzes[groupId] || []);

      const handleQuizComplete = (quizId: number, score: number) => {
        setQuizzes((prev) =>
          prev.map((quiz) =>
            quiz.id === quizId ? { ...quiz, completed: true, score } : quiz
          )
        );
        setSelectedQuiz(null);
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

      const getDifficultyIcon = (difficulty: string) => {
        switch (difficulty) {
          case "easy":
            return "🟢";
          case "medium":
            return "🟡";
          case "hard":
            return "🔴";
          default:
            return "⚪";
        }
      };

      const getScoreColor = (score: number, maxScore: number) => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 90) return "success";
        if (percentage >= 80) return "primary";
        if (percentage >= 70) return "warning";
        return "error";
      };

      const getPerformanceText = (score: number, maxScore: number) => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 90) return "Excellent!";
        if (percentage >= 80) return "Great Job!";
        if (percentage >= 70) return "Good Work!";
        return "Keep Trying!";
      };

      if (selectedQuiz) {
        return (
          <QuizTaker
            quiz={selectedQuiz}
            onComplete={handleQuizComplete}
            onBack={() => setSelectedQuiz(null)}
          />
        );
      }

      const completedQuizzes = quizzes.filter((q) => q.completed).length;
      const totalQuizzes = quizzes.length;
      const averageScore =
        quizzes
          .filter((q) => q.completed && q.score !== undefined)
          .reduce((acc, q) => acc + (q.score! / q.maxScore) * 100, 0) /
        (completedQuizzes || 1);

      return (
        <Box sx={{ width: "100%", height: "100%", overflow: "auto" }}>
          <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
            {/* Header with Stats */}
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                <QuizIcon
                  sx={{ fontSize: { xs: 28, sm: 32 }, color: "primary.main" }}
                />
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  component="h2"
                  fontWeight="bold"
                >
                  Available Quizzes
                </Typography>
              </Box>
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{ mb: 3, fontSize: { xs: "0.9rem", sm: "1rem" } }}
              >
                Test your knowledge and track your progress
              </Typography>

              {/* Progress Stats */}
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 3,
                  bgcolor: "primary.main",
                  color: "white",
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Box sx={{ textAlign: "center", minWidth: 100 }}>
                    <Typography variant="h4" fontWeight="bold">
                      {completedQuizzes}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      Completed
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center", minWidth: 100 }}>
                    <Typography variant="h4" fontWeight="bold">
                      {totalQuizzes}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      Total
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center", minWidth: 100 }}>
                    <Typography variant="h4" fontWeight="bold">
                      {Math.round(averageScore)}%
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      Average
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(completedQuizzes / totalQuizzes) * 100}
                  sx={{
                    mt: 2,
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "rgba(255,255,255,0.3)",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "rgba(255,255,255,0.9)",
                      borderRadius: 4,
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ display: "block", mt: 1, opacity: 0.9 }}
                >
                  Progress:{" "}
                  {Math.round((completedQuizzes / totalQuizzes) * 100)}%
                  Complete
                </Typography>
              </Paper>
            </Box>

            {/* Quiz Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(auto-fit, minmax(300px, 1fr))",
                  lg: "repeat(3, 1fr)",
                },
                gap: { xs: 2, sm: 3 },
                mb: 4,
              }}
            >
              {quizzes.map((quiz, index) => (
                <Fade key={quiz.id} in={true} timeout={300 * (index + 1)}>
                  <Card
                    elevation={3}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease-in-out",
                      position: "relative",
                      overflow: "visible",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: 8,
                      },
                      borderRadius: 3,
                      border: quiz.completed ? "2px solid" : "1px solid",
                      borderColor: quiz.completed ? "success.main" : "divider",
                    }}
                  >
                    {quiz.completed && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          zIndex: 1,
                        }}
                      >
                        <Badge>
                          <CheckIcon
                            sx={{
                              bgcolor: "success.main",
                              color: "white",
                              borderRadius: "50%",
                              fontSize: 24,
                              p: 0.5,
                              boxShadow: 2,
                            }}
                          />
                        </Badge>
                      </Box>
                    )}

                    <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                      {/* Header */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="h3"
                          fontWeight="bold"
                          sx={{
                            flex: 1,
                            minWidth: 0,
                            fontSize: { xs: "1rem", sm: "1.25rem" },
                          }}
                        >
                          {quiz.title}
                        </Typography>
                        <Chip
                          label={quiz.difficulty.toUpperCase()}
                          color={getDifficultyColor(quiz.difficulty) as any}
                          size="small"
                          icon={
                            <span style={{ fontSize: "0.8rem" }}>
                              {getDifficultyIcon(quiz.difficulty)}
                            </span>
                          }
                          sx={{ fontWeight: "bold", flexShrink: 0 }}
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 3,
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {quiz.description}
                      </Typography>

                      {/* Quiz metadata */}
                      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <AssignmentIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {quiz.questions} questions
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <TimeIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {quiz.timeLimit} min
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Score display for completed quizzes */}
                      {quiz.completed && quiz.score !== undefined && (
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "grey.50",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <StarIcon
                              sx={{ color: "warning.main", fontSize: 18 }}
                            />
                            <Typography variant="body2" fontWeight="medium">
                              Your Performance:
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              color="primary"
                            >
                              {quiz.score}/{quiz.maxScore}
                            </Typography>
                            <Chip
                              label={getPerformanceText(
                                quiz.score,
                                quiz.maxScore
                              )}
                              color={
                                getScoreColor(quiz.score, quiz.maxScore) as any
                              }
                              size="small"
                              icon={<TrendingIcon />}
                            />
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={(quiz.score / quiz.maxScore) * 100}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: "grey.200",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 4,
                              },
                            }}
                            color={
                              getScoreColor(quiz.score, quiz.maxScore) as any
                            }
                          />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 0.5, display: "block" }}
                          >
                            {Math.round((quiz.score / quiz.maxScore) * 100)}% -
                            {quiz.score >= quiz.maxScore * 0.9
                              ? " Outstanding!"
                              : quiz.score >= quiz.maxScore * 0.8
                              ? " Well Done!"
                              : quiz.score >= quiz.maxScore * 0.7
                              ? " Good Effort!"
                              : " Keep Practicing!"}
                          </Typography>
                        </Paper>
                      )}
                    </CardContent>

                    <CardActions sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
                      {quiz.completed ? (
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<RefreshIcon />}
                          onClick={() => setSelectedQuiz(quiz)}
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: "medium",
                            py: 1,
                            "&:hover": {
                              transform: "scale(1.02)",
                              boxShadow: 2,
                            },
                            transition: "all 0.2s ease-in-out",
                          }}
                        >
                          Retake Quiz
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<PlayIcon />}
                          onClick={() => setSelectedQuiz(quiz)}
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: "medium",
                            py: 1,
                            boxShadow: 3,
                            "&:hover": {
                              transform: "scale(1.02)",
                              boxShadow: 6,
                            },
                            transition: "all 0.2s ease-in-out",
                          }}
                        >
                          Take Quiz
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Fade>
              ))}
            </Box>

            {quizzes.length === 0 && (
              <Fade in={true}>
                <Paper
                  elevation={3}
                  sx={{
                    p: { xs: 4, sm: 6 },
                    textAlign: "center",
                    borderRadius: 3,
                  }}
                >
                  <QuizIcon
                    sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No quizzes available for this group yet.
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Check back later for new quizzes to test your knowledge!
                  </Typography>
                </Paper>
              </Fade>
            )}
          </Container>
        </Box>
      );
    };

    export default Quiz;
