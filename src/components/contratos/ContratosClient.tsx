'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import SearchRounded from '@mui/icons-material/SearchRounded';
import {
    Box,
    Button,
    Card,
    Grid,
    InputAdornment,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';

import { cancelarContrato } from '@/actions/contratos';
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';
import StatusBadge from '@/components/financeiro/StatusBadge';

type Contrato = {
    id: string;
    nome: string | null;
    valor: number;
    data_inicio: string | null;
    vencimento: number | null;
    status: string;
    clientes: { id: string; nome: string; loja: string | null } | null;
};
const normalizar = (valor: string) =>
    valor
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pt-BR')
        .trim();

export default function ContratosClient({ contratos }: { contratos: Contrato[] }) {
    const { formatarMoeda, formatarData } = useConfiguracoes();
    const [busca, setBusca] = useState('');
    const [statusFiltro, setStatusFiltro] = useState('todos');
    const [lojaFiltro, setLojaFiltro] = useState('todas');
    const lojas = useMemo(
        () =>
            Array.from(
                new Set(
                    contratos.map((contrato) => contrato.clientes?.loja).filter((loja): loja is string => Boolean(loja))
                )
            ).sort((a, b) => a.localeCompare(b, 'pt-BR')),
        [contratos]
    );
    const lista = useMemo(
        () =>
            contratos.filter((contrato) => {
                const termo = normalizar(busca);
                const correspondeBusca =
                    !termo ||
                    normalizar(contrato.clientes?.nome ?? '').includes(termo) ||
                    normalizar(contrato.clientes?.loja ?? '').includes(termo) ||
                    normalizar(contrato.nome ?? '').includes(termo);
                return (
                    correspondeBusca &&
                    (statusFiltro === 'todos' || contrato.status === statusFiltro) &&
                    (lojaFiltro === 'todas' || contrato.clientes?.loja === lojaFiltro)
                );
            }),
        [busca, contratos, lojaFiltro, statusFiltro]
    );
    return (
        <Stack spacing={2.5}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <TextField
                        type="search"
                        value={busca}
                        onChange={(event) => setBusca(event.target.value)}
                        label="Cliente, loja ou plano"
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
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <TextField
                        select
                        value={statusFiltro}
                        onChange={(event) => setStatusFiltro(event.target.value)}
                        label="Status"
                        fullWidth
                        size="small"
                    >
                        <MenuItem value="todos">Todos</MenuItem>
                        <MenuItem value="Ativo">Ativos</MenuItem>
                        <MenuItem value="Cancelado">Cancelados</MenuItem>
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <TextField
                        select
                        value={lojaFiltro}
                        onChange={(event) => setLojaFiltro(event.target.value)}
                        label="Loja"
                        fullWidth
                        size="small"
                    >
                        <MenuItem value="todas">Todas</MenuItem>
                        {lojas.map((loja) => (
                            <MenuItem key={loja} value={loja}>
                                {loja}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </Grid>
            <Typography variant="body2" color="text.secondary">
                {lista.length} de {contratos.length} contrato(s)
            </Typography>
            <Card>
                <TableContainer>
                    <Table sx={{ minWidth: 940 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Cliente</TableCell>
                                <TableCell>Loja</TableCell>
                                <TableCell>Plano</TableCell>
                                <TableCell>Valor</TableCell>
                                <TableCell>Início</TableCell>
                                <TableCell>Vencimento</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lista.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 7, color: 'text.secondary' }}>
                                        Nenhum contrato encontrado com os filtros atuais.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                lista.map((contrato) => (
                                    <TableRow key={contrato.id} hover>
                                        <TableCell>
                                            <Typography
                                                component={Link}
                                                href={`/clientes/${contrato.clientes?.id}`}
                                                sx={{
                                                    color: 'text.primary',
                                                    fontWeight: 750,
                                                    textDecoration: 'none',
                                                    '&:hover': { color: 'primary.light' },
                                                }}
                                            >
                                                {contrato.clientes?.nome ?? '-'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{contrato.clientes?.loja ?? '-'}</TableCell>
                                        <TableCell>
                                            <Typography
                                                component={Link}
                                                href={`/contratos/${contrato.id}`}
                                                sx={{
                                                    color: 'text.primary',
                                                    fontWeight: 750,
                                                    textDecoration: 'none',
                                                    '&:hover': { color: 'primary.light' },
                                                }}
                                            >
                                                {contrato.nome ?? '-'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ color: 'primary.light', fontWeight: 750 }}>
                                            {formatarMoeda(Number(contrato.valor))}
                                        </TableCell>
                                        <TableCell>
                                            {contrato.data_inicio ? formatarData(contrato.data_inicio) : '-'}
                                        </TableCell>
                                        <TableCell>Dia {contrato.vencimento}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={contrato.status} />
                                        </TableCell>
                                        <TableCell align="right">
                                            {contrato.status !== 'Cancelado' && (
                                                <Box component="form" action={cancelarContrato.bind(null, contrato.id)}>
                                                    <Button type="submit" size="small" variant="outlined" color="error">
                                                        Cancelar
                                                    </Button>
                                                </Box>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Stack>
    );
}
