import type { ReactNode } from 'react';
import { Avatar, Box, Card, CardContent, Chip, LinearProgress, Stack, Typography } from '@mui/material';

type Props = {
    titulo: string;
    valor: string;
    subtitulo?: string;
    icone?: ReactNode;
    status?: string;
    tendencia?: string;
    progresso?: number;
    cor?: 'green' | 'red' | 'blue' | 'yellow';
};

const cores = {
    green: { main: '#4ade80', base: '#22c55e', soft: 'rgba(34,197,94,.11)', border: 'rgba(34,197,94,.22)' },
    red: { main: '#f87171', base: '#ef4444', soft: 'rgba(239,68,68,.11)', border: 'rgba(239,68,68,.22)' },
    blue: { main: '#22d3ee', base: '#06b6d4', soft: 'rgba(6,182,212,.11)', border: 'rgba(6,182,212,.22)' },
    yellow: { main: '#fbbf24', base: '#eab308', soft: 'rgba(234,179,8,.11)', border: 'rgba(234,179,8,.22)' },
};

export default function StatCard({
    titulo,
    valor,
    subtitulo,
    icone,
    status,
    tendencia,
    progresso,
    cor = 'green',
}: Props) {
    const tom = cores[cor];

    return (
        <Card
            sx={{
                minWidth: 0,
                height: '100%',
                borderColor: tom.border,
                // O brilho do canto e pintado no proprio fundo do card. Como elemento
                // absoluto ele vazava para fora das bordas arredondadas no mobile.
                backgroundImage: `radial-gradient(145px 145px at calc(100% + 10px) -20px, ${tom.soft} 0%, transparent 70%),
                    linear-gradient(180deg, rgba(23, 31, 43, 0.96), rgba(17, 24, 39, 0.96))`,
                '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 20px 55px ${tom.soft}` },
            }}
        >
            <CardContent
                sx={{ position: 'relative', p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}
            >
                <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="overline"
                            color="text.secondary"
                            sx={{ fontSize: 10, fontWeight: 800, letterSpacing: '.16em' }}
                        >
                            {titulo}
                        </Typography>
                        <Typography
                            sx={{
                                mt: 0.8,
                                color: tom.main,
                                fontSize: { xs: 25, sm: 29 },
                                lineHeight: 1.18,
                                fontWeight: 800,
                                overflowWrap: 'anywhere',
                            }}
                        >
                            {valor}
                        </Typography>
                        {subtitulo && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {subtitulo}
                            </Typography>
                        )}
                    </Box>
                    {icone && (
                        <Avatar
                            variant="rounded"
                            sx={{
                                width: 46,
                                height: 46,
                                color: tom.main,
                                bgcolor: tom.soft,
                            }}
                        >
                            {icone}
                        </Avatar>
                    )}
                </Stack>

                {(status || tendencia) && (
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mt: 2, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}
                    >
                        {status && (
                            <Chip
                                label={status}
                                size="small"
                                variant="outlined"
                                sx={{ color: tom.main, bgcolor: tom.soft, borderColor: tom.border }}
                            />
                        )}
                        {tendencia && (
                            <Typography variant="caption" sx={{ color: tom.main, fontWeight: 700 }}>
                                {tendencia}
                            </Typography>
                        )}
                    </Stack>
                )}

                {progresso !== undefined && cor !== 'red' && (
                    <LinearProgress
                        variant="determinate"
                        value={Math.min(Math.max(progresso, 0), 100)}
                        sx={{
                            mt: 2.5,
                            height: 7,
                            borderRadius: 99,
                            bgcolor: 'rgba(0,0,0,.28)',
                            '& .MuiLinearProgress-bar': { bgcolor: tom.base },
                        }}
                    />
                )}
            </CardContent>
        </Card>
    );
}
