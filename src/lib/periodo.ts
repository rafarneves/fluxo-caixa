export type TipoPeriodo = 'hoje' | 'semana' | 'mes' | '30dias' | 'ano' | 'personalizado';

export type Periodo = {
    inicio: Date;
    fim: Date;
};

type PeriodoPersonalizado = {
    inicio?: string;
    fim?: string;
};

function criarDataLocal(value?: string) {
    const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (!match) return null;

    const [, ano, mes, dia] = match;
    const data = new Date(Number(ano), Number(mes) - 1, Number(dia));

    if (data.getFullYear() !== Number(ano) || data.getMonth() !== Number(mes) - 1 || data.getDate() !== Number(dia)) {
        return null;
    }

    return data;
}

export function obterPeriodo(periodo: string, personalizado: PeriodoPersonalizado = {}): Periodo {
    const hoje = new Date();

    let inicio = new Date(hoje);
    let fim = new Date(hoje);

    switch (periodo as TipoPeriodo) {
        case 'personalizado': {
            const inicioPersonalizado = criarDataLocal(personalizado.inicio);
            const fimPersonalizado = criarDataLocal(personalizado.fim);

            if (inicioPersonalizado && fimPersonalizado && inicioPersonalizado <= fimPersonalizado) {
                inicio = inicioPersonalizado;
                inicio.setHours(0, 0, 0, 0);
                fim = fimPersonalizado;
                fim.setHours(23, 59, 59, 999);
                break;
            }

            inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            inicio.setHours(0, 0, 0, 0);
            fim = new Date(hoje);
            fim.setHours(23, 59, 59, 999);
            break;
        }

        case 'hoje':
            inicio.setHours(0, 0, 0, 0);
            fim.setHours(23, 59, 59, 999);
            break;

        case 'semana': {
            const diaSemana = hoje.getDay();
            const diferenca = diaSemana === 0 ? 6 : diaSemana - 1;

            inicio = new Date(hoje);
            inicio.setDate(hoje.getDate() - diferenca);
            inicio.setHours(0, 0, 0, 0);

            fim = new Date();
            fim.setHours(23, 59, 59, 999);

            break;
        }

        case '30dias':
            inicio = new Date(hoje);
            inicio.setDate(hoje.getDate() - 30);
            inicio.setHours(0, 0, 0, 0);

            fim = new Date();
            fim.setHours(23, 59, 59, 999);
            break;

        case 'ano':
            inicio = new Date(hoje.getFullYear(), 0, 1);
            inicio.setHours(0, 0, 0, 0);

            fim = new Date();
            fim.setHours(23, 59, 59, 999);
            break;

        case 'mes':
        default:
            inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            inicio.setHours(0, 0, 0, 0);

            fim = new Date();
            fim.setHours(23, 59, 59, 999);
            break;
    }

    return {
        inicio,
        fim,
    };
}
