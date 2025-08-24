import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  LinearProgress, 
  Chip, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  Psychology, 
  TrendingUp, 
  Lightbulb, 
  Analytics, 
 *  ExpandMore,
  Star,
  StarBorder,
  AutoAwesome,
  Insights,
  Speed,
  Warning,
  CheckCircle,
  Info
} from '@mui/icons-material';

export default function AIFeatures({ deals, salespeople, financeManagers }) {
  const [aiInsights, setAiInsights] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [insightDialog, setInsightDialog] = useState(false);

  // Simulate AI processing
  useEffect(() => {
    const processAIInsights = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const insights = {
        dealScoring: generateDealScoring(deals),
        fundingPredictions: generateFundingPredictions(deals),
        riskAnalysis: generateRiskAnalysis(deals),
        optimizationSuggestions: generateOptimizationSuggestions(deals, salespeople, financeManagers),
        trends: generateTrends(deals)
      };
      
      setAiInsights(insights);
      setLoading(false);
    };

    processAIInsights();
  }, [deals, salespeople, financeManagers]);

  // Generate AI-powered deal scoring
  const generateDealScoring = (deals) => {
    return deals.map(deal => {
      let score = 50; // Base score
      let factors = [];
      
      // Customer history factor
      if (deal.customerName) {
        const customerDeals = deals.filter(d => d.customerName === deal.customerName);
        if (customerDeals.length > 1) {
          const fundedRate = customerDeals.filter(d => d.fundedDate).length / customerDeals.length;
          score += fundedRate * 20;
          factors.push(`Customer History: +${Math.round(fundedRate * 20)}`);
        }
      }
      
      // Bank performance factor
      if (deal.bank) {
        const bankDeals = deals.filter(d => d.bank === deal.bank);
        if (bankDeals.length > 0) {
          const bankFundedRate = bankDeals.filter(d => d.fundedDate).length / bankDeals.length;
          score += bankFundedRate * 15;
          factors.push(`Bank Performance: +${Math.round(bankFundedRate * 15)}`);
        }
      }
      
      // Salesperson performance factor
      if (deal.salespersonId) {
        const spDeals = deals.filter(d => d.salespersonId === deal.salespersonId);
        if (spDeals.length > 0) {
          const spFundedRate = spDeals.filter(d => d.fundedDate).length / spDeals.length;
          score += spFundedRate * 10;
          factors.push(`Salesperson Performance: +${Math.round(spFundedRate * 10)}`);
        }
      }
      
      // Deal age factor
      if (deal.dealDate) {
        const daysSinceDeal = Math.floor((new Date() - new Date(deal.dealDate)) / (1000 * 60 * 60 * 24));
        if (daysSinceDeal > 14) {
          score -= 10;
          factors.push(`Deal Age: -10`);
        } else if (daysSinceDeal > 7) {
          score -= 5;
          factors.push(`Deal Age: -5`);
        }
      }
      
      // Stock number validation (simplified)
      if (deal.stockNo && deal.stockNo.length >= 6) {
        score += 5;
        factors.push(`Stock Number: +5`);
      }
      
      score = Math.max(0, Math.min(100, score));
      
      return {
        dealId: deal.id,
        customerName: deal.customerName,
        stockNo: deal.stockNo,
        score,
        factors,
        risk: score < 30 ? 'high' : score < 60 ? 'medium' : 'low',
        recommendation: score < 30 ? 'Review Required' : score < 60 ? 'Monitor Closely' : 'Good to Go'
      };
    }).sort((a, b) => b.score - a.score);
  };

  // Generate funding predictions
  const generateFundingPredictions = (deals) => {
    const unfundedDeals = deals.filter(d => !d.fundedDate);
    
    return unfundedDeals.map(deal => {
      const daysSinceDeal = Math.floor((new Date() - new Date(deal.dealDate)) / (1000 * 60 * 60 * 24));
      let probability = 0.8; // Base probability
      
      // Adjust based on deal age
      if (daysSinceDeal > 21) probability *= 0.3;
      else if (daysSinceDeal > 14) probability *= 0.5;
      else if (daysSinceDeal > 7) probability *= 0.7;
      
      // Adjust based on bank performance
      if (deal.bank) {
        const bankDeals = deals.filter(d => d.bank === deal.bank);
        if (bankDeals.length > 0) {
          const bankFundedRate = bankDeals.filter(d => d.fundedDate).length / bankDeals.length;
          probability *= bankFundedRate;
        }
      }
      
      return {
        dealId: deal.id,
        customerName: deal.customerName,
        stockNo: deal.stockNo,
        daysSinceDeal,
        fundingProbability: Math.round(probability * 100),
        estimatedFundingDate: new Date(Date.now() + (1 / probability) * 24 * 60 * 60 * 1000),
        urgency: probability < 0.3 ? 'high' : probability < 0.6 ? 'medium' : 'low'
      };
    }).sort((a, b) => a.fundingProbability - b.fundingProbability);
  };

  // Generate risk analysis
  const generateRiskAnalysis = (deals) => {
    const risks = [];
    
    // High-value unfunded deals
    const highValueUnfunded = deals.filter(d => !d.fundedDate && d.amount && d.amount > 50000);
    if (highValueUnfunded.length > 0) {
      risks.push({
        type: 'high_value_unfunded',
        severity: 'high',
        description: `${highValueUnfunded.length} high-value deals pending funding`,
        deals: highValueUnfunded,
        recommendation: 'Prioritize funding for high-value deals'
      });
    }
    
    // Old unfunded deals
    const oldUnfunded = deals.filter(d => {
      if (!d.fundedDate && d.dealDate) {
        const daysSinceDeal = Math.floor((new Date() - new Date(d.dealDate)) / (1000 * 60 * 60 * 24));
        return daysSinceDeal > 21;
      }
      return false;
    });
    
    if (oldUnfunded.length > 0) {
      risks.push({
        type: 'old_unfunded',
        severity: 'medium',
        description: `${oldUnfunded.length} deals pending for over 21 days`,
        deals: oldUnfunded,
        recommendation: 'Review and follow up on old deals'
      });
    }
    
    // Bank concentration risk
    const bankCounts = deals.reduce((acc, deal) => {
      if (deal.bank) {
        acc[deal.bank] = (acc[deal.bank] || 0) + 1;
      }
      return acc;
    }, {});
    
    const highConcentrationBanks = Object.entries(bankCounts)
      .filter(([bank, count]) => count > deals.length * 0.3)
      .map(([bank, count]) => ({ bank, count }));
    
    if (highConcentrationBanks.length > 0) {
      risks.push({
        type: 'bank_concentration',
        severity: 'medium',
        description: `High concentration in ${highConcentrationBanks.length} banks`,
        details: highConcentrationBanks,
        recommendation: 'Diversify bank relationships'
      });
    }
    
    return risks;
  };

  // Generate optimization suggestions
  const generateOptimizationSuggestions = (deals, salespeople, financeManagers) => {
    const suggestions = [];
    
    // Salesperson performance optimization
    const spPerformance = salespeople.map(sp => {
      const spDeals = deals.filter(d => d.salespersonId === sp.id);
      const fundedRate = spDeals.length > 0 ? spDeals.filter(d => d.fundedDate).length / spDeals.length : 0;
      return { ...sp, fundedRate, dealCount: spDeals.length };
    }).sort((a, b) => a.fundedRate - b.fundedRate);
    
    const lowPerformers = spPerformance.filter(sp => sp.fundedRate < 0.6 && sp.dealCount > 5);
    if (lowPerformers.length > 0) {
      suggestions.push({
        type: 'salesperson_training',
        priority: 'high',
        description: `Provide training for ${lowPerformers.length} low-performing salespeople`,
        details: lowPerformers.map(sp => `${sp.name}: ${Math.round(sp.fundedRate * 100)}% funding rate`),
        impact: 'Improve overall funding success rate'
      });
    }
    
    // Bank performance optimization
    const bankPerformance = deals.reduce((acc, deal) => {
      if (deal.bank) {
        if (!acc[deal.bank]) {
          acc[deal.bank] = { total: 0, funded: 0, avgDays: 0 };
        }
        acc[deal.bank].total++;
        if (deal.fundedDate) {
          acc[deal.bank].funded++;
          const daysToFund = Math.floor((new Date(deal.fundedDate) - new Date(deal.dealDate)) / (1000 * 60 * 60 * 24));
          acc[deal.bank].avgDays += daysToFund;
        }
      }
      return acc;
    }, {});
    
    Object.entries(bankPerformance).forEach(([bank, data]) => {
      const fundedRate = data.total > 0 ? data.funded / data.total : 0;
      const avgDays = data.funded > 0 ? data.avgDays / data.funded : 0;
      
      if (fundedRate < 0.7) {
        suggestions.push({
          type: 'bank_relationship',
          priority: 'medium',
          description: `Review relationship with ${bank}`,
          details: [`Funding rate: ${Math.round(fundedRate * 100)}%`, `Avg days to fund: ${Math.round(avgDays)}`],
          impact: 'Improve funding success and speed'
        });
      }
    });
    
    return suggestions;
  };

  // Generate trends
  const generateTrends = (deals) => {
    const monthlyData = deals.reduce((acc, deal) => {
      if (deal.dealDate) {
        const month = new Date(deal.dealDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (!acc[month]) {
          acc[month] = { total: 0, funded: 0, avgDays: 0, totalDays: 0, fundedCount: 0 };
        }
        acc[month].total++;
        
        if (deal.fundedDate) {
          acc[month].funded++;
          const daysToFund = Math.floor((new Date(deal.fundedDate) - new Date(deal.dealDate)) / (1000 * 60 * 60 * 24));
          acc[month].totalDays += daysToFund;
          acc[month].fundedCount++;
        }
      }
      return acc;
    }, {});
    
    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      totalDeals: data.total,
      fundedDeals: data.funded,
      fundingRate: data.total > 0 ? (data.funded / data.total) * 100 : 0,
      avgDaysToFund: data.fundedCount > 0 ? Math.round(data.totalDays / data.fundedCount) : 0
    })).sort((a, b) => new Date(a.month) - new Date(b.month));
  };

  const handleDealClick = (deal) => {
    setSelectedDeal(deal);
    setInsightDialog(true);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            🤖 AI is analyzing your deals...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This may take a few moments
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <AutoAwesome sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
        <Box>
          <Typography variant="h4" component="h1">
            AI-Powered Insights
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Smart analytics and predictions to optimize your deals
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Deal Scoring */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              🎯 AI Deal Scoring
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Risk assessment and success probability for each deal
            </Typography>
            
            <List>
              {aiInsights.dealScoring?.slice(0, 5).map((deal) => (
                <ListItem key={deal.dealId} sx={{ mb: 1, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <ListItemIcon>
                    <Box sx={{ position: 'relative' }}>
                      <CircularProgress
                        variant="determinate"
                        value={deal.score}
                        size={40}
                        color={getRiskColor(deal.risk)}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {deal.score}
                      </Box>
                    </Box>
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={deal.customerName}
                    secondary={`${deal.stockNo} • ${deal.recommendation}`}
                  />
                  
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip 
                      label={deal.risk.toUpperCase()} 
                      color={getRiskColor(deal.risk)} 
                      size="small" 
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
            
            <Button 
              variant="outlined" 
              fullWidth 
              sx={{ mt: 2 }}
              onClick={() => {/* Navigate to full scoring */}}
            >
              View All Deal Scores
            </Button>
          </Paper>
        </Grid>

        {/* Funding Predictions */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              🔮 Funding Predictions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              AI-powered estimates for when deals will be funded
            </Typography>
            
            <List>
              {aiInsights.fundingPredictions?.slice(0, 5).map((deal) => (
                <ListItem key={deal.dealId} sx={{ mb: 1, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <ListItemIcon>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="primary">
                        {deal.fundingProbability}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Probability
                      </Typography>
                    </Box>
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={deal.customerName}
                    secondary={`${deal.stockNo} • ${deal.daysSinceDeal} days old`}
                  />
                  
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip 
                      label={deal.urgency.toUpperCase()} 
                      color={getUrgencyColor(deal.urgency)} 
                      size="small" 
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
            
            <Button 
              variant="outlined" 
              fullWidth 
              sx={{ mt: 2 }}
              onClick={() => {/* Navigate to full predictions */}}
            >
              View All Predictions
            </Button>
          </Paper>
        </Grid>

        {/* Risk Analysis */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              ⚠️ Risk Analysis
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Identified risks and recommendations
            </Typography>
            
            {aiInsights.riskAnalysis?.map((risk, index) => (
              <Alert 
                key={index}
                severity={risk.severity === 'high' ? 'error' : risk.severity === 'medium' ? 'warning' : 'info'}
                sx={{ mb: 2 }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  {risk.description}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {risk.recommendation}
                </Typography>
                {risk.deals && (
                  <Typography variant="caption" color="text.secondary">
                    Affected deals: {risk.deals.length}
                  </Typography>
                )}
              </Alert>
            ))}
          </Paper>
        </Grid>

        {/* Optimization Suggestions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              💡 Optimization Suggestions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              AI recommendations to improve performance
            </Typography>
            
            {aiInsights.optimizationSuggestions?.map((suggestion, index) => (
              <Accordion key={index} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Chip 
                      label={suggestion.priority.toUpperCase()} 
                      color={suggestion.priority === 'high' ? 'error' : 'warning'} 
                      size="small" 
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="subtitle2">
                      {suggestion.description}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {suggestion.impact}
                  </Typography>
                  {suggestion.details && (
                    <List dense>
                      {suggestion.details.map((detail, idx) => (
                        <ListItem key={idx} sx={{ py: 0 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <Info fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={detail} />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        </Grid>

        {/* Trends */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              📈 Performance Trends
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Monthly performance metrics and trends
            </Typography>
            
            <Grid container spacing={2}>
              {aiInsights.trends?.map((trend, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" color="primary">
                        {trend.month}
                      </Typography>
                      <Typography variant="h4" gutterBottom>
                        {trend.fundingRate.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Funding Rate
                      </Typography>
                      <Typography variant="body2">
                        {trend.totalDeals} total • {trend.fundedDeals} funded
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avg: {trend.avgDaysToFund} days
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Deal Insight Dialog */}
      <Dialog open={insightDialog} onClose={() => setInsightDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          AI Insights for {selectedDeal?.customerName}
        </DialogTitle>
        <DialogContent>
          {selectedDeal && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Deal Analysis
              </Typography>
              {/* Add detailed deal insights here */}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInsightDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
