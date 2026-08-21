import { createClient } from '@/lib/supabase/server';
import { formatarDataServidor, getContextoConfiguracoes } from '@/lib/configuracoes-server';
import { calcularFinanceiro } from '@/lib/financeiro';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import AdvancedMetrics from '@/components/dashboard/AdvancedMetrics';
import FinanceCard from '@/components/dashboard/FinanceCard';
import PlansCard, { type PlanoDistribuicao } from '@/components/dashboard/PlansCard';
import ContractsTable from '@/components/dashboard/ContractsTable';
import RevenueChart from '@/components/dashboard/RevenueChart';
import UpcomingReceivables from '@/components/dashboard/UpcomingReceivables';
import RecentActivity from '@/components/dashboard/RecentActivity';
import FinalizingContractsTable from '@/components/dashboard/FinalizingContractsTable';

type Contrato = {
    id: string;
    valor: number;
    vencimento: number;
    status: string;
    nome: string | null;
    cliente_id: string;
    clientes: { nome: string } | null;
    data_fim: string | null;
};

type Cliente = {
    id: string;
    nome: string;
    created_at: string;
};

type Recebimento = {
    id: string;
    valor: number;
    valor_recebido: number | null;
    competencia: string | null;
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

type Despesa = {
    valor: number;
};

type DistribuicaoPlanoRpc = {
    // Texto livre do plano (contratos.nome), usado como chave da distribuicao.
    plano_id: string;
    slug: string;
    nome: string;
    total: number | string;
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
        { data: distribuicaoPlanos, error: erroDistribuicaoPlanos },
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
        supabase.rpc('dashboard_distribuicao_planos'),
    ]);

    if (erroDistribuicaoPlanos) {
        throw new Error(`Erro ao carregar a distribuição dos planos: ${erroDistribuicaoPlanos.message}`);
    }

    const clientesData = (clientes ?? []) as Cliente[];
    const contratosData = (contratos ?? []) as Contrato[];
    const contratosAtivosData = contratosData;
    const partesHoje = new Intl.DateTimeFormat('pt-BR', {
        timeZone: configuracoes.fusoHorario,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
        .formatToParts(new Date())
        .reduce<Record<string, string>>((partes, parte) => {
            partes[parte.type] = parte.value;
            return partes;
        }, {});
    const hojeISO = `${partesHoje.year}-${partesHoje.month}-${partesHoje.day}`;
    const dataLimite = new Date(`${hojeISO}T00:00:00Z`);
    dataLimite.setUTCDate(dataLimite.getUTCDate() + 30);
    const limiteISO = dataLimite.toISOString().slice(0, 10);
    const contratosFinalizacaoData = contratosData
        .filter((contrato) => {
            const dataFim = contrato.data_fim?.slice(0, 10);

            return Boolean(dataFim && dataFim >= hojeISO && dataFim <= limiteISO);
        })
        .sort((a, b) => String(a.data_fim).localeCompare(String(b.data_fim)));
    const recebimentosData = (recebimentos ?? []) as Recebimento[];
    const despesasData = (despesas ?? []) as Despesa[];
    const custosData = (custosContrato ?? []) as CustoContrato[];
    const planosData = ((distribuicaoPlanos ?? []) as DistribuicaoPlanoRpc[]).map<PlanoDistribuicao>((plano) => ({
        planoId: plano.plano_id,
        slug: plano.slug,
        nome: plano.nome,
        total: Number(plano.total),
    }));

    const financeiro = calcularFinanceiro(recebimentosData);
    const totalClientes = clientesData.length;
    const contratosAtivos = planosData.reduce((total, plano) => total + plano.total, 0);

    const faturamentoMensal = contratosAtivosData.reduce((total, contrato) => total + Number(contrato.valor), 0);

    const despesasTotal = despesasData.reduce((total, despesa) => total + Number(despesa.valor), 0);

    const custosTotal = custosData.reduce((total, custo) => total + Number(custo.valor), 0);

    const saidasTotal = despesasTotal + custosTotal;

    const resultadoEmpresa = financeiro.recebido - saidasTotal;

    const ticketMedio = contratosAtivos === 0 ? 0 : faturamentoMensal / contratosAtivos;

    const atividades = [
        ...clientesData.slice(0, 3).map((cliente) => ({
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

            <RevenueChart recebimentos={recebimentosData} />

            <div className="grid grid-cols-1 gap-6 min-[1440px]:grid-cols-2">
                <FinanceCard
                    recebido={financeiro.recebido}
                    emAberto={financeiro.emAberto}
                    despesas={despesasTotal}
                    custos={custosTotal}
                    resultado={resultadoEmpresa}
                />

                <PlansCard planos={planosData} />
            </div>

            <UpcomingReceivables recebimentos={recebimentosData} />

            <RecentActivity atividades={atividades} />

            <ContractsTable contratos={contratosAtivosData} />

            <FinalizingContractsTable contratos={contratosFinalizacaoData} />
        </main>
    );
}
