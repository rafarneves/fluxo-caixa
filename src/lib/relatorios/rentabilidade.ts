import { buscarDadosFinanceiros } from '@/lib/financeiro/buscarDados';

export type RentabilidadeContrato = {
    id: string;
    cliente: string;
    contrato: string;
    receita: number;
    custos: number;
    lucro: number;
    margem: number;
};

function calcularContrato(contrato: any, recebimentos: any[], custosContrato: any[]): RentabilidadeContrato {
    const receita = recebimentos
        .filter(
            (recebimento: any) =>
                String(recebimento.contrato_id) === String(contrato.id) && recebimento.status === 'Pago'
        )
        .reduce((total: number, recebimento: any) => total + Number(recebimento.valor), 0);

    const custos = custosContrato
        .filter((custo: any) => String(custo.contrato_id) === String(contrato.id))
        .reduce((total: number, custo: any) => total + Number(custo.valor), 0);

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
    };
}

export async function getRentabilidadeContratos(): Promise<{
    contratos: RentabilidadeContrato[];
    totais: {
        receita: number;
        custos: number;
        lucro: number;
        margem: number;
    };
}> {
    const dados = await buscarDadosFinanceiros();

    const contratos: RentabilidadeContrato[] = dados.contratos.map((contrato: any) =>
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

export async function getRentabilidadeContrato(id: string): Promise<RentabilidadeContrato | null> {
    const dados = await buscarDadosFinanceiros();

    const contrato = dados.contratos.find((item: any) => String(item.id).trim() === String(id).trim());

    if (!contrato) {
        return null;
    }

    return calcularContrato(contrato, dados.recebimentos, dados.custosContrato);
}
