'use client';

import { useMemo, useState } from 'react';
import SearchRounded from '@mui/icons-material/SearchRounded';
import WalletRounded from '@mui/icons-material/WalletRounded';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    InputAdornment,
    Pagination,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';
import Badge from '@/components/ui/Badge';

type Recebimento = {
    id: string;
    valor: number;
    vencimento: string;
    status: string | null;
    contratos: { nome: string | null; clientes: { nome: string } | null } | null;
};
const ITENS_POR_PAGINA = 10;
const normalizar = (valor: string) =>
    valor
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pt-BR')
        .trim();

export default function UpcomingReceivables({ recebimentos }: { recebimentos: Recebimento[] }) {
    const { formatarMoedaCompacta, formatarData } = useConfiguracoes();
    const [busca, setBusca] = useState('');
    const [pagina, setPagina] = useState(1);
    const termo = normalizar(busca);
    const filtrados = useMemo(
        () =>
            [...recebimentos]
                .filter(
                    (item) =>
                        item.status !== 'Pago' &&
                        (!termo ||
                            normalizar(item.contratos?.clientes?.nome ?? '').includes(termo) ||
                            normalizar(item.contratos?.nome ?? '').includes(termo))
                )
                .sort((a, b) => new Date(a.vencimento).getTime() - new Date(b.vencimento).getTime()),
        [recebimentos, termo]
    );
    const totalPaginas = Math.max(1, Math.ceil(filtrados.length / ITENS_POR_PAGINA));
    const paginaAtual = Math.min(pagina, totalPaginas);
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const lista = filtrados.slice(inicio, inicio + ITENS_POR_PAGINA);
    const total = filtrados.reduce((acc, item) => acc + Number(item.valor), 0);
    return (
        <Card component="section">
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    sx={{ mb: 3, justifyContent: 'space-between' }}
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
                            Próximos Recebimentos
                        </Typography>
                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                            Cobranças previstas para os próximos dias
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: { md: 'right' } }}>
                        <Typography sx={{ color: 'primary.light', fontSize: 28, fontWeight: 800 }}>
                            {formatarMoedaCompacta(total)}
                        </Typography>
                        <Typography variant="overline" color="text.secondary">
                            Total Previsto
                        </Typography>
                    </Box>
                </Stack>
                <TextField
                    type="search"
                    value={busca}
                    onChange={(event) => {
                        setBusca(event.target.value);
                        setPagina(1);
                    }}
                    label="Buscar por pessoa ou loja"
                    fullWidth
                    size="small"
                    sx={{ mb: 2.5 }}
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
                {lista.length === 0 ? (
                    <Paper
                        variant="outlined"
                        sx={{ py: 5, borderStyle: 'dashed', color: 'text.secondary', textAlign: 'center' }}
                    >
                        {termo ? 'Nenhum recebimento encontrado para a busca.' : 'Nenhum recebimento pendente.'}
                    </Paper>
                ) : (
                    <Stack spacing={1.25}>
                        {lista.map((item) => (
                            <Paper key={item.id} variant="outlined" sx={{ p: 2 }}>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                                >
                                    <Stack direction="row" spacing={1.5} sx={{ minWidth: 0, alignItems: 'center' }}>
                                        <Avatar
                                            variant="rounded"
                                            sx={{ color: 'primary.light', bgcolor: 'rgba(34,197,94,.1)' }}
                                        >
                                            <WalletRounded />
                                        </Avatar>
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography noWrap sx={{ fontWeight: 700 }}>
                                                {item.contratos?.clientes?.nome ?? 'Cliente'}
                                            </Typography>
                                            <Typography noWrap variant="body2" color="text.secondary">
                                                {item.contratos?.nome ?? 'Loja não informada'} ·{' '}
                                                {formatarData(item.vencimento)}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                    <Box sx={{ flexShrink: 0, textAlign: 'right' }}>
                                        <Typography sx={{ fontSize: 20, fontWeight: 800 }}>
                                            {formatarMoedaCompacta(Number(item.valor))}
                                        </Typography>
                                        <Badge color={item.status === 'Vencido' ? 'red' : 'yellow'}>
                                            {item.status ?? 'Pendente'}
                                        </Badge>
                                    </Box>
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>
                )}
                {filtrados.length > 0 && (
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        sx={{
                            mt: 3,
                            pt: 2.5,
                            borderTop: 1,
                            borderColor: 'divider',
                            alignItems: { sm: 'center' },
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            Exibindo {inicio + 1}–{Math.min(inicio + ITENS_POR_PAGINA, filtrados.length)} de{' '}
                            {filtrados.length}
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
            </CardContent>
        </Card>
    );
}
