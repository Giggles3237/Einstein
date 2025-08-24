import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Box, 
  Chip, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button,
  IconButton,
  Tooltip,
  Collapse,
  Paper
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  Clear, 
  DateRange,
  TrendingUp,
  Notifications
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function SearchAndFilters({ 
  onSearch, 
  onFiltersChange, 
  salespeople, 
  financeManagers,
  onExport,
  onBulkAction 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: null,
    dateTo: null,
    funded: 'all',
    salespersonId: '',
    financeManagerId: '',
    bank: '',
    minAmount: '',
    maxAmount: ''
  });
  const [selectedDeals, setSelectedDeals] = useState([]);

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      dateFrom: null,
      dateTo: null,
      funded: 'all',
      salespersonId: '',
      financeManagerId: '',
      bank: '',
      minAmount: '',
      maxAmount: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const handleBulkAction = (action) => {
    if (selectedDeals.length === 0) return;
    onBulkAction(action, selectedDeals);
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      {/* Search Bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search deals, customers, stock numbers, banks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            endAdornment: searchTerm && (
              <IconButton size="small" onClick={() => setSearchTerm('')}>
                <Clear />
              </IconButton>
            )
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          startIcon={<Search />}
        >
          Search
        </Button>
        <Tooltip title="Advanced Filters">
          <IconButton 
            onClick={() => setShowFilters(!showFilters)}
            color={showFilters ? 'primary' : 'default'}
          >
            <FilterList />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Advanced Filters */}
      <Collapse in={showFilters}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="From Date"
              value={filters.dateFrom}
              onChange={(date) => handleFilterChange('dateFrom', date)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
            <DatePicker
              label="To Date"
              value={filters.dateTo}
              onChange={(date) => handleFilterChange('dateTo', date)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
          
          <FormControl fullWidth>
            <InputLabel>Funding Status</InputLabel>
            <Select
              value={filters.funded}
              onChange={(e) => handleFilterChange('funded', e.target.value)}
              label="Funding Status"
            >
              <MenuItem value="all">All Deals</MenuItem>
              <MenuItem value="funded">Funded</MenuItem>
              <MenuItem value="unfunded">Unfunded</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Salesperson</InputLabel>
            <Select
              value={filters.salespersonId}
              onChange={(e) => handleFilterChange('salespersonId', e.target.value)}
              label="Salesperson"
            >
              <MenuItem value="">All Salespeople</MenuItem>
              {salespeople.map(sp => (
                <MenuItem key={sp.id} value={sp.id}>{sp.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Finance Manager</InputLabel>
            <Select
              value={filters.financeManagerId}
              onChange={(e) => handleFilterChange('financeManagerId', e.target.value)}
              label="Finance Manager"
            >
              <MenuItem value="">All F&I Managers</MenuItem>
              {financeManagers.map(fm => (
                <MenuItem key={fm.id} value={fm.id}>{fm.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Bank"
            value={filters.bank}
            onChange={(e) => handleFilterChange('bank', e.target.value)}
            fullWidth
          />

          <TextField
            label="Min Amount"
            type="number"
            value={filters.minAmount}
            onChange={(e) => handleFilterChange('minAmount', e.target.value)}
            fullWidth
          />

          <TextField
            label="Max Amount"
            type="number"
            value={filters.maxAmount}
            onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
            fullWidth
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={clearFilters}
            startIcon={<Clear />}
          >
            Clear All
          </Button>
          <Button
            variant="outlined"
            onClick={() => onExport(filters)}
            startIcon={<TrendingUp />}
          >
            Export Filtered
          </Button>
        </Box>
      </Collapse>

      {/* Bulk Actions */}
      {selectedDeals.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 2, p: 1, bgcolor: 'primary.light', borderRadius: 1 }}>
          <Chip 
            label={`${selectedDeals.length} deals selected`} 
            color="primary" 
            size="small" 
          />
          <Button
            size="small"
            variant="contained"
            onClick={() => handleBulkAction('markFunded')}
          >
            Mark All Funded
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleBulkAction('export')}
          >
            Export Selected
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setSelectedDeals([])}
          >
            Clear Selection
          </Button>
        </Box>
      )}
    </Paper>
  );
}
