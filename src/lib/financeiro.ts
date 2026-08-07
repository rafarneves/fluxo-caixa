export type RecebimentoFinanceiro = {
    valor: number;
    valor_recebido: number | null;
    vencimento: string;
    status: string | null;
};

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
