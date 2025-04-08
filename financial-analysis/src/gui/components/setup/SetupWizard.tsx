import React, { useState } from 'react';
import {
  Box, Stepper, Step, StepLabel, Button, Typography,
  Paper, CircularProgress
} from '@mui/material';
import SystemCheck from './SystemCheck';
import DirectorySetup from './DirectorySetup';
import ConfigurationSetup from './ConfigurationSetup';
import { validateEnv } from '../../../utils/env-validator';

const steps = ['System Check', 'Directory Setup', 'Configuration'];

export default function SetupWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Perform step-specific validation
      switch (activeStep) {
        case 0:
          // System check validation
          await window.electron.checkSystem();
          break;
        case 1:
          // Directory setup validation
          await window.electron.setupDirectories();
          break;
        case 2:
          // Configuration validation
          await validateEnv();
          break;
      }
      
      setActiveStep((prev) => prev + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Setup Wizard
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 2 }}>
          {activeStep === 0 && <SystemCheck />}
          {activeStep === 1 && <DirectorySetup />}
          {activeStep === 2 && <ConfigurationSetup />}
          {activeStep === steps.length && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>
                Setup Complete
              </Typography>
              <Typography color="text.secondary">
                You can now start using the application.
              </Typography>
              <Button 
                variant="contained"
                onClick={() => window.location.reload()}
                sx={{ mt: 2 }}
              >
                Start Application
              </Button>
            </Box>
          )}
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {activeStep < steps.length && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 
                activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
