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
  useTheme,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Download,
  Edit,
  Save,
  Share,
  CheckCircle,
  Schedule,
  MenuBook,
  Timer,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Today,
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
  const [planData, setPlanData] = useState(studyPlan);
  
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const theme = useTheme();

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  // Helper function to format duration from decimal hours to hours and minutes
  const formatDuration = (decimalHours: number) => {
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    
    if (hours === 0) {
      return `${minutes}min`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}min`;
    }
  };

  const getTasksForDate = (date: string) => {
    return planData.schedule.find(day => day.date === date);
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

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfWeek = getFirstDayOfMonth(currentMonth);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = formatDate(date);
      const dayTasks = getTasksForDate(dateString);
      days.push({
        date: day,
        dateString,
        tasks: dayTasks?.tasks || [],
        hasEvents: !!dayTasks
      });
    }
    
    return days;
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "study":
        return <MenuBook sx={{ color: "primary.main" }} />;
      case "review":
        return <TrendingUp sx={{ color: "success.main" }} />;
      case "practice":
        return <Edit sx={{ color: "warning.main" }} />;
      case "break":
        return <Timer sx={{ color: "text.disabled" }} />;
      default:
        return <Schedule sx={{ color: "primary.main" }} />;
    }
  };

  const getTaskColor = (type: string) => {
    switch (type) {
      case "study":
        return theme.palette.primary.main;
      case "review":
        return theme.palette.success?.main || "#4caf50";
      case "practice":
        return theme.palette.warning?.main || "#ff9800";
      case "break":
        return theme.palette.text.disabled;
      default:
        return theme.palette.primary.main;
    }
  };



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
  .map((task) => `• ${task.topic} (${formatDuration(task.duration)}) - ${task.type}`)
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

  const calendarDays = generateCalendarDays();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      gap: 3,
      bgcolor: theme.palette.background.default,
      minHeight: '100vh',
      p: 3
    }}>
      {/* Plan Header */}
      <Card sx={{ 
        borderRadius: 4,
        boxShadow: theme.palette.mode === 'dark' 
          ? '0 10px 30px rgba(0,0,0,0.3)' 
          : '0 10px 30px rgba(0,0,0,0.1)',
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`
          : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
            <Box>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold", textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                {planData.title}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                {planData.duration} • {planData.totalHours} total hours
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {planData.subjects.map((subject, index) => (
                  <Chip
                    key={index}
                    label={subject}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      fontWeight: 'bold',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                ))}
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton onClick={onEdit} sx={{ color: "white", bgcolor: 'rgba(255,255,255,0.1)' }}>
                <Edit />
              </IconButton>
              <IconButton onClick={handleExport} sx={{ color: "white", bgcolor: 'rgba(255,255,255,0.1)' }}>
                <Download />
              </IconButton>
              <IconButton sx={{ color: "white", bgcolor: 'rgba(255,255,255,0.1)' }}>
                <Share />
              </IconButton>
            </Box>
          </Box>

          {/* Progress
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Overall Progress
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {completedTasks}/{totalTasks} tasks completed
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{
                height: 12,
                borderRadius: 6,
                bgcolor: 'rgba(255,255,255,0.2)',
                "& .MuiLinearProgress-bar": {
                  bgcolor: progressPercentage === 100 ? "#4caf50" : "#ffd54f",
                  borderRadius: 6,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                },
              }}
            />
          </Box> */}

          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={() => onSave?.(planData)}
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              backdropFilter: 'blur(10px)',
              "&:hover": { bgcolor: 'rgba(255,255,255,0.3)' },
              borderRadius: 3,
              px: 3,
              py: 1
            }}
          >
            Save Plan
          </Button>
        </CardContent>
      </Card>

      {/* Calendar View */}
      <Card sx={{ 
        borderRadius: 4,
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: 0 }}>
          {/* Calendar Header */}
          <Box sx={{ 
            p: 3, 
            bgcolor: theme.palette.primary.main,
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <IconButton onClick={() => navigateMonth('prev')} sx={{ color: 'white' }}>
              <ChevronLeft />
            </IconButton>
            <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Typography>
            <IconButton onClick={() => navigateMonth('next')} sx={{ color: 'white' }}>
              <ChevronRight />
            </IconButton>
          </Box>

          {/* Weekday Headers */}
          <Grid container sx={{ 
            bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100], 
            borderBottom: `2px solid ${theme.palette.divider}` 
          }}>
            {weekdays.map((day) => (
              <Grid size={{ xs: 12/7 }} key={day}>
                <Box sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: theme.palette.text.primary,
                  borderRight: `1px solid ${theme.palette.divider}`
                }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {day}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Calendar Grid */}
          <Grid container sx={{ minHeight: '400px' }}>
            {calendarDays.map((day, index) => (
              <Grid 
                size={{ xs: 12/7 }} 
                key={index}
                sx={{ 
                  borderRight: `1px solid ${theme.palette.divider}`,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  minHeight: '120px',
                  position: 'relative'
                }}
              >
                <Box 
                  sx={{ 
                    p: 1,
                    height: '100%',
                    cursor: day ? 'pointer' : 'default',
                    bgcolor: day?.hasEvents 
                      ? theme.palette.mode === 'dark' 
                        ? 'rgba(37, 99, 235, 0.1)' 
                        : 'rgba(37, 99, 235, 0.05)' 
                      : 'transparent',
                    '&:hover': day ? { 
                      bgcolor: theme.palette.mode === 'dark' 
                        ? 'rgba(37, 99, 235, 0.2)' 
                        : 'rgba(37, 99, 235, 0.1)' 
                    } : {},
                    transition: 'background-color 0.2s ease'
                  }}
                  onClick={day ? () => setSelectedDate(day.dateString) : undefined}
                >
                  {day && (
                    <>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: day.hasEvents 
                            ? theme.palette.primary.main 
                            : theme.palette.text.secondary,
                          mb: 1
                        }}
                      >
                        {day.date}
                      </Typography>
                      
                      {day.tasks.slice(0, 3).map((task, taskIndex) => (
                        <Box
                          key={taskIndex}
                          onClick={(e) => {
                            e.stopPropagation();
                            const dayIndex = planData.schedule.findIndex(d => d.date === day.dateString);
                            if (dayIndex !== -1) {
                              toggleTaskCompletion(dayIndex, task.id);
                            }
                          }}
                          sx={{
                            mb: 0.5,
                            p: 0.5,
                            borderRadius: 1,
                            bgcolor: task.completed 
                              ? (theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.2)' : '#d4edda')
                              : getTaskColor(task.type),
                            color: task.completed 
                              ? (theme.palette.mode === 'dark' ? theme.palette.success?.main : '#155724')
                              : 'white',
                            fontSize: '0.7rem',
                            cursor: 'pointer',
                            opacity: task.completed ? 0.8 : 1,
                            textDecoration: task.completed ? 'line-through' : 'none',
                            '&:hover': { transform: 'scale(1.02)' },
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}
                        >
                          {getTaskIcon(task.type)}
                          <Typography variant="caption" sx={{ 
                            color: 'inherit',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {task.topic}
                          </Typography>
                        </Box>
                      ))}
                      
                      {day.tasks.length > 3 && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: theme.palette.text.secondary,
                            fontStyle: 'italic',
                            fontSize: '0.65rem'
                          }}
                        >
                          +{day.tasks.length - 3} more
                        </Typography>
                      )}
                    </>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Selected Day Details */}
      {selectedDate && (() => {
        const dayData = getTasksForDate(selectedDate);
        if (!dayData) return null;
        
        return (
          <Card sx={{ 
            borderRadius: 4,
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 10px 30px rgba(0,0,0,0.3)' 
              : '0 10px 30px rgba(0,0,0,0.1)',
            border: `2px solid ${theme.palette.primary.main}`
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                  {dayData.dayName} - {selectedDate}
                </Typography>
                <IconButton onClick={() => setSelectedDate(null)} sx={{ color: theme.palette.text.primary }}>
                  <Today />
                </IconButton>
              </Box>
              
              <Grid container spacing={2}>
                {dayData.tasks.map((task, taskIndex) => {
                  const dayIndex = planData.schedule.findIndex(d => d.date === selectedDate);
                  return (
                    <Grid size={{ xs: 12, md: 6 }} key={taskIndex}>
                      <Card
                        variant="outlined"
                        sx={{
                          borderColor: task.completed 
                            ? (theme.palette.success?.main || "#4caf50")
                            : getTaskColor(task.type),
                          borderWidth: 2,
                          borderRadius: 3,
                          transition: 'all 0.3s ease',
                          '&:hover': { 
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                          }
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                            <IconButton
                              onClick={() => toggleTaskCompletion(dayIndex, task.id)}
                              sx={{
                                color: task.completed 
                                  ? (theme.palette.success?.main || "#4caf50")
                                  : theme.palette.action.disabled,
                                bgcolor: task.completed 
                                  ? 'rgba(76, 175, 80, 0.1)' 
                                  : theme.palette.mode === 'dark' 
                                    ? 'rgba(255,255,255,0.05)' 
                                    : 'rgba(0,0,0,0.05)',
                                "&:hover": { 
                                  bgcolor: task.completed 
                                    ? 'rgba(76, 175, 80, 0.2)' 
                                    : theme.palette.mode === 'dark' 
                                      ? 'rgba(255,255,255,0.1)' 
                                      : 'rgba(0,0,0,0.1)' 
                                },
                              }}
                            >
                              <CheckCircle />
                            </IconButton>
                            
                            <Avatar sx={{ bgcolor: getTaskColor(task.type), width: 40, height: 40 }}>
                              {getTaskIcon(task.type)}
                            </Avatar>
                            
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: "bold",
                                  textDecoration: task.completed ? "line-through" : "none",
                                  color: task.completed 
                                    ? theme.palette.text.secondary 
                                    : theme.palette.text.primary
                                }}
                              >
                                {task.topic}
                              </Typography>
                              <Chip
                                label={`${task.type} • ${formatDuration(task.duration)}`}
                                size="small"
                                sx={{
                                  bgcolor: getTaskColor(task.type),
                                  color: "white",
                                  fontWeight: 'bold'
                                }}
                              />
                            </Box>
                          </Box>
                          
                          <Divider sx={{ my: 2 }} />
                          
                          <Typography variant="body2" color="text.secondary">
                            {task.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        );
      })()}

       


      
    </Box>
  );
}
