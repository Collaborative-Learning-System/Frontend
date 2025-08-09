'use client'

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
  CircularProgress
} from '@mui/material'
import {
  Add,
  Delete,
  AutoAwesome,
  Schedule
} from '@mui/icons-material'

interface StudyPlanFormData {
  subjects: string[]
  studyGoal: string
  startDate: string
  endDate: string
  dailyHours: number
  preferredTimes: string[]
  learningStyle: string
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
    learningStyle: '',
    difficulty: '',
    includeBreaks: true,
    includeReview: true
  })
  const [newSubject, setNewSubject] = useState('')

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
    'Reading/Writing'
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
    setFormData(prev => ({
      ...prev,
      preferredTimes: prev.preferredTimes.includes(time)
        ? prev.preferredTimes.filter(t => t !== time)
        : [...prev.preferredTimes, time]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onGenerate(formData)
  }

  const isFormValid = formData.subjects.length > 0 && 
                     formData.studyGoal && 
                     formData.startDate && 
                     formData.endDate && 
                     formData.learningStyle && 
                     formData.difficulty

  return (
    <Card>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <AutoAwesome sx={{ color: '#083c70ff' }} />
          <Typography variant="h5" sx={{ color: '#083c70ff', fontWeight: 'bold' }}>
            AI Study Plan Generator
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Subjects */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Subjects to Study
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {formData.subjects.map((subject, index) => (
                <Chip
                  key={index}
                  label={subject}
                  onDelete={() => removeSubject(subject)}
                  deleteIcon={<Delete />}
                  sx={{ bgcolor: '#083c70ff', color: 'white' }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Add subject (e.g., Mathematics, Physics)"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addSubject()
                  }
                }}
                sx={{ flex: 1 }}
              />
              <Button 
                onClick={(e) => {
                  e.preventDefault()
                  addSubject()
                }} 
                startIcon={<Add />}
                variant="outlined"
                type="button"
                sx={{ color: '#083c70ff', borderColor: '#083c70ff' }}
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
                  onChange={(e) => setFormData(prev => ({ ...prev, studyGoal: e.target.value }))}
                >
                  {studyGoals.map((goal) => (
                    <MenuItem key={goal} value={goal}>{goal}</MenuItem>
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
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                InputLabelProps={{ 
                  shrink: true,
                  style: { color: '#083c70ff', fontWeight: 'bold' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#083c70ff',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#083c70ff',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#333',
                    fontWeight: 500,
                  }
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
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                InputLabelProps={{ 
                  shrink: true,
                  style: { color: '#083c70ff', fontWeight: 'bold' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#083c70ff',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#083c70ff',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#333',
                    fontWeight: 500,
                  }
                }}
              />
            </Grid>

            {/* Learning Style */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Learning Style</InputLabel>
                <Select
                  value={formData.learningStyle}
                  label="Learning Style"
                  onChange={(e) => setFormData(prev => ({ ...prev, learningStyle: e.target.value }))}
                >
                  {learningStyles.map((style) => (
                    <MenuItem key={style} value={style}>{style}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Difficulty Level */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Difficulty Level</InputLabel>
                <Select
                  value={formData.difficulty}
                  label="Difficulty Level"
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                >
                  {difficultyLevels.map((level) => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Daily Study Hours */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Daily Study Hours: {formData.dailyHours} hours
            </Typography>
            <Slider
              value={formData.dailyHours}
              onChange={(_, value) => setFormData(prev => ({ ...prev, dailyHours: value as number }))}
              min={1}
              max={8}
              step={0.5}
              marks
              valueLabelDisplay="auto"
              sx={{ color: '#083c70ff' }}
            />
          </Box>

          {/* Preferred Study Times */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Preferred Study Times
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {preferredTimeOptions.map((time) => (
                <FormControlLabel
                  key={time}
                  control={
                    <Checkbox
                      checked={formData.preferredTimes.includes(time)}
                      onChange={() => handleTimePreferenceChange(time)}
                      sx={{ color: '#083c70ff', '&.Mui-checked': { color: '#083c70ff' } }}
                    />
                  }
                  label={time}
                />
              ))}
            </Box>
          </Box>

          {/* Additional Options */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Additional Options
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.includeBreaks}
                    onChange={(e) => setFormData(prev => ({ ...prev, includeBreaks: e.target.checked }))}
                    sx={{ color: '#083c70ff', '&.Mui-checked': { color: '#083c70ff' } }}
                  />
                }
                label="Include regular breaks in study sessions"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.includeReview}
                    onChange={(e) => setFormData(prev => ({ ...prev, includeReview: e.target.checked }))}
                    sx={{ color: '#083c70ff', '&.Mui-checked': { color: '#083c70ff' } }}
                  />
                }
                label="Include review sessions for better retention"
              />
            </Box>
          </Box>

          {!isFormValid && (
            <Alert severity="info">
              Please fill in all required fields: subjects, study goal, start date, end date, learning style, and difficulty level.
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!isFormValid || isGenerating}
            startIcon={isGenerating ? <CircularProgress size={20} /> : <Schedule />}
            sx={{ 
              bgcolor: '#083c70ff', 
              '&:hover': { bgcolor: '#0d47a1' },
              py: 1.5
            }}
          >
            {isGenerating ? 'Generating Your Plan...' : 'Generate Study Plan'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
