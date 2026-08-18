import { formatarDataServidor, getContextoConfiguracoes } from '@/lib/configuracoes-server';
import { DollarSign, Wallet, TrendingUp, Percent } from 'lucide-react';
import { notFound } from 'next/navigation';

import ReportHeader from '@/components/relatorios/ReportHeader';
import ReportKPICard from '@/components/relatorios/ReportKPICard';
import ReportExport from '@/components/relatorios/ReportExport';
import ReportTable from '@/components/relatorios/ReportTable';
import ReportPeriodFilter from '@/components/relatorios/ReportPeriodFilter';

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
                actions={
                    <>
                        <ReportPeriodFilter />
                        <ReportExport reportTitle={`Rentabilidade - ${contrato.contrato}`} />
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
