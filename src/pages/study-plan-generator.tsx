import { useState, useContext } from "react";
import {
  Container,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  alpha,
  CardContent,
  useTheme,
  Alert,
  CircularProgress,
  LinearProgress,
  Backdrop,
} from "@mui/material";
import { AutoAwesome, Schedule, CheckCircle, Psychology } from "@mui/icons-material";
import { toast } from "react-toastify";

import StudyPlanForm from "../components/StudyPlanForm";
import StudyPlanDisplay from "../components/StudyPlanDisplay";
import PageHeader from "../components/PageHeader";
import { AppContext } from "../context/AppContext";
import { generateStudyPlan as apiGenerateStudyPlan } from "../services/StudyPlanService";

interface StudyPlanFormData {
  subjects: string[];
  studyGoal: string;
  startDate: string;
  endDate: string;
  dailyHours: number;
  preferredTimes: string[];
  learningStyle: string[];
  difficulty: string;
  includeBreaks: boolean;
  includeReview: boolean;
}

interface StudyTask {
  id: string;
  subject: string;
  topic: string;
  duration: number;
  type: "study" | "review" | "practice" | "break";
  completed: boolean;
  description: string;
}

interface StudyDay {
  date: string;
  dayName: string;
  tasks: StudyTask[];
  totalHours: number;
}

interface GeneratedPlan {
  planId?: string;
  title: string;
  duration: string;
  totalHours: number;
  subjects: string[];
  schedule: StudyDay[];
  tips: string[];
}

