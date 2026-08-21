'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ClearRounded from '@mui/icons-material/ClearRounded';
import LocationOnRounded from '@mui/icons-material/LocationOnRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import {
    Box,
    Button,
    Card,
    Chip,
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

import { inativarCliente } from '@/actions/clientes';
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';

type ContratoCliente = { id: string; valor: number; status: string; loja: string | null };
type Cliente = {
    id: string;
    nome: string;
    cidade: string | null;
    estado: string | null;
    bairro: string | null;
    status: string;
    contratos: ContratoCliente[] | null;
};
type FiltroStatus = 'todos' | 'ativo' | 'inativo';
const ITENS_POR_PAGINA = 10;
const normalizar = (valor: string) =>
    valor
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pt-BR')
        .trim();
// A loja e cadastrada no contrato, entao um cliente pode aparecer com mais de uma.
const lojasDoCliente = (cliente: Cliente) =>
    Array.from(
        new Set(
            (cliente.contratos ?? []).map((contrato) => contrato.loja).filter((loja): loja is string => Boolean(loja))
        )
    ).sort((a, b) => a.localeCompare(b, 'pt-BR'));

export default function ClientsTable({ clientes }: { clientes: Cliente[] }) {
    const { formatarMoeda } = useConfiguracoes();
    const [buscaNome, setBuscaNome] = useState('');
    const [buscaLocalizacao, setBuscaLocalizacao] = useState('');
    const [status, setStatus] = useState<FiltroStatus>('todos');
    const [pagina, setPagina] = useState(1);
    const clientesFiltrados = useMemo(() => {
        const nome = normalizar(buscaNome);
        const localizacao = normalizar(buscaLocalizacao);
        return clientes.filter((cliente) => {
            const statusCliente = normalizar(cliente.status ?? '');
            const correspondeNome =
                !nome ||
                normalizar(cliente.nome).includes(nome) ||
                normalizar(lojasDoCliente(cliente).join(' ')).includes(nome);
            const localizacaoCliente = normalizar(
                [cliente.bairro, cliente.cidade, cliente.estado].filter(Boolean).join(' ')
            );
            return (
                correspondeNome &&
                (!localizacao || localizacaoCliente.includes(localizacao)) &&
                (status === 'todos' || statusCliente === status)
            );
        });
    }, [buscaLocalizacao, buscaNome, clientes, status]);
    const totalPaginas = Math.max(1, Math.ceil(clientesFiltrados.length / ITENS_POR_PAGINA));
    const paginaAtual = Math.min(pagina, totalPaginas);
    const indiceInicial = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const lista = clientesFiltrados.slice(indiceInicial, indiceInicial + ITENS_POR_PAGINA);
    const possuiFiltros = Boolean(buscaNome || buscaLocalizacao || status !== 'todos');
    function limparFiltros() {
        setBuscaNome('');
        setBuscaLocalizacao('');
        setStatus('todos');
        setPagina(1);
    }

    return (
        <Card component="section">
            <Box sx={{ p: 2.5, borderBottom: 1, borderColor: 'divider' }}>
                <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                        <TextField
                            type="search"
                            value={buscaNome}
                            onChange={(event) => {
                                setBuscaNome(event.target.value);
                                setPagina(1);
                            }}
                            label="Nome ou loja"
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
                    <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                        <TextField
                            type="search"
                            value={buscaLocalizacao}
                            onChange={(event) => {
                                setBuscaLocalizacao(event.target.value);
                                setPagina(1);
                            }}
                            label="Localização"
                            fullWidth
                            size="small"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationOnRounded fontSize="small" />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6, xl: 2 }}>
                        <TextField
                            select
                            value={status}
                            onChange={(event) => {
                                setStatus(event.target.value as FiltroStatus);
                                setPagina(1);
                            }}
                            label="Status"
                            fullWidth
                            size="small"
                        >
                            <MenuItem value="todos">Todos</MenuItem>
                            <MenuItem value="ativo">Ativos</MenuItem>
                            <MenuItem value="inativo">Inativos</MenuItem>
                        </TextField>
                    </Grid>
                    {possuiFiltros && (
                        <Grid size={{ xs: 12, md: 6, xl: 2 }}>
                            <Button
                                type="button"
                                variant="outlined"
                                color="inherit"
                                startIcon={<ClearRounded />}
                                onClick={limparFiltros}
                                fullWidth
                            >
                                Limpar
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </Box>
            <TableContainer>
                <Table sx={{ minWidth: 940 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Loja</TableCell>
                            <TableCell>Localização</TableCell>
                            <TableCell>Contratos</TableCell>
                            <TableCell>Receita Mensal</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lista.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 7, color: 'text.secondary' }}>
                                    Nenhum cliente encontrado com os filtros selecionados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            lista.map((cliente) => {
                                const receita = (cliente.contratos ?? [])
                                    .filter((contrato) => contrato.status === 'Ativo')
                                    .reduce((total, contrato) => total + Number(contrato.valor), 0);
                                const ativo = normalizar(cliente.status) === 'ativo';
                                const localizacao = [cliente.cidade, cliente.estado].filter(Boolean).join(' - ');
                                return (
                                    <TableRow key={cliente.id} hover>
                                        <TableCell>
                                            <Typography
                                                component={Link}
                                                href={`/clientes/${cliente.id}`}
                                                sx={{
                                                    color: 'text.primary',
                                                    fontWeight: 750,
                                                    textDecoration: 'none',
                                                    '&:hover': { color: 'primary.light' },
                                                }}
                                            >
                                                {cliente.nome}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{lojasDoCliente(cliente).join(', ') || '-'}</TableCell>
                                        <TableCell>{localizacao || 'Sem localização'}</TableCell>
                                        <TableCell>{cliente.contratos?.length ?? 0}</TableCell>
                                        <TableCell sx={{ color: 'primary.light', fontWeight: 750 }}>
                                            {formatarMoeda(receita)}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={cliente.status}
                                                size="small"
                                                sx={{
                                                    color: ativo ? '#4ade80' : 'text.secondary',
                                                    bgcolor: ativo ? 'rgba(34,197,94,.1)' : 'rgba(113,113,122,.16)',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                                                <Button
                                                    component={Link}
                                                    href={`/clientes/${cliente.id}`}
                                                    size="small"
                                                    variant="outlined"
                                                >
                                                    Ver
                                                </Button>
                                                <Button
                                                    component={Link}
                                                    href={`/clientes/editar/${cliente.id}`}
                                                    size="small"
                                                    variant="outlined"
                                                    color="inherit"
                                                >
                                                    Editar
                                                </Button>
                                                {ativo && (
                                                    <form action={inativarCliente.bind(null, cliente.id)}>
                                                        <Button
                                                            type="submit"
                                                            size="small"
                                                            variant="outlined"
                                                            color="error"
                                                        >
                                                            Inativar
                                                        </Button>
                                                    </form>
                                                )}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {clientesFiltrados.length > 0 && (
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    sx={{
                        alignItems: { sm: 'center' },
                        justifyContent: 'space-between',
                        p: 2.5,
                        borderTop: 1,
                        borderColor: 'divider',
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        Exibindo {indiceInicial + 1}–
                        {Math.min(indiceInicial + ITENS_POR_PAGINA, clientesFiltrados.length)} de{' '}
                        {clientesFiltrados.length}
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
