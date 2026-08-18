import type { ReactNode } from 'react';
import Link from 'next/link';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import { Box, Button, Stack, Typography } from '@mui/material';

type ReportHeaderProps = { title: string; description?: string; actions?: ReactNode; backHref?: string | false };

export default function ReportHeader({ title, description, actions, backHref = '/relatorios' }: ReportHeaderProps) {
    return (
        <Stack
            component="header"
            direction={{ xs: 'column', lg: 'row' }}
            spacing={3}
            sx={{ alignItems: { lg: 'center' }, justifyContent: 'space-between' }}
        >
            <Box>
                {backHref && (
                    <Button
                        component={Link}
                        href={backHref}
                        data-export-ignore
                        variant="outlined"
                        color="inherit"
                        startIcon={<ArrowBackRounded />}
                        sx={{ mb: 2.5, color: 'text.secondary', borderColor: 'divider' }}
                    >
                        Voltar
                    </Button>
                )}
                <Typography
                    variant="overline"
                    color="primary.light"
                    sx={{ display: 'block', fontWeight: 800, letterSpacing: '.2em' }}
                >
                    Relatórios
                </Typography>
                <Typography
                    component="h1"
                    sx={{ mt: 0.5, fontSize: { xs: 30, sm: 36 }, fontWeight: 800, letterSpacing: '-.035em' }}
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
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                    {actions}
                </Stack>
            )}
        </Stack>
    );
}
