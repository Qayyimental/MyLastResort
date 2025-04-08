import React from 'react';
import { Card, Box, Typography, CircularProgress, Tooltip } from '@mui/material';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

export function DataCard({ title, value, change, loading, icon: Icon, color = 'primary' }) {
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <Box sx={{ p: 3, position: 'relative' }}>
        {loading ? (
          <CircularProgress size={20} sx={{ position: 'absolute', right: 16, top: 16 }} />
        ) : (
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              borderRadius: '50%',
              p: 1,
              display: 'inline-flex',
              mb: 2
            }}
          >
            <Icon sx={{ color: 'white' }} />
          </Box>
        )}
        
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        <Typography variant="h4" sx={{ mb: 2 }}>
          {formatCurrency(value)}
        </Typography>

        <Typography
          variant="subtitle2"
          sx={{
            color: change >= 0 ? 'success.main' : 'error.main',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          {change >= 0 ? <TrendingUp color="success" /> : <TrendingDown color="error" />} 
          {formatPercentage(Math.abs(change))}
          <Typography variant="caption" color="text.secondary" component="span">
            vs last month
          </Typography>
        </Typography>
      </Box>
    </Card>
  );
}
