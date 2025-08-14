import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip
} from '@mui/material'
import {
  TrendingUp,
  Schedule,
  Group,
  Assignment,
  Star,
  EmojiEvents
} from '@mui/icons-material'

interface StudyStatsProps {
  stats: {
    totalStudyHours: number
    weeklyGoal: number
    completedCourses: number
    activeGroups: number
    averageScore: number
    currentStreak: number
    achievements: string[]
    weeklyProgress: number[]
  }
}

export default function StudyStats({ stats }: StudyStatsProps) {
  const weeklyHours = stats.weeklyProgress.reduce((a, b) => a + b, 0)
  const progressPercentage = (weeklyHours / stats.weeklyGoal) * 100

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ color: '#083c70ff', fontWeight: 'bold', mb: 3 }}>
          Study Statistics
        </Typography>
        
        <Grid container spacing={3}>
          {/* Key Metrics */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
              <Schedule sx={{ fontSize: 40, color: '#083c70ff', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#083c70ff' }}>
                {stats.totalStudyHours}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Study Hours
              </Typography>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
              <Group sx={{ fontSize: 40, color: '#083c70ff', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#083c70ff' }}>
                {stats.activeGroups}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Groups
              </Typography>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
              <Assignment sx={{ fontSize: 40, color: '#083c70ff', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#083c70ff' }}>
                {stats.completedCourses}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed Courses
              </Typography>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
              <Star sx={{ fontSize: 40, color: '#083c70ff', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#083c70ff' }}>
                {stats.averageScore}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Score
              </Typography>
            </Box>
          </Grid>

          {/* Weekly Progress */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Weekly Goal Progress
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {weeklyHours}/{stats.weeklyGoal} hours
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(progressPercentage, 100)}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: progressPercentage >= 100 ? '#4caf50' : '#083c70ff',
                    borderRadius: 4
                  }
                }}
              />
            </Box>
          </Grid>

          {/* Current Streak */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              p: 2, 
              bgcolor: '#fff3e0', 
              borderRadius: 2,
              border: '1px solid #ffcc02'
            }}>
              <EmojiEvents sx={{ fontSize: 30, color: '#ff9800' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#e65100' }}>
                  {stats.currentStreak} Day Study Streak! 🔥
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Keep it up! You're on fire!
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Achievements */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Recent Achievements
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {stats.achievements.map((achievement, index) => (
                <Chip
                  key={index}
                  label={achievement}
                  icon={<EmojiEvents />}
                  sx={{ 
                    bgcolor: '#4caf50', 
                    color: 'white',
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
