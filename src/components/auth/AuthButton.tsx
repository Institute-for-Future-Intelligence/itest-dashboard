import { Button, CircularProgress, useTheme, alpha } from '@mui/material';
import { 
  Google as GoogleIcon, 
  CheckCircle as CheckIcon,
  Error as ErrorIcon 
} from '@mui/icons-material';
import type { AuthState } from '../../hooks/useAuthState';

interface AuthButtonProps {
  authState: AuthState;
  onLogin: () => void;
}

const AuthButton = ({ authState, onLogin }: AuthButtonProps) => {
  const theme = useTheme();

  const getButtonContent = () => {
    switch (authState) {
      case 'loading':
        return {
          icon: <CircularProgress size={20} color="inherit" />,
          text: 'Signing in...'
        };
      case 'success':
        return {
          icon: <CheckIcon />,
          text: 'Welcome!'
        };
      case 'error':
        return {
          icon: <ErrorIcon />,
          text: 'Try Again'
        };
      default:
        return {
          icon: <GoogleIcon />,
          text: 'Sign in with Google'
        };
    }
  };

  const getButtonStyles = () => {
    switch (authState) {
      case 'success':
        return {
          background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
          },
        };
      case 'error':
        return {
          background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 100%)`,
          },
        };
      default:
        return {
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
          },
        };
    }
  };

  const content = getButtonContent();
  const buttonStyles = getButtonStyles();

  return (
    <Button
      variant="contained"
      onClick={onLogin}
      disabled={authState === 'loading' || authState === 'success'}
      startIcon={content.icon}
      fullWidth
      sx={{
        py: 1.5,
        fontSize: '1rem',
        fontWeight: 600,
        borderRadius: 2,
        textTransform: 'none',
        minHeight: 48,
        boxShadow: theme.shadows[2],
        transition: 'all 0.3s ease',
        ...buttonStyles,
        '&:hover': {
          ...buttonStyles['&:hover'],
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)',
        },
        '&:disabled': {
          background: authState === 'loading' 
            ? buttonStyles.background
            : alpha(theme.palette.action.disabled, 0.1),
          color: authState === 'loading' ? 'white' : theme.palette.action.disabled,
          opacity: authState === 'loading' ? 0.8 : 1,
          transform: 'none',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
      }}
    >
      {content.text}
    </Button>
  );
};

export default AuthButton; 