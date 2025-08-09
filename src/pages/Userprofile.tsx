'use client'

import React, { useState } from 'react'
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  ArrowBack,
  Settings,
  Notifications,
  Security
} from '@mui/icons-material'

import ProfileHeader from '../components/ProfileHeader'
import { EditableSection, PersonalInfo, LearningPreferences } from '../components/EditableSection'
import StudyStats from '../components/StudyStats'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export default function UserProfile() {
  const [tabValue, setTabValue] = useState(0)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // Mock user data - in real app, this would come from API/state management
  const [userData, setUserData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    avatar: '/placeholder.svg?height=120&width=120&text=AJ',
    university: 'Stanford University',
    major: 'Computer Science',
    location: 'California, USA',
    joinDate: 'September 2023',
    studyStreak: 15,
    level: 'Advanced Learner'
  })

  const [personalInfo, setPersonalInfo] = useState({
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@university.edu',
    phone: '+1 (555) 123-4567',
    university: 'Stanford University',
    major: 'Computer Science',
    year: '3rd Year',
    location: 'California, USA',
    bio: 'Passionate computer science student interested in AI and machine learning. Love collaborating with peers and sharing knowledge.'
  })

  const [learningPreferences, setLearningPreferences] = useState({
    learningStyle: 'Visual',
    studyTime: 'Evening',
    subjects: ['Machine Learning', 'Data Structures', 'Web Development', 'Algorithms'],
    goals: ['Master React', 'Complete AI Course', 'Build Portfolio Project', 'Improve Problem Solving']
  })

  const studyStats = {
    totalStudyHours: 247,
    weeklyGoal: 25,
    completedCourses: 8,
    activeGroups: 5,
    averageScore: 87,
    currentStreak: 15,
    achievements: ['Study Streak Master', 'Quiz Champion', 'Collaboration Expert', 'Resource Sharer'],
    weeklyProgress: [4, 3, 5, 2, 6, 3, 4] // Hours per day for the week
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleUpdateAvatar = (file: File) => {
    // In real app, upload file and update user data
    console.log('Updating avatar:', file)
  }

  const handleSavePersonalInfo = (data: any) => {
    setPersonalInfo(prev => ({ ...prev, ...data }))
    console.log('Saving personal info:', data)
  }

  const handleSaveLearningPreferences = (data: any) => {
    setLearningPreferences(prev => ({ ...prev, ...data }))
    console.log('Saving learning preferences:', data)
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 1 }}>
        <Toolbar>
          <IconButton sx={{ color: '#083c70ff', mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#083c70ff', fontWeight: 'bold' }}>
            Profile Settings
          </Typography>
          <IconButton sx={{ color: '#083c70ff' }}>
            <Notifications />
          </IconButton>
          <IconButton sx={{ color: '#083c70ff' }}>
            <Settings />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Profile Header */}
        <ProfileHeader user={userData} onUpdateAvatar={handleUpdateAvatar} />

        {/* Navigation Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white', borderRadius: '8px 8px 0 0' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                color: '#666',
                '&.Mui-selected': {
                  color: '#083c70ff'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#083c70ff'
              }
            }}
          >
            <Tab label="Personal Information" />
            <Tab label="Learning Preferences" />
            <Tab label="Study Statistics" />
            <Tab label="Account Settings" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ bgcolor: 'white', borderRadius: '0 0 8px 8px', minHeight: 400 }}>
          <TabPanel value={tabValue} index={0}>
            <EditableSection title="Personal Information" onSave={handleSavePersonalInfo}>
              {(isEditing) => (
                <PersonalInfo data={personalInfo} onUpdate={handleSavePersonalInfo} isEditing={isEditing} />
              )}
            </EditableSection>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <EditableSection title="Learning Preferences" onSave={handleSaveLearningPreferences}>
              {(isEditing) => (
                <LearningPreferences data={learningPreferences} isEditing={isEditing} />
              )}
            </EditableSection>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <StudyStats stats={studyStats} />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: '#083c70ff', fontWeight: 'bold', mb: 3 }}>
                Account Settings
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Security />}
                  sx={{ justifyContent: 'flex-start', color: '#083c70ff', borderColor: '#083c70ff' }}
                >
                  Change Password
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Notifications />}
                  sx={{ justifyContent: 'flex-start', color: '#083c70ff', borderColor: '#083c70ff' }}
                >
                  Notification Preferences
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Delete Account
                </Button>
              </Box>
            </Box>
          </TabPanel>
        </Box>
      </Container>
    </Box>
  )
}
