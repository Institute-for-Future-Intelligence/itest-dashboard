import React, { memo } from 'react';
import { Container, Box } from '@mui/material';
import { useDashboard } from '../hooks/useDashboard';
import {
  DashboardHero,
  FeatureCard,
  PlatformCapabilities,
  AdminPanel
} from '../components/dashboard';

const HomePage: React.FC = memo(() => {
  const {
    roleDisplayName,
    availableFeatures,
    handleFeatureInteraction,
    handleNavigate,
    isAdmin
  } = useDashboard();

  const handleAdminNavigation = () => {
    handleNavigate('/admin');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <DashboardHero roleDisplayName={roleDisplayName} />

      {/* Features Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
        gap: 3, 
        mb: 4 
      }}>
        {availableFeatures.map((feature) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            onInteraction={handleFeatureInteraction}
          />
        ))}
      </Box>

      {/* Platform Capabilities Section */}
      <PlatformCapabilities />

      {/* Admin Panel - Conditionally Rendered */}
      {isAdmin && (
        <AdminPanel onNavigateToAdmin={handleAdminNavigation} />
      )}
    </Container>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;