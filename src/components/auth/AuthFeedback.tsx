import { Typography, Alert, Fade } from '@mui/material';
import type { AuthState } from '../../hooks/useAuthState';

interface AuthFeedbackProps {
  authState: AuthState;
  error?: string;
}

const AuthFeedback = ({ authState, error }: AuthFeedbackProps) => {
  return (
    <>
      {/* Status text under title */}
      {authState === 'loading' && (
        <Fade in={true}>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Signing in...
          </Typography>
        </Fade>
      )}
      
      {authState === 'success' && (
        <Fade in={true}>
          <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
            Redirecting...
          </Typography>
        </Fade>
      )}

      {/* Error alert only */}
      {authState === 'error' && error && (
        <Fade in={true}>
          <Alert 
            severity="error" 
            sx={{ 
              width: '100%',
              mt: 2,
              '& .MuiAlert-message': {
                fontSize: '0.875rem',
              },
            }}
          >
            {error}
          </Alert>
        </Fade>
      )}
    </>
  );
};

export default AuthFeedback; 