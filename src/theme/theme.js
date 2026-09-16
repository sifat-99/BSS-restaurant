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
            main: '#38BDF8', // Light Blue (for accents)
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