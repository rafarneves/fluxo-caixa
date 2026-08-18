'use client';

import type { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';

type Props = { title: string; description?: string; actions?: ReactNode };

export default function PageHeader({ title, description, actions }: Props) {
    return (
        <Stack
            component="header"
            direction={{ xs: 'column', lg: 'row' }}
            spacing={3}
            sx={{ mb: { xs: 3, md: 4 }, alignItems: { lg: 'center' }, justifyContent: 'space-between' }}
        >
            <Box>
                <Typography
                    component="h1"
                    variant="h3"
                    sx={{ fontSize: { xs: 30, sm: 36 }, fontWeight: 800, letterSpacing: '-0.035em' }}
                >
                    {title}
                </Typography>
                {description && (
                    <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 760, lineHeight: 1.7 }}>
                        {description}
                    </Typography>
                )}
            </Box>
            {actions && (
                <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
                    {actions}
                </Stack>
            )}
        </Stack>
    );
}
