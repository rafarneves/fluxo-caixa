import Image from 'next/image';
import { Box, Card, CardContent, Container, Typography } from '@mui/material';

import LoginForm from './LoginForm';

export default function LoginPage() {
    return (
        <Box component="main" sx={{ display: 'grid', minHeight: '100dvh', placeItems: 'center', px: 2, py: 5, bgcolor: '#080b0f', backgroundImage: 'radial-gradient(circle at 50% 10%, rgba(34,197,94,.08), transparent 30rem)' }}>
            <Container maxWidth="xs" disableGutters>
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                    <Image src="/logo-altuza-horizontal.png" alt="Altuza" width={210} height={70} priority style={{ width: 190, height: 'auto' }} />
                </Box>
                <Card sx={{ borderRadius: 3, boxShadow: '0 28px 80px rgba(0,0,0,.32)' }}>
                    <CardContent sx={{ p: { xs: 3, sm: 4 }, '&:last-child': { pb: { xs: 3, sm: 4 } } }}>
                        <Typography variant="overline" color="primary.light" sx={{ fontWeight: 800, letterSpacing: '.2em' }}>Acesso seguro</Typography>
                        <Typography component="h1" variant="h4" sx={{ mt: .75, fontWeight: 800 }}>Bem-vindo de volta</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>Entre com o usuário administrador cadastrado no Supabase.</Typography>
                        <LoginForm />
                    </CardContent>
                </Card>
                <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 3, textAlign: 'center' }}>Altuza ERP · Ambiente administrativo</Typography>
            </Container>
        </Box>
    );
}
