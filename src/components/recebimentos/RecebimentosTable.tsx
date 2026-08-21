'use client';

import { useMemo, useState } from 'react';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import DescriptionRounded from '@mui/icons-material/DescriptionRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Grid,
    InputAdornment,
    MenuItem,
    Pagination,
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

import MarcarPago from '@/app/(sistema)/recebimentos/MarcarPago';
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';
import Badge from '@/components/ui/Badge';

type Recebimento = {
    id: string;
    competencia: string | null;
    valor: number;
    vencimento: string;
    status: string | null;
    contratos: { nome: string | null; loja: string | null; clientes: { nome: string } | null } | null;
};
type FiltroStatus = 'todos' | 'pago' | 'pendente' | 'atrasado' | 'receber_hoje';
type FiltroPeriodo = 'todos' | 'semanal' | 'mensal' | '6_meses' | 'personalizado';
const ITENS_POR_PAGINA = 10;
const normalizar = (valor: string) =>
    valor
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pt-BR')
        .trim();

export default function RecebimentosTable({ recebimentos }: { recebimentos: Recebimento[] }) {
    const { formatarMoeda, formatarData } = useConfiguracoes();
    const [buscaCliente, setBuscaCliente] = useState('');
    const [statusFiltro, setStatusFiltro] = useState<FiltroStatus>('todos');
    const [periodoFiltro, setPeriodoFiltro] = useState<FiltroPeriodo>('todos');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [pagina, setPagina] = useState(1);
    const recebimentosFiltrados = useMemo(() => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const dataHojeStr = hoje.toISOString().split('T')[0];
        let filtrados = [...recebimentos];
        if (buscaCliente) {
            const busca = normalizar(buscaCliente);
            filtrados = filtrados.filter(
                (item) =>
                    normalizar(item.contratos?.clientes?.nome ?? '').includes(busca) ||
                    normalizar(item.contratos?.loja ?? '').includes(busca)
            );
        }
        if (statusFiltro !== 'todos')
            filtrados = filtrados.filter((item) => {
                const dataVenc = new Date(`${item.vencimento}T00:00:00`);
                dataVenc.setHours(0, 0, 0, 0);
                if (statusFiltro === 'pago') return item.status === 'Pago';
                if (statusFiltro === 'pendente') return item.status !== 'Pago' && dataVenc >= hoje;
                if (statusFiltro === 'atrasado') return item.status !== 'Pago' && dataVenc < hoje;
                return item.status !== 'Pago' && item.vencimento === dataHojeStr;
            });
        if (periodoFiltro !== 'todos') {
            let inicio: Date | null = null;
            let fim: Date | null = null;
            if (periodoFiltro === 'semanal') {
                inicio = new Date(hoje);
                inicio.setDate(hoje.getDate() - 7);
                fim = new Date(hoje);
            } else if (periodoFiltro === 'mensal') {
                inicio = new Date(hoje);
                inicio.setMonth(hoje.getMonth() - 1);
                fim = new Date(hoje);
            } else if (periodoFiltro === '6_meses') {
                inicio = new Date(hoje);
                inicio.setMonth(hoje.getMonth() - 6);
                fim = new Date(hoje);
            } else if (dataInicio && dataFim) {
                inicio = new Date(`${dataInicio}T00:00:00`);
                fim = new Date(`${dataFim}T00:00:00`);
            }
            if (inicio && fim) {
                inicio.setHours(0, 0, 0, 0);
                fim.setHours(23, 59, 59, 999);
                filtrados = filtrados.filter((item) => {
                    const dataVenc = new Date(`${item.vencimento}T00:00:00`);
                    return dataVenc >= inicio! && dataVenc <= fim!;
                });
            }
        }
        return filtrados.sort((a, b) => new Date(b.vencimento).getTime() - new Date(a.vencimento).getTime());
    }, [buscaCliente, dataFim, dataInicio, periodoFiltro, recebimentos, statusFiltro]);
    const totalPaginas = Math.max(1, Math.ceil(recebimentosFiltrados.length / ITENS_POR_PAGINA));
    const paginaAtual = Math.min(pagina, totalPaginas);
    const indiceInicial = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const lista = recebimentosFiltrados.slice(indiceInicial, indiceInicial + ITENS_POR_PAGINA);
    const resetPagina = () => setPagina(1);

    return (
        <Card component="section">
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{ mb: 3, alignItems: 'center', justifyContent: 'space-between' }}
                >
                    <Box>
                        <Typography
                            variant="overline"
                            color="text.secondary"
                            sx={{ fontWeight: 800, letterSpacing: '.18em' }}
                        >
                            Financeiro
                        </Typography>
                        <Typography component="h2" variant="h5" sx={{ mt: 0.5, fontWeight: 800 }}>
                            Histórico de Cobranças
                        </Typography>
                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                            Todos os recebimentos cadastrados
                        </Typography>
                    </Box>
                    <Avatar variant="rounded" sx={{ color: 'primary.light', bgcolor: 'rgba(34,197,94,.1)' }}>
                        <DescriptionRounded />
                    </Avatar>
                </Stack>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                        <TextField
                            label="Buscar"
                            value={buscaCliente}
                            onChange={(event) => {
                                setBuscaCliente(event.target.value);
                                resetPagina();
                            }}
                            placeholder="Cliente ou loja"
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
                    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                        <TextField
                            select
                            label="Status"
                            value={statusFiltro}
                            onChange={(event) => {
                                setStatusFiltro(event.target.value as FiltroStatus);
                                resetPagina();
                            }}
                            fullWidth
                            size="small"
                        >
                            <MenuItem value="todos">Todos</MenuItem>
                            <MenuItem value="pago">Pagos</MenuItem>
                            <MenuItem value="pendente">Pendentes</MenuItem>
                            <MenuItem value="atrasado">Atrasados</MenuItem>
                            <MenuItem value="receber_hoje">Receber Hoje</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                        <TextField
                            select
                            label="Período de Vencimento"
                            value={periodoFiltro}
                            onChange={(event) => {
                                setPeriodoFiltro(event.target.value as FiltroPeriodo);
                                resetPagina();
                            }}
                            fullWidth
                            size="small"
                        >
                            <MenuItem value="todos">Todos</MenuItem>
                            <MenuItem value="semanal">Últimos 7 dias</MenuItem>
                            <MenuItem value="mensal">Último mês</MenuItem>
                            <MenuItem value="6_meses">Últimos 6 meses</MenuItem>
                            <MenuItem value="personalizado">Personalizado</MenuItem>
                        </TextField>
                    </Grid>
                    {periodoFiltro === 'personalizado' && (
                        <>
                            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                <TextField
                                    type="date"
                                    label="Data Inicial"
                                    value={dataInicio}
                                    onChange={(event) => {
                                        setDataInicio(event.target.value);
                                        resetPagina();
                                    }}
                                    fullWidth
                                    size="small"
                                    slotProps={{ inputLabel: { shrink: true } }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                <TextField
                                    type="date"
                                    label="Data Final"
                                    value={dataFim}
                                    onChange={(event) => {
                                        setDataFim(event.target.value);
                                        resetPagina();
                                    }}
                                    fullWidth
                                    size="small"
                                    slotProps={{ inputLabel: { shrink: true } }}
                                />
                            </Grid>
                        </>
                    )}
                </Grid>
            </CardContent>
            <TableContainer>
                <Table sx={{ minWidth: 960 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Loja</TableCell>
                            <TableCell>Plano</TableCell>
                            <TableCell>Competência</TableCell>
                            <TableCell>Valor</TableCell>
                            <TableCell>Vencimento</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lista.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 7, color: 'text.secondary' }}>
                                    Nenhuma cobrança encontrada com os filtros atuais.
                                </TableCell>
                            </TableRow>
                        ) : (
                            lista.map((item) => (
                                <TableRow key={item.id} hover>
                                    <TableCell>
                                        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                                            <Avatar
                                                variant="rounded"
                                                sx={{
                                                    width: 38,
                                                    height: 38,
                                                    color: 'primary.light',
                                                    bgcolor: 'rgba(34,197,94,.1)',
                                                    fontSize: 15,
                                                }}
                                            >
                                                {(item.contratos?.clientes?.nome ?? 'C').charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                    {item.contratos?.clientes?.nome ?? '-'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Cliente
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>{item.contratos?.loja ?? '-'}</TableCell>
                                    <TableCell>{item.contratos?.nome ?? '-'}</TableCell>
                                    <TableCell>{item.competencia ?? '-'}</TableCell>
                                    <TableCell sx={{ color: 'primary.light', fontWeight: 750 }}>
                                        {formatarMoeda(Number(item.valor))}
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                                            <CalendarMonthRounded fontSize="small" />
                                            {formatarData(item.vencimento)}
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Badge color={item.status === 'Pago' ? 'green' : 'yellow'}>
                                            {item.status === 'Pago' ? 'Pago' : 'Pendente'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell align="center">
                                        {item.status !== 'Pago' && <MarcarPago id={item.id} />}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {recebimentosFiltrados.length > 0 && (
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    sx={{
                        alignItems: { sm: 'center' },
                        justifyContent: 'space-between',
                        px: 3,
                        py: 2.5,
                        borderTop: 1,
                        borderColor: 'divider',
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        Exibindo {indiceInicial + 1}–
                        {Math.min(indiceInicial + ITENS_POR_PAGINA, recebimentosFiltrados.length)} de{' '}
                        {recebimentosFiltrados.length}
                    </Typography>
                    <Pagination
                        count={totalPaginas}
                        page={paginaAtual}
                        onChange={(_, value) => setPagina(value)}
                        color="primary"
                        shape="rounded"
                    />
                </Stack>
            )}
        </Card>
    );
}
