import { createTheme } from '@mui/material/styles';


export const spicyTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#EA580C', // Burnt Orange
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#22C55E', // Fresh Green
        },
        background: {
            default: '#FAFAF9', // Off-White/Cream
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1C1917', // Deep Charcoal
            secondary: '#57534E',
        },
    },
    // typography: {
    //     fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    //     button: {
    //         textTransform: 'none', // বাটনের টেক্সট সব বড় হাতের হওয়া বন্ধ করতে
    //         fontWeight: 600,
    //     },
    // },
    // shape: {
    //     borderRadius: 8, // কার্ড এবং বাটনের বর্ডার কিছুটা রাউন্ডেড করতে
    // },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                "*::-webkit-scrollbar": {
                    width: "8px",
                    height: "8px",
                    borderRadius: "none"
                },
                "*::-webkit-scrollbar-track": {
                    backgroundColor: "#FAFAF9", // background.default
                },
                "*::-webkit-scrollbar-thumb": {
                    backgroundColor: "#EA580C", // primary.main
                    borderRadius: "4px",
                },
                "*::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#C2410C", // darker shade
                },
            },
        },
    },
});

// ২. Modern & Elegant (Clean & Professional)
export const modernTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#047857', // Emerald Green
        },
        secondary: {
            main: '#F59E0B', // Golden Yellow
        },
        background: {
            default: '#F8FAFC', // Soft Slate
            paper: '#FFFFFF',
        },
        text: {
            primary: '#0F172A', // Deep Navy
            secondary: '#64748B', // Slate 500
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                "*::-webkit-scrollbar": {
                    width: "8px",
                    height: "8px",
                },
                "*::-webkit-scrollbar-track": {
                    backgroundColor: "#F8FAFC", // background.default
                },
                "*::-webkit-scrollbar-thumb": {
                    backgroundColor: "#047857", // primary.main
                    borderRadius: "4px",
                },
                "*::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#065F46", // darker shade
                },
            },
        },
    },
});

// ৩. Premium Dark Mode
export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#F59E0B', // Warm Amber
        },
        secondary: {
            main: '#ffb677ff', // Light Blue (for accents)
        },
        background: {
            default: '#0F172A', // Dark Slate
            paper: '#1E293B', // Surface Slate
        },
        text: {
            primary: '#F3F4F6', // Light Gray
            secondary: '#9CA3AF', // Gray 400
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                "*::-webkit-scrollbar": {
                    width: "8px",
                    height: "8px",
                },
                "*::-webkit-scrollbar-track": {
                    backgroundColor: "#0F172A", // background.default
                },
                "*::-webkit-scrollbar-thumb": {
                    backgroundColor: "#F59E0B", // primary.main
                    borderRadius: "4px",
                },
                "*::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#D97706", // darker shade
                },
            },
        },
    },
});

// ১. Pure Dark OLED Mode (Fine Dining / Premium)
export const pureDarkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#D4AF37', // Metallic Gold (Premium Feel)
        },
        secondary: {
            main: '#E63946', // Elegant Crimson Red (Appetizing accent)
        },
        background: {
            default: '#000000', // Pure Black
            paper: '#121212', // Slightly lighter black for cards/surfaces
        },
        text: {
            primary: '#FFFFFF', // Pure White
            secondary: '#A3A3A3', // Neutral Gray
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                "*::-webkit-scrollbar": {
                    width: "8px",
                    height: "8px",
                },
                "*::-webkit-scrollbar-track": {
                    backgroundColor: "#000000",
                },
                "*::-webkit-scrollbar-thumb": {
                    backgroundColor: "#D4AF37",
                    borderRadius: "4px",
                },
                "*::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#B5952F",
                },
            },
        },
    },
});

// ২. Spicy Charcoal Mode (Fast Food / BBQ)
export const spicyDarkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#FF4500', // Orange Red (Fiery & Appetizing)
        },
        secondary: {
            main: '#FFB703', // Warm Yellow
        },
        background: {
            default: '#1A1210', // Very dark warm brownish-black
            paper: '#2D1F1A', // Dark charcoal brown for cards
        },
        text: {
            primary: '#FFF5EE', // Seashell White
            secondary: '#D3B8AE', // Muted warm gray
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                "*::-webkit-scrollbar": {
                    width: "8px",
                    height: "8px",
                },
                "*::-webkit-scrollbar-track": {
                    backgroundColor: "#1A1210",
                },
                "*::-webkit-scrollbar-thumb": {
                    backgroundColor: "#FF4500",
                    borderRadius: "4px",
                },
                "*::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#CC3700",
                },
            },
        },
    },
});

// ৩. Fresh Midnight Mode (Cafe / Organic / Healthy Food)
export const modernDarkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#10B981', // Emerald Green (Freshness)
        },
        secondary: {
            main: '#FBBF24', // Soft Amber (For ratings, highlights)
        },
        background: {
            default: '#0F172A', // Deep Slate / Midnight Blue
            paper: '#1E293B', // Lighter Slate for elements
        },
        text: {
            primary: '#F8FAFC', // Slate White
            secondary: '#94A3B8', // Slate Gray
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                "*::-webkit-scrollbar": {
                    width: "8px",
                    height: "8px",
                },
                "*::-webkit-scrollbar-track": {
                    backgroundColor: "#0F172A",
                },
                "*::-webkit-scrollbar-thumb": {
                    backgroundColor: "#10B981",
                    borderRadius: "4px",
                },
                "*::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#059669",
                },
            },
        },
    },
});
