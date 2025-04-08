import React, { useState, useEffect } from 'react';
import { 
  Grid, Box, Typography, MenuItem, Select, FormControl, InputLabel, Alert, CircularProgress 
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  MonetizationOn,
  Timeline
} from '@mui/icons-material';
import { DataCard } from './DataCard';
import { ChartCard } from './ChartCard';

export default function FinancialOverview() {
  const [data, setData] = useState({
    totalAssets: 0,
    totalLiabilities: 0,
    netIncome: 0,
    cashflow: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/financial/overview');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [30, 45, 57, 51, 63, 72],
      borderColor: '#2563eb',
      tension: 0.3
    }]
  };

  return (
    <Box>
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography variant="h4">Financial Overview</Typography>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Time Period</InputLabel>
          <Select
            value="thisMonth"
            label="Time Period"
            onChange={() => {}}
          >
            <MenuItem value="thisMonth">This Month</MenuItem>
            <MenuItem value="lastMonth">Last Month</MenuItem>
            <MenuItem value="thisQuarter">This Quarter</MenuItem>
            <MenuItem value="thisYear">This Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <DataCard
            title="Total Revenue"
            value={872649.50}
            change={0.12}
            icon={MonetizationOn}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DataCard
            title="Total Expenses"
            value={234567.89}
            change={-0.05}
            icon={TrendingUp}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DataCard
            title="Net Profit"
            value={638081.61}
            change={0.15}
            icon={AccountBalance}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DataCard
            title="Growth Rate"
            value={127616.32}
            change={0.08}
            icon={Timeline}
            color="warning"
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <ChartCard
            title="Revenue Trend"
            data={chartData}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <ChartCard
            title="Expense Distribution"
            data={chartData}
            periods={['1M', '3M', '6M', '1Y']}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
