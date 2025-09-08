import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Avatar,
  TextField,
  Button,
  useTheme,
  alpha,
  Stack,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Person,
  Email,
  Lock,
  Edit,
  Save,
  Cancel,
  Dashboard,
  PhotoCamera,
} from "@mui/icons-material";
import { AppContext } from "../context/AppContext";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UserProfile() {
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const theme = useTheme();

  const { userData, setUserData } = useContext(AppContext);

  const [editData, setEditData] = useState(userData);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(userData);
  };

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  // const handleInputChange =
  //   (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
  //     setEditData((prev) => ({ ...prev, [field]: event.target.value }));
  //   };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        p: 4,
      }}
    >
      {/* Profile Header */}
      <Box
        sx={{
          mb: 4,
          p: 4,
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Stack direction="row" spacing={3} alignItems="center">
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={""}
              sx={{
                width: 100,
                height: 100,
                fontSize: "2rem",
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }}
            >
              {userData?.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </Avatar>
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                bottom: -5,
                right: -5,
                bgcolor: theme.palette.primary.main,
                color: "white",
                "&:hover": { bgcolor: theme.palette.primary.dark },
              }}
            >
              <PhotoCamera fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="600" sx={{ mb: 1 }}>
              {userData?.fullName}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {userData?.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {"No bio available"}
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Navigation Tabs */}
      <Box
        sx={{
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            sx={{
              "& .MuiTab-root": {
                color: theme.palette.text.secondary,
                fontWeight: 500,
                "&.Mui-selected": {
                  color: theme.palette.primary.main,
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          >
            <Tab icon={<Dashboard />} label="Dashboard" />
            <Tab icon={<Person />} label="Profile" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="600" sx={{ mb: 3 }}>
              Dashboard
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 300,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 2,
                border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                textAlign="center"
              >
                Dashboard content will be added here
              </Typography>
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 4 }}>
            <Box
              sx={{
                mb: 4,
                display: "flex",
                justifyContent: "between",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" fontWeight="600">
                User Information
              </Typography>
              {!isEditing ? (
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={handleEdit}
                  sx={{ ml: "auto" }}
                >
                  Edit Profile
                </Button>
              ) : (
                <Stack direction="row" spacing={2} sx={{ ml: "auto" }}>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </Stack>
              )}
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Stack spacing={3}>
              {/* Name Field */}
              <Box>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Person sx={{ color: theme.palette.primary.main }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Full Name
                  </Typography>
                </Stack>
                {isEditing ? (
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={editData?.fullName}
                  //  onChange={handleInputChange("name")}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                      },
                    }}
                  />
                ) : (
                  <Typography variant="body1" sx={{ ml: 4 }}>
                    {userData?.fullName}
                  </Typography>
                )}
              </Box>

              {/* Email Field */}
              <Box>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Email sx={{ color: theme.palette.primary.main }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Email Address
                  </Typography>
                </Stack>
                {isEditing ? (
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="email"
                    value={editData?.email}
                    //onChange={handleInputChange("email")}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                      },
                    }}
                  />
                ) : (
                  <Typography variant="body1" sx={{ ml: 4 }}>
                    {userData?.email}
                  </Typography>
                )}
              </Box>

              {/* Password Field */}
              <Box>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Lock sx={{ color: theme.palette.primary.main }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Password
                  </Typography>
                </Stack>
                {isEditing ? (
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="password"
                    value={""}
                    //onChange={handleInputChange("password")}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                      },
                    }}
                  />
                ) : (
                  <Typography variant="body1" sx={{ ml: 4 }}>
                    ********
                  </Typography>
                )}
              </Box>

              {/* Bio Field */}
              <Box>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Person sx={{ color: theme.palette.primary.main }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Bio
                  </Typography>
                </Stack>
                {isEditing ? (
                  <TextField
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                   // value={editData.bio}
                   // onChange={handleInputChange("bio")}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                      },
                    }}
                  />
                ) : (
                  <Typography variant="body1" sx={{ ml: 4, lineHeight: 1.6 }}>
                    {"No bio available"}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Box>
        </TabPanel>
      </Box>
    </Box>
  );
}
