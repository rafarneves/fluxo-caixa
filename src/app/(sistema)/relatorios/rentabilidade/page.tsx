import { getContextoConfiguracoes } from '@/lib/configuracoes-server';
import { DollarSign, Wallet, TrendingUp, Percent, Eye } from 'lucide-react';
import Link from 'next/link';

import ReportHeader from '@/components/relatorios/ReportHeader';
import ReportKPICard from '@/components/relatorios/ReportKPICard';
import ReportExport from '@/components/relatorios/ReportExport';
import ReportTable from '@/components/relatorios/ReportTable';
import ReportPeriodFilter from '@/components/relatorios/ReportPeriodFilter';

import { getRentabilidadeContratos } from '@/lib/relatorios/rentabilidade';

type Props = { searchParams?: Promise<{ periodo?: string }> };

export default async function RelatorioRentabilidadeContratosPage({ searchParams }: Props) {
    const { configuracoes } = await getContextoConfiguracoes();
    const { periodo = 'mes' } = (await searchParams) ?? {};
    const { contratos, totais } = await getRentabilidadeContratos(periodo);

    return (
        <main id="report-content" className="space-y-8">
            <ReportHeader
                title="Rentabilidade dos Contratos"
                description="Visualize a rentabilidade de todos os contratos da empresa."
                actions={
                    <>
                        <ReportPeriodFilter />
                        <ReportExport reportTitle="Rentabilidade dos Contratos" />
                    </>
                }
            />

            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <ReportKPICard
                    title="Receita Total"
                    value={totais.receita.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: configuracoes.moeda,
                    })}
                    icon={DollarSign}
                    color="green"
                />

                <ReportKPICard
                    title="Custos Totais"
                    value={totais.custos.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: configuracoes.moeda,
                    })}
                    icon={Wallet}
                    color="red"
                />

                <ReportKPICard
                    title="Lucro Total"
                    value={totais.lucro.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: configuracoes.moeda,
                    })}
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
                    { key: 'cliente', title: 'Cliente' },
                    { key: 'contrato', title: 'Contrato' },
                    {
                        key: 'receita',
                        title: 'Receita',
                        align: 'right',
                        render: (item) =>
                            item.receita.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: configuracoes.moeda,
                            }),
                    },
                    {
                        key: 'custos',
                        title: 'Custos',
                        align: 'right',
                        render: (item) =>
                            item.custos.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: configuracoes.moeda,
                            }),
                    },
                    {
                        key: 'lucro',
                        title: 'Lucro',
                        align: 'right',
                        render: (item) =>
                            item.lucro.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: configuracoes.moeda,
                            }),
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
                                className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-green-400"
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
