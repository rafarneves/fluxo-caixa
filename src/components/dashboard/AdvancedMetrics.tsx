'use client';

import { TrendingUp, DollarSign, Percent, AlertTriangle } from 'lucide-react';

import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';
import StatCard from '@/components/ui/StatCard';

type Props = {
    mrr: number;
    ticketMedio: number;
    percentualRecebimento: number;
    inadimplencia: number;
};

export default function AdvancedMetrics({ mrr, ticketMedio, percentualRecebimento, inadimplencia }: Props) {
    const { formatarMoedaCompacta } = useConfiguracoes();

    return (
        <section className="grid grid-cols-1 gap-6 min-[900px]:grid-cols-2 min-[1440px]:grid-cols-4">
            <StatCard
                titulo="Receita Recorrente"
                valor={formatarMoedaCompacta(mrr)}
                subtitulo="MRR Mensal"
                status="Financeiro"
                tendencia="Receita recorrente"
                progresso={100}
                cor="green"
                icone={<TrendingUp size={22} />}
            />

            <StatCard
                titulo="Ticket Médio"
                valor={formatarMoedaCompacta(ticketMedio)}
                subtitulo="Valor médio por contrato"
                status="Performance"
                tendencia="Clientes ativos"
                progresso={100}
                cor="blue"
                icone={<DollarSign size={22} />}
            />

            <StatCard
                titulo="Recebimento"
                valor={`${percentualRecebimento.toFixed(1)}%`}
                subtitulo="Taxa de recebimento"
                status={percentualRecebimento >= 90 ? 'Excelente' : percentualRecebimento >= 75 ? 'Boa' : 'Atenção'}
                tendencia="Eficiência financeira"
                progresso={percentualRecebimento}
                cor={percentualRecebimento >= 90 ? 'green' : percentualRecebimento >= 75 ? 'yellow' : 'red'}
                icone={<Percent size={22} />}
            />

            <StatCard
                titulo="Inadimplência"
                valor={formatarMoedaCompacta(inadimplencia)}
                subtitulo="Valores pendentes"
                status={inadimplencia === 0 ? 'Controlada' : 'Monitorar'}
                tendencia="Cobranças em aberto"
                progresso={Math.min(inadimplencia / 1000, 100)}
                cor={inadimplencia === 0 ? 'green' : 'red'}
                icone={<AlertTriangle size={22} />}
            />
        </section>
    );
}
