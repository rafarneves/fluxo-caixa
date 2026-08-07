import { BarChart3, DollarSign, Receipt, TrendingUp, Users, Wallet } from 'lucide-react';

import ReportHeader from '@/components/relatorios/ReportHeader';
import ReportKPICard from '@/components/relatorios/ReportKPICard';
import ReportChart from '@/components/relatorios/ReportChart';
import ReportTable from '@/components/relatorios/ReportTable';
import ReportExport from '@/components/relatorios/ReportExport';
import ExecutiveChart from '@/components/relatorios/ExecutiveChart';

import { getDashboardExecutivo } from '@/lib/relatorios/dashboard';

export default async function DashboardExecutivoPage() {
    const dados = await getDashboardExecutivo();

    return (
        <main className="space-y-8">
            <ReportHeader
                title="Dashboard Executivo"
                description="Resumo executivo dos principais indicadores financeiros da empresa."
                actions={<ReportExport disabledPDF disabledExcel />}
            />

            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                <ReportKPICard title="Receita Recebida" value={dados.kpis.recebido} icon={DollarSign} color="green" />

                <ReportKPICard title="Em Aberto" value={dados.kpis.emAberto} icon={Wallet} color="yellow" />

                <ReportKPICard
                    title="Lucro"
                    value={dados.kpis.lucro}
                    icon={TrendingUp}
                    color={dados.kpis.lucro >= 0 ? 'green' : 'red'}
                />

                <ReportKPICard title="Despesas" value={dados.kpis.despesas} icon={Receipt} color="red" />

                <ReportKPICard
                    title="Clientes"
                    value={dados.resumo.clientes}
                    icon={Users}
                    color="blue"
                    isCurrency={false}
                />

                <ReportKPICard
                    title="Margem"
                    value={`${dados.kpis.margem.toFixed(1)}%`}
                    icon={BarChart3}
                    color="green"
                    isCurrency={false}
                />
            </section>

            <ReportChart title="Receitas x Despesas" description="Comparativo financeiro por período.">
                <ExecutiveChart data={dados.grafico} />
            </ReportChart>

            <ReportTable
                title="Últimas Atividades"
                description="Eventos recentes registrados no sistema."
                columns={[
                    {
                        key: 'titulo',
                        title: 'Título',
                    },
                    {
                        key: 'descricao',
                        title: 'Descrição',
                    },
                    {
                        key: 'data',
                        title: 'Data',
                    },
                ]}
                data={dados.atividades}
            />
        </main>
    );
}
