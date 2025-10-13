import React from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
      <CircularProgress />
      <Typography sx={{ mt: 1 }}>{message}</Typography>
    </Box>
  );
}

export default LoadingSpinner;