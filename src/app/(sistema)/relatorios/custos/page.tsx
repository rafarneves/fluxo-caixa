import { formatarDataServidor, getContextoConfiguracoes } from '@/lib/configuracoes-server';
import { BriefcaseBusiness, Wallet, TrendingDown, BarChart3 } from 'lucide-react';

import ReportHeader from '@/components/relatorios/ReportHeader';
import ReportKPICard from '@/components/relatorios/ReportKPICard';
import ReportTable from '@/components/relatorios/ReportTable';
import ReportPeriodFilter from '@/components/relatorios/ReportPeriodFilter';
import StructuredReportExport from '@/components/relatorios/StructuredReportExport';

import { getDashboardExecutivo } from '@/lib/relatorios/dashboard';

type Props = { searchParams?: Promise<{ periodo?: string }> };

export default async function RelatorioCustosPage({ searchParams }: Props) {
    const { configuracoes } = await getContextoConfiguracoes();
    const { periodo = 'mes' } = (await searchParams) ?? {};
    const dados = await getDashboardExecutivo(periodo);

    const custos = dados.custosContrato;

    const totalCustos = custos.reduce((total, custo) => total + Number(custo.valor), 0);

    const quantidade = custos.length;

    const ticketMedio = quantidade === 0 ? 0 : totalCustos / quantidade;

    const participacao = dados.recebido > 0 ? (totalCustos / dados.recebido) * 100 : 0;

    return (
        <main id="report-content" className="space-y-8">
            <ReportHeader
                title="Custos"
                description="Relatório completo dos custos registrados no ERP."
                actions={
                    <>
                        <ReportPeriodFilter />
                        <StructuredReportExport
                            title="Custos"
                            periodo={periodo}
                            cards={[
                                { label: 'Total de Custos', value: totalCustos, format: 'currency', tone: 'red' },
                                { label: 'Lançamentos', value: quantidade, format: 'number', tone: 'blue' },
                                { label: 'Custo Médio', value: ticketMedio, format: 'currency', tone: 'yellow' },
                                { label: 'Participação', value: participacao, format: 'percent', tone: 'green' },
                            ]}
                            sections={[
                                {
                                    title: 'Custos registrados',
                                    columns: [
                                        { header: 'Descrição', dataKey: 'descricao' },
                                        { header: 'Categoria', dataKey: 'categoria' },
                                        { header: 'Data', dataKey: 'data' },
                                        { header: 'Valor', dataKey: 'valor', format: 'currency', align: 'right' },
                                    ],
                                    rows: custos.map((item) => ({
                                        descricao: item.descricao ?? '-',
                                        categoria: item.categoria ?? '-',
                                        data: item.data ? formatarDataServidor(item.data, configuracoes) : '-',
                                        valor: Number(item.valor),
                                    })),
                                },
                            ]}
                        />
                    </>
                }
            />

            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <ReportKPICard title="Total de Custos" value={totalCustos} icon={Wallet} color="red" />

                <ReportKPICard
                    title="Lançamentos"
                    value={quantidade}
                    icon={BriefcaseBusiness}
                    color="blue"
                    isCurrency={false}
                />

                <ReportKPICard title="Custo Médio" value={ticketMedio} icon={TrendingDown} color="yellow" />

                <ReportKPICard
                    title="Participação"
                    value={`${participacao.toFixed(1)}%`}
                    icon={BarChart3}
                    color="green"
                    isCurrency={false}
                />
            </section>

            <ReportTable
                title="Custos"
                description="Lista completa dos custos cadastrados."
                columns={[
                    {
                        key: 'descricao',
                        title: 'Descrição',
                        render: (item) => item.descricao ?? '-',
                    },
                    {
                        key: 'categoria',
                        title: 'Categoria',
                        render: (item) => item.categoria ?? '-',
                    },
                    {
                        key: 'data',
                        title: 'Data',
                        render: (item) => (item.data ? formatarDataServidor(item.data, configuracoes) : '-'),
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
                data={custos}
            />
        </main>
    );
}
