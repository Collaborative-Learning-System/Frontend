import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  IconButton,
  Badge,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
} from "@mui/material";
import {
  
  PhotoCamera,
  School,
  LocationOn,
  CalendarToday,
} from "@mui/icons-material";

interface ProfileHeaderProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    university: string;
    major: string;
    location: string;
    joinDate: string;
    studyStreak: number;
    level: string;
  };
  onUpdateAvatar: (file: File) => void;
}

export default function ProfileHeader({
  user,
  onUpdateAvatar,
}: ProfileHeaderProps) {
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const theme = useTheme();

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpdateAvatar(file);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "linear-gradient(135deg, #083c70ff 0%, #1565c0 100%)",
        background: "linear-gradient(135deg, #083c70ff 0%, #1565c0 100%)",
        color: "white",
        p: 4,
        borderRadius: 2,
        mb: 3,
      }}
    >
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}
      >
        <Box sx={{ position: "relative" }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <IconButton
                size="small"
                sx={{
                  bgcolor: theme.palette.background.paper,
                  color: theme.palette.primary.main,
                  "&:hover": { bgcolor: theme.palette.background.default },
                }}
                onClick={() => setAvatarDialogOpen(true)}
              >
                <PhotoCamera fontSize="small" />
              </IconButton>
            }
          >
            <Avatar
              src={user.avatar}
              sx={{ width: 120, height: 120, border: "4px solid white" }}
            >
              {user.name.charAt(0)}
            </Avatar>
          </Badge>
        </Box>

        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            {user.name}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
            {user.email}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <School fontSize="small" />
              <Typography variant="body2">{user.university}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOn fontSize="small" />
              <Typography variant="body2">{user.location}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarToday fontSize="small" />
              <Typography variant="body2">Joined {user.joinDate}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip
              label={`${user.studyStreak} Day Streak`}
              sx={{
                bgcolor: alpha(theme.palette.background.paper, 0.3),
                color: "white",
              }}
            />
            <Chip
              label={user.level}
              sx={{
                bgcolor: alpha(theme.palette.background.paper, 0.3),
                color: "white",
              }}
            />
            <Chip
              label={user.major}
              sx={{
                bgcolor: alpha(theme.palette.background.paper, 0.3),
                color: "white",
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Avatar Upload Dialog */}
      <Dialog
        open={avatarDialogOpen}
        onClose={() => setAvatarDialogOpen(false)}
      >
        <DialogTitle>Update Profile Picture</DialogTitle>
        <DialogContent>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="avatar-upload"
            type="file"
            onChange={handleAvatarChange}
          />
          <label htmlFor="avatar-upload">
            <Button
              variant="contained"
              component="span"
              fullWidth
              sx={{ mt: 2 }}
            >
              Choose Image
            </Button>
          </label>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAvatarDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
