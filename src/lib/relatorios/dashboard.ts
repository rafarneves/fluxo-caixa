import { buscarDadosFinanceiros } from '@/lib/financeiro/buscarDados';
import { calcularIndicadores } from '@/lib/financeiro/calcularIndicadores';
import { getContextoConfiguracoes } from '@/lib/configuracoes-server';

function getCompetencia(data: string | Date, timeZone: string) {
    if (typeof data === 'string') {
        const match = data.match(/^(\d{4})-(\d{2})/);

        if (match) {
            const [, year, month] = match;
            const reference = new Date(Date.UTC(Number(year), Number(month) - 1, 15, 12));

            return {
                key: `${year}-${month}`,
                label: reference.toLocaleDateString('pt-BR', {
                    month: 'short',
                    year: 'numeric',
                    timeZone: 'UTC',
                }),
            };
        }
    }

    const d = new Date(data);

    if (Number.isNaN(d.getTime())) return null;

    const parts = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        timeZone,
    }).formatToParts(d);
    const year = parts.find((part) => part.type === 'year')?.value;
    const month = parts.find((part) => part.type === 'month')?.value;

    if (!year || !month) return null;

    return {
        key: `${year}-${month}`,
        label: d.toLocaleDateString('pt-BR', {
            month: 'short',
            year: 'numeric',
            timeZone,
        }),
    };
}

export async function getDashboardExecutivo(periodo = 'todos') {
    const { configuracoes } = await getContextoConfiguracoes();
    const dados = await buscarDadosFinanceiros({ periodo });

    const indicadores = calcularIndicadores(dados, configuracoes.fusoHorario);

    const mapa = new Map<
        string,
        {
            key: string;
            mes: string;
            recebido: number;
            despesas: number;
            custos: number;
        }
    >();

    dados.recebimentos
        .filter((r) => r.status === 'Pago')
        .forEach((r) => {
            const competencia = getCompetencia(r.vencimento, configuracoes.fusoHorario);

            if (!competencia) return;

            if (!mapa.has(competencia.key)) {
                mapa.set(competencia.key, {
                    key: competencia.key,
                    mes: competencia.label,
                    recebido: 0,
                    despesas: 0,
                    custos: 0,
                });
            }

            mapa.get(competencia.key)!.recebido += Number(r.valor_recebido ?? r.valor);
        });

    dados.despesas.forEach((d) => {
        if (!d.data) return;

        const competencia = getCompetencia(d.data, configuracoes.fusoHorario);

        if (!competencia) return;

        if (!mapa.has(competencia.key)) {
            mapa.set(competencia.key, {
                key: competencia.key,
                mes: competencia.label,
                recebido: 0,
                despesas: 0,
                custos: 0,
            });
        }

        mapa.get(competencia.key)!.despesas += Number(d.valor);
    });

    dados.custosContrato.forEach((c) => {
        if (!c.data) return;

        const competencia = getCompetencia(c.data, configuracoes.fusoHorario);

        if (!competencia) return;

        if (!mapa.has(competencia.key)) {
            mapa.set(competencia.key, {
                key: competencia.key,
                mes: competencia.label,
                recebido: 0,
                despesas: 0,
                custos: 0,
            });
        }

        mapa.get(competencia.key)!.custos += Number(c.valor);
    });

    const grafico = Array.from(mapa.values())
        .sort((a, b) => a.key.localeCompare(b.key))
        .slice(-12)
        .map((item) => ({
            mes: item.mes,
            recebido: item.recebido,
            despesas: item.despesas,
            custos: item.custos,
            lucro: item.recebido - item.despesas - item.custos,
        }));

    const resumo = {
        clientes: indicadores.totalClientes,
        contratos: indicadores.contratosAtivos,
        ticketMedio: indicadores.ticketMedio,
        recebimentosPendentes: indicadores.emAberto,
        faturamento: indicadores.faturamentoMensal,
        lucro: indicadores.lucro,
    };

    const kpis = {
        recebido: indicadores.recebido,
        emAberto: indicadores.emAberto,
        despesas: indicadores.despesasTotal,
        custos: indicadores.custosTotal,
        lucro: indicadores.lucro,
        margem: indicadores.margem,
        faturamento: indicadores.faturamentoMensal,
        ticketMedio: indicadores.ticketMedio,
    };

    return {
        ...dados,
        ...indicadores,
        grafico,
        resumo,
        kpis,
    };
}
