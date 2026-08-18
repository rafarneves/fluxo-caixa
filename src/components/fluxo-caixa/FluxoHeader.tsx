import Link from 'next/link';
import AddRounded from '@mui/icons-material/AddRounded';
import { Box, Button, Stack, Typography } from '@mui/material';

export default function FluxoHeader() {
    return (
        <Stack
            component="header"
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            sx={{ alignItems: { md: 'flex-start' }, justifyContent: 'space-between' }}
        >
            <Box>
                <Typography variant="overline" color="primary.light" sx={{ fontWeight: 800, letterSpacing: '.2em' }}>
                    Financeiro
                </Typography>
                <Typography
                    component="h1"
                    sx={{ mt: 0.5, fontSize: { xs: 32, sm: 42 }, fontWeight: 800, letterSpacing: '-.035em' }}
                >
                    Fluxo de Caixa
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 760, fontSize: { sm: 17 }, lineHeight: 1.7 }}>
                    Acompanhe todas as entradas, saídas, despesas e o resultado financeiro da empresa em tempo real.
                </Typography>
            </Box>
            <Button
                component={Link}
                href="/despesas/nova"
                startIcon={<AddRounded />}
                size="large"
                sx={{ width: { xs: '100%', sm: 'auto' }, flexShrink: 0 }}
            >
                Nova Despesa
            </Button>
        </Stack>
    );
}
