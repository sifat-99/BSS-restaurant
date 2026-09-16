import { Box, Paper } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { keyframes } from "@mui/system";

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

const DynamicDashboardIllustration = () => (
  <Box
    sx={{ position: "relative", width: 260, height: 180, mx: "auto", mb: 6 }}
  >
    {/* Main Dashboard Window */}
    <Paper
      elevation={2}
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: 2,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        position: "relative",
        zIndex: 1,
        border: "1px solid",
        borderColor: "divider",
        animation: `${floatSlowAnimation} 4s ease-in-out infinite`,
      }}
    >
      {/* Browser Header */}
      <Box
        sx={{
          height: 16,
          bgcolor: "primary.main",
          display: "flex",
          alignItems: "center",
          px: 1.5,
          gap: 0.5,
        }}
      >
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.9)",
          }}
        />
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.9)",
          }}
        />
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.9)",
          }}
        />
      </Box>
      {/* Browser Body */}
      <Box
        sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* Top Row */}
        <Box sx={{ display: "flex", gap: 2, height: 45 }}>
          <Box sx={{ flex: 1, bgcolor: "grey.200", borderRadius: 1 }} />
          <Box
            sx={{
              flex: 1,
              bgcolor: "primary.main",
              borderRadius: 1,
              opacity: 0.9,
            }}
          />
          <Box sx={{ flex: 1, bgcolor: "grey.200", borderRadius: 1 }} />
        </Box>
        {/* Bottom Area */}
        <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
          <Box
            sx={{
              flex: 1.5,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: "85%",
                height: 6,
                bgcolor: "grey.300",
                borderRadius: 1,
              }}
            />
            <Box
              sx={{
                width: "100%",
                height: 6,
                bgcolor: "grey.300",
                borderRadius: 1,
              }}
            />
            <Box
              sx={{
                width: "90%",
                height: 6,
                bgcolor: "grey.300",
                borderRadius: 1,
              }}
            />
            <Box
              sx={{
                width: "75%",
                height: 6,
                bgcolor: "grey.300",
                borderRadius: 1,
              }}
            />
          </Box>
          <Box sx={{ flex: 1, bgcolor: "primary.main", borderRadius: 1 }} />
        </Box>
      </Box>
    </Paper>

    {/* Floating Elements (Connecting Lines simulated by border/positioning) */}
    {/* Connecting Line 1 */}
    <Box
      sx={{
        position: "absolute",
        top: 5,
        right: 38,
        width: 2,
        height: 25,
        bgcolor: "grey.400",
        transform: "rotate(25deg)",
        zIndex: 0,
      }}
    />
    {/* Floating Badge 1 */}
    <Paper
      elevation={4}
      sx={{
        position: "absolute",
        top: -20,
        right: 25,
        width: 40,
        height: 40,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "grey.300",
        zIndex: 2,
        animation: `${floatAnimation} 3s ease-in-out infinite`,
        animationDelay: "0s",
      }}
    >
      <MenuIcon sx={{ fontSize: 20, color: "primary.main" }} />
    </Paper>

    {/* Connecting Line 2 */}
    <Box
      sx={{
        position: "absolute",
        bottom: 40,
        left: 10,
        width: 2,
        height: 35,
        bgcolor: "grey.400",
        transform: "rotate(-15deg)",
        zIndex: 0,
      }}
    />
    {/* Floating Badge 2 */}
    <Paper
      elevation={4}
      sx={{
        position: "absolute",
        bottom: 10,
        left: -20,
        width: 40,
        height: 40,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "grey.300",
        zIndex: 2,
        animation: `${floatAnimation} 3.5s ease-in-out infinite`,
        animationDelay: "1s",
      }}
    >
      <MenuIcon sx={{ fontSize: 20, color: "primary.main" }} />
    </Paper>

    {/* Connecting Line 3 */}
    <Box
      sx={{
        position: "absolute",
        bottom: 15,
        right: 60,
        width: 2,
        height: 40,
        bgcolor: "grey.400",
        transform: "rotate(15deg)",
        zIndex: 0,
      }}
    />
    {/* Floating Badge 3 */}
    <Paper
      elevation={4}
      sx={{
        position: "absolute",
        bottom: -20,
        right: 45,
        width: 40,
        height: 40,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "grey.300",
        zIndex: 2,
        animation: `${floatAnimation} 2.8s ease-in-out infinite`,
        animationDelay: "0.5s",
      }}
    >
      <MenuIcon sx={{ fontSize: 20, color: "primary.main" }} />
    </Paper>
  </Box>
);

export default DynamicDashboardIllustration;
