import { createClient } from '@/lib/supabase/server';
import { formatarDataServidor, getContextoConfiguracoes } from '@/lib/configuracoes-server';
import { calcularFinanceiro } from '@/lib/financeiro';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import AdvancedMetrics from '@/components/dashboard/AdvancedMetrics';
import FinanceCard from '@/components/dashboard/FinanceCard';
import PlansCard from '@/components/dashboard/PlansCard';
import ContractsTable from '@/components/dashboard/ContractsTable';
import RevenueChart from '@/components/dashboard/RevenueChart';
import UpcomingReceivables from '@/components/dashboard/UpcomingReceivables';
import RecentActivity from '@/components/dashboard/RecentActivity';

type Contrato = {
    id: string;
    valor: number;
    vencimento: number;
    status: string;
    nome: string | null;
    cliente_id: string;
    clientes: { nome: string } | null;
};

type Recebimento = {
    id: string;
    valor: number;
    valor_recebido: number | null;
    vencimento: string;
    status: string | null;
    contratos: {
        nome: string;
        clientes: { nome: string } | null;
    } | null;
};

type CustoContrato = {
    id: string;
    valor: number;
};

export default async function Dashboard() {
    const supabase = await createClient();
    const { configuracoes } = await getContextoConfiguracoes();
    const [
        { data: clientes },
        { data: contratos },
        { data: recebimentos },
        { data: despesas },
        { data: custosContrato },
    ] = await Promise.all([
        supabase.from('clientes').select('*').order('created_at', { ascending: false }),
        supabase
            .from('contratos')
            .select(
                `
      *,
      clientes(nome)
`
            )
            .eq('status', 'Ativo'),
        supabase
            .from('recebimentos')
            .select(
                `
      *,
      contratos(
        nome,
        clientes(nome)
      )
`
            )
            .order('vencimento', { ascending: true }),
        supabase.from('despesas').select('*'),
        supabase.from('custos_contrato').select('id, valor'),
    ]);

    const clientesData = clientes ?? [];
    const contratosData = (contratos ?? []) as Contrato[];
    const recebimentosData = (recebimentos ?? []) as Recebimento[];
    const despesasData = despesas ?? [];
    const custosData = (custosContrato ?? []) as CustoContrato[];

    const financeiro = calcularFinanceiro(recebimentosData);

    const totalClientes = clientesData.length;
    const contratosAtivos = contratosData.length;

    const faturamentoMensal = contratosData.reduce((total, contrato) => total + Number(contrato.valor), 0);

    const despesasTotal = despesasData.reduce((total, despesa: any) => total + Number(despesa.valor), 0);

    const custosTotal = custosData.reduce((total, custo) => total + Number(custo.valor), 0);

    const saidasTotal = despesasTotal + custosTotal;

    const resultadoEmpresa = financeiro.recebido - saidasTotal;

    const ticketMedio = contratosAtivos === 0 ? 0 : faturamentoMensal / contratosAtivos;

    const atividades = [
        ...clientesData.slice(0, 3).map((cliente: any) => ({
            id: cliente.id,
            titulo: 'Novo cliente cadastrado',
            descricao: cliente.nome,
            data: formatarDataServidor(cliente.created_at, configuracoes),
            tipo: 'cliente' as const,
        })),
        ...recebimentosData
            .filter((r) => r.status === 'Pago')
            .slice(0, 3)
            .map((r) => ({
                id: r.id,
                titulo: 'Pagamento recebido',
                descricao: r.contratos?.clientes?.nome ?? 'Cliente',
                data: 'Recente',
                tipo: 'pagamento' as const,
            })),
    ].slice(0, 6);

    return (
        <main className="space-y-8">
            <DashboardHeader />

            <DashboardMetrics
                totalClientes={totalClientes}
                contratosAtivos={contratosAtivos}
                faturamentoMensal={faturamentoMensal}
                emAberto={financeiro.emAberto}
            />

            <AdvancedMetrics
                mrr={faturamentoMensal}
                ticketMedio={ticketMedio}
                percentualRecebimento={financeiro.percentualRecebimento}
                inadimplencia={financeiro.atrasadosValor}
            />

            <RevenueChart />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <FinanceCard
                    recebido={financeiro.recebido}
                    emAberto={financeiro.emAberto}
                    despesas={despesasTotal}
                    custos={custosTotal}
                    resultado={resultadoEmpresa}
                />

                <PlansCard
                    performance={contratosData.filter((c) => c.nome === 'Plano Performance').length}
                    altaPerformance={contratosData.filter((c) => c.nome === 'Plano Alta Performance').length}
                    pro={contratosData.filter((c) => c.nome === 'Plano PRO').length}
                    personalizado={contratosData.filter((c) => c.nome === 'Plano Personalizado').length}
                />
            </div>

            <UpcomingReceivables recebimentos={recebimentosData} />

            <RecentActivity atividades={atividades} />

            <ContractsTable contratos={contratosData} />
        </main>
    );
}
