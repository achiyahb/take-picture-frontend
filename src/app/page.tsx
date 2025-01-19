'use client';
import React from 'react';
import { Box, Typography } from '@mui/material';

const SplashScreen = () => {

  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: '2rem',
              backgroundColor: '#f0f0f0',
            }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1976d2', marginBottom: '2rem' }}>
            Take Picture
          </Typography>
          <Box
              sx={{
                width: '80%',
                maxWidth: '600px',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
              }}
          >

          </Box>
        </Box>
      </Box>
  );
};

export default SplashScreen;
