import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  CircularProgress,
  Box,
  Typography,
  Alert,
  useTheme,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import StudyPlanDisplay from './StudyPlanDisplay';
import { getStudyPlanById, transformApiResponseToStudyPlan } from '../services/StudyPlanService';

interface StudyPlanViewModalProps {
  open: boolean;
  onClose: () => void;
  planId: number | null;
}

const StudyPlanViewModal: React.FC<StudyPlanViewModalProps> = ({
  open,
  onClose,
  planId,
}) => {
  const [studyPlan, setStudyPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (open && planId) {
      fetchStudyPlan();
    }
  }, [open, planId]);

  const fetchStudyPlan = async () => {
    if (!planId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching study plan with ID:', planId);
      const response = await getStudyPlanById(planId);
      console.log('Study plan response:', response);
      
      if (response.success && response.data) {
        const transformedPlan = transformApiResponseToStudyPlan(response.data);
        console.log('Transformed plan:', transformedPlan);
        setStudyPlan(transformedPlan);
      } else {
        setError('Failed to load study plan details');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load study plan');
      console.error('Error fetching study plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStudyPlan(null);
    setError(null);
    onClose();
  };

  const handleSavePlan = (plan: any) => {
    console.log('Save plan:', plan);
    // Implement save functionality if needed
    // You could call an API to update the plan here
  };

  const handleEditPlan = () => {
    handleClose();
    // Implement edit functionality if needed
    // You could navigate to the edit page or open an edit modal
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: { 
          height: '90vh',
          bgcolor: theme.palette.background.default,
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: theme.palette.primary.main,
          color: 'white',
          m: 0,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Study Plan Details
        </Typography>
        <IconButton 
          onClick={handleClose}
          sx={{ 
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, height: '100%', overflow: 'auto' }}>
        {loading && (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: 400,
              flexDirection: 'column',
              gap: 2
            }}
          >
            <CircularProgress size={60} />
            <Typography variant="h6" color="text.secondary">
              Loading study plan...
            </Typography>
          </Box>
        )}
        
        {error && (
          <Box sx={{ p: 3 }}>
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 2,
                '& .MuiAlert-message': {
                  fontSize: '1rem'
                }
              }}
            >
              {error}
            </Alert>
          </Box>
        )}
        
        {studyPlan && !loading && !error && (
          <Box sx={{ height: '100%' }}>
            <StudyPlanDisplay
              studyPlan={studyPlan}
              onSave={handleSavePlan}
              onEdit={handleEditPlan}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StudyPlanViewModal;