'use client';

import { useMemo, useState } from 'react';
import SearchRounded from '@mui/icons-material/SearchRounded';
import { Grid, InputAdornment, Stack, TextField } from '@mui/material';
import EntradasCard from '@/components/fluxo-caixa/EntradasCard';
import FluxoChart from '@/components/fluxo-caixa/FluxoChart';
import FluxoSummary from '@/components/fluxo-caixa/FluxoSummary';
import SaidasCard from '@/components/fluxo-caixa/SaidasCard';

type Recebimento = {
    id: string;
    valor: number;
    vencimento: string;
    status: string;
    contratos: { nome: string | null; clientes: { nome: string; loja: string | null } | null } | null;
};
type Despesa = {
    id: string;
    descricao: string;
    categoria: string;
    tipo: string;
    dia_vencimento: number | null;
    valor: number;
    data?: string;
};
type Custo = { id: string; valor: number; data?: string };
const normalizar = (valor: string) =>
    valor
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pt-BR')
        .trim();

export default function FluxoCaixaClient({
    recebimentos,
    despesas,
    custos,
}: {
    recebimentos: Recebimento[];
    despesas: Despesa[];
    custos: Custo[];
}) {
    const [busca, setBusca] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const filtrados = useMemo(() => {
        let rec = recebimentos;
        let desp = despesas;
        let cust = custos;
        if (dataInicio && dataFim) {
            const inicio = new Date(`${dataInicio}T00:00:00`);
            const fim = new Date(`${dataFim}T00:00:00`);
            fim.setHours(23, 59, 59, 999);
            rec = rec.filter(
                (item) =>
                    !item.vencimento ||
                    (new Date(`${item.vencimento}T00:00:00`) >= inicio &&
                        new Date(`${item.vencimento}T00:00:00`) <= fim)
            );
            desp = desp.filter(
                (item) =>
                    !item.data ||
                    (new Date(`${item.data}T00:00:00`) >= inicio && new Date(`${item.data}T00:00:00`) <= fim)
            );
            cust = cust.filter(
                (item) =>
                    !item.data ||
                    (new Date(`${item.data}T00:00:00`) >= inicio && new Date(`${item.data}T00:00:00`) <= fim)
            );
        }
        if (busca) {
            const termo = normalizar(busca);
            rec = rec.filter(
                (item) =>
                    normalizar(item.contratos?.clientes?.nome ?? '').includes(termo) ||
                    normalizar(item.contratos?.clientes?.loja ?? '').includes(termo) ||
                    normalizar(item.contratos?.nome ?? '').includes(termo)
            );
            desp = desp.filter(
                (item) => normalizar(item.descricao).includes(termo) || normalizar(item.categoria).includes(termo)
            );
        }
        return { recebimentos: rec, despesas: desp, custos: cust };
    }, [busca, custos, dataFim, dataInicio, despesas, recebimentos]);
    const entradas = filtrados.recebimentos.reduce((total, item) => total + Number(item.valor), 0);
    const despesasFixas = filtrados.despesas
        .filter((item) => item.tipo === 'Fixa')
        .reduce((total, item) => total + Number(item.valor), 0);
    const despesasVariaveis = filtrados.despesas
        .filter((item) => item.tipo === 'Variável')
        .reduce((total, item) => total + Number(item.valor), 0);
    const custosContratos = filtrados.custos.reduce((total, item) => total + Number(item.valor), 0);
    const resultado = entradas - despesasFixas - despesasVariaveis - custosContratos;
    return (
        <Stack spacing={{ xs: 3, sm: 4 }} sx={{ minWidth: 0 }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                        type="search"
                        value={busca}
                        onChange={(event) => setBusca(event.target.value)}
                        label="Pessoa, loja ou descrição"
                        fullWidth
                        size="small"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchRounded fontSize="small" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
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
                <Grid size={{ xs: 12, md: 4 }}>
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
            <FluxoSummary
                entradas={entradas}
                despesasFixas={despesasFixas}
                despesasVariaveis={despesasVariaveis}
                custosContratos={custosContratos}
                resultado={resultado}
            />
            <FluxoChart recebimentos={filtrados.recebimentos} despesas={filtrados.despesas} />
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, xl: 6 }}>
                    <EntradasCard recebimentos={filtrados.recebimentos} />
                </Grid>
                <Grid size={{ xs: 12, xl: 6 }}>
                    <SaidasCard despesas={filtrados.despesas} />
                </Grid>
            </Grid>
        </Stack>
    );
}
