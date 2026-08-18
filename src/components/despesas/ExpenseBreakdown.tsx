'use client';

import { Box, Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material';
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';

type Despesa = { categoria: string | null; valor: number };

export default function ExpenseBreakdown({ despesas }: { despesas: Despesa[] }) {
    const moeda = useConfiguracoes().formatarMoeda;
    const categorias = despesas.reduce((acc: Record<string, number>, despesa) => {
        const categoria = despesa.categoria || 'Outros';
        acc[categoria] = (acc[categoria] || 0) + Number(despesa.valor);
        return acc;
    }, {});
    const lista = Object.entries(categorias).sort((a, b) => b[1] - a[1]);
    const total = lista.reduce((acc, [, valor]) => acc + valor, 0);
    return (
        <Card component="section">
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 }, '&:last-child': { pb: { xs: 2.5, md: 3.5 } } }}>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: '.18em' }}>
                    Análise
                </Typography>
                <Typography component="h2" variant="h5" sx={{ mt: 0.5, fontWeight: 800 }}>
                    Despesas por Categoria
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.75, mb: 3 }}>
                    Distribuição dos custos operacionais.
                </Typography>
                {lista.length === 0 ? (
                    <Box
                        sx={{
                            py: 5,
                            border: 1,
                            borderStyle: 'dashed',
                            borderColor: 'divider',
                            borderRadius: 3,
                            color: 'text.secondary',
                            textAlign: 'center',
                        }}
                    >
                        Nenhuma despesa cadastrada.
                    </Box>
                ) : (
                    <Stack spacing={2.5}>
                        {lista.map(([categoria, valor]) => {
                            const percentual = total > 0 ? (valor / total) * 100 : 0;
                            return (
                                <Box key={categoria}>
                                    <Stack direction="row" sx={{ mb: 1, justifyContent: 'space-between' }}>
                                        <Typography sx={{ fontWeight: 650 }}>{categoria}</Typography>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography sx={{ color: 'error.main', fontWeight: 800 }}>
                                                {moeda(valor)}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {percentual.toFixed(1)}%
                                            </Typography>
                                        </Box>
                                    </Stack>
                                    <LinearProgress
                                        variant="determinate"
                                        value={percentual}
                                        sx={{ height: 8, borderRadius: 99, bgcolor: 'rgba(148,163,184,.12)' }}
                                    />
                                </Box>
                            );
                        })}
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
}
