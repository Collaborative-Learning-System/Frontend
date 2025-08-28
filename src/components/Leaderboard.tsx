import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Container,
  ButtonGroup,
  Fade,
  useTheme,
  useMediaQuery,
  Stack,
  LinearProgress,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";

interface UserScore {
  id: number;
  name: string;
  avatar: string;
  totalScore: number;
  quizzesCompleted: number;
  averageScore: number;
  rank: number;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  groupId: number;
}

const mockLeaderboardData: { [key: number]: UserScore[] } = {
  1: [
    // Computer Security
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "👨‍💻",
      totalScore: 285,
      quizzesCompleted: 15,
      averageScore: 95,
      rank: 1,
      isCurrentUser: false,
    },
    {
      id: 2,
      name: "Sarah Chen",
      avatar: "👩‍💼",
      totalScore: 270,
      quizzesCompleted: 14,
      averageScore: 90,
      rank: 2,
      isCurrentUser: false,
    },
    {
      id: 3,
      name: "You",
      avatar: "👤",
      totalScore: 245,
      quizzesCompleted: 12,
      averageScore: 85,
      rank: 3,
      isCurrentUser: true,
    },
    {
      id: 4,
      name: "Mike Rodriguez",
      avatar: "👨‍🎓",
      totalScore: 220,
      quizzesCompleted: 11,
      averageScore: 82,
      rank: 4,
      isCurrentUser: false,
    },
    {
      id: 5,
      name: "Emma Wilson",
      avatar: "👩‍🔬",
      totalScore: 210,
      quizzesCompleted: 10,
      averageScore: 80,
      rank: 5,
      isCurrentUser: false,
    },
  ],
  2: [
    // Software Engineering
    {
      id: 6,
      name: "David Kim",
      avatar: "👨‍💻",
      totalScore: 295,
      quizzesCompleted: 16,
      averageScore: 92,
      rank: 1,
      isCurrentUser: false,
    },
    {
      id: 7,
      name: "Lisa Zhang",
      avatar: "👩‍💻",
      totalScore: 280,
      quizzesCompleted: 15,
      averageScore: 88,
      rank: 2,
      isCurrentUser: false,
    },
    {
      id: 3,
      name: "You",
      avatar: "👤",
      totalScore: 250,
      quizzesCompleted: 13,
      averageScore: 83,
      rank: 3,
      isCurrentUser: true,
    },
  ],
  3: [
    // Business Analysis
    {
      id: 8,
      name: "Jennifer Brown",
      avatar: "👩‍💼",
      totalScore: 275,
      quizzesCompleted: 14,
      averageScore: 89,
      rank: 1,
      isCurrentUser: false,
    },
    {
      id: 3,
      name: "You",
      avatar: "👤",
      totalScore: 230,
      quizzesCompleted: 11,
      averageScore: 78,
      rank: 2,
      isCurrentUser: true,
    },
  ],
};

