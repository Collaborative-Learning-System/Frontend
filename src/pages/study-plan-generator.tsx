import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import {
  AutoAwesome,
  Schedule,
  CheckCircle,
} from "@mui/icons-material";

import StudyPlanForm from "../components/StudyPlanForm";
import StudyPlanDisplay from "../components/StudyPlanDisplay";

interface StudyPlanFormData {
  subjects: string[];
  studyGoal: string;
  startDate: string;
  endDate: string;
  dailyHours: number;
  preferredTimes: string[];
  learningStyle: string;
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

  const steps = ["Configure Plan", "Generate", "Review & Save"];
  const theme = useTheme();

  // Mock AI plan generation
  const generateStudyPlan = async (formData: StudyPlanFormData) => {
    setIsGenerating(true);

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 3000));

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
    setIsGenerating(false);
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
            description: getTaskDescription(subject, formData.learningStyle),
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
    const tips = [
      `As a ${formData.learningStyle.toLowerCase()} learner, focus on ${
        formData.learningStyle === "Visual"
          ? "diagrams and visual aids"
          : formData.learningStyle === "Auditory"
          ? "listening and discussion"
          : formData.learningStyle === "Kinesthetic"
          ? "hands-on practice"
          : "reading and note-taking"
      }.`,
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
      "Join study groups or find study partners for better engagement.",
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
  };

  // const handleStartOver = () => {
  //   setCurrentStep(0);
  //   setGeneratedPlan(null);
  //   setIsGenerating(false);
  // };

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
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
                            ? theme.palette.success?.main ||
                              theme.palette.primary.main
                            : active
                            ? theme.palette.primary.main
                            : theme.palette.action?.disabled ||
                              theme.palette.grey[300],
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
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
                <Box sx={{ width: 300 }}>
                  {/* Add loading animation here */}
                </Box>
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
    </Box>
  );
}
