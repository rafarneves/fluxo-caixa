import { getContextoConfiguracoes } from '@/lib/configuracoes-server';
import { ArrowDownCircle, ArrowUpCircle, Wallet, Landmark } from 'lucide-react';

import ReportHeader from '@/components/relatorios/ReportHeader';
import ReportKPICard from '@/components/relatorios/ReportKPICard';
import ReportTable from '@/components/relatorios/ReportTable';
import ReportPeriodFilter from '@/components/relatorios/ReportPeriodFilter';
import StructuredReportExport from '@/components/relatorios/StructuredReportExport';

import { getDashboardExecutivo } from '@/lib/relatorios/dashboard';

type Props = { searchParams?: Promise<{ periodo?: string }> };

export default async function FluxoCaixaRelatorioPage({ searchParams }: Props) {
    const { configuracoes } = await getContextoConfiguracoes();
    const { periodo = 'mes' } = (await searchParams) ?? {};
    const dados = await getDashboardExecutivo(periodo);

    const entradas = Number(dados.recebido ?? 0);
    const despesas = Number(dados.despesasTotal ?? 0);
    const custos = Number(dados.custosTotal ?? 0);

    const saidas = despesas + custos;
    const saldo = entradas - saidas;

    const linhas = [
        {
            tipo: 'Entradas',
            descricao: 'Recebimentos',
            valor: entradas,
        },
        {
            tipo: 'Saídas',
            descricao: 'Despesas',
            valor: -despesas,
        },
        {
            tipo: 'Saídas',
            descricao: 'Custos',
            valor: -custos,
        },
        {
            tipo: 'Resultado',
            descricao: 'Saldo Final',
            valor: saldo,
        },
    ];

    return (
        <main id="report-content" className="space-y-8">
            <ReportHeader
                title="Fluxo de Caixa"
                description="Relatório consolidado de entradas, saídas e saldo financeiro."
                actions={
                    <>
                        <ReportPeriodFilter />
                        <StructuredReportExport
                            title="Fluxo de Caixa"
                            periodo={periodo}
                            cards={[
                                { label: 'Entradas', value: entradas, format: 'currency', tone: 'green' },
                                { label: 'Saídas', value: saidas, format: 'currency', tone: 'red' },
                                { label: 'Custos', value: custos, format: 'currency', tone: 'yellow' },
                                {
                                    label: 'Saldo',
                                    value: saldo,
                                    format: 'currency',
                                    tone: saldo >= 0 ? 'green' : 'red',
                                },
                            ]}
                            sections={[
                                {
                                    title: 'Movimentação financeira',
                                    columns: [
                                        { header: 'Tipo', dataKey: 'tipo' },
                                        { header: 'Descrição', dataKey: 'descricao' },
                                        { header: 'Valor', dataKey: 'valor', format: 'currency', align: 'right' },
                                    ],
                                    rows: linhas,
                                },
                            ]}
                        />
                    </>
                }
            />

            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <ReportKPICard title="Entradas" value={entradas} icon={ArrowDownCircle} color="green" />

                <ReportKPICard title="Saídas" value={saidas} icon={ArrowUpCircle} color="red" />

                <ReportKPICard title="Custos" value={custos} icon={Wallet} color="yellow" />

                <ReportKPICard title="Saldo" value={saldo} icon={Landmark} color={saldo >= 0 ? 'green' : 'red'} />
            </section>

            <ReportTable
                title="Movimentação Financeira"
                description="Resumo das movimentações do período."
                columns={[
                    {
                        key: 'tipo',
                        title: 'Tipo',
                    },
                    {
                        key: 'descricao',
                        title: 'Descrição',
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
                data={linhas}
            />
        </main>
    );
}
