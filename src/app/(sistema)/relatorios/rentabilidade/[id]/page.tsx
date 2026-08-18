import { formatarDataServidor, getContextoConfiguracoes } from '@/lib/configuracoes-server';
import { DollarSign, Wallet, TrendingUp, Percent } from 'lucide-react';
import { notFound } from 'next/navigation';

import ReportHeader from '@/components/relatorios/ReportHeader';
import ReportKPICard from '@/components/relatorios/ReportKPICard';
import ReportTable from '@/components/relatorios/ReportTable';
import ReportPeriodFilter from '@/components/relatorios/ReportPeriodFilter';
import StructuredReportExport from '@/components/relatorios/StructuredReportExport';

import { getRentabilidadeContrato } from '@/lib/relatorios/rentabilidade';

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{
        id: string;
    }>;
    searchParams?: Promise<{ periodo?: string }>;
};

export default async function RentabilidadeContratoPage({ params, searchParams }: Props) {
    const { configuracoes } = await getContextoConfiguracoes();
    const { id } = await params;
    const { periodo = 'mes' } = (await searchParams) ?? {};

    const contrato = await getRentabilidadeContrato(id, periodo);

    if (!contrato) {
        notFound();
    }

    return (
        <main id="report-content" className="space-y-8">
            <ReportHeader
                title={contrato.contrato}
                description={`Rentabilidade detalhada de ${contrato.cliente}.`}
                backHref={`/relatorios/rentabilidade?periodo=${periodo}`}
                actions={
                    <>
                        <ReportPeriodFilter />
                        <StructuredReportExport
                            title={`Rentabilidade - ${contrato.contrato}`}
                            periodo={periodo}
                            cards={[
                                { label: 'Receita', value: contrato.receita, format: 'currency', tone: 'green' },
                                { label: 'Custos', value: contrato.custos, format: 'currency', tone: 'red' },
                                {
                                    label: 'Lucro',
                                    value: contrato.lucro,
                                    format: 'currency',
                                    tone: contrato.lucro >= 0 ? 'green' : 'red',
                                },
                                {
                                    label: 'Margem',
                                    value: contrato.margem,
                                    format: 'percent',
                                    tone: contrato.margem >= 0 ? 'green' : 'red',
                                },
                            ]}
                            sections={[
                                {
                                    title: 'Movimentações do contrato',
                                    columns: [
                                        { header: 'Tipo', dataKey: 'tipo' },
                                        { header: 'Descrição', dataKey: 'descricao' },
                                        { header: 'Data', dataKey: 'data' },
                                        { header: 'Valor', dataKey: 'valor', format: 'currency', align: 'right' },
                                    ],
                                    rows: contrato.movimentos.map((item) => ({
                                        tipo: item.tipo,
                                        descricao: item.descricao,
                                        data: item.data ? formatarDataServidor(item.data, configuracoes) : '-',
                                        valor: item.valor,
                                    })),
                                    emptyMessage: 'Nenhuma receita paga ou custo foi vinculado a este contrato.',
                                },
                            ]}
                        />
                    </>
                }
            />

            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <ReportKPICard
                    title="Receita"
                    value={contrato.receita.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: configuracoes.moeda,
                    })}
                    icon={DollarSign}
                    color="green"
                />

                <ReportKPICard
                    title="Custos"
                    value={contrato.custos.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: configuracoes.moeda,
                    })}
                    icon={Wallet}
                    color="red"
                />

                <ReportKPICard
                    title="Lucro"
                    value={contrato.lucro.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: configuracoes.moeda,
                    })}
                    icon={TrendingUp}
                    color="blue"
                />

                <ReportKPICard title="Margem" value={`${contrato.margem.toFixed(1)}%`} icon={Percent} color="yellow" />
            </section>

            <ReportTable
                title="Movimentações do Contrato"
                description="Receitas pagas e custos vinculados que compõem o resultado."
                columns={[
                    { key: 'tipo', title: 'Tipo' },
                    { key: 'descricao', title: 'Descrição' },
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
                            item.valor.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: configuracoes.moeda,
                            }),
                    },
                ]}
                data={contrato.movimentos}
                emptyMessage="Nenhuma receita paga ou custo foi vinculado a este contrato."
            />
        </main>
    );
}
