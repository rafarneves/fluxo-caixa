import 'server-only';

import type { Configuracoes } from '@/lib/configuracoes';
import { formatarMoedaServidor } from '@/lib/configuracoes-server';
import type { NotificacaoSistema } from '@/lib/notificacoes';
import { createClient } from '@/lib/supabase/server';

type Recebimento = {
    valor: number | string;
    valor_recebido: number | string | null;
    vencimento: string;
    status: string | null;
};

type Saida = {
    valor: number | string;
};

type ContaPagar = {
    vencimento: number | string;
    status: string;
};

function dataISOnoFuso(fusoHorario: string) {
    const partes = new Intl.DateTimeFormat('en-CA', {
        timeZone: fusoHorario,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
        .formatToParts(new Date())
        .reduce<Record<string, string>>((resultado, parte) => {
            resultado[parte.type] = parte.value;
            return resultado;
        }, {});

    return `${partes.year}-${partes.month}-${partes.day}`;
}

function adicionarDias(dataISO: string, dias: number) {
    const data = new Date(`${dataISO}T00:00:00Z`);
    data.setUTCDate(data.getUTCDate() + dias);
    return data.toISOString().slice(0, 10);
}

function inicioDaSemana(dataISO: string) {
    const data = new Date(`${dataISO}T00:00:00Z`);
    const distanciaAteSegunda = (data.getUTCDay() + 6) % 7;
    data.setUTCDate(data.getUTCDate() - distanciaAteSegunda);
    return data.toISOString().slice(0, 10);
}

function somarValores<T>(itens: T[], obterValor: (item: T) => number) {
    return itens.reduce((total, item) => total + obterValor(item), 0);
}

export async function getNotificacoesSistema(configuracoes: Configuracoes): Promise<NotificacaoSistema[]> {
    if (!configuracoes.notificacoesVencimento && !configuracoes.resumoSemanal && !configuracoes.alertasFinanceiros) {
        return [];
    }

    const supabase = await createClient();
    const hoje = dataISOnoFuso(configuracoes.fusoHorario);
    const limiteVencimentos = adicionarDias(hoje, 7);
    const inicioSemana = inicioDaSemana(hoje);

    const [pendentesResult, contasResult, recebidosSemanaResult, despesasSemanaResult, custosSemanaResult] =
        await Promise.all([
            configuracoes.notificacoesVencimento || configuracoes.alertasFinanceiros
                ? supabase
                      .from('recebimentos')
                      .select('valor, valor_recebido, vencimento, status')
                      .or('status.neq.Pago,status.is.null')
                      .lte('vencimento', limiteVencimentos)
                : Promise.resolve({ data: [] }),
            configuracoes.notificacoesVencimento
                ? supabase.from('contas_pagar').select('vencimento, status').eq('status', 'Pendente')
                : Promise.resolve({ data: [] }),
            configuracoes.resumoSemanal
                ? supabase
                      .from('recebimentos')
                      .select('valor, valor_recebido, vencimento, status')
                      .eq('status', 'Pago')
                      .gte('vencimento', inicioSemana)
                      .lte('vencimento', hoje)
                : Promise.resolve({ data: [] }),
            configuracoes.resumoSemanal
                ? supabase.from('despesas').select('valor').gte('data', inicioSemana).lte('data', hoje)
                : Promise.resolve({ data: [] }),
            configuracoes.resumoSemanal
                ? supabase.from('custos_contrato').select('valor').gte('data', inicioSemana).lte('data', hoje)
                : Promise.resolve({ data: [] }),
        ]);

    const pendentes = (pendentesResult.data ?? []) as Recebimento[];
    const contas = (contasResult.data ?? []) as ContaPagar[];
    const recebidosSemana = (recebidosSemanaResult.data ?? []) as Recebimento[];
    const despesasSemana = (despesasSemanaResult.data ?? []) as Saida[];
    const custosSemana = (custosSemanaResult.data ?? []) as Saida[];
    const notificacoes: NotificacaoSistema[] = [];

    if (configuracoes.alertasFinanceiros) {
        const vencidos = pendentes.filter((item) => item.vencimento.slice(0, 10) < hoje);
        const totalVencido = somarValores(vencidos, (item) => Number(item.valor));

        if (vencidos.length > 0) {
            notificacoes.push({
                id: `alerta-inadimplencia-${hoje}`,
                tipo: 'alerta',
                severidade: 'error',
                titulo: `${vencidos.length} recebimento${vencidos.length === 1 ? '' : 's'} em atraso`,
                descricao: `${formatarMoedaServidor(totalVencido, configuracoes)} aguardando recebimento.`,
                href: '/recebimentos',
            });
        }
    }

    if (configuracoes.notificacoesVencimento) {
        const vencemHoje = pendentes.filter((item) => item.vencimento.slice(0, 10) === hoje);
        const proximos = pendentes.filter((item) => {
            const vencimento = item.vencimento.slice(0, 10);
            return vencimento > hoje && vencimento <= limiteVencimentos;
        });

        if (vencemHoje.length > 0) {
            notificacoes.push({
                id: `vencimentos-hoje-${hoje}`,
                tipo: 'vencimento',
                severidade: 'warning',
                titulo: `${vencemHoje.length} recebimento${vencemHoje.length === 1 ? '' : 's'} vence${vencemHoje.length === 1 ? '' : 'm'} hoje`,
                descricao: `${formatarMoedaServidor(
                    somarValores(vencemHoje, (item) => Number(item.valor)),
                    configuracoes
                )} previstos para hoje.`,
                href: '/recebimentos',
            });
        }

        if (proximos.length > 0) {
            notificacoes.push({
                id: `proximos-vencimentos-${hoje}`,
                tipo: 'vencimento',
                severidade: 'info',
                titulo: `${proximos.length} vencimento${proximos.length === 1 ? '' : 's'} nos próximos 7 dias`,
                descricao: `${formatarMoedaServidor(
                    somarValores(proximos, (item) => Number(item.valor)),
                    configuracoes
                )} a receber no período.`,
                href: '/recebimentos',
            });
        }

        const diaHoje = Number(hoje.slice(-2));
        const diaLimite = Number(limiteVencimentos.slice(-2));
        const mudouMes = hoje.slice(0, 7) !== limiteVencimentos.slice(0, 7);
        const contasProximas = contas.filter((conta) => {
            const dia = Number(conta.vencimento);
            return mudouMes ? dia >= diaHoje || dia <= diaLimite : dia >= diaHoje && dia <= diaLimite;
        });

        if (contasProximas.length > 0) {
            notificacoes.push({
                id: `contas-proximas-${hoje}`,
                tipo: 'vencimento',
                severidade: 'warning',
                titulo: `${contasProximas.length} conta${contasProximas.length === 1 ? '' : 's'} a pagar em breve`,
                descricao: 'Existem contas pendentes com vencimento nos próximos 7 dias.',
                href: '/contas-pagar',
            });
        }
    }

    if (configuracoes.resumoSemanal) {
        const totalRecebido = somarValores(recebidosSemana, (item) => Number(item.valor_recebido ?? item.valor));
        const totalSaidas =
            somarValores(despesasSemana, (item) => Number(item.valor)) +
            somarValores(custosSemana, (item) => Number(item.valor));
        const saldo = totalRecebido - totalSaidas;

        notificacoes.push({
            id: `resumo-semanal-${inicioSemana}`,
            tipo: 'resumo',
            severidade: saldo >= 0 ? 'success' : 'warning',
            titulo: 'Resumo financeiro da semana',
            descricao: `Entradas de ${formatarMoedaServidor(totalRecebido, configuracoes)}, saídas de ${formatarMoedaServidor(totalSaidas, configuracoes)} e saldo de ${formatarMoedaServidor(saldo, configuracoes)}.`,
            href: '/fluxo-caixa',
        });
    }

    return notificacoes;
}
