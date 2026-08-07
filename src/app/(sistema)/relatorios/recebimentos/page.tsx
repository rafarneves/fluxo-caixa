import { formatarDataServidor, formatarMoedaServidor, getContextoConfiguracoes } from '@/lib/configuracoes-server';
import { BadgeDollarSign, Clock3, CheckCircle2, AlertTriangle } from 'lucide-react';

import ReportHeader from '@/components/relatorios/ReportHeader';
import ReportKPICard from '@/components/relatorios/ReportKPICard';
import ReportExport from '@/components/relatorios/ReportExport';
import ReportTable from '@/components/relatorios/ReportTable';

import { getDashboardExecutivo } from '@/lib/relatorios/dashboard';

export default async function RelatorioRecebimentosPage() {
    const { configuracoes } = await getContextoConfiguracoes();
    const dados = await getDashboardExecutivo();

    const recebimentos = dados.recebimentos;

    const pagos = recebimentos.filter((r: any) => r.status === 'Pago');

    const pendentes = recebimentos.filter((r: any) => r.status !== 'Pago' && r.status !== 'Vencido');

    const vencidos = recebimentos.filter((r: any) => r.status === 'Vencido');

    const totalValor = recebimentos.reduce((total: number, item: any) => total + Number(item.valor), 0);

    const totalPago = pagos.reduce((total: number, item: any) => total + Number(item.valor), 0);

    const totalPendente = pendentes.reduce((total: number, item: any) => total + Number(item.valor), 0);

    const totalVencido = vencidos.reduce((total: number, item: any) => total + Number(item.valor), 0);

    return (
        <main className="space-y-8">
            <ReportHeader
                title="Recebimentos"
                description="Relatório completo de cobranças e recebimentos."
                actions={<ReportExport disabledPDF disabledExcel />}
            />

            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <ReportKPICard
                    title="Total"
                    value={formatarMoedaServidor(totalValor, configuracoes, true)}
                    icon={BadgeDollarSign}
                    color="blue"
                />

                <ReportKPICard
                    title="Pagos"
                    value={formatarMoedaServidor(totalPago, configuracoes, true)}
                    icon={CheckCircle2}
                    color="green"
                />

                <ReportKPICard
                    title="Pendentes"
                    value={formatarMoedaServidor(totalPendente, configuracoes, true)}
                    icon={Clock3}
                    color="yellow"
                />

                <ReportKPICard
                    title="Vencidos"
                    value={formatarMoedaServidor(totalVencido, configuracoes, true)}
                    icon={AlertTriangle}
                    color="red"
                />
            </section>

            <ReportTable
                title="Recebimentos"

                description="Lista de todos os recebimentos cadastrados."

                columns={[
                    {
                        key: 'cliente',

                        title: 'Cliente',

                        render: (item: any) => item.contratos?.clientes?.nome ?? '-',
                    },

                    {
                        key: 'vencimento',

                        title: 'Vencimento',

                        render: (item: any) => formatarDataServidor(item.vencimento, configuracoes),
                    },

                    {
                        key: 'status',

                        title: 'Status',
                    },

                    {
                        key: 'valor',

                        title: 'Valor',

                        align: 'right',

                        render: (item: any) =>
                            Number(item.valor).toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: configuracoes.moeda,
                            }),
                    },
                ]}

                data={recebimentos}
            />
        </main>
    );
}
