import Link from 'next/link';
import AddRounded from '@mui/icons-material/AddRounded';
import {
    Box,
    Button,
    Card,
    Chip,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { pagarConta } from '@/actions/contasPagar';
import PageHeader from '@/components/ui/PageHeader';
import ResponsiveGrid from '@/components/ui/ResponsiveGrid';
import StatCard from '@/components/ui/StatCard';
import { formatarMoedaServidor, getContextoConfiguracoes } from '@/lib/configuracoes-server';
import { createClient } from '@/lib/supabase/server';

export default async function ContasPagarPage() {
    const supabase = await createClient();
    const { configuracoes } = await getContextoConfiguracoes();
    const formatMoney = (value: number) => formatarMoedaServidor(value, configuracoes);
    const { data: contas } = await supabase.from('contas_pagar').select('*').order('vencimento', { ascending: true });
    const lista = contas ?? [];
    const total = lista.reduce((acc, conta) => acc + Number(conta.valor), 0);
    const pendentes = lista.filter((conta) => conta.status === 'Pendente').length;
    const pagas = lista.filter((conta) => conta.status === 'Pago').length;
    return (
        <Stack component="main" spacing={4}>
            <PageHeader
                title="Contas a Pagar"
                description="Controle de despesas da empresa."
                actions={
                    <Button component={Link} href="/contas-pagar/nova" startIcon={<AddRounded />}>
                        Nova Conta
                    </Button>
                }
            />
            <ResponsiveGrid columns={3}>
                <StatCard titulo="Total" valor={formatMoney(total)} cor="red" />
                <StatCard titulo="Pendentes" valor={String(pendentes)} cor="yellow" />
                <StatCard titulo="Pagas" valor={String(pagas)} cor="green" />
            </ResponsiveGrid>
            <Card>
                <TableContainer>
                    <Table sx={{ minWidth: 760 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Descrição</TableCell>
                                <TableCell>Categoria</TableCell>
                                <TableCell>Valor</TableCell>
                                <TableCell>Vencimento</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Ação</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lista.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 7, color: 'text.secondary' }}>
                                        Nenhuma conta cadastrada.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                lista.map((conta) => (
                                    <TableRow key={conta.id} hover>
                                        <TableCell>{conta.descricao}</TableCell>
                                        <TableCell>{conta.categoria}</TableCell>
                                        <TableCell sx={{ color: 'error.main', fontWeight: 750 }}>
                                            {formatMoney(Number(conta.valor))}
                                        </TableCell>
                                        <TableCell>Dia {conta.vencimento}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={conta.status}
                                                size="small"
                                                sx={{
                                                    color: conta.status === 'Pago' ? '#4ade80' : '#fbbf24',
                                                    bgcolor:
                                                        conta.status === 'Pago'
                                                            ? 'rgba(34,197,94,.1)'
                                                            : 'rgba(234,179,8,.1)',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            {conta.status === 'Pago' ? (
                                                <Typography color="primary.light" sx={{ fontWeight: 700 }}>
                                                    Pago
                                                </Typography>
                                            ) : (
                                                <Box
                                                    component="form"
                                                    action={async () => {
                                                        'use server';
                                                        await pagarConta(
                                                            conta.id,
                                                            conta.descricao,
                                                            Number(conta.valor)
                                                        );
                                                    }}
                                                >
                                                    <Button type="submit" size="small" color="error">
                                                        Pagar
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
