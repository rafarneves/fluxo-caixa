import { formatarDataServidor, getContextoConfiguracoes } from '@/lib/configuracoes-server';
import { Receipt, TrendingDown, Wallet, CalendarDays } from 'lucide-react';

import ReportHeader from '@/components/relatorios/ReportHeader';
import ReportKPICard from '@/components/relatorios/ReportKPICard';
import ReportTable from '@/components/relatorios/ReportTable';
import ReportPeriodFilter from '@/components/relatorios/ReportPeriodFilter';
import StructuredReportExport from '@/components/relatorios/StructuredReportExport';

import { getDashboardExecutivo } from '@/lib/relatorios/dashboard';

type Props = { searchParams?: Promise<{ periodo?: string }> };

export default async function RelatorioDespesasPage({ searchParams }: Props) {
    const { configuracoes } = await getContextoConfiguracoes();
    const { periodo = 'mes' } = (await searchParams) ?? {};
    const dados = await getDashboardExecutivo(periodo);

    const despesas = dados.despesas;

    const totalDespesas = despesas.reduce((acc, item) => acc + Number(item.valor), 0);

    const quantidade = despesas.length;

    const ticketMedio = quantidade === 0 ? 0 : totalDespesas / quantidade;

    const categorias = new Set(despesas.map((despesa) => despesa.categoria).filter(Boolean)).size;

    return (
        <main id="report-content" className="space-y-8">
            <ReportHeader
                title="Despesas"
                description="Relatório completo das despesas cadastradas no ERP."
                actions={
                    <>
                        <ReportPeriodFilter />
                        <StructuredReportExport
                            title="Despesas"
                            periodo={periodo}
                            cards={[
                                { label: 'Total', value: totalDespesas, format: 'currency', tone: 'red' },
                                { label: 'Lançamentos', value: quantidade, format: 'number', tone: 'blue' },
                                { label: 'Ticket Médio', value: ticketMedio, format: 'currency', tone: 'yellow' },
                                { label: 'Categorias', value: categorias, format: 'number', tone: 'green' },
                            ]}
                            sections={[
                                {
                                    title: 'Despesas registradas',
                                    columns: [
                                        { header: 'Categoria', dataKey: 'categoria' },
                                        { header: 'Descrição', dataKey: 'descricao' },
                                        { header: 'Data', dataKey: 'data' },
                                        { header: 'Valor', dataKey: 'valor', format: 'currency', align: 'right' },
                                    ],
                                    rows: despesas.map((item) => ({
                                        categoria: item.categoria ?? '-',
                                        descricao: item.descricao ?? '-',
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
                <ReportKPICard title="Total" value={totalDespesas} icon={Wallet} color="red" />

                <ReportKPICard title="Lançamentos" value={quantidade} icon={Receipt} color="blue" isCurrency={false} />

                <ReportKPICard title="Ticket Médio" value={ticketMedio} icon={TrendingDown} color="yellow" />

                <ReportKPICard
                    title="Categorias"
                    value={categorias}
                    icon={CalendarDays}
                    color="green"
                    isCurrency={false}
                />
            </section>

            <ReportTable
                title="Despesas"
                description="Lista completa das despesas registradas."
                columns={[
                    {
                        key: 'categoria',
                        title: 'Categoria',
                    },
                    {
                        key: 'descricao',
                        title: 'Descrição',
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
                data={despesas}
            />
        </main>
    );
}
