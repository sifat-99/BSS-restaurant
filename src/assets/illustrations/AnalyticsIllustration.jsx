import React from 'react';
import { Box, Paper } from '@mui/material';

const AnalyticsIllustration = () => (
  <Box sx={{ position: 'relative', width: 260, height: 180, mx: 'auto', mb: 6 }}>
    {/* Dashboard Tablet/Screen */}
    <Paper 
      elevation={4} 
      sx={{ 
        width: '100%', height: '100%', borderRadius: 2, p: 2, 
        bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
        display: 'flex', gap: 2
      }}
    >
      {/* Left side list */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
             <Box sx={{ width: 14, height: 14, borderRadius: 0.5, bgcolor: 'primary.main' }} />
             <Box sx={{ flex: 1 }}>
                <Box sx={{ width: '100%', height: 4, bgcolor: 'primary.light', opacity: 0.5, mb: 1, borderRadius: 1 }} />
                <Box sx={{ width: '70%', height: 4, bgcolor: 'grey.300', borderRadius: 1 }} />
             </Box>
          </Box>
        ))}
      </Box>
      
      {/* Right side chart */}
      <Box sx={{ flex: 1.5, display: 'flex', alignItems: 'flex-end', gap: 1.2, position: 'relative', borderBottom: '2px solid', borderLeft: '2px solid', borderColor: 'grey.400', pb: 0.5, pl: 0.5 }}>
         {/* Line chart simulation using basic SVG */}
         <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <polyline points="10,60 30,30 55,45 85,15 110,25" fill="none" stroke="#666" strokeWidth="1.5" />
            <circle cx="10" cy="60" r="3" fill="#333" />
            <circle cx="30" cy="30" r="3" fill="#333" />
            <circle cx="55" cy="45" r="3" fill="#333" />
            <circle cx="85" cy="15" r="3" fill="#333" />
            <circle cx="110" cy="25" r="3" fill="#333" />
         </svg>
         
         {/* Bar chart simulation */}
         <Box sx={{ width: 14, height: '30%', bgcolor: 'primary.main', borderRadius: '2px 2px 0 0', zIndex: 1, ml: 1 }} />
         <Box sx={{ width: 14, height: '60%', bgcolor: 'primary.main', borderRadius: '2px 2px 0 0', zIndex: 1 }} />
         <Box sx={{ width: 14, height: '40%', bgcolor: 'primary.main', borderRadius: '2px 2px 0 0', zIndex: 1 }} />
         <Box sx={{ width: 14, height: '80%', bgcolor: 'primary.main', borderRadius: '2px 2px 0 0', zIndex: 1 }} />
         <Box sx={{ width: 14, height: '50%', bgcolor: 'primary.main', borderRadius: '2px 2px 0 0', zIndex: 1 }} />
      </Box>
    </Paper>
  </Box>
);

export default AnalyticsIllustration;
