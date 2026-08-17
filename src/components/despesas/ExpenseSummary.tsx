'use client';

import { Receipt, CalendarDays, TrendingDown, Layers } from 'lucide-react';
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';

type Props = {
    total: number;
    quantidade: number;
    fixas: number;
    variaveis: number;
};

export default function ExpenseSummary({ total, quantidade, fixas, variaveis }: Props) {
    const moeda = useConfiguracoes().formatarMoeda;
    const cards = [
        {
            titulo: 'Total de Despesas',
            valor: moeda(total),
            descricao: 'Custos registrados',
            icon: Receipt,
            cor: 'red',
        },

        {
            titulo: 'Despesas Fixas',
            valor: moeda(fixas),
            descricao: 'Custos recorrentes',
            icon: CalendarDays,
            cor: 'yellow',
        },

        {
            titulo: 'Despesas Variáveis',
            valor: moeda(variaveis),
            descricao: 'Custos eventuais',
            icon: TrendingDown,
            cor: 'blue',
        },

        {
            titulo: 'Quantidade',
            valor: String(quantidade),
            descricao: 'Lançamentos',
            icon: Layers,
            cor: 'green',
        },
    ];

    const cores: any = {
        red: {
            texto: 'text-red-400',
            fundo: 'bg-red-500/10',
        },

        yellow: {
            texto: 'text-yellow-400',
            fundo: 'bg-yellow-500/10',
        },

        blue: {
            texto: 'text-cyan-400',
            fundo: 'bg-cyan-500/10',
        },

        green: {
            texto: 'text-green-400',
            fundo: 'bg-green-500/10',
        },
    };

    return (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon;

                const cor = cores[card.cor];

                return (
                    <div
                        key={card.titulo}

                        className="group cursor-pointer rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-600 hover:shadow-xl"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-sm text-zinc-500">{card.titulo}</p>

                                <h2 className={`mt-3 text-2xl font-bold sm:text-3xl ${cor.texto} truncate`}>{card.valor}</h2>
                            </div>

                            <div
                                className={`shrink-0 rounded-2xl p-3 ${cor.fundo} ${cor.texto} transition-transform duration-300 group-hover:scale-110`}
                            >
                                <Icon size={22} />
                            </div>
                        </div>

                        <p className="mt-4 text-xs text-zinc-600">{card.descricao}</p>
                    </div>
                );
            })}
        </section>
    );
}
