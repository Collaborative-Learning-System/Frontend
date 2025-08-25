"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  useTheme,
} from "@mui/material";
import { Edit, Save, Cancel, Add, Delete } from "@mui/icons-material";

interface EditableSectionProps {
  title: string;
  children: (isEditing: boolean) => React.ReactNode;
  onSave?: (data: any) => void;
}

export function EditableSection({
  title,
  children,
  onSave,
}: EditableSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    if (onSave) {
      onSave({});
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "#083c70ff", fontWeight: "bold" }}
          >
            {title}
          </Typography>
          <Box>
            {isEditing ? (
              <>
                <IconButton onClick={handleSave} sx={{ color: "#4caf50" }}>
                  <Save />
                </IconButton>
                <IconButton
                  onClick={() => setIsEditing(false)}
                  sx={{ color: "#f44336" }}
                >
                  <Cancel />
                </IconButton>
              </>
            ) : (
              <IconButton
                onClick={() => setIsEditing(true)}
                sx={{ color: "#083c70ff" }}
              >
                <Edit />
              </IconButton>
            )}
          </Box>
        </Box>
        {children(isEditing)}
      </CardContent>
    </Card>
  );
}

interface PersonalInfoProps {
  isEditing?: boolean;
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    university: string;
    major: string;
    year: string;
    location: string;
    bio: string;
  };
  onUpdate?: (data: any) => void;
}

export function PersonalInfo({
  isEditing = false,
  data,
}: PersonalInfoProps) {
  const [formData, setFormData] = useState(data);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isEditing) {
    return (
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Phone"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="University"
            value={formData.university}
            onChange={(e) => handleChange("university", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Major"
            value={formData.major}
            onChange={(e) => handleChange("major", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Academic Year</InputLabel>
            <Select
              value={formData.year}
              label="Academic Year"
              onChange={(e) => handleChange("year", e.target.value)}
            >
              <MenuItem value="1st Year">1st Year</MenuItem>
              <MenuItem value="2nd Year">2nd Year</MenuItem>
              <MenuItem value="3rd Year">3rd Year</MenuItem>
              <MenuItem value="4th Year">4th Year</MenuItem>
              <MenuItem value="Graduate">Graduate</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Location"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Bio"
            multiline
            rows={3}
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            placeholder="Tell us about yourself..."
          />
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="body2" color="text.secondary">
          Name
        </Typography>
        <Typography variant="body1">
          {data.firstName} {data.lastName}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="body2" color="text.secondary">
          Email
        </Typography>
        <Typography variant="body1">{data.email}</Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="body2" color="text.secondary">
          Phone
        </Typography>
        <Typography variant="body1">{data.phone || "Not provided"}</Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="body2" color="text.secondary">
          University
        </Typography>
        <Typography variant="body1">{data.university}</Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="body2" color="text.secondary">
          Major
        </Typography>
        <Typography variant="body1">{data.major}</Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="body2" color="text.secondary">
          Academic Year
        </Typography>
        <Typography variant="body1">{data.year}</Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography variant="body2" color="text.secondary">
          Bio
        </Typography>
        <Typography variant="body1">{data.bio || "No bio provided"}</Typography>
      </Grid>
    </Grid>
  );
}

interface LearningPreferencesProps {
  isEditing?: boolean;
  data: {
    learningStyle: string;
    studyTime: string;
    subjects: string[];
    goals: string[];
  };
}

export function LearningPreferences({
  isEditing = false,
  data,
}: LearningPreferencesProps) {
  const [formData, setFormData] = useState(data);
  const [newSubject, setNewSubject] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const theme = useTheme();

  const addSubject = () => {
    if (newSubject.trim()) {
      setFormData((prev) => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()],
      }));
      setNewSubject("");
    }
  };

  const removeSubject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index),
    }));
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setFormData((prev) => ({
        ...prev,
        goals: [...prev.goals, newGoal.trim()],
      }));
      setNewGoal("");
    }
  };

  const removeGoal = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index),
    }));
  };

  if (isEditing) {
    return (
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Learning Style</InputLabel>
            <Select
              value={formData.learningStyle}
              label="Learning Style"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  learningStyle: e.target.value,
                }))
              }
            >
              <MenuItem value="Visual">Visual</MenuItem>
              <MenuItem value="Auditory">Auditory</MenuItem>
              <MenuItem value="Kinesthetic">Kinesthetic</MenuItem>
              <MenuItem value="Reading/Writing">Reading/Writing</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Preferred Study Time</InputLabel>
            <Select
              value={formData.studyTime}
              label="Preferred Study Time"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, studyTime: e.target.value }))
              }
            >
              <MenuItem value="Early Morning">Early Morning</MenuItem>
              <MenuItem value="Morning">Morning</MenuItem>
              <MenuItem value="Afternoon">Afternoon</MenuItem>
              <MenuItem value="Evening">Evening</MenuItem>
              <MenuItem value="Night">Night</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle1" gutterBottom>
            Subjects of Interest
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
            {formData.subjects.map((subject, index) => (
              <Chip
                key={index}
                label={subject}
                onDelete={() => removeSubject(index)}
                deleteIcon={<Delete />}
                sx={{ bgcolor: theme.palette.primary.main, color: "white" }}
              />
            ))}
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              size="small"
              placeholder="Add subject"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSubject()}
            />
            <Button onClick={addSubject} startIcon={<Add />}>
              Add
            </Button>
          </Box>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle1" gutterBottom>
            Learning Goals
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
            {formData.goals.map((goal, index) => (
              <Chip
                key={index}
                label={goal}
                onDelete={() => removeGoal(index)}
                deleteIcon={<Delete />}
                sx={{ bgcolor: theme.palette.success.main, color: "white" }}
              />
            ))}
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              size="small"
              placeholder="Add goal"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addGoal()}
            />
            <Button onClick={addGoal} startIcon={<Add />}>
              Add
            </Button>
          </Box>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="body2" color="text.secondary">
          Learning Style
        </Typography>
        <Typography variant="body1">{data.learningStyle}</Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="body2" color="text.secondary">
          Preferred Study Time
        </Typography>
        <Typography variant="body1">{data.studyTime}</Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Subjects of Interest
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {data.subjects.map((subject, index) => (
            <Chip
              key={index}
              label={subject}
              sx={{ bgcolor: theme.palette.primary.main, color: "white" }}
            />
          ))}
        </Box>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Learning Goals
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {data.goals.map((goal, index) => (
            <Chip
              key={index}
              label={goal}
              sx={{ bgcolor: theme.palette.success.main, color: "white" }}
            />
          ))}
        </Box>
      </Grid>
    </Grid>
  );
}
