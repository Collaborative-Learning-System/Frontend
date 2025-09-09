import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Snackbar,
  useTheme,
} from "@mui/material";
import {
  ExpandMore,
  Download,
  Edit,
  Save,
  Share,
  CheckCircle,
  Schedule,
  MenuBook,
  Timer,
  TrendingUp,
} from "@mui/icons-material";

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

interface StudyPlan {
  title: string;
  duration: string;
  totalHours: number;
  subjects: string[];
  schedule: StudyDay[];
  tips: string[];
}

interface StudyPlanDisplayProps {
  studyPlan: StudyPlan;
  onSave?: (plan: StudyPlan) => void;
  onEdit?: () => void;
}

export default function StudyPlanDisplay({
  studyPlan,
  onSave,
  onEdit,
}: StudyPlanDisplayProps) {
  const [expanded, setExpanded] = useState<string>("day-0");
  const [planData, setPlanData] = useState(studyPlan);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  //const [snackbarMessage, setSnackbarMessage] = useState("");
  const theme = useTheme();

  const handleAccordionChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : "");
    };

  const toggleTaskCompletion = (dayIndex: number, taskId: string) => {
    setPlanData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              tasks: day.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task
              ),
            }
          : day
      ),
    }));
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "study":
        return <MenuBook sx={{ color: "#083c70ff" }} />;
      case "review":
        return <TrendingUp sx={{ color: "#4caf50" }} />;
      case "practice":
        return <Edit sx={{ color: "#ff9800" }} />;
      case "break":
        return <Timer sx={{ color: "#9e9e9e" }} />;
      default:
        return <Schedule sx={{ color: "#083c70ff" }} />;
    }
  };

  const getTaskColor = (type: string) => {
    switch (type) {
      case "study":
        return "#083c70ff";
      case "review":
        return "#4caf50";
      case "practice":
        return "#ff9800";
      case "break":
        return "#9e9e9e";
      default:
        return "#083c70ff";
    }
  };

  const completedTasks = planData.schedule.reduce(
    (total, day) => total + day.tasks.filter((task) => task.completed).length,
    0
  );
  const totalTasks = planData.schedule.reduce(
    (total, day) => total + day.tasks.length,
    0
  );
  const progressPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleExport = () => {
    const planText = `
Study Plan: ${planData.title}
Duration: ${planData.duration}
Total Hours: ${planData.totalHours}

${planData.schedule
  .map(
    (day) => `
${day.dayName} - ${day.date}
${day.tasks
  .map((task) => `• ${task.topic} (${task.duration}h) - ${task.type}`)
  .join("\n")}
`
  )
  .join("\n")}

Study Tips:
${planData.tips.map((tip) => `• ${tip}`).join("\n")}
    `;

    const blob = new Blob([planText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${planData.title.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Plan Header */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ color: "#083c70ff", fontWeight: "bold" }}
              >
                {planData.title}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {planData.duration} • {planData.totalHours} total hours
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
                {planData.subjects.map((subject, index) => (
                  <Chip
                    key={index}
                    label={subject}
                    sx={{ bgcolor: theme.palette.primary.main, color: "white" }}
                  />
                ))}
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton onClick={onEdit} sx={{ color: "#083c70ff" }}>
                <Edit />
              </IconButton>
              <IconButton onClick={handleExport} sx={{ color: "#083c70ff" }}>
                <Download />
              </IconButton>
              <IconButton sx={{ color: "#083c70ff" }}>
                <Share />
              </IconButton>
            </Box>
          </Box>

          {/* Progress */}
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Overall Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {completedTasks}/{totalTasks} tasks completed
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "#e0e0e0",
                "& .MuiLinearProgress-bar": {
                  bgcolor: progressPercentage === 100 ? "#4caf50" : "#083c70ff",
                  borderRadius: 4,
                },
              }}
            />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={() => onSave?.(planData)}
              sx={{ bgcolor: "#083c70ff", "&:hover": { bgcolor: "#0d47a1" } }}
            >
              Save Plan
            </Button>
            {/* <Button
              variant="outlined"
              startIcon={<CalendarToday />}
              
              sx={{ color: '#083c70ff', borderColor: '#083c70ff' }}
            >
              Add to Calendar
            </Button> */}
          </Box>
        </CardContent>
      </Card>

      {/* Daily Schedule */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#083c70ff", fontWeight: "bold", mb: 3 }}
          >
            Daily Schedule
          </Typography>

          {planData.schedule.map((day, dayIndex) => (
            <Accordion
              key={dayIndex}
              expanded={expanded === `day-${dayIndex}`}
              onChange={handleAccordionChange(`day-${dayIndex}`)}
              sx={{ mb: 1, "&:before": { display: "none" } }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    mr: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {day.dayName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {day.date} • {day.totalHours} hours •{" "}
                      {day.tasks.filter((t) => t.completed).length}/
                      {day.tasks.length} completed
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (day.tasks.filter((t) => t.completed).length /
                        day.tasks.length) *
                      100
                    }
                    sx={{ width: 100, mr: 2 }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {day.tasks.map((task, taskIndex) => (
                    <Grid size={{ xs: 12 }} key={taskIndex}>
                      <Card
                        variant="outlined"
                        sx={{
                          opacity: task.completed ? 0.7 : 1,
                          borderColor: task.completed ? "#4caf50" : "divider",
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <IconButton
                              onClick={() =>
                                toggleTaskCompletion(dayIndex, task.id)
                              }
                              sx={{
                                color: task.completed
                                  ? "#4caf50"
                                  : "action.disabled",
                                "&:hover": { bgcolor: "action.hover" },
                              }}
                            >
                              <CheckCircle />
                            </IconButton>

                            {getTaskIcon(task.type)}

                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: "bold",
                                  textDecoration: task.completed
                                    ? "line-through"
                                    : "none",
                                }}
                              >
                                {task.topic}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {task.description}
                              </Typography>
                            </Box>

                            <Box sx={{ textAlign: "right" }}>
                              <Chip
                                label={task.type}
                                size="small"
                                sx={{
                                  bgcolor: getTaskColor(task.type),
                                  color: "white",
                                  mb: 0.5,
                                }}
                              />
                              <Typography
                                variant="caption"
                                display="block"
                                color="text.secondary"
                              >
                                {task.duration}h
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>

      {/* Study Tips */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#083c70ff", fontWeight: "bold", mb: 3 }}
          >
            Personalized Study Tips
          </Typography>
          <Grid container spacing={2}>
            {planData.tips.map((tip, index) => (
              <Grid size={{ xs: 12 }} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    p: 2,
                    bgcolor: "#f8f9fa",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "#083c70ff", minWidth: 24 }}
                  >
                    {index + 1}.
                  </Typography>
                  <Typography variant="body1">{tip}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {/* <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert> */}
      </Snackbar>
    </Box>
  );
}
