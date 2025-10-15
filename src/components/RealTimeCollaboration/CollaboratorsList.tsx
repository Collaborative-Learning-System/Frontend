import React from "react";
import {
  Box,
  Avatar,
  Chip,
  Typography,
  Stack,
  Badge,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import { Circle } from "@mui/icons-material";

interface Collaborator {
  id: string;
  name: string;
  cursor?: {
    x: number;
    y: number;
  };
}

interface OnlineUser {
  userId: string;
  name: string;
  isOnline: boolean;
  cursor?: {
    x: number;
    y: number;
    selection?: {
      from: number;
      to: number;
    };
  };
}

interface CollaboratorsListProps {
  collaborators?: Collaborator[];
  onlineUsers?: OnlineUser[];
  currentUserId: string | null;
  showOnlineOnly?: boolean;
}

const CollaboratorsList: React.FC<CollaboratorsListProps> = ({
  collaborators = [],
  onlineUsers = [],
  currentUserId,
  showOnlineOnly = true,
}) => {
  const theme = useTheme();

  const displayUsers = showOnlineOnly
    ? onlineUsers.filter((user) => user.isOnline)
    : onlineUsers.length > 0
    ? onlineUsers
    : collaborators;

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ mb: 1, color: theme.palette.text.secondary }}
      >
        {showOnlineOnly ? "Online Now" : "Collaborators"} ({displayUsers.length}
        )
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {displayUsers.map((user) => {
          const isOnlineUser = "isOnline" in user;
          const userId = isOnlineUser ? user.userId : user.id;
          const userName = isOnlineUser ? user.name : user.name;
          const isUserOnline = isOnlineUser ? user.isOnline : true;

          return (
            <Tooltip
              key={userId}
              title={`${userName}${userId === currentUserId ? " (You)" : ""}${
                isOnlineUser && user.cursor ? " - Active" : ""
              }`}
              arrow
            >
              <Box sx={{ position: "relative" }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    isUserOnline ? (
                      <Circle
                        sx={{
                          color:
                            isOnlineUser && user.cursor ? "#ff9800" : "#4caf50",
                          fontSize: 12,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: "50%",
                          p: 0.25,
                        }}
                      />
                    ) : (
                      <Circle
                        sx={{
                          color: "#9e9e9e",
                          fontSize: 12,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: "50%",
                          p: 0.25,
                        }}
                      />
                    )
                  }
                >
                  <Chip
                    avatar={
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          fontSize: "0.75rem",
                          opacity: isUserOnline ? 1 : 0.6,
                        }}
                      >
                        {userName
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </Avatar>
                    }
                    label={
                      <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                        {userName}
                        {userId === currentUserId && (
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{ ml: 0.5, opacity: 0.7 }}
                          >
                            (You)
                          </Typography>
                        )}
                      </Typography>
                    }
                    size="small"
                    sx={{
                      opacity: isUserOnline ? 1 : 0.6,
                    }}
                  />
                </Badge>
              </Box>
            </Tooltip>
          );
        })}
      </Stack>
    </Box>
  );
};

export default CollaboratorsList;
