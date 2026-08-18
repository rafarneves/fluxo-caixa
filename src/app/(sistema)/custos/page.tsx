import {
    Card,
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
import ExcluirCusto from './components/ExcluirCusto';
import NovoCusto from './components/NovoCusto';

type Custo = {
    id: string;
    descricao: string;
    valor: number;
    contratos: { nome: string | null; clientes: { nome: string } | null } | null;
};
type Contrato = { id: string; nome: string | null; clientes: { nome: string } | null };

export default async function CustosPage() {
    const supabase = await createClient();
    const { configuracoes } = await getContextoConfiguracoes();
    const formatMoney = (value: number) => formatarMoedaServidor(value, configuracoes);
    const [{ data: custos }, { data: contratos }] = await Promise.all([
        supabase
            .from('custos_contrato')
            .select('*, contratos(nome, clientes(nome))')
            .order('created_at', { ascending: false }),
        supabase.from('contratos').select('id, nome, clientes(nome)').eq('status', 'Ativo'),
    ]);
    const dados = (custos ?? []) as unknown as Custo[];
    const listaContratos = ((contratos ?? []) as unknown as Contrato[]).map((contrato) => ({
        id: contrato.id,
        cliente: contrato.clientes?.nome ?? contrato.nome ?? 'Contrato',
    }));
    const total = dados.reduce((soma, custo) => soma + Number(custo.valor), 0);
    return (
        <Stack component="main" spacing={4}>
            <PageHeader title="Custos" description="Controle de custos dos contratos." />
            <NovoCusto contratos={listaContratos} />
            <ResponsiveGrid columns={2}>
                <StatCard titulo="Total Custos" valor={formatMoney(total)} cor="red" />
                <StatCard titulo="Registros" valor={String(dados.length)} cor="green" />
            </ResponsiveGrid>
            <Card sx={{ mt: 3 }}>
                <Typography component="h2" variant="h5" sx={{ p: 3, fontWeight: 800 }}>
                    Histórico de Custos
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Descrição</TableCell>
                                <TableCell>Contrato</TableCell>
                                <TableCell align="right">Valor</TableCell>
                                <TableCell align="center">Ações</TableCell>
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
                                        <TableCell>{custo.descricao}</TableCell>
                                        <TableCell>{custo.contratos?.clientes?.nome ?? '-'}</TableCell>
                                        <TableCell align="right" sx={{ color: 'error.main', fontWeight: 800 }}>
                                            {formatMoney(Number(custo.valor))}
                                        </TableCell>
                                        <TableCell align="center">
                                            <ExcluirCusto id={custo.id} />
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
