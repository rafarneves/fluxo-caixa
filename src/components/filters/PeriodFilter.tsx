'use client';

import { useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import { Box, CircularProgress, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';

const periodos = [
    { value: 'hoje', label: 'Hoje' },
    { value: 'semana', label: 'Esta Semana' },
    { value: 'mes', label: 'Este Mês' },
    { value: '30dias', label: 'Últimos 30 dias' },
    { value: 'ano', label: 'Este Ano' },
    { value: 'personalizado', label: 'Personalizado' },
];

export default function PeriodFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const periodo = searchParams.get('periodo') ?? 'mes';
    const hoje = new Date();
    const dataLocalISO = (data: Date) =>
        `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
    const inicioPadrao = dataLocalISO(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
    const fimPadrao = dataLocalISO(hoje);
    const inicio = searchParams.get('inicio') ?? inicioPadrao;
    const fim = searchParams.get('fim') ?? fimPadrao;
    const navegar = (params: URLSearchParams) =>
        startTransition(() => router.replace(`${pathname}?${params.toString()}`, { scroll: false }));
    function alterarPeriodo(novoPeriodo: string) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('periodo', novoPeriodo);
        if (novoPeriodo === 'personalizado') {
            if (!params.get('inicio')) params.set('inicio', inicioPadrao);
            if (!params.get('fim')) params.set('fim', fimPadrao);
        } else {
            params.delete('inicio');
            params.delete('fim');
        }
        navegar(params);
    }
    function alterarData(campo: 'inicio' | 'fim', value: string) {
        if (!value) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set('periodo', 'personalizado');
        params.set(campo, value);
        const novoInicio = campo === 'inicio' ? value : inicio;
        const novoFim = campo === 'fim' ? value : fim;
        if (novoInicio > novoFim) params.set(campo === 'inicio' ? 'fim' : 'inicio', value);
        navegar(params);
    }

    return (
        <Stack spacing={1.5}>
            <Paper
                variant="outlined"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 0.75,
                    p: 0.75,
                    bgcolor: 'background.paper',
                }}
            >
                <ToggleButtonGroup
                    value={periodo}
                    exclusive
                    onChange={(_, value: string | null) => value && alterarPeriodo(value)}
                    size="small"
                    disabled={isPending}
                    sx={{
                        flexWrap: 'wrap',
                        gap: 0.5,
                        '& .MuiToggleButtonGroup-grouped': { m: 0, px: 2, border: 0, borderRadius: '10px !important' },
                        '& .Mui-selected': {
                            color: 'primary.light !important',
                            bgcolor: 'rgba(34,197,94,.14) !important',
                        },
                    }}
                >
                    {periodos.map((item) => (
                        <ToggleButton key={item.value} value={item.value}>
                            {item.label}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
                {isPending && <CircularProgress size={18} sx={{ mx: 1 }} />}
            </Paper>
            {periodo === 'personalizado' && (
                <Paper
                    variant="outlined"
                    sx={{ p: 2, borderColor: 'rgba(34,197,94,.22)', bgcolor: 'rgba(34,197,94,.045)' }}
                >
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' } }}>
                        <Box sx={{ display: { xs: 'none', sm: 'flex' }, color: 'primary.light' }}>
                            <CalendarMonthRounded />
                        </Box>
                        <TextField
                            type="date"
                            label="Data inicial"
                            value={inicio}
                            onChange={(event) => alterarData('inicio', event.target.value)}
                            disabled={isPending}
                            fullWidth
                            size="small"
                            slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: fim } }}
                        />
                        <TextField
                            type="date"
                            label="Data final"
                            value={fim}
                            onChange={(event) => alterarData('fim', event.target.value)}
                            disabled={isPending}
                            fullWidth
                            size="small"
                            slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: inicio } }}
                        />
                    </Stack>
                </Paper>
            )}
        </Stack>
    );
}
