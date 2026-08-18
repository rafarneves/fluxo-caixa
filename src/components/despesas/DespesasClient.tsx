'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import AddRounded from '@mui/icons-material/AddRounded';
import { Box, Button, Card, CardContent, Chip, Grid, Paper, Stack, TextField, Typography } from '@mui/material';

import ExcluirDespesa from '@/app/(sistema)/despesas/ExcluirDespesa';
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';
import ExpenseBreakdown from '@/components/despesas/ExpenseBreakdown';
import ExpenseSummary from '@/components/despesas/ExpenseSummary';

type Despesa = {
    id: string;
    descricao: string;
    categoria: string;
    tipo: string;
    dia_vencimento: number | null;
    valor: number;
    data?: string;
    created_at?: string;
};

export default function DespesasClient({ despesas }: { despesas: Despesa[] }) {
    const { formatarMoeda, formatarData } = useConfiguracoes();
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const dadosFiltrados = useMemo(() => {
        if (!dataInicio || !dataFim) return despesas;
        const inicio = new Date(`${dataInicio}T00:00:00`);
        const fim = new Date(`${dataFim}T00:00:00`);
        fim.setHours(23, 59, 59, 999);
        return despesas.filter(
            (item) =>
                !item.data || (new Date(`${item.data}T00:00:00`) >= inicio && new Date(`${item.data}T00:00:00`) <= fim)
        );
    }, [dataFim, dataInicio, despesas]);
    const total = dadosFiltrados.reduce((acc, item) => acc + Number(item.valor), 0);
    const fixas = dadosFiltrados
        .filter((item) => item.tipo === 'Fixa')
        .reduce((acc, item) => acc + Number(item.valor), 0);
    const variaveis = dadosFiltrados
        .filter((item) => item.tipo === 'Variável')
        .reduce((acc, item) => acc + Number(item.valor), 0);
    return (
        <Stack spacing={4}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <TextField
                        type="date"
                        label="Data Inicial"
                        value={dataInicio}
                        onChange={(event) => setDataInicio(event.target.value)}
                        fullWidth
                        size="small"
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <TextField
                        type="date"
                        label="Data Final"
                        value={dataFim}
                        onChange={(event) => setDataFim(event.target.value)}
                        fullWidth
                        size="small"
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                </Grid>
            </Grid>
            <ExpenseSummary total={total} quantidade={dadosFiltrados.length} fixas={fixas} variaveis={variaveis} />
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, xl: 8 }}>
                    <Card component="section">
                        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={2}
                                sx={{ mb: 3, alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
                            >
                                <Box>
                                    <Typography component="h2" variant="h5" sx={{ fontWeight: 800 }}>
                                        Lista de Despesas
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                                        {dadosFiltrados.length} lançamento(s)
                                    </Typography>
                                </Box>
                                <Button component={Link} href="/despesas/nova" startIcon={<AddRounded />}>
                                    Nova Despesa
                                </Button>
                            </Stack>
                            {dadosFiltrados.length === 0 ? (
                                <Paper
                                    variant="outlined"
                                    sx={{ py: 5, borderStyle: 'dashed', color: 'text.secondary', textAlign: 'center' }}
                                >
                                    Nenhuma despesa encontrada para este período.
                                </Paper>
                            ) : (
                                <Stack spacing={1.5}>
                                    {dadosFiltrados.map((despesa) => (
                                        <Paper key={despesa.id} variant="outlined" sx={{ p: 2.25 }}>
                                            <Stack
                                                direction={{ xs: 'column', sm: 'row' }}
                                                spacing={2}
                                                sx={{ justifyContent: 'space-between' }}
                                            >
                                                <Box>
                                                    <Typography sx={{ fontWeight: 750 }}>
                                                        {despesa.descricao}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                        {despesa.categoria}
                                                    </Typography>
                                                    <Chip
                                                        label={
                                                            despesa.tipo === 'Fixa'
                                                                ? `Fixa · Todo dia ${despesa.dia_vencimento}`
                                                                : 'Variável'
                                                        }
                                                        size="small"
                                                        sx={{
                                                            mt: 1.5,
                                                            color: despesa.tipo === 'Fixa' ? '#fbbf24' : '#22d3ee',
                                                            bgcolor:
                                                                despesa.tipo === 'Fixa'
                                                                    ? 'rgba(234,179,8,.1)'
                                                                    : 'rgba(6,182,212,.1)',
                                                        }}
                                                    />
                                                </Box>
                                                <Box sx={{ textAlign: { sm: 'right' } }}>
                                                    <Typography
                                                        sx={{ color: 'error.main', fontSize: 22, fontWeight: 800 }}
                                                    >
                                                        {formatarMoeda(Number(despesa.valor))}
                                                    </Typography>
                                                    {despesa.tipo === 'Variável' && despesa.data && (
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{ mt: 0.5 }}
                                                        >
                                                            {formatarData(despesa.data)}
                                                        </Typography>
                                                    )}
                                                    <Stack
                                                        direction="row"
                                                        spacing={1}
                                                        sx={{ mt: 1.5, justifyContent: { sm: 'flex-end' } }}
                                                    >
                                                        <Button
                                                            component={Link}
                                                            href={`/despesas/${despesa.id}`}
                                                            size="small"
                                                            variant="outlined"
                                                            color="inherit"
                                                        >
                                                            Editar
                                                        </Button>
                                                        <ExcluirDespesa id={despesa.id} />
                                                    </Stack>
                                                </Box>
                                            </Stack>
                                        </Paper>
                                    ))}
                                </Stack>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, xl: 4 }}>
                    <ExpenseBreakdown despesas={dadosFiltrados} />
                </Grid>
            </Grid>
        </Stack>
    );
}
