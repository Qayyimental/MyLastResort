import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
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
      default: '#f8fafc',
      paper: '#ffffff'
    }
  },
  shape: {
    borderRadius: 12
  },
  typography: {
    fontFamily: "'Inter', -apple-system, sans-serif",
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '-0.02em'
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em'
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em'
    },
    button: {
      fontWeight: 500,
      textTransform: 'none'
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          background: 'linear-gradient(to bottom, #ffffff, #fafafa)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.3)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: '8px',
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontWeight: 600,
            backgroundColor: 'rgba(0,0,0,0.02)'
          }
        }
      }
    }
  }
});
