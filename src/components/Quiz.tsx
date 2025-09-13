import React, { useState, useEffect } from "react";
    import QuizTakerNew from "./QuizTakerNew";
    import { useNavigate } from "react-router-dom";
    import { useWorkspace } from "../context/WorkspaceContext";
    import { QuizService } from "../services/QuizService";
    import type { QuizCompletionResponse } from "../services/QuizAttemptService";
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
      CircularProgress,
      Alert,
      Snackbar,
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

      NewReleases as NewIcon,
    } from "@mui/icons-material";

    interface Quiz {
      id: string;
      title: string;
      description: string;
      difficulty: "EASY" | "MEDIUM" | "HARD" | "easy" | "medium" | "hard";
      timeLimit: number; // in minutes
      instructions: string;
      questions: number; // number of questions
      completed: boolean;
      score?: number;
      maxScore: number;
      createdAt?: string;
      isNew?: boolean; // for highlighting new quizzes
    }

    interface QuizProps {
      groupId: string; // Changed from number to string
    }

    // Updated to use string keys for the mock data
    const mockQuizzes: { [key: string]: Quiz[] } = {
      // Default mock data for testing - you can remove these when integrating with real API
      "default-group-1": [
        {
          id: "1",
          title: "Network Security Basics",
          description:
            "Test your knowledge of network security fundamentals including firewalls, VPNs, and encryption",
          difficulty: "easy",
          timeLimit: 15,
          instructions: "Answer all questions to the best of your knowledge.",
          questions: 10,
          completed: true,
          score: 8,
          maxScore: 10,
        },
        {
          id: "2",
          title: "Cryptography Advanced",
          description:
            "Advanced concepts in cryptography and encryption algorithms, digital signatures, and key management",
          difficulty: "hard",
          timeLimit: 25,
          instructions: "This is an advanced quiz. Take your time.",
          questions: 15,
          completed: false,
          maxScore: 15,
        },
        {
          id: "3",
          title: "Web Application Security",
          description:
            "Common vulnerabilities and security measures for web applications including OWASP Top 10",
          difficulty: "medium",
          timeLimit: 20,
          instructions: "Focus on practical security measures.",
          questions: 12,
          completed: true,
          score: 10,
          maxScore: 12,
        },
      ],
      "default-group-2": [
        {
          id: "4",
          title: "SDLC Fundamentals",
          description:
            "Software Development Life Cycle basics, methodologies, and best practices",
          difficulty: "easy",
          timeLimit: 12,
          instructions: "Cover all phases of SDLC.",
          questions: 8,
          completed: false,
          maxScore: 8,
        },
        {
          id: "5",
          title: "Design Patterns",
          description:
            "Common software design patterns and their applications in modern development",
          difficulty: "medium",
          timeLimit: 22,
          instructions: "Think about real-world applications.",
          questions: 14,
          completed: true,
          score: 11,
          maxScore: 14,
        },
      ],
    };

    const Quiz: React.FC<QuizProps> = ({ groupId }) => {
      const theme = useTheme();
      const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
      const navigate = useNavigate();
      const { workspaceData } = useWorkspace();
      const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
      const [quizzes, setQuizzes] = useState<Quiz[]>([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);
      const [snackbarOpen, setSnackbarOpen] = useState(false);
      const [snackbarMessage, setSnackbarMessage] = useState("");
      
      // Debug group ID
      console.log('Quiz component - Received groupId:', groupId);
      console.log('Quiz component - GroupId type:', typeof groupId);
      
      // Debug workspace data
      console.log("Quiz Component - Workspace Data:", workspaceData);
      
      // Fetch quizzes when component mounts or groupId changes
      useEffect(() => {
        if (groupId) {
          fetchQuizzes();
        } else {
          console.log('Quiz component - No groupId provided, loading demo data');
          // Load demo data when no groupId is available
          const fallbackQuizzes = Object.values(mockQuizzes).flat().map((quiz, index) => ({
            ...quiz,
            id: quiz.id ? quiz.id.toString() : `demo-${index + 1}-${Date.now()}`
          }));
          setQuizzes(fallbackQuizzes);
          setLoading(false);
          setSnackbarMessage(`Demo mode - ${fallbackQuizzes.length} quizzes loaded`);
          setSnackbarOpen(true);
        }
      }, [groupId]);

      const fetchQuizzes = async () => {
        try {
          setLoading(true);
          setError(null);
          
          console.log('Fetching quizzes for group:', groupId);
          const response = await QuizService.getGroupQuizzes(groupId);
          console.log('Raw API response:', response);
          
          // Transform backend data to match frontend interface
          const transformedQuizzes: Quiz[] = response.data.map((quiz: any) => {
            console.log('Transforming quiz:', quiz);
            
            // Try different possible ID field names
            const quizId = quiz.id || quiz._id || quiz.quizId || quiz.quiz_id || `quiz-${Date.now()}-${Math.random()}`;
            console.log('Available fields:', Object.keys(quiz));
            console.log('Using ID:', quizId);
            
            const transformed = {
              id: quizId.toString(), // Ensure it's a string
              title: quiz.title,
              description: quiz.description,
              difficulty: quiz.difficulty.toLowerCase(),
              timeLimit: quiz.timeLimit,
              instructions: quiz.instructions,
              questions: quiz.questions?.length || 0,
              completed: false, // You can implement quiz completion tracking
              maxScore: quiz.questions?.reduce((sum: number, q: any) => sum + (q.points || 1), 0) || 0,
              createdAt: quiz.createdAt,
              isNew: isQuizNew(quiz.createdAt)
            };
            console.log('Transformed quiz:', transformed);
            return transformed;
          });
          
          setQuizzes(transformedQuizzes);
          
          // Debug: Log the loaded quizzes
          console.log('Loaded quizzes:', transformedQuizzes);
          transformedQuizzes.forEach((quiz, index) => {
            console.log(`Quiz ${index + 1} ID:`, quiz.id, 'Type:', typeof quiz.id);
          });
          
          // Show success message
          const newQuizzes = transformedQuizzes.filter(q => q.isNew).length;
          if (newQuizzes > 0) {
            setSnackbarMessage(`${newQuizzes} new quiz${newQuizzes > 1 ? 'es' : ''} available!`);
          } else {
            setSnackbarMessage(`${transformedQuizzes.length} quiz${transformedQuizzes.length !== 1 ? 'es' : ''} loaded`);
          }
          setSnackbarOpen(true);
          
        } catch (err: any) {
          console.error('Failed to fetch quizzes:', err);
          setError(err.message || 'Failed to load quizzes');
          // Fallback to mock data for development
          const fallbackQuizzes = Object.values(mockQuizzes).flat().map((quiz, index) => ({
            ...quiz,
            id: quiz.id ? quiz.id.toString() : `fallback-${index + 1}-${Date.now()}`
          }));
          setQuizzes(fallbackQuizzes);
          
          // Debug: Log the fallback quizzes
          console.log('Fallback quizzes:', fallbackQuizzes);
          fallbackQuizzes.forEach((quiz, index) => {
            console.log(`Fallback Quiz ${index + 1} ID:`, quiz.id, 'Type:', typeof quiz.id);
          });
          
          setSnackbarMessage(`Using demo data - ${fallbackQuizzes.length} quizzes loaded`);
          setSnackbarOpen(true);
        } finally {
          setLoading(false);
        }
      };

      // Check if quiz was created in the last 24 hours
      const isQuizNew = (createdAt: string): boolean => {
        if (!createdAt) return false;
        const created = new Date(createdAt);
        const now = new Date();
        const diffInHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
        return diffInHours <= 24;
      };

      const handleStartQuiz = (quiz: Quiz) => {
        console.log('Starting quiz:', quiz);
        console.log('Quiz ID:', quiz.id);
        console.log('Quiz ID type:', typeof quiz.id);
        console.log('Quiz ID is truthy:', !!quiz.id);
        
        if (!quiz.id) {
          console.error('Quiz ID is missing or undefined!');
          setSnackbarMessage('Error: Quiz ID is missing. Please try again.');
          setSnackbarOpen(true);
          return;
        }
        
        setSelectedQuiz(quiz);
      };

      const handleQuizComplete = (results: QuizCompletionResponse) => {
        console.log('Quiz completed with results:', results);
        
        // Update the quiz as completed in our local state
        setQuizzes(prevQuizzes => 
          prevQuizzes.map(q => 
            q.id === selectedQuiz?.id 
              ? { ...q, completed: true, score: results.score, maxScore: results.totalQuestions }
              : q
          )
        );
        
        // Show completion message
        setSnackbarMessage(
          `Quiz completed! You scored ${results.score}/${results.totalQuestions} (${Math.round(results.percentage)}%)`
        );
        setSnackbarOpen(true);
        
        // Go back to quiz list
        setSelectedQuiz(null);
      };

      const handleBackToQuizzes = () => {
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

      // Show QuizTaker if a quiz is selected
      if (selectedQuiz) {
        console.log('Quiz component - Selected quiz:', selectedQuiz);
        console.log('Quiz component - Passing quiz ID:', selectedQuiz.id);
        return (
          <QuizTakerNew
            quizId={selectedQuiz.id}
            onComplete={handleQuizComplete}
            onBack={handleBackToQuizzes}
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
              {/* Action Buttons */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={fetchQuizzes}
                  disabled={loading}
                  sx={{ color: "#083c70ff", borderColor: "#083c70ff" }}
                >
                  {loading ? "Refreshing..." : "Refresh"}
                </Button>
                
                {workspaceData?.role === "admin" && (
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/quiz-creator', { state: { groupId } })}
                    sx={{ 
                      bgcolor: "#083c70ff", 
                      "&:hover": { bgcolor: "#062d52ff" } 
                    }}
                  >
                    Create Quiz
                  </Button>
                )}
              </Box>
              
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
              {totalQuizzes > 0 && (
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
              )}
            </Box>

            {/* Loading State */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={40} />
                <Typography variant="body1" sx={{ ml: 2, alignSelf: 'center' }}>
                  Loading quizzes...
                </Typography>
              </Box>
            )}

            {/* Error State */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Quiz Grid */}
            {!loading && quizzes.length > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(auto-fit, minmax(320px, 1fr))",
                    lg: "repeat(3, 1fr)",
                  },
                  gap: { xs: 2, sm: 3 },
                  mb: 4,
                }}
              >
                {quizzes.map((quiz, index) => {
                  // Debug: Log each quiz in the render
                  console.log(`Rendering quiz ${index + 1}:`, quiz);
                  console.log(`Quiz ${index + 1} ID:`, quiz.id, 'Type:', typeof quiz.id);
                  
                  return (
                    <Fade key={quiz.id} in={true} timeout={300 * (index + 1)}>
                      <Card
                      elevation={quiz.isNew ? 8 : 3}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "all 0.3s ease-in-out",
                        position: "relative",
                        ...(quiz.isNew && {
                          border: '2px solid',
                          borderColor: 'primary.main',
                          boxShadow: theme.shadows[8],
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: theme.shadows[12],
                          }
                        }),
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
                        {/* Header with New Badge */}
                        <Box sx={{ position: 'relative', mb: 2 }}>
                          {quiz.isNew && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: -10,
                                left: -10,
                                zIndex: 2,
                              }}
                            >
                              <Chip
                                icon={<NewIcon />}
                                label="NEW"
                                size="small"
                                sx={{
                                  bgcolor: 'error.main',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  fontSize: '0.7rem',
                                  height: 24,
                                  animation: 'pulse 2s infinite',
                                  '@keyframes pulse': {
                                    '0%': {
                                      boxShadow: '0 0 0 0 rgba(244, 67, 54, 0.7)',
                                    },
                                    '70%': {
                                      boxShadow: '0 0 0 10px rgba(244, 67, 54, 0)',
                                    },
                                    '100%': {
                                      boxShadow: '0 0 0 0 rgba(244, 67, 54, 0)',
                                    },
                                  },
                                }}
                              />
                            </Box>
                          )}
                          
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              flexWrap: "wrap",
                              gap: 1,
                              mt: quiz.isNew ? 1 : 0,
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
                                color: quiz.isNew ? 'primary.main' : 'text.primary',
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
                            onClick={() => {
                              console.log('Retake button clicked for quiz:', quiz);
                              console.log('Retake button - Quiz ID:', quiz.id);
                              handleStartQuiz(quiz);
                            }}
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
                            onClick={() => {
                              console.log('Take Quiz button clicked for quiz:', quiz);
                              console.log('Take Quiz button - Quiz ID:', quiz.id);
                              handleStartQuiz(quiz);
                            }}
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
                  );
                })}
              </Box>
            ) : (
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
                    sx={{ fontSize: 80, color: "#083c70ff", mb: 2, opacity: 0.7 }}
                  />
                  <Typography variant="h5" sx={{ color: "#083c70ff", fontWeight: "bold" }} gutterBottom>
                    No Quizzes Available Yet
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {workspaceData?.role === "admin" 
                      ? "Create your first quiz to get started!"
                      : "Check back later for new quizzes to test your knowledge!"
                    }
                  </Typography>
                  
                  {workspaceData?.role === "admin" && (
                    <Button
                      variant="contained"
                      startIcon={<AssignmentIcon />}
                      onClick={() => navigate('/quiz-creator', { state: { groupId } })}
                      sx={{ 
                        bgcolor: "#083c70ff", 
                        "&:hover": { bgcolor: "#062d52ff" },
                        mt: 2
                      }}
                    >
                      Create Your First Quiz
                    </Button>
                  )}
                </Paper>
              </Fade>
            )}
          </Container>
          
          {/* Success/Info Snackbar */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000}
            onClose={() => setSnackbarOpen(false)}
            message={snackbarMessage}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          />
        </Box>
      );
    };

    export default Quiz;