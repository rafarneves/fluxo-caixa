import type { ReactNode } from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

type ReportChartProps = {
    title: string;
    description?: string;
    children: ReactNode;
    actions?: ReactNode;
    height?: number;
};

export default function ReportChart({ title, description, children, actions, height = 420 }: ReportChartProps) {
    return (
        <Card component="section">
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 }, '&:last-child': { pb: { xs: 2.5, md: 3.5 } } }}>
                <Stack
                    direction={{ xs: 'column', lg: 'row' }}
                    spacing={2}
                    sx={{ mb: 3, justifyContent: 'space-between', alignItems: { lg: 'center' } }}
                >
                    <Box>
                        <Typography
                            variant="overline"
                            color="text.secondary"
                            sx={{ fontWeight: 800, letterSpacing: '.18em' }}
                        >
                            Análise
                        </Typography>
                        <Typography component="h2" variant="h5" sx={{ mt: 0.5, fontWeight: 800 }}>
                            {title}
                        </Typography>
                        {description && (
                            <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                                {description}
                            </Typography>
                        )}
                    </Box>
                    {actions && (
                        <Stack direction="row" spacing={1.5}>
                            {actions}
                        </Stack>
                    )}
                </Stack>
                <Box
                    sx={{
                        minHeight: height,
                        p: { xs: 1, sm: 2 },
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 3,
                        bgcolor: 'rgba(2,6,23,.25)',
                    }}
                >
                    {children}
                </Box>
            </CardContent>
        </Card>
    );
}
