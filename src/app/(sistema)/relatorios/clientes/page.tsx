import { Users, UserPlus, FileText, TrendingUp } from 'lucide-react';
import { formatarDataServidor, getContextoConfiguracoes } from '@/lib/configuracoes-server';

import ReportHeader from '@/components/relatorios/ReportHeader';
import ReportKPICard from '@/components/relatorios/ReportKPICard';
import ReportExport from '@/components/relatorios/ReportExport';
import ReportTable from '@/components/relatorios/ReportTable';

import { getDashboardExecutivo } from '@/lib/relatorios/dashboard';

export default async function RelatorioClientesPage() {
    const { configuracoes } = await getContextoConfiguracoes();
    const dados = await getDashboardExecutivo();

    const clientes = dados.clientes;
    const contratos = dados.contratos;
    const contratosAtivos = contratos.filter((contrato) => contrato.status === 'Ativo');
    const limiteNovosClientes = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const novosClientes = clientes.filter((cliente) => {
        const cadastro = new Date(cliente.created_at).getTime();

        return Number.isFinite(cadastro) && cadastro >= limiteNovosClientes;
    }).length;

    return (
        <main id="report-content" className="space-y-8">
            <ReportHeader
                title="Clientes"
                description="Relatório completo dos clientes cadastrados."
                actions={<ReportExport reportTitle="Clientes" />}
            />

            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <ReportKPICard title="Clientes" value={clientes.length} icon={Users} color="blue" isCurrency={false} />

                <ReportKPICard
                    title="Contratos Ativos"
                    value={contratosAtivos.length}
                    icon={FileText}
                    color="green"
                    isCurrency={false}
                />

                <ReportKPICard
                    title="Novos Clientes"
                    value={novosClientes}
                    icon={UserPlus}
                    color="yellow"
                    isCurrency={false}
                    description="Últimos 30 dias"
                />

                <ReportKPICard title="Ticket Médio" value={dados.ticketMedio} icon={TrendingUp} color="green" />
            </section>

            <ReportTable
                title="Clientes Cadastrados"
                description="Lista completa dos clientes."
                columns={[
                    {
                        key: 'nome',
                        title: 'Nome',
                    },
                    {
                        key: 'telefone',
                        title: 'Telefone',
                    },
                    {
                        key: 'email',
                        title: 'E-mail',
                    },
                    {
                        key: 'created_at',
                        title: 'Cadastro',
                        render: (item) => formatarDataServidor(item.created_at, configuracoes),
                    },
                ]}
                data={clientes}
            />
        </main>
    );
}
