import Link from 'next/link';
import AddRounded from '@mui/icons-material/AddRounded';
import CardGiftcardRounded from '@mui/icons-material/CardGiftcardRounded';
import GroupsRounded from '@mui/icons-material/GroupsRounded';
import TrendingUpRounded from '@mui/icons-material/TrendingUpRounded';
import { Button, Card, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import PageHeader from '@/components/ui/PageHeader';
import ResponsiveGrid from '@/components/ui/ResponsiveGrid';
import StatCard from '@/components/ui/StatCard';
import { formatarMoedaServidor, getContextoConfiguracoes } from '@/lib/configuracoes-server';
import { createClient } from '@/lib/supabase/server';

type Indicacao = {
    id: string;
    cliente_indicador: string | null;
    cliente_indicado: string | null;
    valor_desconto: number;
    status: string;
    indicador: { nome: string } | null;
    indicado: { nome: string } | null;
};
type IndicacaoComStatus = Indicacao & { beneficioAtivo: boolean };

export default async function IndicacoesPage() {
    const supabase = await createClient();
    const { configuracoes } = await getContextoConfiguracoes();
    const formatMoney = (value: number) => formatarMoedaServidor(value, configuracoes);
    const { data } = await supabase
        .from('indicacoes')
        .select('*, indicador:cliente_indicador(nome), indicado:cliente_indicado(nome)')
        .order('created_at', { ascending: false });
    const indicacoes = (data ?? []) as unknown as Indicacao[];
    const clientesIndicados = [
        ...new Set(indicacoes.map((item) => item.cliente_indicado).filter((id): id is string => Boolean(id))),
    ];
    const { data: contratosAtivos } = clientesIndicados.length
        ? await supabase
              .from('contratos')
              .select('cliente_id')
              .in('cliente_id', clientesIndicados)
              .eq('status', 'Ativo')
        : { data: [] };
    const clientesComContratoAtivo = new Set((contratosAtivos ?? []).map((contrato) => contrato.cliente_id));
    const lista: IndicacaoComStatus[] = indicacoes.map((item) => ({
        ...item,
        beneficioAtivo: Boolean(item.cliente_indicado && clientesComContratoAtivo.has(item.cliente_indicado)),
    }));
    const idsAtivos = lista.filter((item) => item.beneficioAtivo && item.status !== 'Ativo').map((item) => item.id);
    const idsSuspensos = lista
        .filter((item) => !item.beneficioAtivo && item.status !== 'Suspenso')
        .map((item) => item.id);
    await Promise.all([
        idsAtivos.length
            ? supabase.from('indicacoes').update({ status: 'Ativo' }).in('id', idsAtivos)
            : Promise.resolve(),
        idsSuspensos.length
            ? supabase.from('indicacoes').update({ status: 'Suspenso' }).in('id', idsSuspensos)
            : Promise.resolve(),
    ]);
    const beneficiosAtivos = lista.filter((item) => item.beneficioAtivo).length;
    const beneficioMensal = lista.reduce(
        (total, item) => total + (item.beneficioAtivo ? Number(item.valor_desconto) : 0),
        0
    );
    return (
        <main>
            <PageHeader
                title="Indicações"
                description="Controle de benefícios gerados por indicação de clientes."
                actions={
                    <Button component={Link} href="/indicacoes/nova" startIcon={<AddRounded />}>
                        Nova Indicação
                    </Button>
                }
            />
            <ResponsiveGrid columns={3}>
                <StatCard
                    titulo="Total Indicações"
                    valor={String(lista.length)}
                    cor="green"
                    icone={<GroupsRounded />}
                />
                <StatCard
                    titulo="Benefícios Ativos"
                    valor={String(beneficiosAtivos)}
                    cor="blue"
                    icone={<CardGiftcardRounded />}
                />
                <StatCard
                    titulo="Benefício Mensal"
                    valor={formatMoney(beneficioMensal)}
                    cor="yellow"
                    icone={<TrendingUpRounded />}
                />
            </ResponsiveGrid>
            <Card sx={{ mt: 3 }}>
                <TableContainer>
                    <Table sx={{ minWidth: 720 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Cliente Indicador</TableCell>
                                <TableCell>Cliente Indicado</TableCell>
                                <TableCell>Benefício</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lista.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 7, color: 'text.secondary' }}>
                                        Nenhuma indicação cadastrada.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                lista.map((indicacao) => (
                                    <TableRow key={indicacao.id} hover>
                                        <TableCell sx={{ fontWeight: 700 }}>
                                            {indicacao.indicador?.nome ?? '-'}
                                        </TableCell>
                                        <TableCell>{indicacao.indicado?.nome ?? '-'}</TableCell>
                                        <TableCell sx={{ color: 'warning.main', fontWeight: 800 }}>
                                            {formatMoney(Number(indicacao.valor_desconto))}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={indicacao.beneficioAtivo ? 'Ativo' : 'Suspenso'}
                                                size="small"
                                                sx={{
                                                    color: indicacao.beneficioAtivo ? '#4ade80' : '#f87171',
                                                    bgcolor: indicacao.beneficioAtivo
                                                        ? 'rgba(34,197,94,.1)'
                                                        : 'rgba(239,68,68,.1)',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                component={Link}
                                                href={`/indicacoes/editar/${indicacao.id}`}
                                                variant="outlined"
                                                size="small"
                                            >
                                                Editar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </main>
    );
}
