import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Avatar,
  Alert,
  Tabs,
  Tab,
  InputAdornment,
  CircularProgress,
  Link,
  useTheme,
} from "@mui/material";
import {
  Person,
  Email,
  Lock,
  PersonAdd,
  Login,
} from "@mui/icons-material";
import axios from "axios";

const AuthComponent = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [info, setInfo] = useState("");

  const isLogin = tabValue === 0;

  // Login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
       setInfo("");
      await new Promise((resolve) => setTimeout(resolve, 1500));
     
      if (loginForm.email && loginForm.password) {
        console.log(loginForm)
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, loginForm);
        // need to handle response for HTTP status code
        if (response) {
          
          setSuccess("Login successful!");
          console.log(response)
          setTimeout(() => {
            navigate("/landing");
          }, 1000);
        } else {
          setError("Login failed. Please try again.");
          console.error("Login errorrrr:", response);
        }
      } else {
        setError("Please fill in all fields");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const { message, statusCode, error: errType } = err.response.data;
        setError(message);
        console.error(`Error ${statusCode}: ${errType}`);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Signup form submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (signupForm.name && signupForm.email && signupForm.password) {
        console.log(signupForm);
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
          signupForm
        );
        if (response) {
          setSuccess("Account created successfully!");
          setTimeout(() => {
            setSuccess("");
            setTabValue(0);
            setInfo("Log in to your account");
          }, 3000);
          
        } else {
         setError("Signup failed. Please try again.");
          console.error("Signup error:", error);
        }
      } else {
        setError("Please fill in all fields");
      }
    } catch (err) {
       if (axios.isAxiosError(err) && err.response) {
         const { message, statusCode, error: errType } = err.response.data;
         setError(message);
         console.error(`Error ${statusCode}: ${errType}`);
       } else {
         setError("Signup failed. Please try again.");
       }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError("");
    setSuccess("");
    setLoginForm({ email: "", password: "" });
    setSignupForm({ name: "", email: "", password: "" });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: theme.palette.background.default,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Avatar
            sx={{
              
              width: 64,
              height: 64,
              mx: "auto",
              mb: 2
            }}
          >
            {isLogin ? (
              <Login sx={{ fontSize: 32, color: theme.palette.primary.main, bgcolor: "transparent" }} />
            ) : (
              <PersonAdd
                sx={{ fontSize: 32, color: theme.palette.primary.main }}
              />
            )}
          </Avatar>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            color={theme.palette.primary.main}
            sx={{ fontWeight: "bold" }}
          >
            {isLogin ? "Welcome Back" : "Create Account"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isLogin ? "Sign in to your account" : "Sign up to get started"}
          </Typography>
        </Box>

        {/* Form Card */}
        <Card sx={{ boxShadow: theme.shadows[8] }}>
          <CardContent sx={{ p: 4 }}>
            {/* Tabs for Login/Signup */}
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                mb: 3,
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: 1.5,
                },
              }}
            >
              <Tab label="Login" />
              <Tab label="Sign Up" />
            </Tabs>

            {/* Error/Success Messages */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            {info && (
              <Alert severity="info" sx={{ mb: 2 }}>
                {info}
              </Alert>
            )}

            {/* Login Form */}
            {isLogin ? (
              <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  margin="normal"
                  required
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Enter your email"
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  required
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                  
                  }}
                  placeholder="Enter your password"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                  onClick={handleLogin}
                >
                  {isLoading ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CircularProgress size={20} color="inherit" />
                      <span>Signing in...</span>
                    </Box>
                  ) : (
                    "SIGN IN"
                  )}
                </Button>
              </Box>
            ) : (
              /* Signup Form */
              <Box component="form" onSubmit={handleSignup} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  type="text"
                  variant="outlined"
                  margin="normal"
                  required
                  value={signupForm.name}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, name: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Enter your full name"
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  margin="normal"
                  required
                  value={signupForm.email}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, email: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Enter your email"
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  required
                  value={signupForm.password}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, password: e.target.value })
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleSignup(e)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    // endAdornment: (
                    //   <InputAdornment position="end">
                    //     <IconButton
                    //       aria-label="toggle password visibility"
                    //       onClick={togglePasswordVisibility}
                    //       edge="end"
                    //     >
                    //       {showPassword ? <VisibilityOff /> : <Visibility />}
                    //     </IconButton>
                    //   </InputAdornment>
                    // ),
                  }}
                  placeholder="Create a password"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                  onClick={handleSignup}
                >
                  {isLoading ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CircularProgress size={20} color="inherit" />
                      <span>Creating account...</span>
                    </Box>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Box>
            )}

            {/* Footer */}
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() =>
                    handleTabChange({} as React.SyntheticEvent, isLogin ? 1 : 0)
                  }
                  sx={{ textDecoration: "none", fontWeight: "medium" }}
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AuthComponent;
