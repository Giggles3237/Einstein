import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Container, Typography, Button } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import all the new components
import SearchAndFilters from './components/SearchAndFilters';
import DashboardCharts from './components/DashboardCharts';
import NotificationSystem from './components/NotificationSystem';
import DealTemplates from './components/DealTemplates';
import AuditTrail from './components/AuditTrail';
import MobileLayout from './components/MobileLayout';
import AIFeatures from './components/AIFeatures';

// Import existing pages
import DealEntry from './pages/DealEntry';
import Funding from './pages/Funding';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  const handlePageChange = (page) => {
    console.log('Page changing to:', page);
    setCurrentPage(page);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'newDeal':
        // Handle new deal creation
        console.log('New deal action');
        break;
      case 'search':
        // Handle search action
        console.log('Search action');
        break;
      case 'filters':
        // Handle filters action
        console.log('Filters action');
        break;
      case 'markFunded':
        // Handle mark funded action
        console.log('Mark funded action');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleSearch = (searchTerm) => {
    console.log('Search:', searchTerm);
    // Implement search functionality
  };

  const handleFiltersChange = (filters) => {
    console.log('Filters changed:', filters);
    // Implement filter functionality
  };

  const handleExport = (filters) => {
    console.log('Export with filters:', filters);
    // Implement export functionality
  };

  const handleBulkAction = (action, selectedDeals) => {
    console.log('Bulk action:', action, selectedDeals);
    // Implement bulk actions
  };

  const handleApplyTemplate = (template) => {
    console.log('Apply template:', template);
    // Implement template application
  };

  const handleRollback = (entry) => {
    console.log('Rollback entry:', entry);
    // Implement rollback functionality
  };

  // Render the appropriate page content
  const renderPageContent = () => {
    console.log('Rendering page:', currentPage);
    switch (currentPage) {
      case 'dashboard':
        return (
          <Box>
            <DashboardCharts 
              deals={[]} // Pass actual deals data
              salespeople={[]} // Pass actual salespeople data
              financeManagers={[]} // Pass actual finance managers data
            />
            <AIFeatures 
              deals={[]} // Pass actual deals data
              salespeople={[]} // Pass actual salespeople data
              financeManagers={[]} // Pass actual finance managers data
            />
          </Box>
        );
      case 'deals':
        return (
          <Box>
            <SearchAndFilters 
              onSearch={handleSearch}
              onFiltersChange={handleFiltersChange}
              salespeople={[]} // Pass actual salespeople data
              financeManagers={[]} // Pass actual finance managers data
              onExport={handleExport}
              onBulkAction={handleBulkAction}
            />
            <DealTemplates 
              salespeople={[]} // Pass actual salespeople data
              financeManagers={[]} // Pass actual finance managers data
              onApplyTemplate={handleApplyTemplate}
              onSaveTemplate={() => {}}
            />
            <DealEntry />
          </Box>
        );
      case 'funding':
        return <Funding />;
      case 'history':
        return (
          <AuditTrail 
            deals={[]} // Pass actual deals data
            onRollback={handleRollback}
          />
        );
      default:
        return <Navigate to="/dashboard" replace />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <MobileLayout
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onQuickAction={handleQuickAction}
            showNotifications={showNotifications}
            notificationCount={notificationCount}
          >
                      <Container maxWidth="xl" sx={{ py: 2 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {currentPage === 'dashboard' && 'Dashboard'}
                {currentPage === 'deals' && 'Deals Management'}
                {currentPage === 'funding' && 'Funding Status'}
                {currentPage === 'history' && 'Audit Trail'}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button 
                  variant={currentPage === 'dashboard' ? 'contained' : 'outlined'} 
                  onClick={() => handlePageChange('dashboard')}
                >
                  Dashboard
                </Button>
                <Button 
                  variant={currentPage === 'deals' ? 'contained' : 'outlined'} 
                  onClick={() => handlePageChange('deals')}
                >
                  Deals
                </Button>
                <Button 
                  variant={currentPage === 'funding' ? 'contained' : 'outlined'} 
                  onClick={() => handlePageChange('funding')}
                >
                  Funding
                </Button>
                <Button 
                  variant={currentPage === 'history' ? 'contained' : 'outlined'} 
                  onClick={() => handlePageChange('history')}
                >
                  History
                </Button>
              </Box>
            </Box>
            {renderPageContent()}
          </Container>
          </MobileLayout>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
