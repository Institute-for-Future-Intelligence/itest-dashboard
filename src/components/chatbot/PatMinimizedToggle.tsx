import { memo } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';

/**
 * Collapsed control for chatbot-interface-ifi. IFI clones this node and attaches the open handler.
 * Clicking the panel X returns to this view without unmounting (conversation state stays in IFI).
 */
export const PatMinimizedToggle = memo(function PatMinimizedToggle() {
  return (
    <Paper
      component="div"
      role="button"
      elevation={4}
      aria-label="Open Personalized Academic Tutor"
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        px: 2,
        py: 1.5,
        borderRadius: 2,
        cursor: 'pointer',
        maxWidth: 400,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: 3,
        '&:hover': {
          boxShadow: 8,
          borderColor: 'primary.main',
        },
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
        <Typography
          component="span"
          variant="subtitle1"
          fontWeight={800}
          sx={{ display: 'block', letterSpacing: '0.04em', color: 'primary.main' }}
        >
          PAT
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: 'block', mt: 0.25, lineHeight: 1.3, fontSize: '0.8rem' }}
        >
          Personalized Academic Tutor
        </Typography>
      </Box>
      <ChatIcon color="primary" sx={{ fontSize: 32, flexShrink: 0 }} aria-hidden />
    </Paper>
  );
});
