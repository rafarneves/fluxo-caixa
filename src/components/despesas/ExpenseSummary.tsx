'use client';

import { CalendarDays, Layers, Receipt, TrendingDown } from 'lucide-react';
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';
import ResponsiveGrid from '@/components/ui/ResponsiveGrid';
import StatCard from '@/components/ui/StatCard';

export default function ExpenseSummary({
    total,
    quantidade,
    fixas,
    variaveis,
}: {
    total: number;
    quantidade: number;
    fixas: number;
    variaveis: number;
}) {
    const moeda = useConfiguracoes().formatarMoeda;
    return (
        <ResponsiveGrid>
            <StatCard
                titulo="Total de Despesas"
                valor={moeda(total)}
                subtitulo="Custos registrados"
                cor="red"
                icone={<Receipt size={22} />}
            />
            <StatCard
                titulo="Despesas Fixas"
                valor={moeda(fixas)}
                subtitulo="Custos recorrentes"
                cor="yellow"
                icone={<CalendarDays size={22} />}
            />
            <StatCard
                titulo="Despesas Variáveis"
                valor={moeda(variaveis)}
                subtitulo="Custos eventuais"
                cor="blue"
                icone={<TrendingDown size={22} />}
            />
            <StatCard
                titulo="Quantidade"
                valor={String(quantidade)}
                subtitulo="Lançamentos"
                cor="green"
                icone={<Layers size={22} />}
            />
        </ResponsiveGrid>
    );
}
