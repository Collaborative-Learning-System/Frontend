"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  useTheme,
} from "@mui/material"
import { ExpandMore, Edit, Delete, DragIndicator, Visibility, QuizOutlined, ShortText, ToggleOff } from "@mui/icons-material"
import type { Question } from "./QuestionBuilder"

interface QuestionListProps {
  questions: Question[]
  onEditQuestion: (index: number, question: Question) => void
  onDeleteQuestion: (index: number) => void
  onReorderQuestions: (questions: Question[]) => void
}

export default function QuestionList({
  questions,
  onEditQuestion,
  onDeleteQuestion,
  
}: QuestionListProps) {
  const theme = useTheme()
  const [expanded, setExpanded] = useState<string | false>(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null)

  const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  const handlePreview = (question: Question) => {
    setPreviewQuestion(question)
    setPreviewOpen(true)
  }

  const getQuestionIcon = (type: string) => {
    if (type === "mcq") return <QuizOutlined />
    if (type === "true-false") return <ToggleOff />
    return <ShortText />
  }

  const getQuestionTypeLabel = (type: string) => {
    if (type === "mcq") return "Multiple Choice"
    if (type === "true-false") return "True/False"
    return "Short Answer"
  }

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: "center", py: 6 }}>
          <QuizOutlined sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No questions added yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start building your quiz by adding questions above
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5" sx={{ color: "primary.main", fontWeight: "bold" }}>
              Quiz Questions ({questions.length})
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Chip label={`Total Points: ${totalPoints}`} color="primary" />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {questions.map((question, index) => (
        <Card key={question.id} sx={{ mb: 2 }}>
          <Accordion expanded={expanded === `question-${index}`} onChange={handleAccordionChange(`question-${index}`)}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%", mr: 2 }}>
                <IconButton size="small" sx={{ cursor: "grab" }}>
                  <DragIndicator />
                </IconButton>

                {getQuestionIcon(question.type)}

                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Question {index + 1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {question.question}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Chip
                    label={getQuestionTypeLabel(question.type)}
                    size="small"
                    sx={{ 
                      bgcolor: question.type === "mcq" ? theme.palette.primary.main : 
                               question.type === "true-false" ? theme.palette.warning.main : theme.palette.success.main, 
                      color: "white" 
                    }}
                  />
                  <Chip label={`${question.points} pts`} size="small" variant="outlined" />
                </Box>
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  {question.question}
                </Typography>

                {question.type === "mcq" && question.options && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: "bold" }}>
                      Options:
                    </Typography>
                    <RadioGroup value={question.correctAnswer}>
                      {question.options.map((option, optIndex) => (
                        <FormControlLabel
                          key={optIndex}
                          value={optIndex}
                          control={<Radio size="small" />}
                          label={
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Typography variant="body2">{option}</Typography>
                              {optIndex === question.correctAnswer && (
                                <Chip label="Correct" size="small" sx={{ bgcolor: theme.palette.success.main, color: "white" }} />
                              )}
                            </Box>
                          }
                          disabled
                        />
                      ))}
                    </RadioGroup>
                  </Box>
                )}

                {question.type === "short-answer" && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: "bold" }}>
                      Sample Answer:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        bgcolor: theme.palette.background.default,
                        p: 2,
                        borderRadius: 1,
                        fontStyle: "italic",
                      }}
                    >
                      {question.correctAnswer}
                    </Typography>
                  </Box>
                )}

                {question.type === "true-false" && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: "bold" }}>
                      Correct Answer:
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                      <Chip
                        label="True"
                        sx={{
                          bgcolor: question.correctAnswer === true ? theme.palette.success.main : theme.palette.background.default,
                          color: question.correctAnswer === true ? "white" : "text.secondary",
                        }}
                      />
                      <Chip
                        label="False"
                        sx={{
                          bgcolor: question.correctAnswer === false ? theme.palette.success.main : theme.palette.background.default,
                          color: question.correctAnswer === false ? "white" : "text.secondary",
                        }}
                      />
                    </Box>
                  </Box>
                )}

                {question.explanation && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: "bold" }}>
                      Explanation:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {question.explanation}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                  <Button
                    startIcon={<Visibility />}
                    onClick={() => handlePreview(question)}
                    variant="outlined"
                    size="small"
                    color="primary"
                  >
                    Preview
                  </Button>
                  <Button
                    startIcon={<Edit />}
                    onClick={() => onEditQuestion(index, question)}
                    variant="outlined"
                    size="small"
                    color="primary"
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<Delete />}
                    onClick={() => onDeleteQuestion(index)}
                    variant="outlined"
                    size="small"
                    color="error"
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Card>
      ))}

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: "white" }}>Question Preview</DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {previewQuestion && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {previewQuestion.question}
              </Typography>

              {previewQuestion.type === "mcq" && previewQuestion.options && (
                <RadioGroup>
                  {previewQuestion.options.map((option, index) => (
                    <FormControlLabel key={index} value={index} control={<Radio />} label={option} />
                  ))}
                </RadioGroup>
              )}

              {previewQuestion.type === "short-answer" && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Answer:
                  </Typography>
                  <Box
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      p: 2,
                      minHeight: 60,
                      bgcolor: theme.palette.background.default,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      [Student's answer will appear here]
                    </Typography>
                  </Box>
                </Box>
              )}

              {previewQuestion.type === "true-false" && (
                <Box sx={{ mt: 2 }}>
                  <RadioGroup>
                    <FormControlLabel value="true" control={<Radio />} label="True" />
                    <FormControlLabel value="false" control={<Radio />} label="False" />
                  </RadioGroup>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
