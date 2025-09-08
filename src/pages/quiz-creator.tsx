"use client"

import { useState } from "react"
import {
  Container,
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  useTheme,
} from "@mui/material"

import QuizMetadata from "../components/QuizMetadata"
import QuestionBuilder, { type Question } from "../components/QuestionBuilder"
import QuestionList from "../components/QuestionList"
import TopNavBar from "../components/TopNavBar"


interface QuizData {
  metadata: {
    title: string
    description: string
    difficulty: string
    timeLimit: number
    instructions: string
  }
  questions: Question[]
}

export default function QuizCreator() {
  const theme = useTheme()
  const [currentStep, setCurrentStep] = useState(0)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [publishDialogOpen, setPublishDialogOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  const [quizData, setQuizData] = useState<QuizData>({
    metadata: {
      title: "",
      description: "",
      difficulty: "",
      timeLimit: 30,
      instructions: "",
    },
    questions: [],
  })

  const steps = ["Quiz Information", "Add Questions", "Review & Publish"]

  const handleMetadataChange = (field: string, value: any) => {
    setQuizData((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value },
    }))
  }

  const handleAddQuestion = (question: Question) => {
    setQuizData((prev) => ({
      ...prev,
      questions: [...prev.questions, question],
    }))
    showSnackbar("Question added successfully!")
  }

  const handleEditQuestion = (index: number, question: Question) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) => (i === index ? question : q)),
    }))
    showSnackbar("Question updated successfully!")
  }

  const handleDeleteQuestion = (index: number) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }))
    showSnackbar("Question deleted successfully!")
  }

  const handleReorderQuestions = (questions: Question[]) => {
    setQuizData((prev) => ({ ...prev, questions }))
  }

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message)
    setSnackbarOpen(true)
  }

  const validateQuiz = (): string[] => {
    const errors: string[] = []

    if (!quizData.metadata.title.trim()) {
      errors.push("Quiz title is required")
    }

    // if (!quizData.metadata.subject) {
    //   errors.push("Subject is required")
    // }

    if (!quizData.metadata.difficulty) {
      errors.push("Difficulty level is required")
    }

    if (quizData.questions.length === 0) {
      errors.push("At least one question is required")
    }

    return errors
  }

  const handleSaveQuiz = () => {
    const errors = validateQuiz()
    if (errors.length > 0) {
      showSnackbar(`Please fix the following errors: ${errors.join(", ")}`)
      return
    }

    // In real app, save to backend
    console.log("Saving quiz:", quizData)
    setSaveDialogOpen(false)
    showSnackbar("Quiz saved as draft!")
  }

  const handlePublishQuiz = () => {
    const errors = validateQuiz()
    if (errors.length > 0) {
      showSnackbar(`Please fix the following errors: ${errors.join(", ")}`)
      return
    }

    // In real app, publish to backend
    console.log("Publishing quiz:", quizData)
    setPublishDialogOpen(false)
    showSnackbar("Quiz published successfully!")
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 0:
        return quizData.metadata.title.trim() && quizData.metadata.difficulty
      case 1:
        return quizData.questions.length > 0
      default:
        return true
    }
  }

  const totalPoints = quizData.questions.reduce((sum, q) => sum + q.points, 0)

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: "100vh" }}>
      <TopNavBar />

      <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
        {/* Progress Stepper */}
        <Box sx={{ mb: 4, position: "relative", zIndex: 1 }}>
          <Stepper activeStep={currentStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel 
                  onClick={() => setCurrentStep(index)} 
                  sx={{ 
                    cursor: "pointer",
                    "& .MuiStepIcon-root": {
                      fontSize: "2rem",
                      zIndex: 2
                    }
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Step Content */}
        {currentStep === 0 && <QuizMetadata metadata={quizData.metadata} onChange={handleMetadataChange} />}

        {currentStep === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <QuestionBuilder onAddQuestion={handleAddQuestion} />
            <QuestionList
              questions={quizData.questions}
              onEditQuestion={handleEditQuestion}
              onDeleteQuestion={handleDeleteQuestion}
              onReorderQuestions={handleReorderQuestions}
            />
          </Box>
        )}

        {currentStep === 2 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {/* Quiz Summary */}
            <Box
              sx={{
                bgcolor: theme.palette.background.paper,
                p: 4,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: "bold" }}>
                {quizData.metadata.title || "Untitled Quiz"}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {quizData.metadata.description || "No description provided"}
              </Typography>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
                <Box sx={{ bgcolor: theme.palette.background.default, p: 2, borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Difficulty
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {quizData.metadata.difficulty}
                  </Typography>
                </Box>
                <Box sx={{ bgcolor: theme.palette.background.default, p: 2, borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Questions
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {quizData.questions.length}
                  </Typography>
                </Box>
                <Box sx={{ bgcolor: theme.palette.background.default, p: 2, borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Total Points
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {totalPoints}
                  </Typography>
                </Box>
                <Box sx={{ bgcolor: theme.palette.background.default, p: 2, borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Time Limit
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {quizData.metadata.timeLimit} min
                  </Typography>
                </Box>
              </Box>

              {quizData.metadata.instructions && (
                <Box sx={{ bgcolor: theme.palette.primary.light + "20", p: 3, borderRadius: 1, mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: "bold" }}>
                    Instructions:
                  </Typography>
                  <Typography variant="body2">{quizData.metadata.instructions}</Typography>
                </Box>
              )}
            </Box>

            <QuestionList
              questions={quizData.questions}
              onEditQuestion={handleEditQuestion}
              onDeleteQuestion={handleDeleteQuestion}
              onReorderQuestions={handleReorderQuestions}
            />
          </Box>
        )}

        {/* Navigation */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            variant="outlined"
            sx={{ color: theme.palette.primary.main, borderColor: theme.palette.primary.main }}
          >
            Previous
          </Button>
          <Button
            onClick={() => {
              if (currentStep === 2) {
                // Handle finish action - you can add your finish logic here
                console.log("Quiz finished!", quizData)
                setPublishDialogOpen(true) // Open publish dialog when finished
              } else {
                setCurrentStep(Math.min(2, currentStep + 1))
              }
            }}
            disabled={!canProceedToNext()}
            variant="contained"
            sx={{ bgcolor: theme.palette.primary.main, "&:hover": { bgcolor: theme.palette.primary.dark } }}
          >
            {currentStep === 2 ? "Finish" : "Next"}
          </Button>
        </Box>
      </Container>

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Quiz as Draft</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to save this quiz as a draft? You can continue editing it later.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveQuiz} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Publish Dialog */}
      <Dialog open={publishDialogOpen} onClose={() => setPublishDialogOpen(false)}>
        <DialogTitle>Publish Quiz</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            Are you sure you want to publish this quiz? Once published, students will be able to take it.
          </Typography>
          <Alert severity="info">Make sure all questions are correct and the quiz is ready for students.</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublishDialogOpen(false)}>Cancel</Button>
          <Button onClick={handlePublishQuiz} variant="contained" color="primary">
            Publish
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  )
}