const Leaderboard: React.FC<LeaderboardProps> = ({ groupId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "all"
  >("all");

  const leaderboardData = mockLeaderboardData[groupId] || [];
  const topThreeRaw = leaderboardData.slice(0, 3);
  const topThree = [topThreeRaw[1], topThreeRaw[0], topThreeRaw[2]].filter(
    Boolean
  );

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🏆";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
  return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return theme.palette.warning.main; // Gold
      case 2:
        return theme.palette.grey[400]; // Silver
      case 3:
        return "#cd7f32"; // Bronze
      default:
        return theme.palette.primary.main;
    }
  };

  const getPodiumHeight = (rank: number) => {
    if (isSmall) {
      switch (rank) {
        case 1:
          return 140;
        case 2:
          return 120;
        case 3:
          return 100;
        default:
          return 80;
      }
    }
    switch (rank) {
      case 1:
        return 160;
      case 2:
        return 140;
      case 3:
        return 120;
      default:
        return 100;
    }
  };

  const getPerformanceColor = (average: number) => {
    if (average >= 90) return "success";
    if (average >= 80) return "primary";
    if (average >= 70) return "warning";
    return "error";
  };

  return (
    <Box sx={{ width: "100%", height: "100%", overflow: "auto" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TrophyIcon
              sx={{ color: "warning.main", fontSize: { xs: 28, sm: 32 } }}
            />
            <Typography
              variant={isSmall ? "h5" : "h4"}
              component="h2"
              fontWeight="bold"
            >
              Leaderboard
            </Typography>
          </Box>

          <ButtonGroup
            variant="contained"
            size={isSmall ? "small" : "medium"}
            sx={{
              "& .MuiButton-root": {
                textTransform: "none",
                fontWeight: "medium",
              },
            }}
          >
            <Button
              variant={selectedPeriod === "week" ? "contained" : "outlined"}
              onClick={() => setSelectedPeriod("week")}
            >
              This Week
            </Button>
            <Button
              variant={selectedPeriod === "month" ? "contained" : "outlined"}
              onClick={() => setSelectedPeriod("month")}
            >
              This Month
            </Button>
            <Button
              variant={selectedPeriod === "all" ? "contained" : "outlined"}
              onClick={() => setSelectedPeriod("all")}
            >
              All Time
            </Button>
          </ButtonGroup>
        </Box>

        {/* Top 3 Podium */}
        <Paper
          elevation={3}
          sx={{ p: { xs: 2, sm: 3 }, mb: 4, borderRadius: 3 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <StarIcon sx={{ color: "warning.main" }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Top Performers
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "end",
              gap: { xs: 1, sm: 2 },
              minHeight: { xs: 180, sm: 220 },
              flexWrap: { xs: "wrap", sm: "nowrap" },
              px: { xs: 1, sm: 0 },
            }}
          >
            {topThree.map((user, index) => (
              <Fade key={user.id} in={true} timeout={500 * (index + 1)}>
                <Card
                  elevation={user.rank === 1 ? 8 : 4}
                  sx={{
                    textAlign: "center",
                    minWidth: { xs: "100%", sm: 140, md: 160 },
                    maxWidth: { xs: "100%", sm: 200 },
                    height: getPodiumHeight(user.rank),
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    border: user.isCurrentUser ? "3px solid" : "1px solid",
                    borderColor: user.isCurrentUser
                      ? "primary.main"
                      : "divider",
                    bgcolor:
                      user.rank === 1
                        ? "rgba(255, 215, 0, 0.05)"
                        : "background.paper",
                    position: "relative",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px) scale(1.02)",
                      boxShadow: 8,
                    },
                    mb: { xs: 2, sm: 0 },
                    "&::before":
                      user.rank === 1
                        ? {
                            content: '""',
                            position: "absolute",
                            top: -12,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 24,
                            height: 24,
                            bgcolor: "warning.main",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1,
                            boxShadow: 3,
                          }
                        : {},
                  }}
                >
                  <CardContent sx={{ p: { xs: 1.5, sm: 2 }, pb: 0 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        color: getRankColor(user.rank),
                        mb: 1,
                        fontSize: { xs: "2rem", sm: "3rem" },
                      }}
                    >
                      {getRankIcon(user.rank)}
                    </Typography>
                    <Avatar
                      sx={{
                        width: { xs: 50, sm: 60 },
                        height: { xs: 50, sm: 60 },
                        mx: "auto",
                        mb: 1,
                        fontSize: { xs: "1.5rem", sm: "1.8rem" },
                        bgcolor: user.isCurrentUser
                          ? "primary.light"
                          : "grey.300",
                        border: "3px solid",
                        borderColor: "background.paper",
                        boxShadow: 3,
                      }}
                    >
                      {user.avatar}
                    </Avatar>
                    <Typography
                      variant={isSmall ? "body1" : "h6"}
                      fontWeight="bold"
                      noWrap
                      sx={{ fontSize: { xs: "0.9rem", sm: "1.1rem" } }}
                    >
                      {user.name}
                    </Typography>
                    {user.isCurrentUser && (
                      <Chip
                        label="YOU"
                        color="primary"
                        size="small"
                        sx={{ mt: 0.5, fontWeight: "bold" }}
                      />
                    )}
                  </CardContent>
                  <CardContent sx={{ pt: 0, pb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {user.totalScore} pts
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.averageScore}% average
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={user.averageScore}
                      sx={{
                        mt: 1,
                        height: 6,
                        borderRadius: 3,
                        bgcolor: "grey.200",
                      }}
                      color={getPerformanceColor(user.averageScore) as any}
                    />
                  </CardContent>
                </Card>
              </Fade>
            ))}
          </Box>
        </Paper>

        {/* Full Leaderboard Table */}
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Box sx={{ p: 3, pb: 1, bgcolor: "primary.main", color: "white" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TrendingUpIcon />
              <Typography variant="h5" fontWeight="600">
                Full Rankings
              </Typography>
            </Box>
          </Box>

          <TableContainer sx={{ maxHeight: isMobile ? 400 : 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: "grey.50" }}>
                    Rank
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: "grey.50" }}>
                    Student
                  </TableCell>
                  {!isSmall && (
                    <>
                      <TableCell
                        align="center"
                        sx={{ fontWeight: "bold", bgcolor: "grey.50" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 0.5,
                          }}
                        >
                          <SpeedIcon fontSize="small" />
                          Score
                        </Box>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontWeight: "bold", bgcolor: "grey.50" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 0.5,
                          }}
                        >
                          <AssignmentIcon fontSize="small" />
                          Quizzes
                        </Box>
                      </TableCell>
                    </>
                  )}
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", bgcolor: "grey.50" }}
                  >
                    Average
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboardData.map((user, index) => (
                  <Fade key={user.id} in={true} timeout={200 * (index + 1)}>
                    <TableRow
                      sx={{
                        bgcolor: user.isCurrentUser
                          ? "primary.light"
                          : "transparent",
                        color: user.isCurrentUser
                          ? "primary.contrastText"
                          : "text.primary",
                        "&:hover": {
                          bgcolor: user.isCurrentUser
                            ? "primary.main"
                            : "action.hover",
                          "& .MuiTableCell-root": {
                            color: user.isCurrentUser
                              ? "white"
                              : "text.primary",
                          },
                        },
                        transition: "all 0.2s ease-in-out",
                        cursor: "pointer",
                      }}
                    >
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              color: getRankColor(user.rank),
                              fontWeight: "bold",
                              fontSize: { xs: "1rem", sm: "1.25rem" },
                            }}
                          >
                            {getRankIcon(user.rank)}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: user.isCurrentUser
                                ? "primary.dark"
                                : "grey.300",
                              width: { xs: 32, sm: 40 },
                              height: { xs: 32, sm: 40 },
                              fontSize: { xs: "1rem", sm: "1.2rem" },
                            }}
                          >
                            {user.avatar}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body1"
                              fontWeight="medium"
                              sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                            >
                              {user.name}
                            </Typography>
                            {user.isCurrentUser && (
                              <Chip
                                label="YOU"
                                color="secondary"
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: "0.7rem",
                                  fontWeight: "bold",
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      </TableCell>

                      {!isSmall && (
                        <>
                          <TableCell align="center">
                            <Stack alignItems="center" spacing={0.5}>
                              <Typography
                                variant="h6"
                                fontWeight="bold"
                                color="primary"
                              >
                                {user.totalScore}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                pts
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="center">
                            <Typography variant="body1" fontWeight="medium">
                              {user.quizzesCompleted}
                            </Typography>
                          </TableCell>
                        </>
                      )}

                      <TableCell align="center">
                        <Stack alignItems="center" spacing={1}>
                          <Chip
                            label={`${user.averageScore}%`}
                            color={getPerformanceColor(user.averageScore) as any}
                            variant={user.averageScore >= 80 ? "filled" : "outlined"}
                            size="small"
                            sx={{ fontWeight: "bold" }}
                          />
                          <LinearProgress
                            variant="determinate"
                            value={user.averageScore}
                            sx={{
                              width: 60,
                              height: 4,
                              borderRadius: 2,
                              bgcolor: "grey.200",
                            }}
                            color={
                              getPerformanceColor(user.averageScore) as any
                            }
                          />
                        </Stack>
                      </TableCell>
                    </TableRow>
                  </Fade>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {leaderboardData.length === 0 && (
            <Box sx={{ p: 6, textAlign: "center" }}>
              <TrophyIcon
                sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No leaderboard data available for this group yet.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Complete some quizzes to see rankings!
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Leaderboard;
