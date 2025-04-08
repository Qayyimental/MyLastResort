import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  LinearProgress,
  Step,
  StepLabel,
  Stepper,
  ThemeProvider,
  createTheme,
  Alert,
  IconButton,
  Fade,
  CircularProgress
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  PlayArrow,
  Settings,
  Download,
  CheckCircle,
  Error as ErrorIcon,
  Close,
  Analytics,
  Security,
  Storage,
  Code
} from '@mui/icons-material';

// Add these types at the top of the file
declare global {
  interface Window {
    electron: {
      checkSystem: () => Promise<CheckResult>;
      checkRequirement: (req: string) => Promise<void>;
      setupDirectories: () => Promise<void>;
      saveConfig: (config: any) => Promise<void>;
      startMainApp: () => void;
      runNpmCommand: (command: string) => Promise<void>; // Add this line
    }
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8'
    },
    secondary: {
      main: '#059669',
      light: '#10b981',
      dark: '#047857'
    },
    background: {
      default: '#0f172a',
      paper: alpha('#fff', 0.05)
    }
  },
  typography: {
    fontFamily: '"Inter", -apple-system, sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.02em'
    },
    h6: {
      fontWeight: 500,
      letterSpacing: '-0.01em'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          padding: '10px 24px',
          fontSize: '1rem',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(37, 99, 235, 0.2)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: alpha('#fff', 0.03),
          backdropFilter: 'blur(20px)',
          borderRadius: 24,
          border: `1px solid ${alpha('#fff', 0.1)}`
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
          padding: 8
        }
      }
    }
  }
});

interface CheckResult {
  ready: boolean;
  missingComponents: string[];
}

interface StepIconProps {
  icon: number;
  active?: boolean;
}

const StepIcon = ({ icon, active }: StepIconProps) => {
  const icons = [
    <Security sx={{ fontSize: 28 }} />,
    <Code sx={{ fontSize: 28 }} />,
    <Analytics sx={{ fontSize: 28 }} />,
    <Storage sx={{ fontSize: 28 }} />
  ];

  return (
    <Box
      sx={{
        width: 50,
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: active ? 'primary.main' : alpha('#fff', 0.05),
        color: active ? 'white' : 'text.secondary',
        transition: 'all 0.3s ease'
      }}
    >
      {icons[icon - 1]}
    </Box>
  );
};

