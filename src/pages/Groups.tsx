import { Group, Info } from "@mui/icons-material";
import { alpha, Box, Grid, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";

const Groups = () => {
  const theme = useTheme();
  const [viewDetail, setViewDetail] = React.useState(false);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        p: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.1
          )} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          borderRadius: 3,
          padding: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton size="large" color="primary">
            <Group />
          </IconButton>
          <Typography variant="h5">Computer Science and Engineering</Typography>
        </Box>
        <IconButton
          size="large"
          color="primary"
          onClick={() => setViewDetail(!viewDetail)}
        >
          <Info />
        </IconButton>
      </Box>
      {viewDetail && (
        <Box
          sx={{
            mt: 0.5,
            p: 2,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.1
            )} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            borderRadius: 3,
            width: "100%",
            top: 0,
            position: "relative",
            right: 0,
          }}
        >
          <Typography variant="body1">
            This group focuses on advanced topics in computer science and
            engineering.
          </Typography>
        </Box>
      )}
      <Stack spacing={2} sx={{ mt: 2 }} direction={"row"}>
        {/* <Box
          sx={{
            mt: 2,
            width: "100%",
            height: "100vh",
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.1
            )} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
            borderRadius: 2,
          }}
        ></Box>
        <Box
          sx={{
            mt: 2,
            width: "100%",
            height: "100vh",
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.1
            )} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
            borderRadius: 2,
          }}
        ></Box> */}
        <Grid
          container
          spacing={2}
          sx={{
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.1
            )} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
          }}
        >
          <Grid
            size={3}
            sx={{
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.1
              )} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
            }}
                  >
                      <Box>
                          
                      </Box>
                
          </Grid>
          <Grid size={9}></Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default Groups;
