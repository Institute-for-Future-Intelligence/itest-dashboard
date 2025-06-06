// src/layout/AuthenticatedLayout.tsx
import { Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { useConfirmation } from '../hooks/useConfirmation';
import ConfirmationDialog from '../features/ConfirmationDialog';
import { NavigationBar } from '../components/navigation';
import type { ReactNode } from 'react';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const navigate = useNavigate();
  const clearUser = useUserStore((state) => state.clearUser);
  const { confirm, confirmationState, handleConfirm, handleCancel } = useConfirmation();

  const handleLogoutClick = async () => {
    const confirmed = await confirm({
      title: 'Confirm Logout',
      message: 'Are you sure you want to log out of the iTEST Dashboard?',
      confirmText: 'Logout',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      clearUser();
      navigate('/');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavigationBar onLogout={handleLogoutClick} />

      <Container
        maxWidth="lg"
        sx={{
          mt: 3,
          mb: 3,
          px: { xs: 2, sm: 3, md: 4 },
          flexGrow: 1,
        }}
      >
        {children}
      </Container>

      <ConfirmationDialog
        confirmationState={confirmationState}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </Box>
  );
};

export default AuthenticatedLayout;