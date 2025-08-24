import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Divider,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/material';
import { 
  History, 
  Edit, 
  Add, 
  Delete, 
  Restore, 
  Compare, 
  FilterList,
  Refresh,
  Visibility,
  Undo
} from '@mui/icons-material';

export default function AuditTrail({ deals, onRollback }) {
  const [auditLog, setAuditLog] = useState([]);
  const [filteredLog, setFilteredLog] = useState([]);
  const [filters, setFilters] = useState({
    action: 'all',
    dealId: '',
    user: 'all',
    dateFrom: null,
    dateTo: null
  });
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [compareDialog, setCompareDialog] = useState(false);
  const [rollbackDialog, setRollbackDialog] = useState(false);

  // Generate audit log from deals data
  useEffect(() => {
    const log = [];
    
    deals.forEach(deal => {
      // Deal creation
      if (deal.createdAt) {
        log.push({
          id: `create-${deal.id}`,
          dealId: deal.id,
          action: 'created',
          field: 'deal',
          oldValue: null,
          newValue: deal,
          timestamp: new Date(deal.createdAt),
          user: deal.createdBy || 'System',
          description: `Deal created for ${deal.customerName} (${deal.stockNo})`
        });
      }

      // Deal updates (simulated - in real app this would come from actual change tracking)
      if (deal.updatedAt && deal.updatedAt !== deal.createdAt) {
        log.push({
          id: `update-${deal.id}-${Date.now()}`,
          dealId: deal.id,
          action: 'updated',
          field: 'deal',
          oldValue: null, // In real app, this would be the previous version
          newValue: deal,
          timestamp: new Date(deal.updatedAt),
          user: deal.updatedBy || 'System',
          description: `Deal updated for ${deal.customerName}`
        });
      }

      // Funding status changes
      if (deal.fundedDate) {
        log.push({
          id: `funded-${deal.id}`,
          dealId: deal.id,
          action: 'funded',
          field: 'fundedDate',
          oldValue: null,
          newValue: deal.fundedDate,
          timestamp: new Date(deal.fundedDate),
          user: deal.fundedBy || 'System',
          description: `Deal funded for ${deal.customerName} (${deal.stockNo})`
        });
      }
    });

    // Sort by timestamp (newest first)
    log.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setAuditLog(log);
  }, [deals]);

  // Apply filters
  useEffect(() => {
    let filtered = [...auditLog];

    if (filters.action !== 'all') {
      filtered = filtered.filter(entry => entry.action === filters.action);
    }

    if (filters.dealId) {
      filtered = filtered.filter(entry => entry.dealId.toString().includes(filters.dealId));
    }

    if (filters.user !== 'all') {
      filtered = filtered.filter(entry => entry.user === filters.user);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(entry => new Date(entry.timestamp) >= filters.dateFrom);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(entry => new Date(entry.timestamp) <= filters.dateTo);
    }

    setFilteredLog(filtered);
  }, [auditLog, filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'created': return <Add color="success" />;
      case 'updated': return <Edit color="primary" />;
      case 'deleted': return <Delete color="error" />;
      case 'funded': return <Edit color="success" />;
      case 'restored': return <Restore color="warning" />;
      default: return <Edit />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'created': return 'success';
      case 'updated': return 'primary';
      case 'deleted': return 'error';
      case 'funded': return 'success';
      case 'restored': return 'warning';
      default: return 'default';
    }
  };

  const handleViewDetails = (entry) => {
    setSelectedEntry(entry);
  };

  const handleCompare = (entry) => {
    setSelectedEntry(entry);
    setCompareDialog(true);
  };

  const handleRollback = (entry) => {
    setSelectedEntry(entry);
    setRollbackDialog(true);
  };

  const confirmRollback = () => {
    if (selectedEntry && onRollback) {
      onRollback(selectedEntry);
      setRollbackDialog(false);
      setSelectedEntry(null);
    }
  };

  const getUniqueUsers = () => {
    const users = [...new Set(auditLog.map(entry => entry.user))];
    return users.sort();
  };

  const getUniqueActions = () => {
    const actions = [...new Set(auditLog.map(entry => entry.action))];
    return actions.sort();
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          📋 Audit Trail & Change History
        </Typography>
        <Tooltip title="Refresh">
          <IconButton>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          🔍 Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Action Type</InputLabel>
              <Select
                value={filters.action}
                onChange={(e) => handleFilterChange('action', e.target.value)}
                label="Action Type"
              >
                <MenuItem value="all">All Actions</MenuItem>
                {getUniqueActions().map(action => (
                  <MenuItem key={action} value={action}>
                    {action.charAt(0).toUpperCase() + action.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Deal ID"
              value={filters.dealId}
              onChange={(e) => handleFilterChange('dealId', e.target.value)}
              placeholder="Search by deal ID"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>User</InputLabel>
              <Select
                value={filters.user}
                onChange={(e) => handleFilterChange('user', e.target.value)}
                label="User"
              >
                <MenuItem value="all">All Users</MenuItem>
                {getUniqueUsers().map(user => (
                  <MenuItem key={user} value={user}>{user}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Date From"
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Audit Log */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          📝 Change History ({filteredLog.length} entries)
        </Typography>
        
        <Timeline>
          {filteredLog.map((entry, index) => (
            <TimelineItem key={entry.id}>
              <TimelineOppositeContent sx={{ m: 'auto 0' }} variant="body2" color="text.secondary">
                {new Date(entry.timestamp).toLocaleString()}
              </TimelineOppositeContent>
              
              <TimelineSeparator>
                <TimelineDot color={getActionColor(entry.action)}>
                  {getActionIcon(entry.action)}
                </TimelineDot>
                {index < filteredLog.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              
              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" component="span">
                        {entry.description}
                      </Typography>
                      <Box>
                        <Chip 
                          label={entry.action} 
                          color={getActionColor(entry.action)} 
                          size="small" 
                          sx={{ mr: 1 }}
                        />
                        <Chip 
                          label={`Deal #${entry.dealId}`} 
                          variant="outlined" 
                          size="small"
                        />
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Changed by: <strong>{entry.user}</strong>
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewDetails(entry)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      {entry.oldValue && (
                        <Tooltip title="Compare Changes">
                          <IconButton 
                            size="small" 
                            onClick={() => handleCompare(entry)}
                          >
                            <Compare fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      {entry.action !== 'created' && (
                        <Tooltip title="Rollback Changes">
                          <IconButton 
                            size="small" 
                            onClick={() => handleRollback(entry)}
                            color="warning"
                          >
                            <Undo fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Paper>

      {/* Entry Details Dialog */}
      <Dialog open={Boolean(selectedEntry)} onClose={() => setSelectedEntry(null)} maxWidth="md" fullWidth>
        <DialogTitle>
          Change Details
        </DialogTitle>
        <DialogContent>
          {selectedEntry && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedEntry.description}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Deal ID
                  </Typography>
                  <Typography variant="body1">
                    {selectedEntry.dealId}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Action
                  </Typography>
                  <Chip 
                    label={selectedEntry.action} 
                    color={getActionColor(selectedEntry.action)} 
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    User
                  </Typography>
                  <Typography variant="body1">
                    {selectedEntry.user}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Timestamp
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedEntry.timestamp).toLocaleString()}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Field Changed
                  </Typography>
                  <Typography variant="body1">
                    {selectedEntry.field}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedEntry(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Rollback Confirmation Dialog */}
      <Dialog open={rollbackDialog} onClose={() => setRollbackDialog(false)}>
        <DialogTitle>
          Confirm Rollback
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to rollback the changes made to Deal #{selectedEntry?.dealId}?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRollbackDialog(false)}>Cancel</Button>
          <Button onClick={confirmRollback} color="warning" variant="contained">
            Rollback Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
