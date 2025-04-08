import React, { useEffect, useState } from 'react';
import {
  List, ListItem, ListItemIcon, ListItemText,
  CircularProgress, Typography
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Pending as PendingIcon
} from '@mui/icons-material';

interface Requirement {
  name: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
}

export default function SystemCheck() {
  const [requirements, setRequirements] = useState<Requirement[]>([
    { name: 'Node.js Version', status: 'pending' },
    { name: 'System Dependencies', status: 'pending' },
    { name: 'Disk Space', status: 'pending' },
    { name: 'Required Permissions', status: 'pending' }
  ]);

  useEffect(() => {
    const checkSystem = async () => {
      for (let i = 0; i < requirements.length; i++) {
        try {
          // Call electron API to check each requirement
          const result = await window.electron.checkRequirement(requirements[i].name);
          setRequirements(prev => [
            ...prev.slice(0, i),
            { ...prev[i], status: 'success' },
            ...prev.slice(i + 1)
          ]);
        } catch (error) {
          setRequirements(prev => [
            ...prev.slice(0, i),
            { ...prev[i], status: 'error', message: error.message },
            ...prev.slice(i + 1)
          ]);
        }
      }
    };

    checkSystem();
  }, []);

  const getIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <CircularProgress size={24} />;
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        System Requirements Check
      </Typography>
      <List>
        {requirements.map((req) => (
          <ListItem key={req.name}>
            <ListItemIcon>
              {getIcon(req.status)}
            </ListItemIcon>
            <ListItemText 
              primary={req.name}
              secondary={req.message}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
}
