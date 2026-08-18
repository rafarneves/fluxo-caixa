import { formatarMoedaServidor, getContextoConfiguracoes } from '@/lib/configuracoes-server';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

import ReportHeader from '@/components/relatorios/ReportHeader';
import ReportKPICard from '@/components/relatorios/ReportKPICard';
import ReportTable from '@/components/relatorios/ReportTable';
import ReportPeriodFilter from '@/components/relatorios/ReportPeriodFilter';
import StructuredReportExport from '@/components/relatorios/StructuredReportExport';

import { getDashboardExecutivo } from '@/lib/relatorios/dashboard';

type Props = { searchParams?: Promise<{ periodo?: string }> };

export default async function DREResumidoPage({ searchParams }: Props) {
    const { configuracoes } = await getContextoConfiguracoes();
    const { periodo = 'mes' } = (await searchParams) ?? {};
    const dados = await getDashboardExecutivo(periodo);

    const receita = dados.recebido;

    const custos = dados.custosTotal;

    const despesas = dados.despesasTotal;

    const lucro = dados.lucro;

    const margem = receita === 0 ? 0 : (lucro / receita) * 100;

    return (
        <main id="report-content" className="space-y-8">
            <ReportHeader
                title="DRE Resumido"

                description="Demonstrativo resumido do resultado do exercício."

                actions={
                    <>
                        <ReportPeriodFilter />
                        <StructuredReportExport
                            title="DRE Resumido"
                            periodo={periodo}
                            cards={[
                                { label: 'Receita', value: receita, format: 'currency', tone: 'green' },
                                { label: 'Custos', value: custos, format: 'currency', tone: 'yellow' },
                                { label: 'Despesas', value: despesas, format: 'currency', tone: 'red' },
                                {
                                    label: 'Lucro',
                                    value: lucro,
                                    format: 'currency',
                                    tone: lucro >= 0 ? 'green' : 'red',
                                },
                            ]}
                            sections={[
                                {
                                    title: 'Resumo financeiro',
                                    columns: [
                                        { header: 'Conta', dataKey: 'conta' },
                                        { header: 'Valor', dataKey: 'valor', align: 'right' },
                                    ],
                                    rows: [
                                        {
                                            conta: 'Receita Bruta',
                                            valor: formatarMoedaServidor(receita, configuracoes),
                                        },
                                        { conta: '(-) Custos', valor: formatarMoedaServidor(-custos, configuracoes) },
                                        {
                                            conta: '(-) Despesas',
                                            valor: formatarMoedaServidor(-despesas, configuracoes),
                                        },
                                        { conta: 'Lucro Líquido', valor: formatarMoedaServidor(lucro, configuracoes) },
                                        { conta: 'Margem', valor: `${margem.toFixed(2)}%` },
                                    ],
                                },
                            ]}
                        />
                    </>
                }
            />

            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <ReportKPICard
                    title="Receita"

                    value={formatarMoedaServidor(receita, configuracoes, true)}

                    icon={DollarSign}

                    color="green"
                />

                <ReportKPICard
                    title="Custos"

                    value={formatarMoedaServidor(custos, configuracoes, true)}

                    icon={TrendingDown}

                    color="yellow"
                />

                <ReportKPICard
                    title="Despesas"

                    value={formatarMoedaServidor(despesas, configuracoes, true)}

                    icon={TrendingDown}

                    color="red"
                />

                <ReportKPICard
                    title="Lucro"

                    value={formatarMoedaServidor(lucro, configuracoes, true)}

                    icon={TrendingUp}

                    color={lucro >= 0 ? 'green' : 'red'}
                />
            </section>

            <ReportTable
                title="Resumo Financeiro"

                description="Resumo dos principais indicadores do DRE."

                columns={[
                    {
                        key: 'conta',

                        title: 'Conta',
                    },

                    {
                        key: 'valor',

                        title: 'Valor',

                        align: 'right',
                    },
                ]}

                data={[
                    {
                        conta: 'Receita Bruta',

                        valor: receita.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: configuracoes.moeda,
                        }),
                    },

                    {
                        conta: '(-) Custos',

                        valor: custos.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: configuracoes.moeda,
                        }),
                    },

                    {
                        conta: '(-) Despesas',

                        valor: despesas.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: configuracoes.moeda,
                        }),
                    },

                    {
                        conta: 'Lucro Líquido',

                        valor: lucro.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: configuracoes.moeda,
                        }),
                    },

                    {
                        conta: 'Margem',

                        valor: `${margem.toFixed(2)}%`,
                    },
                ]}
            />
        </main>
    );
}
