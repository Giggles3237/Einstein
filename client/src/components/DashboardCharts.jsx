import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  AttachMoney, 
  Schedule,
  CheckCircle,
  Warning,
  Refresh
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function DashboardCharts({ deals, salespeople, financeManagers }) {
  // Calculate key metrics
  const totalDeals = deals.length;
  const fundedDeals = deals.filter(d => d.fundedDate).length;
  const unfundedDeals = totalDeals - fundedDeals;
  const fundingRate = totalDeals > 0 ? ((fundedDeals / totalDeals) * 100).toFixed(1) : 0;
  
  // Calculate average days to fund
  const fundedDealsWithDates = deals.filter(d => d.fundedDate && d.dealDate);
  const avgDaysToFund = fundedDealsWithDates.length > 0 
    ? Math.round(fundedDealsWithDates.reduce((sum, d) => {
        const dealDate = new Date(d.dealDate);
        const fundedDate = new Date(d.fundedDate);
        return sum + Math.floor((fundedDate - dealDate) / (1000 * 60 * 60 * 24));
      }, 0) / fundedDealsWithDates.length)
    : 0;

  // Sales performance by salesperson
  const salesPerformance = salespeople.map(sp => {
    const spDeals = deals.filter(d => d.salespersonId === sp.id);
    const spFunded = spDeals.filter(d => d.fundedDate).length;
    return {
      name: sp.name,
      total: spDeals.length,
      funded: spFunded,
      rate: spDeals.length > 0 ? ((spFunded / spDeals.length) * 100).toFixed(1) : 0
    };
  }).sort((a, b) => b.total - a.total);

  // Monthly funding trends
  const monthlyData = deals.reduce((acc, deal) => {
    if (deal.fundedDate) {
      const month = new Date(deal.fundedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + 1;
    }
    return acc;
  }, {});

  const monthlyTrends = Object.entries(monthlyData).map(([month, count]) => ({
    month,
    funded: count
  })).slice(-6); // Last 6 months

  // Bank performance
  const bankPerformance = deals.reduce((acc, deal) => {
    if (deal.bank) {
      if (!acc[deal.bank]) {
        acc[deal.bank] = { total: 0, funded: 0 };
      }
      acc[deal.bank].total++;
      if (deal.fundedDate) acc[deal.bank].funded++;
    }
    return acc;
  }, {});

  const bankData = Object.entries(bankPerformance).map(([bank, data]) => ({
    bank,
    total: data.total,
    funded: data.funded,
    rate: ((data.funded / data.total) * 100).toFixed(1)
  })).sort((a, b) => b.total - a.total).slice(0, 5);

  // Deal status distribution
  const statusData = [
    { name: 'Funded', value: fundedDeals, color: '#4caf50' },
    { name: 'Unfunded', value: unfundedDeals, color: '#ff9800' }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          📊 Deal Analytics Dashboard
        </Typography>
        <Tooltip title="Refresh Data">
          <IconButton>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
            <CardContent>
              <Typography color="inherit" variant="h4" component="div">
                {totalDeals}
              </Typography>
              <Typography color="inherit" variant="body2">
                Total Deals
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
            <CardContent>
              <Typography color="inherit" variant="h4" component="div">
                {fundingRate}%
              </Typography>
              <Typography color="inherit" variant="body2">
                Funding Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
            <CardContent>
              <Typography color="inherit" variant="h4" component="div">
                {avgDaysToFund}
              </Typography>
              <Typography color="inherit" variant="body2">
                Avg Days to Fund
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'info.light', color: 'white' }}>
            <CardContent>
              <Typography color="inherit" variant="h4" component="div">
                {unfundedDeals}
              </Typography>
              <Typography color="inherit" variant="body2">
                Pending Funding
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Grid */}
      <Grid container spacing={3}>
        {/* Monthly Funding Trends */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              📈 Monthly Funding Trends
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Line type="monotone" dataKey="funded" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Deal Status Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              🎯 Deal Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Sales Performance */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              👥 Sales Performance by Person
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesPerformance.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="total" fill="#8884d8" />
                <Bar dataKey="funded" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Bank Performance */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              🏦 Top Bank Performance
            </Typography>
            <Box sx={{ height: '100%', overflowY: 'auto' }}>
              {bankData.map((bank, index) => (
                <Box key={bank.bank} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {bank.bank}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {bank.funded}/{bank.total} deals
                    </Typography>
                  </Box>
                  <Chip 
                    label={`${bank.rate}%`} 
                    color={parseFloat(bank.rate) > 80 ? 'success' : parseFloat(bank.rate) > 60 ? 'warning' : 'error'}
                    size="small"
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
