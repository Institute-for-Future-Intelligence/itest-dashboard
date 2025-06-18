import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { userService, type FirestoreUser } from '../firebase/firestore';
import { usePermissions } from '../hooks/usePermissions';
import type { UserRole } from '../types';
import { Timestamp } from 'firebase/firestore';

const AdminUserManagement: React.FC = () => {
  const { isAdmin } = usePermissions();
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateDialog, setUpdateDialog] = useState<{
    open: boolean;
    user: FirestoreUser | null;
    newRole: UserRole | null;
  }>({ open: false, user: null, newRole: null });

  // Load all users
  useEffect(() => {
    if (!isAdmin) return;

    const loadUsers = async () => {
      try {
        setLoading(true);
        const allUsers = await userService.getAllUsers();
        setUsers(allUsers);
      } catch (err) {
        setError('Failed to load users');
        console.error('Error loading users:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [isAdmin]);

  const handleRoleChange = (user: FirestoreUser, newRole: UserRole) => {
    setUpdateDialog({
      open: true,
      user,
      newRole,
    });
  };

  const confirmRoleUpdate = async () => {
    if (!updateDialog.user || !updateDialog.newRole) return;

    try {
      await userService.updateUserRole(
        updateDialog.user.uid,
        updateDialog.newRole,
        true
      );

      // Update local state
      setUsers(users.map(user => 
        user.uid === updateDialog.user!.uid 
          ? { ...user, role: updateDialog.newRole!, approvedByAdmin: true }
          : user
      ));

      setUpdateDialog({ open: false, user: null, newRole: null });
    } catch (err) {
      setError('Failed to update user role');
      console.error('Error updating user role:', err);
    }
  };

  const getRoleColor = (role: UserRole): 'primary' | 'secondary' | 'error' => {
    switch (role) {
      case 'admin': return 'error';
      case 'educator': return 'primary';
      case 'student': return 'secondary';
      default: return 'secondary';
    }
  };

  const formatDate = (timestamp: Timestamp | { seconds: number } | null | undefined) => {
    if (!timestamp) return 'Never';
    try {
      if (timestamp instanceof Timestamp) {
        return timestamp.toDate().toLocaleDateString();
      } else if (typeof timestamp === 'object' && 'seconds' in timestamp) {
        return new Date(timestamp.seconds * 1000).toLocaleDateString();
      }
      return 'Invalid date';
    } catch {
      return 'Invalid date';
    }
  };

  if (!isAdmin) {
    return (
      <Alert severity="error">
        You don't have permission to access user management.
      </Alert>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Current Role</TableCell>
              <TableCell>Approved</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.uid}>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {user.uid}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.role.toUpperCase()} 
                    color={getRoleColor(user.role)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.approvedByAdmin ? 'Yes' : 'No'}
                    color={user.approvedByAdmin ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>{formatDate(user.lastLoginAt)}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    size="small"
                    onChange={(e) => handleRoleChange(user, e.target.value as UserRole)}
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="educator">Educator</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog 
        open={updateDialog.open} 
        onClose={() => setUpdateDialog({ open: false, user: null, newRole: null })}
      >
        <DialogTitle>Confirm Role Update</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to change user {updateDialog.user?.uid}'s 
            role from <strong>{updateDialog.user?.role}</strong> to <strong>{updateDialog.newRole}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialog({ open: false, user: null, newRole: null })}>
            Cancel
          </Button>
          <Button onClick={confirmRoleUpdate} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUserManagement; 