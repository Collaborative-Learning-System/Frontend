import React, { useState, useEffect , useRef } from "react";
    import QuizTakerNew from "./QuizTakerNew";
    import QuizResults from "./QuizResults";
    import { useNavigate } from "react-router-dom";
    import { useWorkspace } from "../context/WorkspaceContext";
    import { QuizService } from "../services/QuizService";
    import { QuizAttemptService } from "../services/QuizAttemptService";
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
      timeLimit: number; 
      instructions: string;
      questions: number; 
      completed: boolean;
      score?: number;
      maxScore: number;
      percentage?: number; 
      createdAt?: string;
      isNew?: boolean; 
    }

    interface QuizProps {
      groupId: string; // Changed from number to string
    }

    const Quiz: React.FC<QuizProps> = ({ groupId }) => {
      const theme = useTheme();
      const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
      const navigate = useNavigate();
      const { workspaceData } = useWorkspace();
      const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
      const [showingResults, setShowingResults] = useState<Quiz | null>(null);
      const [quizzes, setQuizzes] = useState<Quiz[]>([]);
      const [loading, setLoading] = useState(true);
      const [startingQuiz, setStartingQuiz] = useState<string | null>(null); // Track which quiz is being started
      const [error, setError] = useState<string | null>(null);
      const [snackbarOpen, setSnackbarOpen] = useState(false);
      const [snackbarMessage, setSnackbarMessage] = useState("");
      const isStartingRef = useRef<Record<string, boolean>>({})
      
     
      useEffect(() => {
        // Clear previous data immediately when groupId changes
        setQuizzes([]);
        setSelectedQuiz(null);
        setShowingResults(null);
        setError(null);
        setStartingQuiz(null);
        isStartingRef.current = {};

        if (groupId) {
          fetchQuizzes();
        } else {
          setLoading(false);
          setSnackbarMessage('No group selected');
          setSnackbarOpen(true);
        }
      }, [groupId]);

      const fetchQuizzes = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await QuizService.getGroupQuizzes(groupId);
          const userId = localStorage.getItem('userId');
          
          // Transform backend data to match frontend interface
          const transformedQuizzes: Quiz[] = await Promise.all(
            response.data.map(async (quiz: any) => {
              // Try different possible ID field names
              const quizId = quiz.id || quiz._id || quiz.quizId || quiz.quiz_id || `quiz-${Date.now()}-${Math.random()}`;
              
              let completed = false;
              let score: number | undefined;
              let percentage: number | undefined;
              let maxScore = 0;
              
             
              if (quiz.questions && Array.isArray(quiz.questions)) {
                maxScore = quiz.questions.reduce((sum: number, q: any) => {
                  const points = q.points || 1; 
                  
                  return sum + points;
                }, 0);
                
              } else {
                
                const questionCount = quiz.questions?.length || 0;
                maxScore = questionCount;
                console.warn(`No questions array found for quiz ${quiz.title}, using fallback maxScore: ${maxScore}`);
              }
              
             
              if (userId && quizId) {
                try {
                  const userAttempts = await QuizAttemptService.getUserQuizAttempts(userId, quizId.toString());
                  
                  
                  if (userAttempts && userAttempts.attempts && userAttempts.attempts.length > 0) {
                    
                    completed = true;
                    
                    const bestAttempt = userAttempts.attempts.reduce((best, current) => 
                      current.score > best.score ? current : best
                    );
                    score = bestAttempt.score;
                    percentage = bestAttempt.percentage; 
                    
                    console.log(`Best attempt for quiz ${quiz.title}:`, {
                      score: bestAttempt.score,
                      totalQuestions: bestAttempt.totalQuestions,
                      percentage: bestAttempt.percentage,
                      calculatedMaxScore: maxScore,
                      calculatedPercentage: (bestAttempt.score / maxScore) * 100
                    });
                    
                    
                  }
                } catch (err) {
                  
                  console.log(`No attempts found for quiz ${quizId}:`, err);
                }
              }
              
              const transformed = {
                id: quizId.toString(), 
                title: quiz.title,
                description: quiz.description,
                difficulty: quiz.difficulty.toLowerCase(),
                timeLimit: quiz.timeLimit,
                instructions: quiz.instructions,
                questions: quiz.questions?.length || 0,
                completed,
                score,
                maxScore,
                percentage, 
                createdAt: quiz.createdAt,
                isNew: isQuizNew(quiz.createdAt)
              };
              return transformed;
            })
          );
          
          setQuizzes(transformedQuizzes);
          
          
          
        } catch (err: any) {
          console.error('Failed to fetch quizzes:', err);
          setError(err.message || 'Failed to load quizzes');
          setQuizzes([]);
          setSnackbarMessage('Failed to load quizzes. Please try again.');
          setSnackbarOpen(true);
        } finally {
          setLoading(false);
        }
      };

     
      const isQuizNew = (createdAt: string): boolean => {
        if (!createdAt) return false;
        const created = new Date(createdAt);
        const now = new Date();
        const diffInHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
        return diffInHours <= 24;
      };

      const handleStartQuiz = (quiz: Quiz) => {
        if (!quiz.id) {
          console.error('Quiz ID is missing or undefined!');
          setSnackbarMessage('Error: Quiz ID is missing. Please try again.');
          setSnackbarOpen(true);
          return;
        }
        
       
        if (isStartingRef.current[quiz.id]) {
          console.log(`Quiz selection already in progress for quiz ${quiz.id} - skipping`);
          return;
        }
        
       
        isStartingRef.current[quiz.id] = true;
        setStartingQuiz(quiz.id);
        setSnackbarMessage('Loading quiz...');
        setSnackbarOpen(true);
        
        console.log('Navigating to quiz:', quiz.id);
        
       
        setSelectedQuiz(quiz);
        
        
        setTimeout(() => {
          isStartingRef.current[quiz.id] = false;
          setStartingQuiz(null);
        }, 1000);
      };

      const handleQuizComplete = (results: QuizCompletionResponse) => {
        
        let maxPossibleScore = 0;
        
        if (results.results && Array.isArray(results.results)) {
          maxPossibleScore = results.results.reduce((sum, result) => sum + (result.points || 0), 0);
        } else {
          
          console.warn('Quiz results array is missing, using fallback maxScore calculation');
          if (selectedQuiz && selectedQuiz.maxScore) {
            maxPossibleScore = selectedQuiz.maxScore;
          } else {
           
            maxPossibleScore = results.totalQuestions || 1;
          }
        }
        
        console.log('Quiz completion data:', {
          results,
          maxPossibleScore,
          selectedQuiz: selectedQuiz?.title
        });
        
        
        setQuizzes(prevQuizzes => 
          prevQuizzes.map(q => 
            q.id === selectedQuiz?.id 
              ? { ...q, completed: true, score: results.score, maxScore: maxPossibleScore }
              : q
          )
        );
        
        
        setSelectedQuiz(null);
      };

      const handleBackToQuizzes = () => {
        setSelectedQuiz(null);
      };

      const handleShowResults = (quiz: Quiz) => {
        setShowingResults(quiz);
      };

      const handleBackFromResults = () => {
        setShowingResults(null);
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

      const getScoreColor = (quiz: Quiz): string => {
        if (quiz.percentage !== undefined) {
          
          if (quiz.percentage >= 90) return "success";
          if (quiz.percentage >= 80) return "primary";
          if (quiz.percentage >= 70) return "warning";
          return "error";
        } else {
          
          if (!quiz.maxScore || quiz.maxScore === 0) return "primary";
          const percentage = ((quiz.score || 0) / quiz.maxScore) * 100;
          if (isNaN(percentage)) return "primary";
          if (percentage >= 90) return "success";
          if (percentage >= 80) return "primary";
          if (percentage >= 70) return "warning";
          return "error";
        }
      };

      const getPerformanceText = (quiz: Quiz): string => {
        const percentage = quiz.percentage !== undefined 
          ? quiz.percentage 
          : ((quiz.score || 0) / (quiz.maxScore || 1)) * 100;
        
        if (isNaN(percentage)) return "Keep Trying!";
        if (percentage >= 90) return "Excellent!";
        if (percentage >= 80) return "Great Job!";
        if (percentage >= 70) return "Good Work!";
        return "Keep Trying!";
      };

      
      if (selectedQuiz) {
        return (
          <QuizTakerNew
            quizId={selectedQuiz.id}
            onComplete={handleQuizComplete}
            onBack={handleBackToQuizzes}
          />
        );
      }

      
      if (showingResults) {
        const userId = localStorage.getItem('userId') || '';
        return (
          <QuizResults
            quizId={showingResults.id}
            quizTitle={showingResults.title}
            userId={userId}
            onBack={handleBackFromResults}
          />
        );
      }

      const completedQuizzes = quizzes.filter((q) => q.completed).length;
      const totalQuizzes = quizzes.length;


      let averageScore = (completedQuizzes / totalQuizzes) * 100; 

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
                  color="primary"
                >
                  {loading ? "Refreshing..." : "Refresh"}
                </Button>
                
                {workspaceData?.role === "admin" && (
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate('/quiz-creator', { state: { groupId } })}
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
                        {isNaN(averageScore) ? 0 : Math.round(averageScore)}%
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
                      bgcolor: "rgba(255,255,255,0.2)",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "white",
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
                                      boxShadow: `0 0 0 0 ${theme.palette.error.main}70`,
                                    },
                                    '70%': {
                                      boxShadow: `0 0 0 10px ${theme.palette.error.main}00`,
                                    },
                                    '100%': {
                                      boxShadow: `0 0 0 0 ${theme.palette.error.main}00`,
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
                              bgcolor: "background.default",
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
                                justifyContent: "flex-end",
                                alignItems: "center",
                                mb: 1,
                              }}
                            >
                              <Chip
                                label={getPerformanceText(quiz)}
                                color={getScoreColor(quiz) as any}
                                size="small"
                                icon={<TrendingIcon />}
                              />
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={
                                quiz.percentage !== undefined 
                                  ? Math.min(100, Math.max(0, quiz.percentage))
                                  : quiz.maxScore && quiz.score !== undefined 
                                    ? Math.min(100, Math.max(0, (quiz.score / quiz.maxScore) * 100))
                                    : 0
                              }
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: "action.disabled",
                                "& .MuiLinearProgress-bar": {
                                  borderRadius: 4,
                                },
                              }}
                              color={
                                getScoreColor(quiz) as any
                              }
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ mt: 0.5, display: "block" }}
                            >
                              {quiz.percentage !== undefined
                                ? Math.round(quiz.percentage)
                                : quiz.maxScore && quiz.score !== undefined
                                  ? Math.round((quiz.score / quiz.maxScore) * 100)
                                  : 0}% -
                              {(quiz.percentage !== undefined ? quiz.percentage : ((quiz.score || 0) / (quiz.maxScore || 1)) * 100) >= 90
                                ? " Outstanding!"
                                : (quiz.percentage !== undefined ? quiz.percentage : ((quiz.score || 0) / (quiz.maxScore || 1)) * 100) >= 80
                                ? " Well Done!"
                                : (quiz.percentage !== undefined ? quiz.percentage : ((quiz.score || 0) / (quiz.maxScore || 1)) * 100) >= 70
                                ? " Good Effort!"
                                : " Keep Practicing!"}
                            </Typography>
                          </Paper>
                        )}
                      </CardContent>

                      <CardActions sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
                        {!quiz.completed ? (
                          <Button
                            variant="contained"
                            fullWidth
                            startIcon={startingQuiz === quiz.id ? <CircularProgress size={16} /> : <PlayIcon />}
                            onClick={() => {
                              handleStartQuiz(quiz);
                            }}
                            disabled={startingQuiz === quiz.id}
                            sx={{
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: "medium",
                              py: 1,
                              boxShadow: 3,
                              "&:hover": {
                                transform: startingQuiz === quiz.id ? "none" : "scale(1.02)",
                                boxShadow: startingQuiz === quiz.id ? "none" : 6,
                              },
                              transition: "all 0.2s ease-in-out",
                            }}
                          >
                            {startingQuiz === quiz.id ? "Starting..." : "Take Quiz"}
                          </Button>
                        ) : (
                          <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                            <Button
                              variant="outlined"
                              fullWidth
                              startIcon={<PlayIcon />}
                              onClick={() => handleStartQuiz(quiz)}
                              disabled={startingQuiz === quiz.id}
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: "medium",
                                py: 1,
                              }}
                            >
                              Retake Quiz
                            </Button>
                            <Button
                              variant="contained"
                              fullWidth
                              startIcon={<StarIcon />}
                              onClick={() => handleShowResults(quiz)}
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
                              View Results
                            </Button>
                          </Box>
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
                    sx={{ fontSize: 80, color: "primary.main", mb: 2, opacity: 0.7 }}
                  />
                  <Typography variant="h5" sx={{ color: "primary.main", fontWeight: "bold" }} gutterBottom>
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
                      color="primary"
                      startIcon={<AssignmentIcon />}
                      onClick={() => navigate('/quiz-creator', { state: { groupId } })}
                      sx={{ mt: 2 }}
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



    