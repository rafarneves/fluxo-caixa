import { Box, Typography } from '@mui/material';

export default function RecebimentosHeader() {
    return (
        <Box component="header">
            <Typography variant="overline" color="primary.light" sx={{ fontWeight: 800, letterSpacing: '.2em' }}>
                Financeiro
            </Typography>
            <Typography
                component="h1"
                sx={{ mt: 0.5, fontSize: { xs: 32, sm: 42 }, fontWeight: 800, letterSpacing: '-.035em' }}
            >
                Recebimentos
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 760, fontSize: { sm: 17 }, lineHeight: 1.7 }}>
                Acompanhe os valores previstos, pagos e pendentes dos contratos ativos.
            </Typography>
        </Box>
    );
}
