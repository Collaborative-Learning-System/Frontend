"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  Alert,
  useTheme,
} from "@mui/material"
import { Add, Delete } from "@mui/icons-material"

export interface Question {
  id: string
  type: "mcq" | "short-answer" | "true-false"
  question: string
  points: number
  options?: string[]
  correctAnswer?: string | number | boolean
  explanation?: string
}

interface QuestionBuilderProps {
  onAddQuestion: (question: Question) => void
  editingQuestion?: Question | null
  editingIndex?: number
  onUpdateQuestion?: (index: number, question: Question) => void
  onCancelEdit?: () => void
}

export default function QuestionBuilder({ 
  onAddQuestion, 
  editingQuestion, 
  editingIndex, 
  onUpdateQuestion, 
  onCancelEdit 
}: QuestionBuilderProps) {
  const theme = useTheme()
  
  // Initialize with editing data if provided, otherwise use default
  const [questionData, setQuestionData] = useState<Partial<Question>>(() => {
    if (editingQuestion) {
      return { ...editingQuestion }
    }
    return {
      type: "mcq",
      question: "",
      points: 1,
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
    }
  })

  const [errors, setErrors] = useState<string[]>([])

  // Update form when editing question changes
  useEffect(() => {
    if (editingQuestion) {
      setQuestionData({ ...editingQuestion })
      setErrors([])
    } else {
      setQuestionData({
        type: "mcq",
        question: "",
        points: 1,
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
      })
      setErrors([])
    }
  }, [editingQuestion])

  const isEditMode = editingQuestion !== undefined && editingQuestion !== null
  const handleTypeChange = (type: "mcq" | "short-answer" | "true-false") => {
    setQuestionData({
      type,
      question: "",
      points: 1,
      ...(type === "mcq"
        ? {
            options: ["", "", "", ""],
            correctAnswer: 0,
          }
        : type === "true-false"
          ? {
              correctAnswer: true,
            }
          : {
              correctAnswer: "",
            }),
      explanation: "",
    })
    setErrors([])
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(questionData.options || [])]
    newOptions[index] = value
    setQuestionData((prev) => ({ ...prev, options: newOptions }))
  }

  // const addOption = () => {
  //   if (questionData.options && questionData.options.length < 6) {
  //     setQuestionData((prev) => ({
  //       ...prev,
  //       options: [...(prev.options || []), ""],
  //     }))
  //   }
  // }

  const removeOption = (index: number) => {
    if (questionData.options && questionData.options.length > 2) {
      const newOptions = questionData.options.filter((_, i) => i !== index)
      setQuestionData((prev) => ({
        ...prev,
        options: newOptions,
        correctAnswer:
          prev.correctAnswer === index
            ? 0
            : typeof prev.correctAnswer === "number" && prev.correctAnswer > index
              ? prev.correctAnswer - 1
              : prev.correctAnswer,
      }))
    }
  }

  const validateQuestion = (): string[] => {
    const newErrors: string[] = []

    if (!questionData.question?.trim()) {
      newErrors.push("Question text is required")
    }

    if (questionData.type === "mcq") {
      const filledOptions = questionData.options?.filter((opt) => opt.trim()) || []
      if (filledOptions.length < 2) {
        newErrors.push("At least 2 options are required for MCQ")
      }

      const correctIndex = questionData.correctAnswer as number
      if (correctIndex >= (questionData.options?.length || 0) || !questionData.options?.[correctIndex]?.trim()) {
        newErrors.push("Please select a valid correct answer")
      }
    }

    if (questionData.type === "short-answer" && !questionData.correctAnswer?.toString().trim()) {
      newErrors.push("Sample answer is required for short answer questions")
    }

    if (questionData.type === "true-false" && questionData.correctAnswer === undefined) {
      newErrors.push("Please select the correct answer (True or False)")
    }

    return newErrors
  }

  const handleAddQuestion = () => {
    const validationErrors = validateQuestion()
    setErrors(validationErrors)

    if (validationErrors.length === 0) {
      const questionPayload: Question = {
        id: isEditMode ? editingQuestion!.id : `question-${Date.now()}`,
        type: questionData.type!,
        question: questionData.question!,
        points: questionData.points!,
        explanation: questionData.explanation,
        ...(questionData.type === "mcq"
          ? {
              options: questionData.options?.filter((opt) => opt.trim()),
              correctAnswer: questionData.correctAnswer as number,
            }
          : questionData.type === "true-false"
            ? {
                correctAnswer: questionData.correctAnswer as boolean,
              }
            : {
                correctAnswer: questionData.correctAnswer as string,
              }),
      }

      if (isEditMode && onUpdateQuestion && editingIndex !== undefined) {
        onUpdateQuestion(editingIndex, questionPayload)
      } else {
        onAddQuestion(questionPayload)
      }

      // Reset form only if not in edit mode
      if (!isEditMode) {
        handleTypeChange(questionData.type!)
      }
    }
  }

  const handleCancelEdit = () => {
    if (onCancelEdit) {
      onCancelEdit()
    }
  }

  return (
    <Card>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: "bold", mb: 3 }}>
          {isEditMode ? "Edit Question" : "Add New Question"}
        </Typography>

        {errors.length > 0 && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Question Type */}
          <FormControl>
            <InputLabel>Question Type</InputLabel>
            <Select
              value={questionData.type}
              label="Question Type"
              onChange={(e) => handleTypeChange(e.target.value as "mcq" | "short-answer" | "true-false")}
            >
              <MenuItem value="mcq">Multiple Choice Question</MenuItem>
              <MenuItem value="short-answer">Short Answer</MenuItem>
              <MenuItem value="true-false">True/False</MenuItem>
            </Select>
          </FormControl>

          {/* Question Text */}
          <TextField
            fullWidth
            label="Question"
            value={questionData.question}
            onChange={(e) => setQuestionData((prev) => ({ ...prev, question: e.target.value }))}
            multiline
            rows={3}
            placeholder="Enter your question here..."
            required
          />

          {/* Points and Required */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Points"
              type="number"
              value={questionData.points}
              onChange={(e) => setQuestionData((prev) => ({ ...prev, points: Number.parseInt(e.target.value) || 1 }))}
              inputProps={{ min: 1, max: 100 }}
              sx={{ width: 120 }}
            />
            
          </Box>

          {/* MCQ Options */}
          {questionData.type === "mcq" && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Answer Options
              </Typography>
              <RadioGroup
                value={questionData.correctAnswer}
                onChange={(e) =>
                  setQuestionData((prev) => ({ ...prev, correctAnswer: Number.parseInt(e.target.value) }))
                }
              >
                {questionData.options?.map((option, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <FormControlLabel
                      value={index}
                      control={<Radio sx={{ color: theme.palette.primary.main, "&.Mui-checked": { color: theme.palette.primary.main } }} />}
                      label=""
                      sx={{ margin: 0 }}
                    />
                    <TextField
                      fullWidth
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      size="small"
                    />
                    {questionData.options && questionData.options.length > 2 && (
                      <IconButton onClick={() => removeOption(index)} color="error">
                        <Delete />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </RadioGroup>

              {/* {questionData.options && questionData.options.length < 6 && (
                <Button
                  startIcon={<Add />}
                  onClick={addOption}
                  variant="outlined"
                  sx={{ mt: 1, color: theme.palette.primary.main, borderColor: theme.palette.primary.main }}
                >
                  Add Option
                </Button>
              )} */}
            </Box>
          )}

          {/* Short Answer */}
          {questionData.type === "short-answer" && (
            <TextField
              fullWidth
              label="Sample Answer"
              value={questionData.correctAnswer}
              onChange={(e) => setQuestionData((prev) => ({ ...prev, correctAnswer: e.target.value }))}
              multiline
              rows={2}
              placeholder="Provide a sample correct answer for reference"
              helperText="This will help with grading and provide guidance to students"
            />
          )}

          {/* True/False */}
          {questionData.type === "true-false" && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Correct Answer
              </Typography>
              <RadioGroup
                value={questionData.correctAnswer?.toString()}
                onChange={(e) =>
                  setQuestionData((prev) => ({ ...prev, correctAnswer: e.target.value === "true" }))
                }
              >
                <FormControlLabel
                  value="true"
                  control={<Radio sx={{ color: theme.palette.primary.main, "&.Mui-checked": { color: theme.palette.primary.main } }} />}
                  label="True"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio sx={{ color: theme.palette.primary.main, "&.Mui-checked": { color: theme.palette.primary.main } }} />}
                  label="False"
                />
              </RadioGroup>
            </Box>
          )}

          {/* Explanation */}
          <TextField
            fullWidth
            label="Explanation (Optional)"
            value={questionData.explanation || ""}
            onChange={(e) => setQuestionData((prev) => ({ ...prev, explanation: e.target.value }))}
            multiline
            rows={2}
            placeholder="Provide an explanation for the correct answer (optional)"
          />

          {isEditMode ? (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleAddQuestion}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  "&:hover": { bgcolor: theme.palette.primary.dark },
                }}
              >
                Update Question
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancelEdit}
                sx={{
                  color: theme.palette.text.secondary,
                  borderColor: theme.palette.text.secondary,
                }}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              onClick={handleAddQuestion}
              startIcon={<Add />}
              sx={{
                bgcolor: theme.palette.primary.main,
                "&:hover": { bgcolor: theme.palette.primary.dark },
                alignSelf: "flex-start",
              }}
            >
              Add Question
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
