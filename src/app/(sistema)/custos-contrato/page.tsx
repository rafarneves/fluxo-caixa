import {
    Box,
    Card,
    CardContent,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';

import PageHeader from '@/components/ui/PageHeader';
import ResponsiveGrid from '@/components/ui/ResponsiveGrid';
import StatCard from '@/components/ui/StatCard';
import { formatarMoedaServidor, getContextoConfiguracoes } from '@/lib/configuracoes-server';
import { createClient } from '@/lib/supabase/server';
import NovoCustoContrato from './components/NovoCustoContrato';

type Custo = {
    id: string;
    contrato_id: string;
    categoria: string;
    descricao: string | null;
    valor: number;
    contratos: { nome: string | null; clientes: { nome: string } | null } | null;
};
type Contrato = { id: string; nome: string | null; valor: number; clientes: { nome: string } | null };

export default async function CustosContratoPage() {
    const supabase = await createClient();
    const { configuracoes } = await getContextoConfiguracoes();
    const formatMoney = (value: number) => formatarMoedaServidor(value, configuracoes);
    const [{ data: custos }, { data: contratos }] = await Promise.all([
        supabase
            .from('custos_contrato')
            .select('*, contratos(nome, clientes(nome))')
            .order('created_at', { ascending: false }),
        supabase.from('contratos').select('id, nome, valor, clientes(nome)').eq('status', 'Ativo'),
    ]);
    const dados = (custos ?? []) as unknown as Custo[];
    const contratosData = (contratos ?? []) as unknown as Contrato[];
    const listaContratos = contratosData.map((contrato) => ({
        id: contrato.id,
        cliente: contrato.clientes?.nome ?? contrato.nome ?? 'Contrato',
    }));
    const total = dados.reduce((soma, custo) => soma + Number(custo.valor), 0);
    const ranking = contratosData
        .map((contrato) => {
            const receita = Number(contrato.valor ?? 0);
            const custo = dados
                .filter((item) => item.contrato_id === contrato.id)
                .reduce((soma, item) => soma + Number(item.valor), 0);
            const lucro = receita - custo;
            return {
                cliente: contrato.clientes?.nome ?? contrato.nome ?? 'Contrato',
                lucro,
                margem: receita === 0 ? 0 : (lucro / receita) * 100,
            };
        })
        .sort((a, b) => b.lucro - a.lucro)
        .slice(0, 3);
    return (
        <Stack component="main" spacing={4}>
            <PageHeader title="Custos por Contrato" description="Controle dos custos individuais de cada cliente." />
            <NovoCustoContrato contratos={listaContratos} />
            <ResponsiveGrid columns={3}>
                <StatCard titulo="Total de Custos" valor={formatMoney(total)} cor="red" />
                <StatCard titulo="Registros" valor={String(dados.length)} cor="green" />
                <StatCard titulo="Clientes com Custos" valor={String(ranking.length)} cor="blue" />
            </ResponsiveGrid>
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography component="h2" variant="h5" sx={{ mb: 2.5, fontWeight: 800 }}>
                        Top 3 Contratos Mais Lucrativos
                    </Typography>
                    <Stack spacing={1.5}>
                        {ranking.length === 0 ? (
                            <Typography color="text.secondary">Nenhum contrato disponível.</Typography>
                        ) : (
                            ranking.map((item, index) => (
                                <Paper key={item.cliente} variant="outlined" sx={{ p: 2 }}>
                                    <Stack
                                        direction="row"
                                        sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                                    >
                                        <Box>
                                            <Typography sx={{ fontWeight: 750 }}>
                                                {index + 1}º {item.cliente}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Margem {item.margem.toFixed(1)}%
                                            </Typography>
                                        </Box>
                                        <Typography
                                            sx={{
                                                color: item.lucro >= 0 ? 'primary.light' : 'error.main',
                                                fontSize: 19,
                                                fontWeight: 800,
                                            }}
                                        >
                                            {formatMoney(item.lucro)}
                                        </Typography>
                                    </Stack>
                                </Paper>
                            ))
                        )}
                    </Stack>
                </CardContent>
            </Card>
            <Card sx={{ mt: 3 }}>
                <Typography component="h2" variant="h5" sx={{ p: 3, fontWeight: 800 }}>
                    Histórico
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Categoria</TableCell>
                                <TableCell>Descrição</TableCell>
                                <TableCell>Cliente</TableCell>
                                <TableCell align="right">Valor</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dados.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                                        Nenhum custo cadastrado.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                dados.map((custo) => (
                                    <TableRow key={custo.id} hover>
                                        <TableCell>{custo.categoria}</TableCell>
                                        <TableCell>{custo.descricao ?? '-'}</TableCell>
                                        <TableCell>{custo.contratos?.clientes?.nome ?? '-'}</TableCell>
                                        <TableCell align="right" sx={{ color: 'error.main', fontWeight: 800 }}>
                                            {formatMoney(Number(custo.valor))}
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
