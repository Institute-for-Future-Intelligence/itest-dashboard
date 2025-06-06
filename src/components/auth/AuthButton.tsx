import { Button, CircularProgress } from '@mui/material';
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

  const getButtonColor = () => {
    switch (authState) {
      case 'success':
        return '#4caf50'; // Green
      case 'error':
        return '#f44336'; // Red
      default:
        return '#DB4437'; // Google red
    }
  };

  const getHoverColor = () => {
    switch (authState) {
      case 'error':
        return '#d32f2f';
      case 'success':
        return '#388e3c';
      default:
        return '#c1351d';
    }
  };

  const content = getButtonContent();

  return (
    <Button
      variant="contained"
      startIcon={content.icon}
      onClick={onLogin}
      disabled={authState === 'loading' || authState === 'success'}
      sx={{
        bgcolor: getButtonColor(),
        '&:hover': {
          bgcolor: getHoverColor(),
        },
        '&:disabled': {
          bgcolor: getButtonColor(),
          color: 'white',
          opacity: authState === 'loading' ? 0.8 : 1,
        },
        textTransform: 'none',
        fontWeight: 600,
        minHeight: 48,
        transition: 'all 0.3s ease-in-out',
      }}
      fullWidth
    >
      {content.text}
    </Button>
  );
};

export default AuthButton; 