import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
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
  Fade,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material";
import axios from "axios";
import { AppContext } from "../context/AppContext";

interface LeaderboardData {
  userId: string;
  name: string;
  totalPoints: number;
  avgPoints: number;
  quizzesTaken: number;
  rank: number;
  avatar: string;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  groupId: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ groupId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { userId } = useContext(AppContext);

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboardData = async (groupId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/quiz/results/${groupId}`
      );

      const responseData = response.data.data;
      const data = responseData.success ? responseData.data : responseData;

      const mappedData: LeaderboardData[] = (
        Array.isArray(data) ? data : []
      ).map((entry: any, index: number) => ({
        userId: entry.userId,
        name: entry.name.trim(),
        totalPoints: parseFloat(entry.totalPoints),
        avgPoints: parseFloat(entry.avgPoints) * 100,
        quizzesTaken: entry.quizzesTaken,
        rank: index + 1,
        avatar: entry.name.trim().charAt(0).toUpperCase(),
        isCurrentUser: entry.userId === (userId || "").trim(),
      }));

      mappedData.sort((a, b) => b.avgPoints - a.avgPoints);
      mappedData.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      setLeaderboardData(mappedData);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load leaderboard. Please Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Clear previous data immediately when groupId changes
    setLeaderboardData([]);
    setError(null);
    fetchLeaderboardData(groupId);
  }, [groupId]);

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
        return theme.palette.warning.main;
      case 2:
        return theme.palette.grey[400];
      case 3:
        return "#cd7f32";
      default:
        return theme.palette.primary.main;
    }
  };

  const getPodiumHeight = (rank: number) => {
    if (isSmall) {
      switch (rank) {
        case 1:
          return 150;
        case 2:
          return 130;
        case 3:
          return 120;
        default:
          return 100;
      }
    }
    switch (rank) {
      case 1:
        return 240;
      case 2:
        return 220;
      case 3:
        return 210;
      default:
        return 120;
    }
  };

  const getPerformanceColor = (average: number) => {
    if (average >= 90) return "success";
    if (average >= 80) return "primary";
    if (average >= 70) return "warning";
    return "error";
  };

  const topThreeRaw = leaderboardData.slice(0, 3);
  const topThree = [topThreeRaw[1], topThreeRaw[0], topThreeRaw[2]].filter(
    Boolean
  );

  return (
    <Box sx={{ width: "100%", height: "100%", overflow: "auto" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TrophyIcon
              sx={{ color: "warning.main", fontSize: { xs: 26, sm: 32 } }}
            />
            <Typography
              variant={isSmall ? "h6" : "h4"}
              component="h2"
              fontWeight="bold"
            >
              Leaderboard
            </Typography>
          </Box>
        </Box>

        {loading ? (
          <Fade in={true}>
            <Paper
              elevation={3}
              sx={{ p: { xs: 4, sm: 6 }, textAlign: "center", borderRadius: 3 }}
            >
              <CircularProgress size={50} sx={{ mb: 2 }} />
              <Typography>Loading leaderboard...</Typography>
            </Paper>
          </Fade>
        ) : error ? (
          <Fade in={true}>
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
              {error}
            </Alert>
          </Fade>
        ) : leaderboardData.length > 0 ? (
          <>
            {/* Top 3 Podium */}
            <Paper
              elevation={3}
              sx={{ p: { xs: 2, sm: 3 }, mb: 4, borderRadius: 3 }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <StarIcon sx={{ color: "warning.main", fontSize: 22 }} />
                <Typography
                  variant={isSmall ? "h6" : "h5"}
                  sx={{ fontWeight: 600 }}
                >
                  Top Performers
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  gap: { xs: 1.5, sm: 3 },
                  flexWrap: "wrap",
                  minHeight: { xs: 170, sm: 240 },
                }}
              >
                {topThree.map((user) => (
                  <Card
                    key={`podium-${user.rank}`}
                    elevation={user.rank === 1 ? 8 : 3}
                    sx={{
                      flex: "1 1 0",
                      textAlign: "center",
                      minWidth: { xs: 90, sm: 120 },
                      maxWidth: { xs: 110, sm: 170 },
                      height: getPodiumHeight(user.rank),
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      border: user.isCurrentUser ? "2px solid" : "1px solid",
                      borderColor: user.isCurrentUser
                        ? "primary.main"
                        : "divider",
                      bgcolor:
                        user.rank === 1
                          ? "rgba(255, 215, 0, 0.08)"
                          : "background.paper",
                    }}
                  >
                    <CardContent sx={{ p: 1.5, pb: 1 }}>
                      <Typography
                        variant="h4"
                        sx={{
                          color: getRankColor(user.rank),
                          mb: 0.5,
                          fontSize: { xs: "1.6rem", sm: "2.2rem" },
                        }}
                      >
                        {getRankIcon(user.rank)}
                      </Typography>
                      <Avatar
                        sx={{
                          width: { xs: 45, sm: 55 },
                          height: { xs: 45, sm: 55 },
                          mx: "auto",
                          mb: 1,
                          fontSize: { xs: "1.2rem", sm: "1.6rem" },
                          bgcolor: user.isCurrentUser
                            ? "primary.light"
                            : "grey.300",
                        }}
                      >
                        {user.avatar}
                      </Avatar>
                      <Typography
                        variant={isSmall ? "body2" : "h6"}
                        fontWeight="bold"
                        noWrap
                      >
                        {user.name}
                      </Typography>
                      {user.isCurrentUser && (
                        <Chip
                          label="YOU"
                          color="primary"
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      )}
                    </CardContent>
                    <CardContent sx={{ pt: 0, pb: 1 }}>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="primary"
                      >
                        {Math.round(user.avgPoints)}%
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Paper>

            {/* Full Leaderboard */}
            <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
              <Box
                sx={{
                  p: { xs: 2, sm: 3 },
                  pb: 1,
                  bgcolor: "primary.main",
                  color: "white",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TrendingUpIcon fontSize="small" />
                  <Typography variant={isSmall ? "h6" : "h5"} fontWeight="600">
                    Full Rankings
                  </Typography>
                </Box>
              </Box>

              <TableContainer sx={{ maxHeight: isMobile ? 350 : 500 }}>
                <Table stickyHeader size={isSmall ? "small" : "medium"}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Rank</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Student</TableCell>
                      {!isSmall && (
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          <SpeedIcon fontSize="small" /> Score
                        </TableCell>
                      )}
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Total Score
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Quizzes 
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaderboardData.map((user) => (
                      <TableRow key={`table-user-${user.rank}`} sx={{
                        bgcolor: user.isCurrentUser ? "action.selected" : "inherit"
                      }}>
                        <TableCell>
                          <Typography
                            variant="body1"
                            sx={{ color: getRankColor(user.rank) }}
                          >
                            {getRankIcon(user.rank)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Avatar sx={{ width: 32, height: 32 }}>
                              {user.avatar}
                            </Avatar>
                            <Typography
                              noWrap
                              fontSize={isSmall ? "0.85rem" : "1rem"}
                            >
                              {user.isCurrentUser ? `${user.name} (You)` : user.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        {!isSmall && (
                          <TableCell align="center">
                            <Chip
                              label={`${Math.round(user.avgPoints)}%`}
                              color={getPerformanceColor(user.avgPoints) as any}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                        )}
                        <TableCell sx={{ alignItems: "center" }}>{user.totalPoints}</TableCell>
                        <TableCell>{user.quizzesTaken}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        ) : (
          <Fade in={true}>
            <Paper
              elevation={3}
              sx={{ p: { xs: 4, sm: 6 }, textAlign: "center", borderRadius: 3 }}
            >
              <TrophyIcon
                sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
              />
              <Typography>No leaderboard data available yet.</Typography>
            </Paper>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default Leaderboard;