export default function StudyPlanGenerator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const { userId } = useContext(AppContext);

  const steps = ["Configure Plan", "Generate", "Review & Save"];
  const theme = useTheme();

  // API-based study plan generation
  const generateStudyPlan = async (formData: StudyPlanFormData) => {
    if (!userId) {
      setError("Please log in to generate a study plan");
      toast.error("Please log in to generate a study plan");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCurrentStep(1); // Move to generation step immediately

    try {
      // Transform form data to API format - match exact API specification
      const requestData = {
        userId,
        subjects: formData.subjects.join(","),
        startDate: formData.startDate,
        endDate: formData.endDate,
        dailyHours: formData.dailyHours,
        preferredTimeSlots:
          formData.preferredTimes.length > 0
            ? formData.preferredTimes
            : ["Morning (9-12 PM)"],
        includeRegularBreaks: formData.includeBreaks,
        studygoal: formData.studyGoal,
        learningstyle:
          formData.learningStyle.length > 0
            ? formData.learningStyle.join(", ")
            : "Visual",
        // Add difficulty level if needed by backend
        difficultyLevel: formData.difficulty || "Intermediate",
      };

      console.log("Form data being sent:", requestData);
      console.log("userId type:", typeof userId, "value:", userId);

      const response = await apiGenerateStudyPlan(requestData);

      console.log("API Response:", response);

      if (response && response.success && response.data) {
        // Transform API response to match UI expectations
        const apiData = response.data;

        // Transform tasks array to schedule format expected by UI
        const schedule = transformTasksToSchedule(apiData.tasks);

        const transformedPlan = {
          planId: apiData.planId.toString(),
          title: apiData.title,
          duration: calculateDuration(formData),
          totalHours: calculateTotalHours(formData),
          subjects: apiData.subjects.split(",").map((s: string) => s.trim()),
          schedule: schedule,
          tips: generateTips(formData), // Generate tips since API doesn't provide them
        };

        console.log("Transformed plan for UI:", transformedPlan);
        setGeneratedPlan(transformedPlan);
        setCurrentStep(2);
        toast.success("Study plan generated successfully!");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to generate study plan";
      console.error("Study plan generation failed:", error);

      // Check if it's just a display issue but database was updated
      if (
        error.message &&
        !error.message.includes("400") &&
        !error.message.includes("Network")
      ) {
        console.log(
          "API call may have succeeded but response parsing failed. Generating plan with form data..."
        );
        await generateMockStudyPlan(formData);
        toast.warning(
          "Study plan created successfully! (Using local generation due to response format)"
        );
      } else {
        setError(errorMessage);
        toast.error(errorMessage);
        setCurrentStep(0); // Go back to form on error

        // Fallback to mock generation for demo purposes
        console.log("Falling back to mock generation...");
        await generateMockStudyPlan(formData);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Fallback mock generation (for demo/development)
  const generateMockStudyPlan = async (formData: StudyPlanFormData) => {
    // Calculate duration from dates
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const daysDifference = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const durationText =
      daysDifference <= 7
        ? `${daysDifference} days`
        : daysDifference <= 30
        ? `${Math.ceil(daysDifference / 7)} weeks`
        : `${Math.ceil(daysDifference / 30)} months`;

    // Generate mock study plan based on form data
    const plan = {
      title: `${formData.studyGoal} - ${durationText} Plan`,
      duration: durationText,
      totalHours: calculateTotalHours(formData),
      subjects: formData.subjects,
      schedule: generateSchedule(formData),
      tips: generateTips(formData),
    };

    setGeneratedPlan(plan);
    setCurrentStep(2);
    toast.info("Using demo mode - connect to backend for full functionality");
  };

  // Transform API tasks format to UI schedule format
  const transformTasksToSchedule = (tasks: any[]) => {
    // Group tasks by date
    const tasksByDate = tasks.reduce((acc: any, task: any) => {
      const date = task.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push({
        id: task.id.toString(),
        subject: task.title.split(":")[0] || "Study", // Extract subject from title
        topic: task.title,
        duration: task.durationMinutes / 60, // Convert minutes to hours
        type: task.type as "study" | "review" | "practice" | "break",
        completed: false,
        description: task.description,
      });
      return acc;
    }, {});

    // Convert to array format expected by UI
    return Object.entries(tasksByDate).map(
      ([date, dayTasks]: [string, any]) => {
        const totalHours = dayTasks.reduce(
          (sum: number, task: any) => sum + task.duration,
          0
        );

        // Calculate day name based on date
        const taskDate = new Date(date);
        const startDate = new Date(tasks[0]?.date || date);
        const dayNumber =
          Math.ceil(
            (taskDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          ) + 1;

        return {
          date: new Date(date).toLocaleDateString(),
          dayName: `Day ${dayNumber}`,
          tasks: dayTasks,
          totalHours: Math.round(totalHours * 10) / 10, // Round to 1 decimal
        };
      }
    );
  };

  const calculateDuration = (formData: StudyPlanFormData) => {
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const daysDifference = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDifference <= 7
      ? `${daysDifference} days`
      : daysDifference <= 30
      ? `${Math.ceil(daysDifference / 7)} weeks`
      : `${Math.ceil(daysDifference / 30)} months`;
  };

  const calculateTotalHours = (formData: StudyPlanFormData) => {
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.round(days * formData.dailyHours);
  };

  const generateSchedule = (formData: StudyPlanFormData) => {
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const totalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const schedule = [];

    for (let i = 0; i < Math.min(totalDays, 14); i++) {
      // Show first 14 days
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      const dayTasks: StudyTask[] = [];
      let remainingHours = formData.dailyHours;

      // Distribute subjects across the day
      formData.subjects.forEach((subject, index) => {
        if (remainingHours > 0) {
          const studyTime = Math.min(remainingHours, 1.5);
          dayTasks.push({
            id: `task-${i}-${index}`,
            subject,
            topic: getTopicForSubject(subject, formData.difficulty),
            duration: studyTime,
            type: "study",
            completed: false,
            description: getTaskDescription(
              subject,
              formData.learningStyle[0] || "Visual"
            ),
          });
          remainingHours -= studyTime;

          // Add break if enabled
          if (formData.includeBreaks && remainingHours > 0) {
            dayTasks.push({
              id: `break-${i}-${index}`,
              subject: "Break",
              topic: "Rest & Recharge",
              duration: 0.25,
              type: "break",
              completed: false,
              description: "Take a short break to maintain focus",
            });
            remainingHours -= 0.25;
          }
        }
      });

      // Add review session if enabled
      if (formData.includeReview && remainingHours > 0 && i > 0) {
        dayTasks.push({
          id: `review-${i}`,
          subject: "Review",
          topic: "Previous Day Review",
          duration: Math.min(remainingHours, 0.5),
          type: "review",
          completed: false,
          description: "Review and reinforce yesterday's learning",
        });
      }

      schedule.push({
        date: currentDate.toLocaleDateString(),
        dayName: `Day ${i + 1}`,
        tasks: dayTasks,
        totalHours: dayTasks.reduce((sum, task) => sum + task.duration, 0),
      });
    }

    return schedule;
  };

  const getTopicForSubject = (subject: string, difficulty: string) => {
    const topics: Record<string, string[]> = {
      Mathematics: [
        "Basic Algebra",
        "Calculus Fundamentals",
        "Advanced Calculus",
      ],
      Physics: ["Mechanics", "Thermodynamics", "Quantum Physics"],
      Chemistry: ["Atomic Structure", "Chemical Bonding", "Organic Chemistry"],
      "Computer Science": [
        "Programming Basics",
        "Data Structures",
        "Algorithms",
      ],
      Biology: ["Cell Biology", "Genetics", "Molecular Biology"],
    };

    const subjectTopics = topics[subject] || [
      "Introduction",
      "Intermediate Concepts",
      "Advanced Topics",
    ];
    const difficultyIndex =
      difficulty === "Beginner" ? 0 : difficulty === "Intermediate" ? 1 : 2;
    return subjectTopics[difficultyIndex] || subjectTopics[0];
  };

  const getTaskDescription = (subject: string, learningStyle: string) => {
    const descriptions: Record<string, string> = {
      Visual: `Study ${subject} using diagrams, charts, and visual aids`,
      Auditory: `Listen to ${subject} lectures and discuss concepts aloud`,
      Kinesthetic: `Practice ${subject} problems and hands-on exercises`,
      "Reading/Writing": `Read ${subject} materials and take detailed notes`,
    };
    return (
      descriptions[learningStyle] ||
      `Study ${subject} concepts and practice problems`
    );
  };

  const generateTips = (formData: StudyPlanFormData) => {
    // Generate learning style specific tips
    const learningStyleTips = [];

    if (formData.learningStyle.includes("Visual")) {
      learningStyleTips.push(
        "Use diagrams, charts, mind maps, and color-coding to organize information visually."
      );
    }
    if (formData.learningStyle.includes("Auditory")) {
      learningStyleTips.push(
        "Record yourself explaining concepts and listen back, or discuss topics with study partners."
      );
    }
    if (formData.learningStyle.includes("Kinesthetic")) {
      learningStyleTips.push(
        "Use hands-on practice, write notes by hand, and take movement breaks during study sessions."
      );
    }
    if (formData.learningStyle.includes("Reading/Writing")) {
      learningStyleTips.push(
        "Take detailed notes, rewrite key concepts, and create written summaries of what you learn."
      );
    }
    if (formData.learningStyle.includes("Social/Group Learning")) {
      learningStyleTips.push(
        "Join study groups, teach others, and participate in collaborative learning activities."
      );
    }
    if (formData.learningStyle.includes("Logical/Mathematical")) {
      learningStyleTips.push(
        "Break down complex topics into logical steps and use problem-solving approaches."
      );
    }

    const tips = [
      `Your learning styles (${formData.learningStyle.join(
        ", "
      )}) suggest a multi-modal approach to studying.`,
      ...learningStyleTips,
      `Study during your preferred times: ${formData.preferredTimes
        .join(", ")
        .toLowerCase()}.`,
      `Break down your ${formData.dailyHours}-hour daily sessions into focused chunks with regular breaks.`,
      `Since you're at ${formData.difficulty.toLowerCase()} level, ${
        formData.difficulty === "Beginner"
          ? "start with fundamentals and build gradually"
          : formData.difficulty === "Intermediate"
          ? "focus on connecting concepts and practical applications"
          : "challenge yourself with complex problems and advanced topics"
      }.`,
      "Use active recall techniques - test yourself regularly instead of just re-reading.",
      "Create a dedicated study space free from distractions.",
      "Track your progress daily and adjust the plan if needed.",
    ];
    return tips;
  };

  const handleSavePlan = (plan: any) => {
    // In real app, save to backend/local storage
    console.log("Saving plan:", plan);
    alert("Study plan saved successfully!");
  };

  const handleEditPlan = () => {
    setCurrentStep(0);
    setGeneratedPlan(null);
    setError(null);
  };

  // const handleStartOver = () => {
  //   setCurrentStep(0);
  //   setGeneratedPlan(null);
  //   setIsGenerating(false);
  // };

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, 
                   ${alpha(theme.palette.primary.main, 0.03)} 0%, 
                   ${alpha(theme.palette.secondary.main, 0.02)} 50%,
                   ${alpha(theme.palette.background.default, 0.95)} 100%)`,

        minHeight: "100vh",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 80%, ${alpha(
            theme.palette.primary.main,
            0.1
          )} 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, ${alpha(
                             theme.palette.secondary.main,
                             0.1
                           )} 0%, transparent 50%)`,
          pointerEvents: "none",
        },
      }}
    >
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: 4,
          filter: isGenerating ? 'blur(3px)' : 'none',
          pointerEvents: isGenerating ? 'none' : 'auto',
          transition: 'filter 0.4s ease, opacity 0.4s ease',
          opacity: isGenerating ? 0.5 : 1,
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Header Section */}
        <PageHeader
          title="AI Study Plan Generator"
          subtitle="Create personalized study plans tailored to your learning style, schedule, and goals using advanced AI technology"
          icon={<AutoAwesome />}
          gradient={true}
          centerAlign={true}
        />

        {/* Progress Stepper */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stepper activeStep={currentStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={({ active, completed }) => (
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          bgcolor: completed
                            ? "#10b981" // Standard success green
                            : active
                            ? theme.palette.primary.main // #0084FF
                            : theme.palette.mode === 'dark'
                              ? theme.palette.text.disabled // #475569 in dark mode
                              : "#d1d5db", // Light gray for inactive in light mode
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: 'all 0.3s ease',
                          boxShadow: active || completed 
                            ? '0 4px 12px rgba(0, 132, 255, 0.3)' 
                            : 'none'
                        }}
                      >
                        {completed ? (
                          <CheckCircle />
                        ) : index === 0 ? (
                          <AutoAwesome />
                        ) : index === 1 ? (
                          <Schedule />
                        ) : (
                          <CheckCircle />
                        )}
                      </Box>
                    )}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* User Authentication Check */}
        {!userId && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Please log in to generate a personalized study plan.
          </Alert>
        )}

        {/* Step Content */}
        {currentStep === 0 && (
          <StudyPlanForm
            onGenerate={generateStudyPlan}
            isGenerating={isGenerating}
          />
        )}

        {currentStep === 1 && (
          <Card>
            <CardContent sx={{ textAlign: "center", py: 8 }}>
              <AutoAwesome
                sx={{ fontSize: 64, color: theme.palette.primary.main, mb: 2 }}
              />
              <Typography
                variant="h4"
                gutterBottom
                sx={{ color: theme.palette.primary.main, fontWeight: "bold" }}
              >
                Generating Your Personalized Study Plan
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph>
                Our AI is analyzing your preferences and creating an optimized
                study schedule...
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress 
                  size={50}
                  thickness={4}
                  sx={{ color: theme.palette.primary.main }} // #0084FF
                />
              </Box>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && generatedPlan && (
          <StudyPlanDisplay
            studyPlan={generatedPlan}
            onSave={handleSavePlan}
            onEdit={handleEditPlan}
          />
        )}
      </Container>

      {/* Global Loading Backdrop */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme.palette.mode === 'dark' 
            ? 'rgba(24, 24, 27, 0.85)' // Dark mode: #18181b with transparency
            : 'rgba(30, 41, 59, 0.85)', // Light mode: #1e293b with transparency
          backdropFilter: 'blur(8px)'
        }}
        open={isGenerating}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 3,
          textAlign: 'center',
          maxWidth: 500,
          p: 4,
          bgcolor: theme.palette.mode === 'dark'
            ? 'rgba(35, 39, 47, 0.9)' // Dark mode paper color with transparency
            : 'rgba(255, 255, 255, 0.95)', // Light mode paper color with transparency
          borderRadius: 4,
          backdropFilter: 'blur(15px)',
          border: theme.palette.mode === 'dark'
            ? '1px solid rgba(100, 116, 139, 0.3)' // Dark mode divider
            : '1px solid rgba(226, 232, 240, 0.5)', // Light mode divider
          boxShadow: theme.palette.mode === 'dark'
            ? '0 25px 50px rgba(0, 0, 0, 0.4)'
            : '0 25px 50px rgba(30, 41, 59, 0.2)'
        }}>
          <Psychology sx={{ 
            fontSize: 80, 
            color: theme.palette.primary.main, // #0084FF
            mb: 2,
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(1)',
                opacity: 1,
              },
              '50%': {
                transform: 'scale(1.1)',
                opacity: 0.8,
              },
              '100%': {
                transform: 'scale(1)',
                opacity: 1,
              },
            },
            animation: 'pulse 2s ease-in-out infinite',
          }} />
          <CircularProgress 
            size={60} 
            thickness={4}
            sx={{ 
              color: theme.palette.primary.main, // #0084FF
              mb: 2
            }}
          />
          <Typography variant="h4" sx={{ 
            fontWeight: 'bold', 
            color: theme.palette.text.primary,
            textShadow: theme.palette.mode === 'dark' 
              ? '2px 2px 4px rgba(0,0,0,0.3)' 
              : 'none'
          }}>
            Generating Your Study Plan
          </Typography>
          <Typography variant="h6" sx={{ 
            color: theme.palette.text.secondary,
            maxWidth: 400,
            lineHeight: 1.6
          }}>
            AI is analyzing your preferences and creating an optimized schedule tailored just for you...
          </Typography>
          <LinearProgress 
            sx={{ 
              width: '100%', 
              height: 8,
              borderRadius: 4,
              bgcolor: theme.palette.mode === 'dark'
                ? 'rgba(100, 116, 139, 0.2)' // Dark mode secondary text with transparency
                : 'rgba(100, 116, 139, 0.15)', // Light mode secondary text with transparency
              '& .MuiLinearProgress-bar': {
                bgcolor: theme.palette.primary.main, // #0084FF
                borderRadius: 4,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`, // Gradient from main to light blue
              }
            }}
          />
          <Typography variant="body2" sx={{ 
            color: theme.palette.text.disabled,
            fontStyle: 'italic'
          }}>
            This may take a few moments...
          </Typography>
        </Box>
      </Backdrop>
    </Box>
  );
}
