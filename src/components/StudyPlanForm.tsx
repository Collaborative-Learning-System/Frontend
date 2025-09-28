import { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Card,
  CardContent,
  Grid,
  Slider,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  useTheme
} from '@mui/material'
import {
  Add,
  Delete,
  Schedule
} from '@mui/icons-material'

interface StudyPlanFormData {
  subjects: string[]
  studyGoal: string
  startDate: string
  endDate: string
  dailyHours: number
  preferredTimes: string[]
  learningStyle: string[]
  difficulty: string
  includeBreaks: boolean
  includeReview: boolean
}

interface StudyPlanFormProps {
  onGenerate: (data: StudyPlanFormData) => void
  isGenerating: boolean
}

export default function StudyPlanForm({ onGenerate, isGenerating }: StudyPlanFormProps) {
  // Helper function to format date for input
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  // Set default dates
  const today = new Date()
  const defaultEndDate = new Date()
  defaultEndDate.setDate(today.getDate() + 30) // 30 days from now

  const [formData, setFormData] = useState<StudyPlanFormData>({
    subjects: [],
    studyGoal: '',
    startDate: formatDateForInput(today),
    endDate: formatDateForInput(defaultEndDate),
    dailyHours: 2,
    preferredTimes: [],
    learningStyle: [],
    difficulty: '',
    includeBreaks: true,
    includeReview: true
  })
  const [newSubject, setNewSubject] = useState('')
  const theme = useTheme()

  const studyGoals = [
    'Exam Preparation',
    'Course Completion',
    'Skill Development',
    'Assignment Completion',
    'General Learning',
    'Certification Prep'
  ]

 

  const preferredTimeOptions = [
    'Early Morning (6-9 AM)',
    'Morning (9-12 PM)',
    'Afternoon (12-5 PM)',
    'Evening (5-8 PM)',
    'Night (8-11 PM)'
  ]

  const learningStyles = [
    'Visual',
    'Auditory', 
    'Kinesthetic',
    'Reading/Writing',
    'Social/Group Learning',
    'Logical/Mathematical',
    'Intrapersonal/Self-Study',
    'Verbal/Linguistic'
  ]

  const difficultyLevels = [
    'Beginner',
    'Intermediate',
    'Advanced'
  ]

  const addSubject = () => {
    if (newSubject.trim() && !formData.subjects.includes(newSubject.trim())) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()]
      }))
      setNewSubject('')
    }
  }

  const removeSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subject)
    }))
  }

  const handleTimePreferenceChange = (time: string) => {
    const maxSlots = Math.ceil(formData.dailyHours / 2) // Each slot represents ~2 hours
    
    setFormData(prev => {
      if (prev.preferredTimes.includes(time)) {
        // Remove the time slot
        return {
          ...prev,
          preferredTimes: prev.preferredTimes.filter(t => t !== time)
        }
      } else {
        // Add the time slot only if under the limit
        if (prev.preferredTimes.length < maxSlots) {
          return {
            ...prev,
            preferredTimes: [...prev.preferredTimes, time]
          }
        }
        return prev 
      }
    })
  }



  // Calculate recommended time slots and hours per slot
  const getTimeSlotRecommendations = () => {
    const maxSlots = Math.ceil(formData.dailyHours / 2)
    const hoursPerSlot = formData.dailyHours / Math.max(formData.preferredTimes.length, 1)
    
    return {
      maxSlots,
      hoursPerSlot: Math.round(hoursPerSlot * 10) / 10, // Round to 1 decimal
      remainingSlots: maxSlots - formData.preferredTimes.length
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onGenerate(formData)
  }

  const isFormValid = formData.subjects.length > 0 && 
                     formData.studyGoal && 
                     formData.startDate && 
                     formData.endDate && 
                     formData.learningStyle.length > 0 && 
                     formData.difficulty &&
                     formData.preferredTimes.length > 0

  return (
    <Card>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{ color: theme.palette.primary.main, fontWeight: "bold" }}
          >
            AI Study Plan Generator
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          {/* Subjects */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Subjects to Study
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
              {formData.subjects.map((subject, index) => (
                <Chip
                  key={index}
                  label={subject}
                  onDelete={() => removeSubject(subject)}
                  deleteIcon={<Delete />}
                  sx={{ bgcolor: theme.palette.primary.main, color: "white" }}
                />
              ))}
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                size="small"
                placeholder="Add subject (e.g., Mathematics, Physics)"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSubject();
                  }
                }}
                sx={{ flex: 1 }}
              />
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  addSubject();
                }}
                startIcon={<Add />}
                variant="outlined"
                type="button"
                sx={{
                  color: theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                }}
              >
                Add
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Study Goal */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Study Goal</InputLabel>
                <Select
                  value={formData.studyGoal}
                  label="Study Goal"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      studyGoal: e.target.value,
                    }))
                  }
                >
                  {studyGoals.map((goal) => (
                    <MenuItem key={goal} value={goal}>
                      {goal}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Timeframe
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Timeframe</InputLabel>
                <Select
                  value={formData.timeframe}
                  label="Timeframe"
                  onChange={(e) => setFormData(prev => ({ ...prev, timeframe: e.target.value }))}
                >
                  {timeframes.map((time) => (
                    <MenuItem key={time} value={time}>{time}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}

            {/* Start Date */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                InputLabelProps={{
                  shrink: true,
                  style: {
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#333",
                    fontWeight: 500,
                  },
                }}
              />
            </Grid>

            {/* End Date */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                }
                InputLabelProps={{
                  shrink: true,
                  style: {
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#333",
                    fontWeight: 500,
                  },
                }}
              />
            </Grid>

            {/* Learning Styles */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Learning Styles</InputLabel>
                <Select
                  multiple
                  value={formData.learningStyle}
                  label="Learning Styles"
                  onChange={(e) => {
                    const value = e.target.value;
                    // Limit to maximum 3 selections
                    if (Array.isArray(value) && value.length <= 3) {
                      setFormData((prev) => ({
                        ...prev,
                        learningStyle: value as string[],
                      }));
                    }
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          size="small"
                          sx={{ 
                            bgcolor: theme.palette.primary.main, 
                            color: 'white',
                            fontSize: '0.75rem'
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 224,
                        width: 250,
                      },
                    },
                  }}
                >
                  {learningStyles.map((style) => (
                    <MenuItem 
                      key={style} 
                      value={style}
                      disabled={!formData.learningStyle.includes(style) && formData.learningStyle.length >= 3}
                      sx={{
                        '&.Mui-disabled': {
                          opacity: 0.5
                        }
                      }}
                    >
                      <Checkbox 
                        checked={formData.learningStyle.includes(style)}
                        sx={{
                          color: theme.palette.primary.main,
                          "&.Mui-checked": { color: theme.palette.primary.main },
                        }}
                      />
                      <Typography sx={{ ml: 1 }}>{style}</Typography>
                    </MenuItem>
                  ))}
                </Select>
                
                {/* Helper text */}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    mt: 1, 
                    color: theme.palette.text.secondary,
                    fontSize: '0.75rem'
                  }}
                >
                  Select up to 3 learning styles ({formData.learningStyle.length}/3 selected)
                </Typography>
              </FormControl>
            </Grid>

            {/* Difficulty Level */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Difficulty Level</InputLabel>
                <Select
                  value={formData.difficulty}
                  label="Difficulty Level"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      difficulty: e.target.value,
                    }))
                  }
                >
                  {difficultyLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Daily Study Hours */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Daily Study Hours: {formData.dailyHours} hours
            </Typography>
            <Slider
              value={formData.dailyHours}
              onChange={(_, value) =>
                setFormData((prev) => ({
                  ...prev,
                  dailyHours: value as number,
                }))
              }
              min={1}
              max={8}
              step={0.5}
              marks
              valueLabelDisplay="auto"
              sx={{ color: theme.palette.primary.main }}
            />
          </Box>

          {/* Preferred Study Times */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Preferred Study Times
            </Typography>
            
            {/* Time slot recommendations info */}
            {(() => {
              const recommendations = getTimeSlotRecommendations()
              return (
                <Alert 
                  severity="info" 
                  sx={{ mb: 2, bgcolor: "#e3f2fd", border: "1px solid #2196f3" }}
                >
                  <Typography variant="body2">
                    Based on your {formData.dailyHours} daily hours, you can select up to{' '}
                    <strong>{recommendations.maxSlots} time slots</strong>.
                    {formData.preferredTimes.length > 0 && (
                      <> Each selected slot will be approximately{' '}
                      <strong>{recommendations.hoursPerSlot} hours</strong>.</>
                    )}
                    {recommendations.remainingSlots > 0 && (
                      <> You can select {recommendations.remainingSlots} more time slot(s).</>
                    )}
                  </Typography>
                </Alert>
              )
            })()}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {preferredTimeOptions.map((time) => {
                const isChecked = formData.preferredTimes.includes(time)
                const canSelect = isChecked || formData.preferredTimes.length < Math.ceil(formData.dailyHours / 2)
                
                return (
                  <FormControlLabel
                    key={time}
                    control={
                      <Checkbox
                        checked={isChecked}
                        onChange={() => handleTimePreferenceChange(time)}
                        disabled={!canSelect}
                        sx={{
                          color: theme.palette.primary.main,
                          "&.Mui-checked": { color: theme.palette.primary.main },
                          "&.Mui-disabled": { color: theme.palette.action.disabled },
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography 
                          sx={{ 
                            color: !canSelect ? theme.palette.action.disabled : 'inherit',
                            opacity: !canSelect ? 0.6 : 1 
                          }}
                        >
                          {time}
                        </Typography>
                        {isChecked && (
                          <Chip 
                            size="small" 
                            label={`~${getTimeSlotRecommendations().hoursPerSlot}h`}
                            sx={{ 
                              bgcolor: theme.palette.primary.light, 
                              color: 'white',
                              fontSize: '0.75rem'
                            }}
                          />
                        )}
                      </Box>
                    }
                    sx={{
                      opacity: !canSelect ? 0.6 : 1,
                      transition: 'opacity 0.2s ease'
                    }}
                  />
                )
              })}
            </Box>
            
            {formData.preferredTimes.length === 0 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Please select at least one preferred study time to continue.
              </Alert>
            )}
          </Box>

          {/* Additional Options */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Additional Options
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.includeBreaks}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        includeBreaks: e.target.checked,
                      }))
                    }
                    sx={{
                      color: theme.palette.primary.main,
                      "&.Mui-checked": { color: theme.palette.primary.main },
                    }}
                  />
                }
                label="Include regular breaks in study sessions"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.includeReview}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        includeReview: e.target.checked,
                      }))
                    }
                    sx={{
                      color: theme.palette.primary.main,
                      "&.Mui-checked": { color: theme.palette.primary.main },
                    }}
                  />
                }
                label="Include review sessions for better retention"
              />
            </Box>
          </Box>

          {!isFormValid && (
            <Alert severity="info">
              Please fill in all required fields: subjects, study goal, start
              date, end date, at least one learning style, difficulty level, and at least one preferred study time.
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!isFormValid || isGenerating}
            startIcon={
              isGenerating ? <CircularProgress size={20} /> : <Schedule />
            }
            sx={{
              bgcolor: theme.palette.primary.main,
              "&:hover": { bgcolor: theme.palette.primary.dark },
              py: 1.5,
            }}
          >
            {isGenerating ? "Generating Your Plan..." : "Generate Study Plan"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
