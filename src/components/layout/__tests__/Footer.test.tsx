import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import Footer from '../Footer';

// Create a test theme
const testTheme = createTheme({
  palette: {
    primary: { main: '#2563eb' },
    secondary: { main: '#0891b2' },
    background: { default: '#f8fafc', paper: '#ffffff' },
    text: { primary: '#1e293b', secondary: '#475569' },
  },
});

const renderFooter = () => {
  return render(
    <ThemeProvider theme={testTheme}>
      <Footer />
    </ThemeProvider>
  );
};

describe('Footer', () => {
  describe('Branding', () => {
    it('renders the app brand name', () => {
      renderFooter();
      
      expect(screen.getByText('Nā Puna ʻIke')).toBeInTheDocument();
    });

    it('renders the app tagline', () => {
      renderFooter();
      
      expect(screen.getByText('Springs of Knowledge')).toBeInTheDocument();
    });

    it('renders the water drop icon', () => {
      renderFooter();
      
      expect(screen.getByTestId('WaterDropOutlinedIcon')).toBeInTheDocument();
    });
  });

  describe('Contact Information', () => {
    it('displays both email addresses in contact section', () => {
      renderFooter();
      
      // Check that both email addresses are present
      expect(screen.getByText('andriy@intofuture.org')).toBeInTheDocument();
      expect(screen.getByText('dylan@intofuture.org')).toBeInTheDocument();
    });

    it('displays contact label', () => {
      renderFooter();
      
      expect(screen.getByText(/Contact:/)).toBeInTheDocument();
    });

    it('has proper email links with correct href attributes', () => {
      renderFooter();
      
      const andriyLink = screen.getByRole('link', { name: 'andriy@intofuture.org' });
      const dylanLink = screen.getByRole('link', { name: 'dylan@intofuture.org' });
      
      expect(andriyLink).toHaveAttribute('href', 'mailto:andriy@intofuture.org');
      expect(dylanLink).toHaveAttribute('href', 'mailto:dylan@intofuture.org');
    });

    it('displays email separator', () => {
      renderFooter();
      
      // Check that the separator " | " is present between emails (as part of larger text)
      expect(screen.getByText(/\|/)).toBeInTheDocument();
    });

    it('renders email icon', () => {
      renderFooter();
      
      expect(screen.getByTestId('EmailIcon')).toBeInTheDocument();
    });
  });

  describe('GitHub Repository', () => {
    it('displays GitHub repository link', () => {
      renderFooter();
      
      const githubLink = screen.getByRole('link', { name: 'GitHub Repository' });
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute('href', 'https://github.com/Institute-for-Future-Intelligence/itest-dashboard');
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders GitHub icon', () => {
      renderFooter();
      
      expect(screen.getByTestId('GitHubIcon')).toBeInTheDocument();
    });
  });

  describe('Beta Status', () => {
    it('displays beta status chip', () => {
      renderFooter();
      
      expect(screen.getByText('Beta')).toBeInTheDocument();
    });
  });

  describe('Copyright', () => {
    it('displays current year in copyright', () => {
      renderFooter();
      
      const currentYear = new Date().getFullYear();
      expect(screen.getByText(`© ${currentYear} Institute for Future Intelligence.`)).toBeInTheDocument();
    });

    it('does not display the old environmental data platform text', () => {
      renderFooter();
      
      // Verify that the old text is not present
      expect(screen.queryByText('Environmental data platform for research and education.')).not.toBeInTheDocument();
    });
  });

  describe('Layout and Responsiveness', () => {
    it('renders as a footer element', () => {
      renderFooter();
      
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
      expect(footer.tagName).toBe('FOOTER');
    });

    it('has proper semantic structure', () => {
      renderFooter();
      
      // Check that links are properly structured
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
      
      // Check that the footer contains the expected sections
      expect(screen.getByText('Nā Puna ʻIke')).toBeInTheDocument();
      expect(screen.getByText('GitHub Repository')).toBeInTheDocument();
      expect(screen.getByText(/Contact:/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper link accessibility attributes', () => {
      renderFooter();
      
      const githubLink = screen.getByRole('link', { name: 'GitHub Repository' });
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('email links have proper accessibility', () => {
      renderFooter();
      
      const andriyLink = screen.getByRole('link', { name: 'andriy@intofuture.org' });
      const dylanLink = screen.getByRole('link', { name: 'dylan@intofuture.org' });
      
      expect(andriyLink).toBeInTheDocument();
      expect(dylanLink).toBeInTheDocument();
    });
  });

  describe('Visual Elements', () => {
    it('renders all expected icons', () => {
      renderFooter();
      
      // Check for all icons
      expect(screen.getByTestId('WaterDropOutlinedIcon')).toBeInTheDocument();
      expect(screen.getByTestId('GitHubIcon')).toBeInTheDocument();
      expect(screen.getByTestId('EmailIcon')).toBeInTheDocument();
    });

    it('has proper footer container structure', () => {
      renderFooter();
      
      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveStyle({
        'margin-top': 'auto',
      });
    });
  });

  describe('Content Validation', () => {
    it('contains all expected text content', () => {
      renderFooter();
      
      // Brand section
      expect(screen.getByText('Nā Puna ʻIke')).toBeInTheDocument();
      expect(screen.getByText('Springs of Knowledge')).toBeInTheDocument();
      
      // Links section
      expect(screen.getByText('GitHub Repository')).toBeInTheDocument();
      expect(screen.getByText(/Contact:/)).toBeInTheDocument();
      expect(screen.getByText('andriy@intofuture.org')).toBeInTheDocument();
      expect(screen.getByText('dylan@intofuture.org')).toBeInTheDocument();
      
      // Status and copyright
      expect(screen.getByText('Beta')).toBeInTheDocument();
      expect(screen.getByText(/© \d{4} Institute for Future Intelligence\./)).toBeInTheDocument();
    });

    it('does not contain outdated content', () => {
      renderFooter();
      
      // Verify old content is not present
      expect(screen.queryByText('Environmental data platform for research and education.')).not.toBeInTheDocument();
      expect(screen.queryByText('iTEST')).not.toBeInTheDocument();
    });
  });
}); 