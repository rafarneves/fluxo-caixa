export function formatMoneyCompact(value: number, currency = 'BRL') {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency,
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value || 0);
}

export function formatMoney(value: number, currency = 'BRL') {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency,
    }).format(value);
}

export function formatPercent(value: number) {
    return `${value.toFixed(1).replace('.', ',')}%`;
}

export function formatDate(date: string, timeZone = 'America/Sao_Paulo') {
    if (!date) return '-';

    return new Intl.DateTimeFormat('pt-BR', { timeZone }).format(new Date(date));
}
