import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Menu as MenuIcon,
  Assessment,
  AccountBalance,
  TrendingUp,
  Settings as SettingsIcon
} from '@mui/icons-material';
import FinancialOverview from './FinancialOverview';
import TransactionList from './TransactionList';
import AnalyticsPanel from './AnalyticsPanel';
import Settings from './Settings';

export default function Dashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentView, setCurrentView] = useState('overview');
  
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">
            Financial Analysis Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <List>
          <ListItem button onClick={() => setCurrentView('overview')}>
            <ListItemIcon><Assessment /></ListItemIcon>
            <ListItemText primary="Overview" />
          </ListItem>
          <ListItem button onClick={() => setCurrentView('transactions')}>
            <ListItemIcon><AccountBalance /></ListItemIcon>
            <ListItemText primary="Transactions" />
          </ListItem>
          <ListItem button onClick={() => setCurrentView('analytics')}>
            <ListItemIcon><TrendingUp /></ListItemIcon>
            <ListItemText primary="Analytics" />
          </ListItem>
          <ListItem button onClick={() => setCurrentView('settings')}>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {currentView === 'overview' && <FinancialOverview />}
        {currentView === 'transactions' && <TransactionList />}
        {currentView === 'analytics' && <AnalyticsPanel />}
        {currentView === 'settings' && <Settings />}
      </Box>
    </Box>
  );
}
