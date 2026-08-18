'use client';

import { CalendarClock, Wallet, BadgeDollarSign, AlertTriangle } from 'lucide-react';

import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';
import StatCard from '@/components/ui/StatCard';
import ResponsiveGrid from '@/components/ui/ResponsiveGrid';

type Props = {
    receberHoje: number;
    emAberto: number;
    recebido: number;
    atrasados: number;
};

export default function RecebimentosSummary({ receberHoje, emAberto, recebido, atrasados }: Props) {
    const { formatarMoedaCompacta } = useConfiguracoes();
    return (
        <ResponsiveGrid>
            <StatCard
                titulo="Receber Hoje"
                valor={formatarMoedaCompacta(receberHoje)}
                subtitulo="Vencimentos do dia"
                icone={<CalendarClock size={22} />}
                status="Hoje"
                tendencia="Recebimentos previstos"
                progresso={100}
                cor="blue"
            />

            <StatCard
                titulo="Em Aberto"
                valor={formatarMoedaCompacta(emAberto)}
                subtitulo="Valores pendentes"
                icone={<Wallet size={22} />}
                status="Pendente"
                tendencia="Cobranças abertas"
                progresso={70}
                cor="yellow"
            />

            <StatCard
                titulo="Recebido"
                valor={formatarMoedaCompacta(recebido)}
                subtitulo="Valores confirmados"
                icone={<BadgeDollarSign size={22} />}
                status="Pago"
                tendencia="Receita recebida"
                progresso={100}
                cor="green"
            />

            <StatCard
                titulo="Atrasados"
                valor={String(atrasados)}
                subtitulo="Cobranças vencidas"
                icone={<AlertTriangle size={22} />}
                status={atrasados > 0 ? 'Atenção' : 'Controlado'}
                tendencia={atrasados > 0 ? 'Necessita cobrança' : 'Sem pendências'}
                progresso={Math.min(atrasados * 10, 100)}
                cor={atrasados > 0 ? 'red' : 'green'}
            />
        </ResponsiveGrid>
    );
}
