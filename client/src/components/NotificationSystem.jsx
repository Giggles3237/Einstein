import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Snackbar, 
  Alert, 
  Badge, 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Chip,
  Tooltip,
  Divider
} from '@mui/material';
import { 
  Notifications, 
  CheckCircle, 
  Warning, 
  Error, 
  Info,
  Schedule,
  AttachMoney,
  Clear
} from '@mui/icons-material';

export default function NotificationSystem({ deals, onMarkAsRead }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  // Generate notifications based on deal data
  useEffect(() => {
    const newNotifications = [];
    
    // Check for deals that haven't been funded for more than 7 days
    const today = new Date();
    deals.forEach(deal => {
      if (!deal.fundedDate && deal.dealDate) {
        const dealDate = new Date(deal.dealDate);
        const daysSinceDeal = Math.floor((today - dealDate) / (1000 * 60 * 60 * 24));
        
        if (daysSinceDeal > 7) {
          newNotifications.push({
            id: `unfunded-${deal.id}`,
            type: 'warning',
            title: 'Deal Pending Funding',
            message: `Deal for ${deal.customerName} (${deal.stockNo}) has been pending for ${daysSinceDeal} days`,
            dealId: deal.id,
            timestamp: new Date(),
            read: false,
            priority: daysSinceDeal > 14 ? 'high' : 'medium'
          });
        }
      }
    });

    // Check for deals funded today
    deals.forEach(deal => {
      if (deal.fundedDate) {
        const fundedDate = new Date(deal.fundedDate);
        const isToday = fundedDate.toDateString() === today.toDateString();
        
        if (isToday) {
          newNotifications.push({
            id: `funded-${deal.id}`,
            type: 'success',
            title: 'Deal Funded',
            message: `Deal for ${deal.customerName} (${deal.stockNo}) was funded today`,
            dealId: deal.id,
            timestamp: new Date(),
            read: false,
            priority: 'low'
          });
        }
      }
    });

    // Check for high-value deals
    deals.forEach(deal => {
      if (deal.amount && deal.amount > 50000 && !deal.fundedDate) {
        newNotifications.push({
          id: `high-value-${deal.id}`,
          type: 'info',
          title: 'High-Value Deal',
          message: `High-value deal for ${deal.customerName} (${deal.stockNo}) - $${deal.amount?.toLocaleString()}`,
          dealId: deal.id,
          timestamp: new Date(),
          read: false,
          priority: 'medium'
        });
      }
    });

    setNotifications(prev => {
      const existingIds = prev.map(n => n.id);
      const uniqueNew = newNotifications.filter(n => !existingIds.includes(n.id));
      return [...prev, ...uniqueNew];
    });
  }, [deals]);

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    if (onMarkAsRead) {
      onMarkAsRead(notificationId);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle color="success" />;
      case 'warning': return <Warning color="warning" />;
      case 'error': return <Error color="error" />;
      case 'info': return <Info color="info" />;
      default: return <Info />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => !n.read && n.priority === 'high').length;

  // Auto-show toast for high priority notifications
  useEffect(() => {
    const highPriority = notifications.find(n => !n.read && n.priority === 'high');
    if (highPriority) {
      setToast({
        open: true,
        message: highPriority.message,
        severity: highPriority.type
      });
    }
  }, [notifications]);

  return (
    <>
      {/* Notification Bell */}
      <Tooltip title="Notifications">
        <IconButton 
          color="inherit" 
          onClick={handleNotificationClick}
          sx={{ position: 'relative' }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <Notifications />
          </Badge>
          {highPriorityCount > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'error.main',
                animation: 'pulse 2s infinite'
              }}
            />
          )}
        </IconButton>
      </Tooltip>

      {/* Notification Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 400, maxHeight: 500 }
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </Typography>
            {unreadCount > 0 && (
              <Chip 
                label="Mark All Read" 
                size="small" 
                onClick={markAllAsRead}
                variant="outlined"
              />
            )}
          </Box>
        </Box>

        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No notifications
              </Typography>
            </Box>
          ) : (
            notifications.map((notification, index) => (
              <Box key={notification.id}>
                <MenuItem 
                  sx={{ 
                    p: 2, 
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                    borderLeft: 4,
                    borderColor: getPriorityColor(notification.priority)
                  }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight={notification.read ? 'normal' : 'bold'}>
                          {notification.title}
                        </Typography>
                        <Chip 
                          label={notification.priority} 
                          size="small" 
                          color={getPriorityColor(notification.priority)}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {notification.timestamp.toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                  <IconButton 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                  >
                    <Clear fontSize="small" />
                  </IconButton>
                </MenuItem>
                {index < notifications.length - 1 && <Divider />}
              </Box>
            ))
          )}
        </Box>
      </Menu>

      {/* Toast Notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setToast({ ...toast, open: false })} 
          severity={toast.severity}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </>
  );
}
