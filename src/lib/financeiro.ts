export type RecebimentoFinanceiro = {
    valor: number;
    valor_recebido: number | null;
    vencimento: string;
    status: string | null;
};

export type RecebimentoFaturamento = {
    valor: number;
    competencia: string | null;
    vencimento: string;
    status: string | null;
};

export type FaturamentoMensal = {
    mes: string;
    valor: number;
};

function obterCompetencia(recebimento: RecebimentoFaturamento) {
    const competencia = recebimento.competencia?.trim() ?? '';

    if (/^\d{4}-(0[1-9]|1[0-2])$/.test(competencia)) {
        return competencia;
    }

    const competenciaAntiga = competencia.match(/^(0[1-9]|1[0-2])\/(\d{4})$/);

    if (competenciaAntiga) {
        return `${competenciaAntiga[2]}-${competenciaAntiga[1]}`;
    }

    const competenciaVencimento = recebimento.vencimento?.slice(0, 7) ?? '';

    return /^\d{4}-(0[1-9]|1[0-2])$/.test(competenciaVencimento) ? competenciaVencimento : null;
}

export function calcularEvolucaoFaturamento(
    recebimentos: RecebimentoFaturamento[],
    quantidadeMeses = 6,
    referencia = new Date()
): FaturamentoMensal[] {
    const totalMeses = Math.max(1, Math.trunc(quantidadeMeses));
    const competencias = Array.from({ length: totalMeses }, (_, indice) => {
        const data = new Date(referencia.getFullYear(), referencia.getMonth() - (totalMeses - 1 - indice), 1);
        return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
    });
    const totais = new Map(competencias.map((competencia) => [competencia, 0]));
    let encontrouFaturamento = false;

    recebimentos.forEach((recebimento) => {
        if (recebimento.status?.toLowerCase() === 'cancelado') {
            return;
        }

        const competencia = obterCompetencia(recebimento);

        if (!competencia || !totais.has(competencia)) {
            return;
        }

        totais.set(competencia, (totais.get(competencia) ?? 0) + Number(recebimento.valor || 0));
        encontrouFaturamento = true;
    });

    if (!encontrouFaturamento) {
        return [];
    }

    return competencias.map((mes) => ({
        mes,
        valor: totais.get(mes) ?? 0,
    }));
}

export function calcularFinanceiro(recebimentos: RecebimentoFinanceiro[]) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const hojeString = hoje.toISOString().split('T')[0];

    const recebido = recebimentos
        .filter((r) => r.status === 'Pago')
        .reduce((total, r) => total + Number(r.valor_recebido ?? r.valor), 0);

    const emAberto = recebimentos.filter((r) => r.status !== 'Pago').reduce((total, r) => total + Number(r.valor), 0);

    const receberHoje = recebimentos
        .filter((r) => r.status !== 'Pago' && r.vencimento === hojeString)
        .reduce((total, r) => total + Number(r.valor), 0);

    const atrasados = recebimentos.filter((r) => {
        if (r.status === 'Pago') return false;

        const vencimento = new Date(r.vencimento);
        vencimento.setHours(0, 0, 0, 0);

        return vencimento < hoje;
    });

    return {
        recebido,
        emAberto,
        receberHoje,
        atrasadosQuantidade: atrasados.length,
        atrasadosValor: atrasados.reduce((total, r) => total + Number(r.valor), 0),
        percentualRecebimento: recebido + emAberto === 0 ? 0 : Math.round((recebido / (recebido + emAberto)) * 100),
    };
}
