import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  Chip,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Schedule,
  PlayArrow,
  Visibility,
  CalendarToday,
} from "@mui/icons-material";

interface StudyPlanCardProps {
  planId: number;
  title: string;
  subjects: string;
  studyGoal: string;
  startDate: string;
  endDate: string;
  dailyHours: number;
  createdAt: string;
  progress?: number;
  totalTasks?: number;
  completedTasks?: number;
  onView?: (planId: number) => void;
  onResume?: (planId: number) => void;
}

export default function StudyPlanCard({
  planId,
  title,
  subjects,
  studyGoal,
  startDate,
  endDate,
  dailyHours,
  progress = 0,
  totalTasks = 0,
  completedTasks = 0,
  onView,
  onResume,
}: StudyPlanCardProps) {
  const theme = useTheme();
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getSubjectsArray = () => {
    return subjects.split(',').map(s => s.trim()).slice(0, 3);
  };

  const getDaysRemaining = () => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const isActive = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    return today >= start && today <= end;
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "all 0.3s ease",
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
          borderColor: alpha(theme.palette.primary.main, 0.3),
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header with status indicator */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              fontSize: "1rem",
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
          <Chip
            label={isActive() ? "Active" : "Scheduled"}
            size="small"
            sx={{
              bgcolor: isActive() 
                ? alpha(theme.palette.success.main, 0.1)
                : alpha(theme.palette.info.main, 0.1),
              color: isActive() 
                ? theme.palette.success.main
                : theme.palette.info.main,
              fontWeight: 500,
              fontSize: "0.75rem",
            }}
          />
        </Box>

        {/* Study Goal */}
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            mb: 1.5,
            fontStyle: "italic",
          }}
        >
          {studyGoal}
        </Typography>

        {/* Subjects */}
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
            Subjects:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {getSubjectsArray().map((subject, index) => (
              <Chip
                key={index}
                label={subject}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem", height: 20 }}
              />
            ))}
            {subjects.split(',').length > 3 && (
              <Chip
                label={`+${subjects.split(',').length - 3} more`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem", height: 20, opacity: 0.7 }}
              />
            )}
          </Box>
        </Box>

        {/* Progress */}
        <Box sx={{ mb: 1.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Progress
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: "0.75rem" }}>
              {completedTasks}/{totalTasks} tasks
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              "& .MuiLinearProgress-bar": {
                bgcolor: theme.palette.primary.main,
                borderRadius: 3,
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.secondary, fontSize: "0.7rem" }}
          >
            {Math.round(progress)}% complete
          </Typography>
        </Box>

        {/* Schedule Info */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CalendarToday sx={{ fontSize: "0.9rem", color: theme.palette.text.secondary }} />
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              {formatDate(startDate)} - {formatDate(endDate)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Schedule sx={{ fontSize: "0.9rem", color: theme.palette.text.secondary }} />
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              {dailyHours}h/day
            </Typography>
          </Box>
        </Box>

        {/* Days remaining */}
        <Typography
          variant="caption"
          sx={{
            color: getDaysRemaining() < 7 
              ? theme.palette.warning.main 
              : theme.palette.text.secondary,
            fontWeight: 500,
          }}
        >
          {getDaysRemaining() > 0 
            ? `${getDaysRemaining()} days remaining`
            : "Plan ended"
          }
        </Typography>
      </CardContent>

      {/* Action buttons */}
      <Box
        sx={{
          p: 1,
          pt: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <IconButton
          size="small"
          onClick={() => onView?.(planId)}
          sx={{
            color: theme.palette.text.secondary,
            "&:hover": {
              color: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <Visibility fontSize="small" />
        </IconButton>
        {isActive() && (
          <IconButton
            size="small"
            onClick={() => onResume?.(planId)}
            sx={{
              color: theme.palette.success.main,
              "&:hover": {
                bgcolor: alpha(theme.palette.success.main, 0.1),
              },
            }}
          >
            <PlayArrow fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Card>
  );
}