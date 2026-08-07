import { DollarSign, Wallet, TrendingUp, Percent, Eye } from 'lucide-react';

import Link from 'next/link';

import ReportHeader from '@/components/relatorios/ReportHeader';
import ReportKPICard from '@/components/relatorios/ReportKPICard';
import ReportExport from '@/components/relatorios/ReportExport';
import ReportTable from '@/components/relatorios/ReportTable';

import { getRentabilidadeContratos } from '@/lib/relatorios/rentabilidade';
import { formatarMoedaServidor, getContextoConfiguracoes } from '@/lib/configuracoes-server';

export default async function RelatorioRentabilidadeContratosPage() {
    const { configuracoes } = await getContextoConfiguracoes();
    const formatMoney = (value: number) => formatarMoedaServidor(value, configuracoes);
    const { contratos, totais } = await getRentabilidadeContratos();

    return (
        <main className="space-y-8">
            <ReportHeader
                title="Rentabilidade dos Contratos"

                description="Visualize a rentabilidade de todos os contratos da empresa."

                actions={<ReportExport disabledPDF disabledExcel />}
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

                        render: (item: any) => formatMoney(item.receita),
                    },

                    {
                        key: 'custos',

                        title: 'Custos',

                        align: 'right',

                        render: (item: any) => formatMoney(item.custos),
                    },

                    {
                        key: 'lucro',

                        title: 'Lucro',

                        align: 'right',

                        render: (item: any) => formatMoney(item.lucro),
                    },

                    {
                        key: 'margem',

                        title: 'Margem',

                        align: 'right',

                        render: (item: any) => `${item.margem.toFixed(1)}%`,
                    },

                    {
                        key: 'acoes',

                        title: 'Ações',

                        align: 'center',

                        render: (item: any) => (
                            <Link
                                href={`/relatorios/rentabilidade/${item.id}`}

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
