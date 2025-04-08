import React from 'react';
import {
  Box, Paper, Typography, FormControl, InputLabel,
  Select, MenuItem, Switch, FormControlLabel, TextField,
  Divider, Grid, Button
} from '@mui/material';

export default function Settings() {
  const [settings, setSettings] = React.useState({
    currency: 'USD',
    language: 'en',
    darkMode: false,
    apiKey: '',
    autoBackup: true
  });

  const [accountingSettings, setAccountingSettings] = React.useState({
    defaultStandard: 'IFRS',
    autoReconciliation: true,
    enableAIAnalysis: true,
    anomalyDetectionThreshold: 0.05
  });

  const handleSave = () => {
    // Implement settings save
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>General Settings</Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Currency</InputLabel>
              <Select
                value={settings.currency}
                onChange={(e) => setSettings({...settings, currency: e.target.value})}
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="GBP">GBP</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Language</InputLabel>
              <Select
                value={settings.language}
                onChange={(e) => setSettings({...settings, language: e.target.value})}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={(e) => setSettings({...settings, darkMode: e.target.checked})}
                />
              }
              label="Dark Mode"
            />

            <Button
              variant="contained"
              onClick={handleSave}
              sx={{ mt: 2 }}
              fullWidth
            >
              Save Settings
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Accounting Standards</Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Default Standard</InputLabel>
              <Select
                value={accountingSettings.defaultStandard}
                onChange={(e) => setAccountingSettings({
                  ...accountingSettings,
                  defaultStandard: e.target.value
                })}
              >
                <MenuItem value="IFRS">IFRS</MenuItem>
                <MenuItem value="GAAP">GAAP</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={accountingSettings.autoReconciliation}
                  onChange={(e) => setAccountingSettings({
                    ...accountingSettings,
                    autoReconciliation: e.target.checked
                  })}
                />
              }
              label="Automatic Reconciliation"
            />

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>AI Features</Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={accountingSettings.enableAIAnalysis}
                  onChange={(e) => setAccountingSettings({
                    ...accountingSettings,
                    enableAIAnalysis: e.target.checked
                  })}
                />
              }
              label="Enable AI Analysis"
            />

            <TextField
              fullWidth
              type="number"
              label="Anomaly Detection Threshold"
              value={accountingSettings.anomalyDetectionThreshold}
              onChange={(e) => setAccountingSettings({
                ...accountingSettings,
                anomalyDetectionThreshold: parseFloat(e.target.value)
              })}
              inputProps={{ step: 0.01, min: 0, max: 1 }}
              sx={{ mt: 2 }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
