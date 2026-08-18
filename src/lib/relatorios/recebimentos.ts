export type RecebimentoRelatorio = {
    status?: string | null;
    vencimento?: string | null;
};

function hojeNoFuso(timeZone: string) {
    const parts = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone,
    }).formatToParts(new Date());
    const year = parts.find((part) => part.type === 'year')?.value;
    const month = parts.find((part) => part.type === 'month')?.value;
    const day = parts.find((part) => part.type === 'day')?.value;

    return `${year}-${month}-${day}`;
}

export function getStatusRecebimento(recebimento: RecebimentoRelatorio, timeZone: string) {
    if (recebimento.status === 'Pago') return 'Pago';
    if (recebimento.status === 'Cancelado') return 'Cancelado';

    const vencimento = recebimento.vencimento?.slice(0, 10);

    return vencimento && vencimento < hojeNoFuso(timeZone) ? 'Vencido' : 'Pendente';
}