export default function QIIEMLauncher() {
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [setupProgress, setSetupProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  const steps = [
    'System Requirements',
    'Dependencies',
    'Configuration',
    'Database Setup'
  ];

  useEffect(() => {
    checkSystem();
  }, []);

  const checkSystem = async () => {
    setIsChecking(true);
    try {
      const result = await window.electron.checkSystem();
      setCheckResult(result);
      if (!result.ready) {
        setShowSetup(true);
      }
    } catch (err) {
      setError('Failed to check system requirements');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSetup = async () => {
    setShowSetup(true);
    setSetupProgress(0);
    setActiveStep(0);

    try {
      // System requirements check
      setActiveStep(0);
      setSetupProgress(25);
      await window.electron.checkRequirement('systemRequirements');

      // Install dependencies
      setActiveStep(1);
      setSetupProgress(40);
      await window.electron.runNpmCommand('install');
      setSetupProgress(50);

      // Run build and setup
      await window.electron.runNpmCommand('run build');
      setSetupProgress(60);
      await window.electron.setupDirectories();
      setSetupProgress(70);

      // Configure settings
      setActiveStep(2);
      setSetupProgress(75);
      await window.electron.saveConfig({});

      // Run post-setup commands
      setActiveStep(3);
      setSetupProgress(85);
      await window.electron.runNpmCommand('run setup');
      setSetupProgress(95);
      await window.electron.runNpmCommand('run make-exe');
      setSetupProgress(100);
      
      // Reload app after successful setup
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (err: any) {
      setError(`Setup failed: ${err?.message || 'Unknown error'}`);
    }
  };

  const launchApp = async () => {
    setIsStarting(true);
    setStartError(null);
    try {
      await window.electron.startMainApp();
    } catch (error) {
      setStartError(error.message || 'Failed to start application');
      console.error('Launch failed:', error);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: 3
      }}>
        <Fade in timeout={800}>
          <Paper 
            elevation={24}
            sx={{ 
              p: 4,
              maxWidth: 600,
              width: '100%',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              bgcolor: 'primary.main',
              opacity: isChecking ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}>
              <LinearProgress color="inherit" />
            </Box>

            <Typography 
              variant="h4" 
              gutterBottom 
              align="center" 
              sx={{ 
                color: 'primary.main',
                mb: 4,
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 60,
                  height: 3,
                  bgcolor: 'primary.main',
                  borderRadius: 1
                }
              }}
            >
              QIIEM Financial App
            </Typography>

            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 2 }}
                action={
                  <IconButton size="small" onClick={() => setError(null)}>
                    <Close fontSize="small" />
                  </IconButton>
                }
              >
                {error}
              </Alert>
            )}

            <Fade in timeout={500}>
              <Box>
                {isChecking ? (
                  <Box sx={{ 
                    my: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2 
                  }}>
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                      Checking system requirements...
                    </Typography>
                  </Box>
                ) : checkResult?.ready ? (
                  <Box sx={{ 
                    textAlign: 'center',
                    my: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3
                  }}>
                    <CheckCircle 
                      sx={{ 
                        fontSize: 80,
                        color: 'success.main',
                        filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.3))'
                      }} 
                    />
                    <Typography variant="h6" sx={{ color: 'success.main' }}>
                      System Ready
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<PlayArrow />}
                      onClick={launchApp}
                      sx={{ 
                        minWidth: 200,
                        fontSize: '1.1rem',
                        height: 48
                      }}
                    >
                      Launch Application
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', my: 4 }}>
                    <ErrorIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Setup Required
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<Download />}
                      onClick={() => setShowSetup(true)}
                      sx={{ mt: 2 }}
                    >
                      Start Setup
                    </Button>
                  </Box>
                )}
              </Box>
            </Fade>
          </Paper>
        </Fade>

        <Dialog 
          open={showSetup} 
          maxWidth="sm" 
          fullWidth
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 400 }}
          onClose={() => !isChecking && setShowSetup(false)}
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            }
          }}
        >
          <DialogTitle sx={{ 
            borderBottom: `1px solid ${alpha('#fff', 0.1)}`,
            pb: 2
          }}>
            <Typography variant="h6" sx={{ color: 'primary.main' }}>
              System Setup
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 3 }}>
              <Stepper 
                activeStep={activeStep} 
                alternativeLabel
                sx={{
                  '& .MuiStepConnector-line': {
                    borderColor: alpha('#fff', 0.1)
                  }
                }}
              >
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel StepIconComponent={({ active }) => (
                      <StepIcon icon={index + 1} active={active || index < activeStep} />
                    )}>
                      <Typography sx={{ color: 'text.primary' }}>
                        {label}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
              
              <LinearProgress 
                variant="determinate" 
                value={setupProgress} 
                sx={{ 
                  mt: 4,
                  height: 6,
                  borderRadius: 3,
                  bgcolor: alpha('#fff', 0.05),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3
                  }
                }}
              />
              
              <Typography 
                sx={{ 
                  mt: 2,
                  textAlign: 'center',
                  color: setupProgress === 100 ? 'success.main' : 'text.secondary'
                }}
              >
                {setupProgress < 100 ? 'Installing components...' : 'Setup complete!'}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: `1px solid ${alpha('#fff', 0.1)}` }}>
            <Button 
              onClick={() => setShowSetup(false)} 
              disabled={setupProgress > 0 && setupProgress < 100}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSetup}
              disabled={setupProgress > 0}
            >
              Start Installation
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {startError && (
        <Alert 
          severity="error" 
          sx={{ position: 'fixed', bottom: 16, right: 16, maxWidth: 400 }}
          onClose={() => setStartError(null)}
        >
          {startError}
        </Alert>
      )}
      
      {isStarting && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <CircularProgress size={60} />
        </Box>
      )}
    </ThemeProvider>
  );
}
