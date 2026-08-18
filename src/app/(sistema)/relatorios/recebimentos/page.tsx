import { formatarDataServidor, formatarMoedaServidor, getContextoConfiguracoes } from '@/lib/configuracoes-server';
import { BadgeDollarSign, Clock3, CheckCircle2, AlertTriangle } from 'lucide-react';

import ReportHeader from '@/components/relatorios/ReportHeader';
import ReportKPICard from '@/components/relatorios/ReportKPICard';
import ReportExport from '@/components/relatorios/ReportExport';
import ReportTable from '@/components/relatorios/ReportTable';
import ReportPeriodFilter from '@/components/relatorios/ReportPeriodFilter';

import { getDashboardExecutivo } from '@/lib/relatorios/dashboard';
import { getStatusRecebimento } from '@/lib/relatorios/recebimentos';

type Props = { searchParams?: Promise<{ periodo?: string }> };

export default async function RelatorioRecebimentosPage({ searchParams }: Props) {
    const { configuracoes } = await getContextoConfiguracoes();
    const { periodo = 'mes' } = (await searchParams) ?? {};
    const dados = await getDashboardExecutivo(periodo);

    const recebimentos = dados.recebimentos;

    const recebimentosClassificados = recebimentos.map((recebimento) => ({
        ...recebimento,
        statusRelatorio: getStatusRecebimento(recebimento, configuracoes.fusoHorario),
    }));

    const recebimentosValidos = recebimentosClassificados.filter(
        (recebimento) => recebimento.statusRelatorio !== 'Cancelado'
    );

    const pagos = recebimentosValidos.filter((recebimento) => recebimento.statusRelatorio === 'Pago');

    const pendentes = recebimentosValidos.filter((recebimento) => recebimento.statusRelatorio === 'Pendente');

    const vencidos = recebimentosValidos.filter((recebimento) => recebimento.statusRelatorio === 'Vencido');

    const totalValor = recebimentosValidos.reduce((total, item) => total + Number(item.valor), 0);

    const totalPago = pagos.reduce((total, item) => total + Number(item.valor_recebido ?? item.valor), 0);

    const totalPendente = pendentes.reduce((total, item) => total + Number(item.valor), 0);

    const totalVencido = vencidos.reduce((total, item) => total + Number(item.valor), 0);

    return (
        <main id="report-content" className="space-y-8">
            <ReportHeader
                title="Recebimentos"
                description="Relatório completo de cobranças e recebimentos."
                actions={
                    <>
                        <ReportPeriodFilter />
                        <ReportExport reportTitle="Recebimentos" />
                    </>
                }
            />

            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <ReportKPICard
                    title="Total"
                    value={formatarMoedaServidor(totalValor, configuracoes, true)}
                    icon={BadgeDollarSign}
                    color="blue"
                />

                <ReportKPICard
                    title="Pagos"
                    value={formatarMoedaServidor(totalPago, configuracoes, true)}
                    icon={CheckCircle2}
                    color="green"
                />

                <ReportKPICard
                    title="Pendentes"
                    value={formatarMoedaServidor(totalPendente, configuracoes, true)}
                    icon={Clock3}
                    color="yellow"
                />

                <ReportKPICard
                    title="Vencidos"
                    value={formatarMoedaServidor(totalVencido, configuracoes, true)}
                    icon={AlertTriangle}
                    color="red"
                />
            </section>

            <ReportTable
                title="Recebimentos"

                description="Lista de todos os recebimentos cadastrados."

                columns={[
                    {
                        key: 'cliente',

                        title: 'Cliente',

                        render: (item) => item.contratos?.clientes?.nome ?? '-',
                    },

                    {
                        key: 'vencimento',

                        title: 'Vencimento',

                        render: (item) => formatarDataServidor(item.vencimento, configuracoes),
                    },

                    {
                        key: 'statusRelatorio',

                        title: 'Status',
                    },

                    {
                        key: 'valor',

                        title: 'Valor',

                        align: 'right',

                        render: (item) =>
                            Number(item.valor).toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: configuracoes.moeda,
                            }),
                    },
                ]}

                data={recebimentosClassificados}
            />
        </main>
    );
}
