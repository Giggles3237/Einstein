import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import { 
  Add, 
  Save, 
  Delete, 
  ContentCopy, 
  Keyboard,
  Speed,
  Template
} from '@mui/icons-material';

export default function DealTemplates({ 
  salespeople, 
  financeManagers, 
  onApplyTemplate, 
  onSaveTemplate 
}) {
  const [templates, setTemplates] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    bank: '',
    salespersonId: '',
    financeManagerId: '',
    fundingNotes: '',
    shortcuts: []
  });

  // Load templates from localStorage
  useEffect(() => {
    const savedTemplates = localStorage.getItem('dealTemplates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
  }, []);

  // Save templates to localStorage
  useEffect(() => {
    localStorage.setItem('dealTemplates', JSON.stringify(templates));
  }, [templates]);

  // Default templates
  useEffect(() => {
    if (templates.length === 0) {
      const defaultTemplates = [
        {
          id: 'default-1',
          name: 'Standard Deal',
          description: 'Standard deal template for most customers',
          bank: 'Chase Auto',
          salespersonId: '',
          financeManagerId: '',
          fundingNotes: 'Standard funding process',
          shortcuts: ['Ctrl+1'],
          isDefault: true
        },
        {
          id: 'default-2',
          name: 'High-Value Deal',
          description: 'Template for high-value deals requiring special attention',
          bank: 'Wells Fargo',
          salespersonId: '',
          financeManagerId: '',
          fundingNotes: 'High-value deal - expedite processing',
          shortcuts: ['Ctrl+2'],
          isDefault: true
        }
      ];
      setTemplates(defaultTemplates);
    }
  }, [templates.length]);

  const handleOpenDialog = (template = null) => {
    if (template) {
      setEditingTemplate(template);
      setTemplateForm({ ...template });
    } else {
      setEditingTemplate(null);
      setTemplateForm({
        name: '',
        description: '',
        bank: '',
        salespersonId: '',
        financeManagerId: '',
        fundingNotes: '',
        shortcuts: []
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTemplate(null);
    setTemplateForm({
      name: '',
      description: '',
      bank: '',
      salespersonId: '',
      financeManagerId: '',
      fundingNotes: '',
      shortcuts: []
    });
  };

  const handleSaveTemplate = () => {
    if (editingTemplate) {
      // Update existing template
      setTemplates(prev => 
        prev.map(t => t.id === editingTemplate.id ? { ...templateForm, id: t.id } : t)
      );
    } else {
      // Create new template
      const newTemplate = {
        ...templateForm,
        id: Date.now().toString(),
        isDefault: false
      };
      setTemplates(prev => [...prev, newTemplate]);
    }
    handleCloseDialog();
  };

  const handleDeleteTemplate = (templateId) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const handleApplyTemplate = (template) => {
    onApplyTemplate(template);
  };

  const handleDuplicateTemplate = (template) => {
    const duplicated = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      isDefault: false
    };
    setTemplates(prev => [...prev, duplicated]);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey) {
        const key = event.key;
        const template = templates.find(t => t.shortcuts.includes(`Ctrl+${key}`));
        if (template) {
          event.preventDefault();
          handleApplyTemplate(template);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [templates]);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          🎯 Deal Templates & Quick Actions
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          New Template
        </Button>
      </Box>

      {/* Templates Grid */}
      <Grid container spacing={2}>
        {templates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <Card 
              sx={{ 
                height: '100%',
                border: template.isDefault ? 2 : 1,
                borderColor: template.isDefault ? 'primary.main' : 'divider'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" component="h3">
                    {template.name}
                  </Typography>
                  {template.isDefault && (
                    <Chip label="Default" size="small" color="primary" />
                  )}
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {template.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  {template.bank && (
                    <Chip label={template.bank} size="small" sx={{ mr: 1, mb: 1 }} />
                  )}
                  {template.shortcuts.map((shortcut, index) => (
                    <Chip 
                      key={index}
                      label={shortcut} 
                      size="small" 
                      variant="outlined" 
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>

                <Typography variant="caption" color="text.secondary">
                  {template.fundingNotes}
                </Typography>
              </CardContent>

              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<Speed />}
                  onClick={() => handleApplyTemplate(template)}
                  variant="contained"
                  fullWidth
                >
                  Apply Template
                </Button>
              </CardActions>

              <Divider />

              <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Tooltip title="Edit Template">
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenDialog(template)}
                    disabled={template.isDefault}
                  >
                    <Save fontSize="small" />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Duplicate Template">
                  <IconButton 
                    size="small" 
                    onClick={() => handleDuplicateTemplate(template)}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Delete Template">
                  <IconButton 
                    size="small" 
                    onClick={() => handleDeleteTemplate(template.id)}
                    disabled={template.isDefault}
                    color="error"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Keyboard Shortcuts Help */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          ⌨️ Keyboard Shortcuts
        </Typography>
        <Grid container spacing={2}>
          {templates.map((template) => (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                <Keyboard sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2" sx={{ mr: 1 }}>
                  {template.shortcuts.join(', ')}:
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {template.name}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Template Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTemplate ? 'Edit Template' : 'Create New Template'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Template Name"
                value={templateForm.name}
                onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Description"
                value={templateForm.description}
                onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bank"
                value={templateForm.bank}
                onChange={(e) => setTemplateForm({ ...templateForm, bank: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Keyboard Shortcut (e.g., Ctrl+1)"
                value={templateForm.shortcuts.join(', ')}
                onChange={(e) => setTemplateForm({ 
                  ...templateForm, 
                  shortcuts: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                })}
                helperText="Separate multiple shortcuts with commas"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Salesperson</InputLabel>
                <Select
                  value={templateForm.salespersonId}
                  onChange={(e) => setTemplateForm({ ...templateForm, salespersonId: e.target.value })}
                  label="Salesperson"
                >
                  <MenuItem value="">None</MenuItem>
                  {salespeople.map(sp => (
                    <MenuItem key={sp.id} value={sp.id}>{sp.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Finance Manager</InputLabel>
                <Select
                  value={templateForm.financeManagerId}
                  onChange={(e) => setTemplateForm({ ...templateForm, financeManagerId: e.target.value })}
                  label="Finance Manager"
                >
                  <MenuItem value="">None</MenuItem>
                  {financeManagers.map(fm => (
                    <MenuItem key={fm.id} value={fm.id}>{fm.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Funding Notes"
                multiline
                rows={3}
                value={templateForm.fundingNotes}
                onChange={(e) => setTemplateForm({ ...templateForm, fundingNotes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveTemplate} variant="contained">
            {editingTemplate ? 'Update Template' : 'Create Template'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
