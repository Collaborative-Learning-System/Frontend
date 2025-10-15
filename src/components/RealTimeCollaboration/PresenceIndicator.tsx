import React from "react";
import { Box, Typography, Chip, Stack, useTheme, alpha } from "@mui/material";
import { Circle, Visibility, Edit } from "@mui/icons-material";

interface OnlineUser {
  userId: string;
  name: string;
  isOnline: boolean;
  isActive?: boolean;
  lastActivity?: Date;
  cursor?: {
    x: number;
    y: number;
    selection?: {
      from: number;
      to: number;
    };
  };
}

interface PresenceIndicatorProps {
  onlineUsers: OnlineUser[];
  currentUserId: string | null;
}

const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({
  onlineUsers,
  currentUserId,
}) => {
  const theme = useTheme();

  const activeUsers = onlineUsers.filter(
    (user) => user.isOnline && user.userId !== currentUserId
  );

  const typingUsers = activeUsers.filter(
    (user) =>
      user.cursor?.selection &&
      user.cursor.selection.from !== user.cursor.selection.to
  );

  const viewingUsers = activeUsers.filter(
    (user) => !typingUsers.includes(user)
  );

  if (activeUsers.length === 0) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        backgroundColor: alpha(theme.palette.background.paper, 0.95),
        backdropFilter: "blur(10px)",
        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        borderRadius: 2,
        p: 2,
        boxShadow: theme.shadows[8],
        minWidth: 200,
        zIndex: 1000,
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
        Live Activity
      </Typography>

      <Stack spacing={1}>
        {typingUsers.length > 0 && (
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{ mb: 0.5 }}
            >
              <Edit sx={{ fontSize: 14, color: theme.palette.warning.main }} />
              <Typography variant="caption" sx={{ fontWeight: "medium" }}>
                Editing
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} flexWrap="wrap">
              {typingUsers.map((user) => (
                <Chip
                  key={user.userId}
                  label={user.name}
                  size="small"
                  icon={
                    <Circle
                      sx={{
                        fontSize: "8px !important",
                        color: theme.palette.warning.main,
                      }}
                    />
                  }
                  sx={{
                    height: 20,
                    fontSize: "0.7rem",
                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    color: theme.palette.warning.main,
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {viewingUsers.length > 0 && (
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{ mb: 0.5 }}
            >
              <Visibility
                sx={{ fontSize: 14, color: theme.palette.success.main }}
              />
              <Typography variant="caption" sx={{ fontWeight: "medium" }}>
                Viewing
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} flexWrap="wrap">
              {viewingUsers.map((user) => (
                <Chip
                  key={user.userId}
                  label={user.name}
                  size="small"
                  icon={
                    <Circle
                      sx={{
                        fontSize: "8px !important",
                        color: theme.palette.success.main,
                      }}
                    />
                  }
                  sx={{
                    height: 20,
                    fontSize: "0.7rem",
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default PresenceIndicator;
