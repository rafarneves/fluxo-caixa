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

export type FaturamentoPeriodo = {
    periodo: string;
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

function dataValida(valor: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
        return false;
    }

    const [ano, mes, dia] = valor.split('-').map(Number);
    const data = new Date(Date.UTC(ano, mes - 1, dia));

    return data.getUTCFullYear() === ano && data.getUTCMonth() === mes - 1 && data.getUTCDate() === dia;
}

function adicionarDias(valor: string, quantidade: number) {
    const [ano, mes, dia] = valor.split('-').map(Number);
    const data = new Date(Date.UTC(ano, mes - 1, dia + quantidade));

    return data.toISOString().slice(0, 10);
}

function adicionarMeses(valor: string, quantidade: number) {
    const [ano, mes] = valor.split('-').map(Number);
    const data = new Date(Date.UTC(ano, mes - 1 + quantidade, 1));

    return data.toISOString().slice(0, 7);
}

export function calcularEvolucaoFaturamentoPorPeriodo(
    recebimentos: RecebimentoFaturamento[],
    inicio: string,
    fim: string
): FaturamentoPeriodo[] {
    if (!dataValida(inicio) || !dataValida(fim) || inicio > fim) {
        return [];
    }

    const diferencaDias = Math.floor(
        (Date.parse(`${fim}T00:00:00Z`) - Date.parse(`${inicio}T00:00:00Z`)) / (24 * 60 * 60 * 1000)
    );
    const agruparPorMes = diferencaDias > 45;
    const inicioPeriodo = agruparPorMes ? inicio.slice(0, 7) : inicio;
    const fimPeriodo = agruparPorMes ? fim.slice(0, 7) : fim;
    const periodos: string[] = [];

    for (let periodo = inicioPeriodo; periodo <= fimPeriodo;) {
        periodos.push(periodo);
        periodo = agruparPorMes ? adicionarMeses(periodo, 1) : adicionarDias(periodo, 1);
    }

    const totais = new Map(periodos.map((periodo) => [periodo, 0]));

    recebimentos.forEach((recebimento) => {
        if (recebimento.status?.toLowerCase() === 'cancelado') {
            return;
        }

        const vencimento = recebimento.vencimento?.slice(0, 10) ?? '';

        if (!dataValida(vencimento) || vencimento < inicio || vencimento > fim) {
            return;
        }

        const periodo = agruparPorMes ? vencimento.slice(0, 7) : vencimento;
        totais.set(periodo, (totais.get(periodo) ?? 0) + Number(recebimento.valor || 0));
    });

    return periodos.map((periodo) => ({
        periodo,
        valor: totais.get(periodo) ?? 0,
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
