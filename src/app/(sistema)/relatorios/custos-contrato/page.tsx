import { DollarSign, Wallet, TrendingUp, Percent, Eye } from 'lucide-react';

import Link from 'next/link';

import ReportHeader from '@/components/relatorios/ReportHeader';
import ReportKPICard from '@/components/relatorios/ReportKPICard';
import ReportTable from '@/components/relatorios/ReportTable';
import ReportPeriodFilter from '@/components/relatorios/ReportPeriodFilter';
import StructuredReportExport from '@/components/relatorios/StructuredReportExport';

import { getRentabilidadeContratos } from '@/lib/relatorios/rentabilidade';
import { formatarMoedaServidor, getContextoConfiguracoes } from '@/lib/configuracoes-server';

type Props = { searchParams?: Promise<{ periodo?: string }> };

export default async function RelatorioRentabilidadeContratosPage({ searchParams }: Props) {
    const { configuracoes } = await getContextoConfiguracoes();
    const formatMoney = (value: number) => formatarMoedaServidor(value, configuracoes);
    const { periodo = 'mes' } = (await searchParams) ?? {};
    const { contratos, totais } = await getRentabilidadeContratos(periodo);

    return (
        <main id="report-content" className="space-y-8">
            <ReportHeader
                title="Custos por Contrato"

                description="Compare custos, receitas e resultado financeiro por contrato."

                actions={
                    <>
                        <ReportPeriodFilter />
                        <StructuredReportExport
                            title="Custos por Contrato"
                            periodo={periodo}
                            cards={[
                                { label: 'Receita Total', value: totais.receita, format: 'currency', tone: 'green' },
                                { label: 'Custos Totais', value: totais.custos, format: 'currency', tone: 'red' },
                                {
                                    label: 'Lucro Total',
                                    value: totais.lucro,
                                    format: 'currency',
                                    tone: totais.lucro >= 0 ? 'green' : 'red',
                                },
                                {
                                    label: 'Margem Geral',
                                    value: totais.margem,
                                    format: 'percent',
                                    tone: totais.margem >= 0 ? 'green' : 'red',
                                },
                            ]}
                            sections={[
                                {
                                    title: 'Resultado por contrato',
                                    columns: [
                                        { header: 'Cliente', dataKey: 'cliente' },
                                        { header: 'Contrato', dataKey: 'contrato' },
                                        { header: 'Receita', dataKey: 'receita', format: 'currency', align: 'right' },
                                        { header: 'Custos', dataKey: 'custos', format: 'currency', align: 'right' },
                                        { header: 'Lucro', dataKey: 'lucro', format: 'currency', align: 'right' },
                                        { header: 'Margem', dataKey: 'margem', format: 'percent', align: 'right' },
                                    ],
                                    rows: contratos.map((item) => ({
                                        cliente: item.cliente,
                                        contrato: item.contrato,
                                        receita: item.receita,
                                        custos: item.custos,
                                        lucro: item.lucro,
                                        margem: item.margem,
                                    })),
                                },
                            ]}
                        />
                    </>
                }
            />

            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <ReportKPICard
                    title="Receita Total"

                    value={totais.receita}

                    icon={DollarSign}

                    color="green"
                />

                <ReportKPICard
                    title="Custos Totais"

                    value={totais.custos}

                    icon={Wallet}

                    color="red"
                />

                <ReportKPICard
                    title="Lucro Total"

                    value={totais.lucro}

                    icon={TrendingUp}

                    color="blue"
                />

                <ReportKPICard
                    title="Margem Geral"

                    value={`${totais.margem.toFixed(1)}%`}

                    icon={Percent}

                    color="yellow"
                />
            </section>

            <ReportTable
                title="Rentabilidade dos Contratos"

                description="Resultado financeiro consolidado por contrato."

                columns={[
                    {
                        key: 'cliente',
                        title: 'Cliente',
                    },

                    {
                        key: 'contrato',
                        title: 'Contrato',
                    },

                    {
                        key: 'receita',

                        title: 'Receita',

                        align: 'right',

                        render: (item) => formatMoney(item.receita),
                    },

                    {
                        key: 'custos',

                        title: 'Custos',

                        align: 'right',

                        render: (item) => formatMoney(item.custos),
                    },

                    {
                        key: 'lucro',

                        title: 'Lucro',

                        align: 'right',

                        render: (item) => formatMoney(item.lucro),
                    },

                    {
                        key: 'margem',

                        title: 'Margem',

                        align: 'right',

                        render: (item) => `${item.margem.toFixed(1)}%`,
                    },

                    {
                        key: 'acoes',

                        title: 'Ações',

                        align: 'center',

                        render: (item) => (
                            <Link
                                href={`/relatorios/rentabilidade/${item.id}?periodo=${periodo}`}

                                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:border-emerald-500 hover:text-emerald-400"
                            >
                                <Eye size={16} />
                                Ver detalhes
                            </Link>
                        ),
                    },
                ]}

                data={contratos}
            />
        </main>
    );
}
