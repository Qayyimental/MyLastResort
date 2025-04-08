import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel, Select,
  MenuItem, FormHelperText, Grid 
} from '@mui/material';
import { validateAmount, validateDate } from '../../utils/validators';

interface TransactionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (transaction: any) => void;
}

export function TransactionDialog({ open, onClose, onSave }: TransactionDialogProps) {
  const [formData, setFormData] = React.useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    description: '',
    category: '',
    accountingStandard: 'IFRS'
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!validateAmount(Number(formData.amount))) {
      newErrors.amount = 'Invalid amount';
    }
    if (!validateDate(formData.date)) {
      newErrors.date = 'Invalid date';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Transaction</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              fullWidth
              error={!!errors.date}
              helperText={errors.date}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              fullWidth
              error={!!errors.amount}
              helperText={errors.amount}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              fullWidth
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                label="Category"
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
                <MenuItem value="investment">Investment</MenuItem>
                <MenuItem value="transfer">Transfer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
