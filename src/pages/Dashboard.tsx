import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Button,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  Group,
  Quiz,
  Assignment,
  Schedule,
  MoreVert,
  PlayArrow,
} from '@mui/icons-material';

const Dashboard = () => {
  const theme = useTheme();

  // Mock data for demonstration
  const stats = [
    { title: 'Active Study Plans', value: '3', icon: <Assignment />, color: '#2196F3' },
    { title: 'Completed Quizzes', value: '12', icon: <Quiz />, color: '#4CAF50' },
    { title: 'Study Groups', value: '5', icon: <Group />, color: '#FF9800' },
    { title: 'Study Streak', value: '7 days', icon: <TrendingUp />, color: '#9C27B0' },
  ];

  const recentActivity = [
    { action: 'Completed Quiz: React Basics', time: '2 hours ago', avatar: 'Q' },
    { action: 'Joined Study Group: Data Structures', time: '5 hours ago', avatar: 'G' },
    { action: 'Updated Study Plan: Web Development', time: '1 day ago', avatar: 'P' },
    { action: 'Earned Badge: Quick Learner', time: '2 days ago', avatar: 'B' },
  ];

  const upcomingTasks = [
    { task: 'JavaScript Arrays Quiz', dueDate: 'Today, 3:00 PM', priority: 'high' },
    { task: 'Complete React Chapter 5', dueDate: 'Tomorrow', priority: 'medium' },
    { task: 'Group Project: Database Design', dueDate: 'Friday', priority: 'high' },
    { task: 'Review Python Functions', dueDate: 'Next Week', priority: 'low' },
  ];

  const studyPlans = [
    { name: 'Web Development Fundamentals', progress: 75, lessons: '8/12 completed' },
    { name: 'Data Structures & Algorithms', progress: 45, lessons: '6/15 completed' },
    { name: 'Database Management', progress: 90, lessons: '9/10 completed' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="600" color="primary" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's your learning progress overview.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3, 
        mb: 4,
        '& > *': { 
          flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' }
        }
      }}>
        {stats.map((stat, index) => (
          <Card key={index} sx={{ 
            background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
            border: `1px solid ${stat.color}30`,
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="700" color={stat.color}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Box>
                <Box sx={{ color: stat.color, opacity: 0.7 }}>
                  {stat.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
        {/* Study Plans Progress */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight="600">
                  Active Study Plans
                </Typography>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              <Box sx={{ space: 2 }}>
                {studyPlans.map((plan, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" fontWeight="500">
                        {plan.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {plan.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={plan.progress} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: theme.palette.grey[200],
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {plan.lessons}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<PlayArrow />}
                sx={{ mt: 1 }}
              >
                Continue Learning
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Recent Activity */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight="600">
                  Recent Activity
                </Typography>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              <List sx={{ p: 0 }}>
                {recentActivity.map((activity, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 1 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32, 
                        fontSize: '0.875rem',
                        bgcolor: theme.palette.primary.main 
                      }}>
                        {activity.avatar}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.action}
                      secondary={activity.time}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Upcoming Tasks */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight="600">
              Upcoming Tasks
            </Typography>
            <Button variant="text" size="small">
              View All
            </Button>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 2,
            '& > *': { 
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(25% - 12px)' }
            }
          }}>
            {upcomingTasks.map((task, index) => (
              <Paper 
                key={index}
                sx={{ 
                  p: 2, 
                  borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
                  backgroundColor: theme.palette.background.paper,
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Schedule sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Chip 
                    label={task.priority} 
                    size="small" 
                    sx={{ 
                      bgcolor: getPriorityColor(task.priority), 
                      color: 'white', 
                      fontSize: '0.75rem',
                      height: 20
                    }} 
                  />
                </Box>
                <Typography variant="body2" fontWeight="500" sx={{ mb: 1 }}>
                  {task.task}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Due: {task.dueDate}
                </Typography>
              </Paper>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
