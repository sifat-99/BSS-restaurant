import { Box, Paper } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { keyframes } from '@mui/system';

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const DynamicManagementIllustration = () => (
  <Box
    sx={{ position: "relative", width: 220, height: 180, mx: "auto", mb: 6 }}
  >
    {/* Card 1 (Back left) */}
    <Paper
      elevation={2}
      sx={{
        position: "absolute",
        top: 10,
        left: 10,
        width: 100,
        height: 60,
        borderRadius: 2,
        p: 1.5,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        zIndex: 1,
        animation: `${floatAnimation} 3.5s ease-in-out infinite`,
        animationDelay: '1s',
      }}
    >
      <Box
        sx={{
          width: "80%",
          height: 4,
          bgcolor: "grey.300",
          mb: 1,
          borderRadius: 1,
        }}
      />
      <Box
        sx={{ width: "60%", height: 4, bgcolor: "grey.300", borderRadius: 1 }}
      />
      {/* Checkmark Badge */}
      <Box
        sx={{
          position: "absolute",
          top: -8,
          right: -8,
          bgcolor: "primary.main",
          borderRadius: "50%",
          width: 20,
          height: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CheckIcon sx={{ color: "white", fontSize: 14 }} />
      </Box>
    </Paper>

    {/* Card 2 (Middle left) */}
    <Paper
      elevation={3}
      sx={{
        position: "absolute",
        top: 40,
        left: -10,
        width: 110,
        height: 75,
        borderRadius: 2,
        p: 1.5,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        zIndex: 2,
        animation: `${floatAnimation} 3s ease-in-out infinite`,
        animationDelay: '0s',
      }}
    >
      <Box
        sx={{
          width: "85%",
          height: 4,
          bgcolor: "grey.300",
          mb: 1.5,
          borderRadius: 1,
        }}
      />
      <Box
        sx={{
          width: "70%",
          height: 4,
          bgcolor: "grey.300",
          mb: 1.5,
          borderRadius: 1,
        }}
      />
      <Box
        sx={{ width: "50%", height: 4, bgcolor: "grey.300", borderRadius: 1 }}
      />
      {/* Checkmark Badge */}
      <Box
        sx={{
          position: "absolute",
          top: -8,
          right: -8,
          bgcolor: "primary.main",
          borderRadius: "50%",
          width: 22,
          height: 22,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CheckIcon sx={{ color: "white", fontSize: 16 }} />
      </Box>
    </Paper>

    {/* Card 3 (Front right) */}
    <Paper
      elevation={4}
      sx={{
        position: "absolute",
        top: 70,
        right: 0,
        width: 140,
        height: 85,
        borderRadius: 2,
        p: 2,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        zIndex: 3,
        animation: `${floatAnimation} 4s ease-in-out infinite`,
        animationDelay: '0.5s',
      }}
    >
      <Box
        sx={{
          width: "90%",
          height: 5,
          bgcolor: "grey.400",
          mb: 1.5,
          borderRadius: 1,
        }}
      />
      <Box
        sx={{
          width: "80%",
          height: 5,
          bgcolor: "grey.300",
          mb: 1.5,
          borderRadius: 1,
        }}
      />
      <Box
        sx={{ width: "60%", height: 5, bgcolor: "grey.300", borderRadius: 1 }}
      />
      {/* Checkmark Badge */}
      <Box
        sx={{
          position: "absolute",
          top: -10,
          left: -10,
          bgcolor: "primary.main",
          borderRadius: "50%",
          width: 26,
          height: 26,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CheckIcon
          sx={{ color: "white", fontSize: 18, stroke: "white", strokeWidth: 1 }}
        />
      </Box>
    </Paper>
  </Box>
);

export default DynamicManagementIllustration;
