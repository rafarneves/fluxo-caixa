import { calcularFinanceiro } from '@/lib/financeiro';
import type {
    ClienteFinanceiro,
    ContratoFinanceiro,
    CustoContratoFinanceiro,
    DespesaFinanceira,
    RecebimentoFinanceiroDetalhado,
} from '@/lib/financeiro/buscarDados';

type DadosFinanceiros = {
    clientes: ClienteFinanceiro[];
    contratos: ContratoFinanceiro[];
    recebimentos: RecebimentoFinanceiroDetalhado[];
    despesas: DespesaFinanceira[];
    custosContrato: CustoContratoFinanceiro[];
};

export function calcularIndicadores(
    { clientes, contratos, recebimentos, despesas, custosContrato }: DadosFinanceiros,
    timeZone = 'America/Sao_Paulo'
) {
    const financeiro = calcularFinanceiro(recebimentos, timeZone);

    const totalClientes = clientes.length;

    const contratosAtivosData = contratos.filter((contrato) => contrato.status === 'Ativo');

    const contratosAtivos = contratosAtivosData.length;

    const faturamentoMensal = contratosAtivosData.reduce((total, contrato) => total + Number(contrato.valor), 0);

    const despesasTotal = despesas.reduce((total, despesa) => total + Number(despesa.valor), 0);

    const custosTotal = custosContrato.reduce((total, custo) => total + Number(custo.valor), 0);

    const totalSaidas = despesasTotal + custosTotal;

    const lucro = financeiro.recebido - totalSaidas;

    const ticketMedio = contratosAtivos === 0 ? 0 : faturamentoMensal / contratosAtivos;

    const margem = financeiro.recebido === 0 ? 0 : (lucro / financeiro.recebido) * 100;

    const formatarDataAtividade = (data: string) => {
        const dataCivil = data.match(/^(\d{4})-(\d{2})-(\d{2})$/);

        if (dataCivil) return `${dataCivil[3]}/${dataCivil[2]}/${dataCivil[1]}`;

        return new Intl.DateTimeFormat('pt-BR', { timeZone }).format(new Date(data));
    };

    const atividades = [
        ...clientes.map((cliente) => ({
            id: `cliente-${cliente.id}`,
            titulo: 'Novo cliente cadastrado',
            descricao: cliente.nome,
            data: formatarDataAtividade(cliente.created_at),
            ordem: new Date(cliente.created_at).getTime(),
            tipo: 'cliente' as const,
        })),

        ...recebimentos
            .filter((r) => r.status === 'Pago')
            .map((r) => ({
                id: `pagamento-${r.id}`,
                titulo: 'Pagamento recebido',
                descricao: r.contratos?.clientes?.nome ?? 'Cliente',
                data: formatarDataAtividade(r.vencimento),
                ordem: new Date(r.vencimento).getTime(),
                tipo: 'pagamento' as const,
            })),
    ]
        .sort((a, b) => b.ordem - a.ordem)
        .slice(0, 6)
        .map((atividade) => ({
            id: atividade.id,
            titulo: atividade.titulo,
            descricao: atividade.descricao,
            data: atividade.data,
            tipo: atividade.tipo,
        }));

    return {
        totalClientes,
        contratosAtivos,

        faturamentoMensal,

        recebido: financeiro.recebido,
        emAberto: financeiro.emAberto,
        atrasados: financeiro.atrasadosValor,

        percentualRecebimento: financeiro.percentualRecebimento,

        despesasTotal,

        custosTotal,

        totalSaidas,

        lucro,

        margem,

        ticketMedio,

        atividades,
    };
}
