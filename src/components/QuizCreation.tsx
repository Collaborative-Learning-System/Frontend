import React from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  useTheme,
  Container,
  Paper,
  Grid,
  Radio,
  FormControlLabel,
  RadioGroup,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface Answer {
  text: string;
}

interface Question {
  text: string;
  answers: Answer[];
  correctIndex: number | null;
  isSaved: boolean; 
}

interface QuizCreationProps {
  onClose: () => void;
}

const QuizCreation: React.FC<QuizCreationProps> = ({ onClose }) => {
  const theme = useTheme();
  const [questionNo, setQuestionNo] = React.useState(1);
  const [questions, setQuestions] = React.useState<Question[]>([]);

  // Update question text
  const updateQuestionText = (index: number, value: string) => {
    const updated = [...questions];
    updated[index].text = value;
    setQuestions(updated);
  };

  // Update answer text
  const updateAnswerText = (qIndex: number, aIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].answers[aIndex] = { text: value };
    setQuestions(updated);
  };

  // Set correct answer
  const setCorrectAnswer = (qIndex: number, aIndex: number) => {
    const updated = [...questions];
    updated[qIndex].correctIndex = aIndex;
    setQuestions(updated);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        answers: Array(5).fill({ text: "" }),
        correctIndex: null,
        isSaved: false,
      },
    ]);
    setQuestionNo((prev) => prev + 1);
  };

  // Save a question (switch to Saved Mode)
  const handleSaveQuestion = (index: number) => {
    const updated = [...questions];
    updated[index].isSaved = true;
    setQuestions(updated);
  };

  // View question (switch back to Edit Mode)
  const handleViewQuestion = (index: number) => {
    const updated = [...questions];
    updated[index].isSaved = false;
    setQuestions(updated);
  };

  // Remove question
  const handleRemoveQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 3,
          bgcolor: theme.palette.background.paper,
        }}
      >
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          position="relative"
        >
          <Typography variant="h4">Create Quiz</Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button variant="contained">Save Quiz</Button>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </Stack>

        {/* Form Fields */}
        <Box component="form" sx={{ mt: 4 }}>
          <TextField
            fullWidth
            label="Quiz Title"
            placeholder="Enter quiz title"
            variant="outlined"
            required
          />

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Time Limit"
                type="number"
                placeholder="Enter quiz time"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                fullWidth
                value="minutes"
                onChange={() => {}}
                displayEmpty
              >
                <MenuItem value="minutes">Minutes</MenuItem>
                <MenuItem value="hours">Hours</MenuItem>
              </Select>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" fontWeight={500} gutterBottom>
              Select Difficulty
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Button variant="outlined" color="success">
                Easy
              </Button>
              <Button variant="outlined" color="warning">
                Medium
              </Button>
              <Button variant="outlined" color="error">
                Hard
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* Questions Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight={600}>
            Add Questions
          </Typography>

          {/* Render Each Question Form */}
          {questions.map((q, qIndex) => (
            <Paper
              key={qIndex}
              variant="outlined"
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: theme.palette.background.paper,
              }}
            >
              {q.isSaved ? (
                // SAVED MODE
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Question {qIndex + 1}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleViewQuestion(qIndex)}
                    >
                      View
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveQuestion(qIndex)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Stack>
              ) : (
                // EDIT MODE
                <>
                  <TextField
                    fullWidth
                    label={`Question ${qIndex + 1}`}
                    placeholder="Enter the question"
                    value={q.text}
                    onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <RadioGroup
                    value={q.correctIndex}
                    onChange={(e) =>
                      setCorrectAnswer(qIndex, Number(e.target.value))
                    }
                  >
                    {q.answers.map((answer, aIndex) => (
                      <Stack
                        key={aIndex}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mb: 1 }}
                      >
                        <FormControlLabel
                          value={aIndex}
                          control={<Radio />}
                          label=""
                          sx={{ m: 0 }}
                        />
                        <TextField
                          fullWidth
                          placeholder={`Answer ${aIndex + 1}`}
                          value={answer.text}
                          onChange={(e) =>
                            updateAnswerText(qIndex, aIndex, e.target.value)
                          }
                        />
                      </Stack>
                    ))}
                  </RadioGroup>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveQuestion(qIndex)}
                    >
                      Remove Question
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleSaveQuestion(qIndex)}
                    >
                      Save Question
                    </Button>
                  </Box>
                </>
              )}
            </Paper>
          ))}

          {/* Add Question Button */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="stretch"
            sx={{ mt: 2 }}
          >
            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              onClick={handleAddQuestion}
            >
              Add Question
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default QuizCreation;
