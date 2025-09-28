import React from 'react';
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
} from '@mui/material';
import { Circle } from '@mui/icons-material';

interface Collaborator {
  id: string;
  name: string;
  cursor?: {
    x: number;
    y: number;
  };
}

interface CollaboratorsListProps {
  collaborators: Collaborator[];
  currentUserId: string | null;
}

const CollaboratorsList: React.FC<CollaboratorsListProps> = ({
  collaborators,
  currentUserId,
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        p: 2,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
      }}
    > 
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {collaborators.map((collaborator) => (
          <Tooltip
            key={collaborator.id}
            title={`${collaborator.name}${collaborator.id === currentUserId ? ' (You)' : ''}`}
            arrow
          >
            <Box sx={{ position: 'relative' }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  
                    <Circle
                      sx={{
                        color: '#4caf50',
                        fontSize: 12,
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: '50%',
                        p: 0.25,
                      }}
                    />
                  
                }
              >
                <Chip
                  avatar={
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        fontSize: '0.75rem',
                      }}
                    >
                      {collaborator.name.split(" ").map(n => n[0]).join("")}
                    </Avatar>
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {/* {collaborator.name} */}
                      {collaborator.id === currentUserId && (
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
                  // variant={collaborator.isActive ? 'filled' : 'outlined'}
                  size="small"
                  // sx={{
                  //   bgcolor: collaborator.isActive 
                  //     ? alpha(collaborator.color, 0.1) 
                  //     : 'transparent',
                  //   borderColor: collaborator.color,
                  //   opacity: collaborator.isActive ? 1 : 0.6,
                  //   '&:hover': {
                  //     opacity: 1,
                  //   },
                  // }}
                />
              </Badge>
            </Box>
          </Tooltip>
        ))}
        
        {/* {collaborators.filter(c => c.isActive).length === 0 && (
          <Typography variant="body2" sx={{ opacity: 0.6, fontStyle: 'italic' }}>
            No active collaborators
          </Typography>
        )} */}
      </Stack>
    </Box>
  );
};

export default CollaboratorsList;
