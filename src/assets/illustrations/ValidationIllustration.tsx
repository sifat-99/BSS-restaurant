import React from 'react';
import { Box, Paper } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { keyframes } from '@mui/system';

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const floatSlowAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const ValidationIllustration = () => (
  <Box sx={{ position: 'relative', width: 220, height: 180, mx: 'auto', mb: 6 }}>
    {/* Large Document */}
    <Paper 
      elevation={2} 
      sx={{ 
        position: 'absolute', top: 10, left: 20, width: 180, height: 160, 
        borderRadius: 2, p: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', zIndex: 1,
        animation: `${floatSlowAnimation} 4s ease-in-out infinite`
      }}
    >
       <Box sx={{ width: '40%', height: 6, bgcolor: 'primary.main', mb: 2, borderRadius: 1, opacity: 0.8 }} />
       <Box sx={{ width: '80%', height: 6, bgcolor: 'grey.300', mb: 2, borderRadius: 1 }} />
       <Box sx={{ width: '100%', height: 6, bgcolor: 'grey.300', mb: 2, borderRadius: 1 }} />
       <Box sx={{ width: '70%', height: 6, bgcolor: 'grey.300', mb: 2, borderRadius: 1 }} />
       <Box sx={{ width: '90%', height: 6, bgcolor: 'grey.300', mb: 2, borderRadius: 1 }} />
    </Paper>

    {/* Giant Checkmark Badge */}
    <Paper 
      elevation={6} 
      sx={{ 
        position: 'absolute', top: 40, left: -10, width: 65, height: 65, 
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        bgcolor: 'primary.main', zIndex: 2,
        animation: `${floatAnimation} 3s ease-in-out infinite`
      }}
    >
       <CheckIcon sx={{ color: 'white', fontSize: 35, stroke: 'white', strokeWidth: 1.5 }} />
    </Paper>
  </Box>
);

export default ValidationIllustration;
