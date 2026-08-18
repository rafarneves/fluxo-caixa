import { buscarDadosFinanceiros } from '@/lib/financeiro/buscarDados';
import type {
    ContratoFinanceiro,
    CustoContratoFinanceiro,
    RecebimentoFinanceiroDetalhado,
} from '@/lib/financeiro/buscarDados';

export type RentabilidadeContrato = {
    id: string;
    cliente: string;
    contrato: string;
    receita: number;
    custos: number;
    lucro: number;
    margem: number;
    movimentos: MovimentoRentabilidade[];
};

export type MovimentoRentabilidade = {
    id: string;
    tipo: 'Receita' | 'Custo';
    descricao: string;
    data: string | null;
    valor: number;
};

function calcularContrato(
    contrato: ContratoFinanceiro,
    recebimentos: RecebimentoFinanceiroDetalhado[],
    custosContrato: CustoContratoFinanceiro[]
): RentabilidadeContrato {
    const recebimentosContrato = recebimentos.filter(
        (recebimento) => String(recebimento.contrato_id) === String(contrato.id) && recebimento.status === 'Pago'
    );

    const custosDoContrato = custosContrato.filter((custo) => String(custo.contrato_id) === String(contrato.id));
    const receita = recebimentosContrato.reduce(
        (total, recebimento) => total + Number(recebimento.valor_recebido ?? recebimento.valor),
        0
    );
    const custos = custosDoContrato.reduce((total, custo) => total + Number(custo.valor), 0);

    const lucro = receita - custos;

    const margem = receita > 0 ? (lucro / receita) * 100 : 0;

    return {
        id: contrato.id,
        cliente: contrato.clientes?.nome ?? '-',
        contrato: contrato.nome,
        receita,
        custos,
        lucro,
        margem,
        movimentos: [
            ...recebimentosContrato.map((recebimento) => ({
                id: `receita-${recebimento.id}`,
                tipo: 'Receita' as const,
                descricao: recebimento.competencia ? `Recebimento ${recebimento.competencia}` : 'Recebimento',
                data: recebimento.vencimento ?? null,
                valor: Number(recebimento.valor_recebido ?? recebimento.valor),
            })),
            ...custosDoContrato.map((custo) => ({
                id: `custo-${custo.id}`,
                tipo: 'Custo' as const,
                descricao: custo.descricao ?? custo.categoria ?? custo.tipo ?? 'Custo do contrato',
                data: custo.data ?? custo.created_at ?? null,
                valor: -Number(custo.valor),
            })),
        ].sort((a, b) => String(b.data ?? '').localeCompare(String(a.data ?? ''))),
    };
}

export async function getRentabilidadeContratos(periodo = 'todos'): Promise<{
    contratos: RentabilidadeContrato[];
    totais: {
        receita: number;
        custos: number;
        lucro: number;
        margem: number;
    };
}> {
    const dados = await buscarDadosFinanceiros({ periodo });

    const contratos: RentabilidadeContrato[] = dados.contratos.map((contrato) =>
        calcularContrato(contrato, dados.recebimentos, dados.custosContrato)
    );

    contratos.sort((a, b) => b.lucro - a.lucro);

    const totais = contratos.reduce(
        (acc, item) => {
            acc.receita += item.receita;
            acc.custos += item.custos;
            acc.lucro += item.lucro;

            return acc;
        },
        {
            receita: 0,
            custos: 0,
            lucro: 0,
            margem: 0,
        }
    );

    totais.margem = totais.receita > 0 ? (totais.lucro / totais.receita) * 100 : 0;

    return {
        contratos,
        totais,
    };
}

export async function getRentabilidadeContrato(id: string, periodo = 'todos'): Promise<RentabilidadeContrato | null> {
    const dados = await buscarDadosFinanceiros({ periodo });

    const contrato = dados.contratos.find((item) => String(item.id).trim() === String(id).trim());

    if (!contrato) {
        return null;
    }

    return calcularContrato(contrato, dados.recebimentos, dados.custosContrato);
}
