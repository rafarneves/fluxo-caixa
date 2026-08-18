import { formatarMoedaServidor, getContextoConfiguracoes } from '@/lib/configuracoes-server';
import { DollarSign, TrendingDown, TrendingUp, Percent, Wallet, Landmark } from 'lucide-react';

import ReportHeader from '@/components/relatorios/ReportHeader';
import ReportKPICard from '@/components/relatorios/ReportKPICard';
import ReportTable from '@/components/relatorios/ReportTable';
import ReportPeriodFilter from '@/components/relatorios/ReportPeriodFilter';
import StructuredReportExport from '@/components/relatorios/StructuredReportExport';

import { getDashboardExecutivo } from '@/lib/relatorios/dashboard';

type Props = { searchParams?: Promise<{ periodo?: string }> };

export default async function DRECompletoPage({ searchParams }: Props) {
    const { configuracoes } = await getContextoConfiguracoes();
    const { periodo = 'mes' } = (await searchParams) ?? {};
    const dados = await getDashboardExecutivo(periodo);

    const receitaBruta = dados.recebido;

    const custos = dados.custosTotal;

    const despesas = dados.despesasTotal;

    const lucroBruto = receitaBruta - custos;

    const lucroLiquido = lucroBruto - despesas;

    const margem = receitaBruta === 0 ? 0 : (lucroLiquido / receitaBruta) * 100;

    const linhas = [
        {
            conta: 'Receita Bruta',
            grupo: 'Receitas',
            valor: receitaBruta,
        },

        {
            conta: '(-) Custos',
            grupo: 'Custos',
            valor: -custos,
        },

        {
            conta: 'Lucro Bruto',
            grupo: 'Resultado',
            valor: lucroBruto,
        },

        {
            conta: '(-) Despesas Operacionais',
            grupo: 'Despesas',
            valor: -despesas,
        },

        {
            conta: 'Lucro Líquido',
            grupo: 'Resultado Final',
            valor: lucroLiquido,
        },
    ];

    return (
        <main id="report-content" className="space-y-8">
            <ReportHeader
                title="DRE Completo"

                description="Demonstrativo completo do resultado do exercício."

                actions={
                    <>
                        <ReportPeriodFilter />
                        <StructuredReportExport
                            title="DRE Completo"
                            periodo={periodo}
                            cards={[
                                { label: 'Receita', value: receitaBruta, format: 'currency', tone: 'green' },
                                { label: 'Custos', value: custos, format: 'currency', tone: 'yellow' },
                                {
                                    label: 'Lucro Bruto',
                                    value: lucroBruto,
                                    format: 'currency',
                                    tone: lucroBruto >= 0 ? 'green' : 'red',
                                },
                                { label: 'Despesas', value: despesas, format: 'currency', tone: 'red' },
                                {
                                    label: 'Lucro Líquido',
                                    value: lucroLiquido,
                                    format: 'currency',
                                    tone: lucroLiquido >= 0 ? 'green' : 'red',
                                },
                                {
                                    label: 'Margem',
                                    value: margem,
                                    format: 'percent',
                                    tone: margem >= 0 ? 'green' : 'red',
                                },
                            ]}
                            sections={[
                                {
                                    title: 'Demonstrativo',
                                    columns: [
                                        { header: 'Grupo', dataKey: 'grupo' },
                                        { header: 'Conta', dataKey: 'conta' },
                                        { header: 'Valor', dataKey: 'valor', format: 'currency', align: 'right' },
                                    ],
                                    rows: linhas,
                                },
                            ]}
                        />
                    </>
                }
            />

            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <ReportKPICard
                    title="Receita"

                    value={formatarMoedaServidor(receitaBruta, configuracoes, true)}

                    icon={DollarSign}

                    color="green"
                />

                <ReportKPICard
                    title="Custos"

                    value={formatarMoedaServidor(custos, configuracoes, true)}

                    icon={Wallet}

                    color="yellow"
                />

                <ReportKPICard
                    title="Lucro Bruto"

                    value={formatarMoedaServidor(lucroBruto, configuracoes, true)}

                    icon={TrendingUp}

                    color={lucroBruto >= 0 ? 'green' : 'red'}
                />

                <ReportKPICard
                    title="Despesas"

                    value={formatarMoedaServidor(despesas, configuracoes, true)}

                    icon={TrendingDown}

                    color="red"
                />

                <ReportKPICard
                    title="Lucro Líquido"

                    value={formatarMoedaServidor(lucroLiquido, configuracoes, true)}

                    icon={Landmark}

                    color={lucroLiquido >= 0 ? 'green' : 'red'}
                />

                <ReportKPICard
                    title="Margem"

                    value={`${margem.toFixed(2)}%`}

                    icon={Percent}

                    color="blue"
                />
            </section>

            <ReportTable
                title="Demonstrativo"

                description="Composição completa do DRE."

                columns={[
                    {
                        key: 'grupo',

                        title: 'Grupo',
                    },

                    {
                        key: 'conta',

                        title: 'Conta',
                    },

                    {
                        key: 'valor',

                        title: 'Valor',

                        align: 'right',

                        render: (item) =>
                            item.valor.toLocaleString(
                                'pt-BR',

                                {
                                    style: 'currency',

                                    currency: configuracoes.moeda,
                                }
                            ),
                    },
                ]}

                data={linhas}
            />
        </main>
    );
}
