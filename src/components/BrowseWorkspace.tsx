import { Close, Groups, Search } from "@mui/icons-material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  IconButton,
  Box,
  useTheme,
  TextField,
  InputAdornment,
  Autocomplete,
  Button,
  alpha,
} from "@mui/material";
import React from "react";

interface BrowseWorkspaceProps {
  onClose: () => void;
}

const BrowseWorkspace: React.FC<BrowseWorkspaceProps> = ({ onClose }) => {
  const theme = useTheme();
  const [WorkspaceName, setWorkspaceName] = React.useState("");
  const [value, setValue] = React.useState("");
  const [viewWs, setViewWs] = React.useState(false);

  const arrayOfWorkspaceNames = [
    "Workspace 1",
    "dorkspace 2",
    "Warkspace 3",
    "Wordspace 4",
    "Workspace 5",
  ];
  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 500,
        mx: "auto",
        backdropFilter: "blur(5px)",
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        boxShadow: theme.shadows[10],
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.secondary.main,
                width: 40,
                height: 40,
              }}
            >
              {!viewWs ? (
                <Groups />
              ) : (
                <KeyboardBackspaceIcon
                  onClick={() => {
                    setViewWs(false);
                    setValue("");
                  }}
                />
              )}
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              {!viewWs ? "Browse Workspaces" : "Workspace Details"}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close
              sx={{
                color: theme.palette.text.secondary,
              }}
            />
          </IconButton>
        </Box>

        <Stack spacing={2}>
          {!viewWs && (
            <Autocomplete
              freeSolo
              options={arrayOfWorkspaceNames}
              onInputChange={(event, newInputValue) => setValue(newInputValue)}
              renderInput={(params) => (
                <TextField {...params} label="Search..." variant="outlined" />
              )}
            />
          )}
          {viewWs && (
            <Box>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Name: {WorkspaceName || "Workspace 1"}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Description: This is a sample workspace description.
              </Typography>
            </Box>
          )}
          {!viewWs ? (
            <Button
              variant="contained"
              sx={{ mt: 2, width: "100%" }}
              color="secondary"
              onClick={() => setViewWs(true)}
              disabled={!value.trim()}
            >
              View Workspace
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{ mt: 2, width: "100%" }}
              color="secondary"
              onClick={() => setViewWs(true)}
            >
              Join Workspace
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
export default BrowseWorkspace;
