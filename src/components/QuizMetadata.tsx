"use client"

import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  useTheme,
} from "@mui/material"

interface QuizMetadataProps {
  metadata: {
    title: string
    description: string
    difficulty: string
    timeLimit: number
    instructions: string
  }
  onChange: (field: string, value: any) => void
}

export default function QuizMetadata({ metadata, onChange }: QuizMetadataProps) {
  const theme = useTheme()
  

  

  const difficulties = ["Easy", "Medium", "Hard"]

  
  return (
    <Card>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: "bold", mb: 3 }}>
          Quiz Information
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            fullWidth
            label="Quiz Title"
            value={metadata.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="Enter an engaging quiz title"
            required
          />

          <TextField
            fullWidth
            label="Description"
            value={metadata.description}
            onChange={(e) => onChange("description", e.target.value)}
            multiline
            rows={3}
            placeholder="Describe what this quiz covers and its purpose"
          />

          {/* Difficulty and Time Limit in the same row */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ flexGrow: 1, minWidth: "200px" }}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={metadata.difficulty}
                  label="Difficulty"
                  onChange={(e) => onChange("difficulty", e.target.value)}
                >
                  {difficulties.map((difficulty) => (
                    <MenuItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ flexGrow: 1, minWidth: "200px" }}>
              <TextField
                fullWidth
                label="Time Limit (minutes)"
                type="number"
                value={metadata.timeLimit}
                onChange={(e) => onChange("timeLimit", Number.parseInt(e.target.value) || 0)}
                inputProps={{ min: 0, max: 300 }}
              />
            </Box>
          </Box>

         
  
          <TextField
            fullWidth
            label="Instructions"
            value={metadata.instructions}
            onChange={(e) => onChange("instructions", e.target.value)}
            multiline
            rows={3}
            placeholder="Provide instructions for quiz takers (optional)"
          />
        </Box>
      </CardContent>
    </Card>
  )
}
