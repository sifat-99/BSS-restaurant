import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

interface DynamicCardProps {
    title?: string;
    subTitle?: string;
    illustration?: ReactNode;
}

export const DynamicCard = ({ title, subTitle, illustration }: DynamicCardProps) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                color: "text.primary",
                padding: { xs: 4, md: 8 },
                textAlign: "center",
            }}
        >
            {illustration}

            <Typography
                variant="h3"
                sx={{
                    fontWeight: 700,
                    mb: 2.5,
                    color: "text.primary",
                    fontSize: { xs: "1.75rem", md: "2.25rem" },
                }}
            >
                {title}
            </Typography>

            <Typography
                variant="h6"
                sx={{
                    fontWeight: 500,
                    color: "text.secondary",
                    maxWidth: 550,
                    lineHeight: 1.6,
                    fontSize: { xs: "1rem", md: "1.125rem" },
                }}
            >
                {subTitle}
            </Typography>
        </Box>
    );
};
