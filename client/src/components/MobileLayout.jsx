import React, { useState, useEffect } from 'react';
import { 
  Box, 
  useTheme, 
  useMediaQuery, 
  Drawer, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Fab, 
  SpeedDial, 
  SpeedDialAction, 
  SpeedDialIcon,
  SwipeableDrawer,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useScrollTrigger,
  Slide,
  Zoom,
  Fade
} from '@mui/material';
import { 
  Menu, 
  Dashboard, 
  Assignment, 
  AttachMoney, 
  History, 
  Settings, 
  Add,
  Search,
  FilterList,
  Notifications,
  Home,
  List as ListIcon,
  TrendingUp,
  Person
} from '@mui/icons-material';

// Hide on scroll component
function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

// Floating action button with zoom animation
function ZoomFab({ children, ...props }) {
  return (
    <Zoom in={true} style={{ transitionDelay: '200ms' }}>
      {children}
    </Zoom>
  );
}

export default function MobileLayout({ 
  children, 
  currentPage, 
  onPageChange,
  onQuickAction,
  showNotifications = false,
  notificationCount = 0
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bottomNavValue, setBottomNavValue] = useState('dashboard');
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleBottomNavChange = (event, newValue) => {
    setBottomNavValue(newValue);
    onPageChange(newValue);
  };

  const handleSpeedDialAction = (action) => {
    setSpeedDialOpen(false);
    onQuickAction(action);
  };

  const quickActions = [
    { icon: <Add />, name: 'New Deal', action: 'newDeal' },
    { icon: <Search />, name: 'Search', action: 'search' },
    { icon: <FilterList />, name: 'Filters', action: 'filters' },
    { icon: <AttachMoney />, name: 'Mark Funded', action: 'markFunded' },
  ];

  const navigationItems = [
    { label: 'Dashboard', icon: <Dashboard />, value: 'dashboard' },
    { label: 'Deals', icon: <Assignment />, value: 'deals' },
    { label: 'Funding', icon: <AttachMoney />, value: 'funding' },
    { label: 'History', icon: <History />, value: 'history' },
  ];

  // Debug logging
  useEffect(() => {
    console.log('Current page:', currentPage);
    console.log('Bottom nav value:', bottomNavValue);
  }, [currentPage, bottomNavValue]);

  // Auto-close drawer on mobile when clicking outside
  useEffect(() => {
    if (isMobile && mobileOpen) {
      const handleClickOutside = () => setMobileOpen(false);
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobile, mobileOpen]);

  // Mobile drawer content
  const drawerContent = (
    <Box sx={{ width: 250 }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Einstein App
        </Typography>
      </Toolbar>
      <List>
        {navigationItems.map((item) => (
          <ListItem 
            button 
            key={item.value}
            onClick={() => {
              onPageChange(item.value);
              setMobileOpen(false);
            }}
            selected={currentPage === item.value}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Mobile App Bar */}
        <HideOnScroll>
          <AppBar 
            position="fixed" 
            sx={{ 
              zIndex: theme.zIndex.drawer + 1,
              backgroundColor: 'primary.main'
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <Menu />
              </IconButton>
              
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                {navigationItems.find(item => item.value === currentPage)?.label || 'Einstein App'}
              </Typography>

              {/* Notification Icon */}
              {showNotifications && (
                <IconButton color="inherit" sx={{ mr: 1 }}>
                  <Notifications />
                  {notificationCount > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        bgcolor: 'error.main',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}
                    >
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </Box>
                  )}
                </IconButton>
              )}
            </Toolbar>
          </AppBar>
        </HideOnScroll>

        {/* Mobile Drawer */}
        <SwipeableDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          onOpen={() => setMobileOpen(true)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 250,
              backgroundColor: 'background.paper'
            },
          }}
        >
          {drawerContent}
        </SwipeableDrawer>

        {/* Main Content */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: isSmallMobile ? 1 : 2,
            mt: '64px', // App bar height
            mb: '56px', // Bottom navigation height
            overflow: 'auto'
          }}
        >
          <Fade in={true} timeout={300}>
            <Box>
              {children}
            </Box>
          </Fade>
        </Box>

        {/* Bottom Navigation */}
        <Paper 
          sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0,
            zIndex: theme.zIndex.appBar
          }} 
          elevation={3}
        >
          <BottomNavigation
            value={bottomNavValue}
            onChange={handleBottomNavChange}
            showLabels
            sx={{ 
              height: 56,
              '& .MuiBottomNavigationAction-root': {
                minWidth: 'auto',
                padding: '6px 8px'
              }
            }}
          >
            {navigationItems.map((item, index) => (
              <BottomNavigationAction
                key={item.value}
                label={item.label}
                icon={item.icon}
                value={item.value}
                sx={{
                  '&.Mui-selected': {
                    color: 'primary.main'
                  }
                }}
              />
            ))}
          </BottomNavigation>
        </Paper>

        {/* Floating Action Button */}
        <ZoomFab>
          <Fab
            color="primary"
            aria-label="quick actions"
            sx={{
              position: 'fixed',
              bottom: 72, // Above bottom navigation
              right: 16,
              zIndex: theme.zIndex.speedDial
            }}
            onClick={() => setSpeedDialOpen(!speedDialOpen)}
          >
            <SpeedDialIcon />
          </Fab>
        </ZoomFab>

        {/* Speed Dial Actions */}
        <SpeedDial
          ariaLabel="Quick Actions"
          sx={{
            position: 'fixed',
            bottom: 72,
            right: 16,
            zIndex: theme.zIndex.speedDial
          }}
          icon={<SpeedDialIcon />}
          onClose={() => setSpeedDialOpen(false)}
          onOpen={() => setSpeedDialOpen(true)}
          open={speedDialOpen}
          direction="up"
        >
          {quickActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => handleSpeedDialAction(action.action)}
            />
          ))}
        </SpeedDial>
      </Box>
    );
  }

  // Desktop layout
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Desktop Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: 'background.paper',
            borderRight: 1,
            borderColor: 'divider'
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
        <Toolbar /> {/* Spacer for content */}
        <Fade in={true} timeout={300}>
          <Box>
            {children}
          </Box>
        </Fade>
      </Box>
    </Box>
  );
}
