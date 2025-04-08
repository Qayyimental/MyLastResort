import React, { useState, useEffect } from 'react';
import {
  Grid, Paper, Typography, Tabs, Tab, Box,
  Button, Alert, CircularProgress
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar, Scatter } from 'react-chartjs-2';
import { FileDownload, BugReport, TrendingUp } from '@mui/icons-material';
import { TensorFlowService } from '../../services/ai/tensorflow';
import { exportToExcel } from '../../services/export/excel';
import { exportToPDF } from '../../services/export/pdf';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPanel() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [anomalies, setAnomalies] = useState([]);
  const [forecast, setForecast] = useState(null);

  const ratioData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Liquidity Ratio',
      data: [1.2, 1.3, 1.1, 1.4, 1.3, 1.5],
      borderColor: '#4285f4'
    }]
  };

  const anomalyData = {
    datasets: [{
      label: 'Normal Data',
      data: [
        { x: 1, y: 2 },
        { x: 2, y: 3 },
        { x: 3, y: 4 }
      ],
      backgroundColor: '#4285f4'
    }, {
      label: 'Anomalies',
      data: [
        { x: 1.5, y: 5 },
        { x: 2.5, y: 1 }
      ],
      backgroundColor: '#ea4335'
    }]
  };

  const performanceData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{
      label: 'Performance',
      data: [65, 78, 82, 91],
      backgroundColor: '#34a853'
    }]
  };

  const handleExportExcel = () => {
    exportToExcel(/* data */);
  };

  const handleExportPDF = () => {
    exportToPDF(/* data */);
  };

  const handleAnomalyDetection = async () => {
    setLoading(true);
    // Implement anomaly detection using TensorFlowService
    setLoading(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Financial Analytics</Typography>
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            onClick={handleExportExcel}
          >
            Export Excel
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            onClick={handleExportPDF}
          >
            Export PDF
          </Button>
        </Box>
      </Box>

      <Tabs value={tab} onChange={(e, val) => setTab(val)}>
        <Tab label="Financial Ratios" />
        <Tab label="AI Forecasting" />
        <Tab label="Anomaly Detection" />
        <Tab label="Performance" />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {tab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Liquidity Ratios</Typography>
                <Line data={ratioData} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Profitability Ratios</Typography>
                {/* Implement ratio visualizations */}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Debt Ratios</Typography>
                {/* Implement ratio visualizations */}
              </Paper>
            </Grid>
          </Grid>
        )}

        {tab === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">AI-Powered Revenue Forecast</Typography>
                  <Button
                    variant="contained"
                    startIcon={<TrendingUp />}
                    sx={{ ml: 'auto' }}
                  >
                    Generate Forecast
                  </Button>
                </Box>
                {forecast && <Line data={forecast} />}
              </Paper>
            </Grid>
          </Grid>
        )}

        {tab === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Anomaly Detection</Typography>
                  <Button
                    variant="contained"
                    startIcon={<BugReport />}
                    onClick={handleAnomalyDetection}
                    sx={{ ml: 'auto' }}
                  >
                    Detect Anomalies
                  </Button>
                </Box>
                {loading && <CircularProgress />}
                {anomalies.length > 0 && (
                  <Alert severity="warning">
                    {anomalies.length} potential anomalies detected
                  </Alert>
                )}
                <Scatter 
                  data={anomalyData}
                  options={{
                    scales: {
                      x: { type: 'linear', position: 'bottom' }
                    }
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        )}

        {tab === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Performance Metrics</Typography>
                <Bar data={performanceData} />
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
}
