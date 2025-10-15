import React from "react";
import { Box, Typography, alpha } from "@mui/material";

interface CursorPosition {
  x: number;
  y: number;
  selection?: {
    from: number;
    to: number;
  };
}

interface OnlineUser {
  userId: string;
  name: string;
  isOnline: boolean;
  cursor?: CursorPosition;
}

interface CursorOverlayProps {
  onlineUsers: OnlineUser[];
  currentUserId: string | null;
}

const CursorOverlay: React.FC<CursorOverlayProps> = ({
  onlineUsers,
  currentUserId,
}) => {
  const getUserColor = (userId: string) => {
    const colors = [
      "#ff4444",
      "#44ff44",
      "#4444ff",
      "#ffff44",
      "#ff44ff",
      "#44ffff",
      "#ff8844",
      "#88ff44",
      "#4488ff",
      "#ff4488",
      "#88ff88",
      "#8844ff",
    ];
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <>
      {onlineUsers
        .filter(
          (user) =>
            user.userId !== currentUserId && user.isOnline && user.cursor
        )
        .map((user) => {
          if (!user.cursor) return null;

          const userColor = getUserColor(user.userId);

          return (
            <Box
              key={user.userId}
              sx={{
                position: "absolute",
                left: user.cursor.x,
                top: user.cursor.y,
                pointerEvents: "none",
                zIndex: 1000,
                transform: "translate(-2px, -2px)",
              }}
            >
              <Box
                sx={{
                  width: "2px",
                  height: "20px",
                  backgroundColor: userColor,
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: "-3px",
                    left: "-3px",
                    width: "8px",
                    height: "8px",
                    backgroundColor: userColor,
                    transform: "rotate(45deg)",
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  top: "-25px",
                  left: "8px",
                  backgroundColor: userColor,
                  color: "white",
                  px: 0.5,
                  py: 0.25,
                  borderRadius: "4px",
                  fontSize: "10px",
                  whiteSpace: "nowrap",
                  fontWeight: "medium",
                  boxShadow: `0 2px 4px ${alpha(userColor, 0.3)}`,
                }}
              >
                {user.name}
              </Typography>
            </Box>
          );
        })}
    </>
  );
};

export default CursorOverlay;
