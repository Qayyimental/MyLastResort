import React, { useState, useEffect } from 'react';
import { 
  Box, Button, IconButton, Typography, 
  Chip, Tooltip, Paper, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, 
  Select, MenuItem, FormControl, InputLabel, Menu 
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, FileDownload, FilterList } from '@mui/icons-material';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    description: '',
    category: '',
    type: 'expense'
  });
  const [exportMenu, setExportMenu] = useState(null);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/transactions');
        if (!response.ok) throw new Error('Failed to fetch transactions');
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const handleExport = (format) => {
    if (format === 'excel') {
      exportToExcel(selectedTransactions, 'transactions.xlsx');
    } else {
      exportToPDF(selectedTransactions, 'transactions.pdf');
    }
    setExportMenu(null);
  };

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      width: 130,
      renderCell: (params) => formatDate(params.value)
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 130,
      renderCell: (params) => (
        <Typography color={params.value >= 0 ? 'success.main' : 'error.main'}>
          {formatCurrency(params.value)}
        </Typography>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value}
          color={
            params.value === 'completed' ? 'success' :
            params.value === 'pending' ? 'warning' : 'error'
          }
          size="small"
        />
      )
    },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'category', headerName: 'Category', width: 130 },
    { field: 'type', headerName: 'Type', width: 130 },
    {
      field: 'accountingStandard',
      headerName: 'Standard',
      width: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value}
          color={params.value === 'IFRS' ? 'primary' : 'secondary'}
          size="small"
        />
      )
    }
  ];

  const handleSave = () => {
    // Implement save logic
    setOpenDialog(false);
  };

  return (
    <Box>
      <Box sx={{ 
        mb: 3, 
        display: 'flex', 
        alignItems: 'center',
        gap: 2 
      }}>
        <Typography variant="h4">Transactions</Typography>
        
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            onClick={(e) => setExportMenu(e.currentTarget)}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
          >
            Add Transaction
          </Button>
        </Box>
      </Box>

      <Menu
        anchorEl={exportMenu}
        open={Boolean(exportMenu)}
        onClose={() => setExportMenu(null)}
      >
        <MenuItem onClick={() => handleExport('excel')}>
          Export to Excel
        </MenuItem>
        <MenuItem onClick={() => handleExport('pdf')}>
          Export to PDF
        </MenuItem>
      </Menu>

      <Paper sx={{ height: 600 }}>
        <DataGrid
          rows={transactions}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          checkboxSelection
          disableSelectionOnClick
          loading={loading}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: 'background.paper',
              fontWeight: 600
            }
          }}
        />
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Transaction</DialogTitle>
        <DialogContent>
          <TextField
            label="Date"
            type="date"
            value={newTransaction.date}
            onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
            fullWidth
            margin="normal"
          />
          {/* Add other fields */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Accounting Standard</InputLabel>
            <Select
              value={newTransaction.accountingStandard || 'IFRS'}
              onChange={(e) => setNewTransaction({
                ...newTransaction,
                accountingStandard: e.target.value
              })}
            >
              <MenuItem value="IFRS">IFRS</MenuItem>
              <MenuItem value="GAAP">GAAP</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
