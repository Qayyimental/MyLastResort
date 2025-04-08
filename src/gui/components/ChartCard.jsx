import React from 'react';
import { Card, Box, Typography, ButtonGroup, Button } from '@mui/material';
import { Line } from 'react-chartjs-2';

export function ChartCard({ title, data, periods = ['1W', '1M', '3M', '1Y', 'ALL'] }) {
  const [activePeriod, setActivePeriod] = React.useState('1M');

  return (
    <Card sx={{ height: '100%' }}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">{title}</Typography>
          <ButtonGroup size="small" sx={{ ml: 'auto' }}>
            {periods.map((period) => (
              <Button
                key={period}
                variant={activePeriod === period ? 'contained' : 'outlined'}
                onClick={() => setActivePeriod(period)}
              >
                {period}
              </Button>
            ))}
          </ButtonGroup>
        </Box>

        <Box sx={{ height: 300 }}>
          <Line
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                }
              },
              scales: {
                x: { grid: { display: false } },
                y: { 
                  grid: { 
                    borderDash: [2],
                    drawBorder: false
                  }
                }
              }
            }}
          />
        </Box>
      </Box>
    </Card>
  );
}
