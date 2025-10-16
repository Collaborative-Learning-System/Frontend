import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import { Close, Email } from "@mui/icons-material";

interface ContactUsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactUsModal({ open, onClose }: ContactUsModalProps) {
  const theme = useTheme();

  const glassBackdropStyles = {
    background: `linear-gradient(135deg, 
      ${alpha(theme.palette.primary.main, 0.1)} 0%, 
      ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    border: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
  };

  const developers = [
    {
      name: "Harsha Dankotuwa",
      email: "harshad.22@cse.mrt.ac.lk",
      avatar: "/Harsha.jpg",
    },
    {
      name: "Gamith Chanuka",
      email: "gamith.22@cse.mrt.ac.lk",
      avatar: "/Gamith.jpg",
    },
    {
      name: "Dineth Danurdha",
      email: "danurdha.22@cse.mrt.ac.lk",
      avatar: "/Dineth.jpg",
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 4,
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          textAlign: "center",
          ...glassBackdropStyles,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontWeight: "bold",
              color: "transparent",
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            Meet Our Development Team
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 600,
              mx: "auto",
              lineHeight: 1.5,
            }}
          >
            Get in touch with the EduCollab developers
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: theme.palette.text.primary,
            position: "absolute",
            top: 16,
            right: 16,
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {developers.map((developer, index) => (
            <Grid key={index} size={{ xs: 12, sm: 4 }}>
              <Card
                sx={{
                  textAlign: "center",
                  height: "100%",
                  boxShadow: 2,
                  "&:hover": {
                    boxShadow: 4,
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box
                    sx={{
                      position: "relative",
                      width: 80,
                      height: 80,
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <Box
                      component="img"
                      src={developer.avatar}
                      alt={developer.name}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: `3px solid ${theme.palette.primary.main}`,
                        boxShadow: 2,
                      }}
                      onError={(e) => {
                        // Hide the image and show initials fallback on error
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: 80,
                        height: 80,
                        bgcolor: theme.palette.primary.main,
                        color: "white",
                        borderRadius: "50%",
                        display: "none", // Hidden by default, shown on error
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.8rem",
                        fontWeight: "bold",
                        border: `3px solid ${theme.palette.primary.main}`,
                        boxShadow: 2,
                      }}
                    >
                      {developer.name.split(' ').map(n => n[0]).join('')}
                    </Box>
                  </Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    {developer.name}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 1.5,
                      bgcolor: theme.palette.background.default,
                      borderRadius: 1,
                      "&:hover": {
                        bgcolor: theme.palette.primary.main + "10",
                      },
                      transition: "background-color 0.2s ease",
                      cursor: "pointer",
                    }}
                    onClick={() => window.open(`mailto:${developer.email}`)}
                  >
                    <Email
                      sx={{
                        mr: 1,
                        color: theme.palette.primary.main,
                        fontSize: "1.1rem",
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: "medium",
                        fontSize: "0.85rem",
                      }}
                    >
                      {developer.email}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Card sx={{ bgcolor: theme.palette.background.default }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: theme.palette.primary.main, fontWeight: "bold" }}
              >
                EduCollab - Collaborative Learning System
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Our platform enhances collaborative learning experiences for
                students and educators.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                For technical inquiries, bug reports, or feature requests, click
                on any developer's email above to get in touch!
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
