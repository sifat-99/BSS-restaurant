import { Box, Paper, Avatar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LockIcon from "@mui/icons-material/Lock";
import { keyframes } from "@mui/system";

const floatSlowAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const pulseWidth = keyframes`
  0%, 100% { width: 70%; }
  50% { width: 40%; }
`;

const pulseWidthSmall = keyframes`
  0%, 100% { width: 50%; }
  50% { width: 30%; }
`;

const SecurityIllustration = () => (
    <Box
        sx={{ position: "relative", width: 280, height: 200, mx: "auto", mb: 6 }}
    >
        {/* Browser Window */}
        <Paper
            elevation={3}
            sx={{
                width: "100%",
                height: "100%",
                borderRadius: 2,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                animation: `${floatSlowAnimation} 4s ease-in-out infinite`,
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    height: 16,
                    bgcolor: "grey.200",
                    display: "flex",
                    alignItems: "center",
                    px: 1.5,
                    gap: 0.5,
                }}
            >
                <Box
                    sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "grey.400" }}
                />
                <Box
                    sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "grey.400" }}
                />
                <Box
                    sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "grey.400" }}
                />
            </Box>

            {/* Content rows */}
            <Box
                sx={{
                    flex: 1,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2.5,
                }}
            >
                {[1, 2, 3].map((item, index) => (
                    <Box
                        key={item}
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: index === 0 ? "primary.main" : "grey.300",
                            }}
                        />
                        <Box sx={{ flex: 1 }}>
                            <Box
                                sx={{
                                    width: "70%",
                                    height: 5,
                                    bgcolor: "grey.300",
                                    mb: 0.5,
                                    borderRadius: 1,
                                    animation: `${pulseWidth} 3s ease-in-out infinite`,
                                    animationDelay: `${index * 0.4}s`,
                                }}
                            />
                            <Box
                                sx={{
                                    width: "50%",
                                    height: 5,
                                    bgcolor: "grey.200",
                                    borderRadius: 1,
                                    animation: `${pulseWidthSmall} 3s ease-in-out infinite`,
                                    animationDelay: `${index * 0.4 + 0.2}s`,
                                }}
                            />
                        </Box>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                            <Box
                                sx={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: 1,
                                    bgcolor: index === 0 ? "primary.main" : "grey.100",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <EditIcon
                                    sx={{
                                        fontSize: 16,
                                        color: index === 0 ? "white" : "grey.500",
                                    }}
                                />
                            </Box>
                            <Box
                                sx={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: 1,
                                    bgcolor: index === 0 ? "primary.main" : "grey.100",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <VisibilityIcon
                                    sx={{
                                        fontSize: 16,
                                        color: index === 0 ? "white" : "grey.500",
                                    }}
                                />
                            </Box>
                            <Box
                                sx={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: 1,
                                    bgcolor: index === 0 ? "primary.main" : "grey.100",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <LockIcon
                                    sx={{
                                        fontSize: 16,
                                        color: index === 0 ? "white" : "grey.500",
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Paper>
    </Box>
);

export default SecurityIllustration;
