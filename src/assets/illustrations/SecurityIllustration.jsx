import React from 'react';
import { Box, Paper, Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LockIcon from '@mui/icons-material/Lock';

const SecurityIllustration = () => (
  <Box sx={{ position: 'relative', width: 280, height: 200, mx: 'auto', mb: 6 }}>
    {/* Browser Window */}
    <Paper 
      elevation={3} 
      sx={{ 
        width: '100%', height: '100%', borderRadius: 2, overflow: 'hidden', 
        display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' 
      }}
    >
      {/* Header */}
      <Box sx={{ height: 16, bgcolor: 'grey.200', display: 'flex', alignItems: 'center', px: 1.5, gap: 0.5 }}>
         <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'grey.400' }} />
         <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'grey.400' }} />
         <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'grey.400' }} />
      </Box>
      
      {/* Content rows */}
      <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
         {[1, 2, 3].map((item, index) => (
           <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
             <Avatar sx={{ width: 32, height: 32, bgcolor: index === 0 ? 'primary.main' : 'grey.300' }} />
             <Box sx={{ flex: 1 }}>
               <Box sx={{ width: '70%', height: 5, bgcolor: 'grey.300', mb: 0.5, borderRadius: 1 }} />
               <Box sx={{ width: '50%', height: 5, bgcolor: 'grey.200', borderRadius: 1 }} />
             </Box>
             <Box sx={{ display: 'flex', gap: 0.5 }}>
               <Box sx={{ width: 26, height: 26, borderRadius: 1, bgcolor: index === 0 ? 'primary.main' : 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <EditIcon sx={{ fontSize: 16, color: index === 0 ? 'white' : 'grey.500' }} />
               </Box>
               <Box sx={{ width: 26, height: 26, borderRadius: 1, bgcolor: index === 0 ? 'primary.main' : 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <VisibilityIcon sx={{ fontSize: 16, color: index === 0 ? 'white' : 'grey.500' }} />
               </Box>
               <Box sx={{ width: 26, height: 26, borderRadius: 1, bgcolor: index === 0 ? 'primary.main' : 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <LockIcon sx={{ fontSize: 16, color: index === 0 ? 'white' : 'grey.500' }} />
               </Box>
             </Box>
           </Box>
         ))}
      </Box>
    </Paper>
  </Box>
);

export default SecurityIllustration;
