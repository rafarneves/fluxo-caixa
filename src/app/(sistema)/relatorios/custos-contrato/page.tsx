import { DollarSign, Wallet, TrendingUp, Percent, Eye } from 'lucide-react';

import Link from 'next/link';

import ReportHeader from '@/components/relatorios/ReportHeader';
import ReportKPICard from '@/components/relatorios/ReportKPICard';
import ReportExport from '@/components/relatorios/ReportExport';
import ReportTable from '@/components/relatorios/ReportTable';
import ReportPeriodFilter from '@/components/relatorios/ReportPeriodFilter';

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
                        <ReportExport reportTitle="Custos por Contrato" />
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
