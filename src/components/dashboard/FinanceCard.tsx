'use client';

import { ArrowDownCircle, ArrowUpCircle, CreditCard, Wallet, TrendingUp } from 'lucide-react';
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';

type FinanceCardProps = {
    recebido?: number;
    emAberto?: number;
    despesas?: number;
    custos?: number;
    resultado?: number;
};

export default function FinanceCard({
    recebido = 0,
    emAberto = 0,
    despesas = 0,
    custos = 0,
    resultado = 0,
}: FinanceCardProps) {
    const { formatarMoedaCompacta } = useConfiguracoes();
    const total = recebido + emAberto;

    const percentual = total === 0 ? 0 : Math.round((recebido / total) * 100);

    const itens = [
        {
            titulo: 'Recebido',
            valor: recebido,
            cor: 'text-green-400',
            fundo: 'bg-green-500/10',
            icone: <ArrowDownCircle size={20} />,
        },

        {
            titulo: 'Em Aberto',
            valor: emAberto,
            cor: 'text-yellow-400',
            fundo: 'bg-yellow-500/10',
            icone: <Wallet size={20} />,
        },

        {
            titulo: 'Despesas',
            valor: despesas,
            cor: 'text-red-400',
            fundo: 'bg-red-500/10',
            icone: <ArrowUpCircle size={20} />,
        },

        {
            titulo: 'Custos',
            valor: custos,
            cor: 'text-orange-400',
            fundo: 'bg-orange-500/10',
            icone: <CreditCard size={20} />,
        },
    ];

    return (
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Painel Financeiro</h2>

                    <p className="mt-2 text-zinc-500">Resumo financeiro do período</p>
                </div>

                <div className="text-right">
                    <p className="text-4xl font-bold text-green-400">{percentual}%</p>

                    <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Saúde Financeira</p>
                </div>
            </div>

            <div className="mt-8 h-3 overflow-hidden rounded-full bg-black/30">
                <div
                    className="h-full rounded-full bg-green-500 transition-all duration-500"

                    style={{
                        width: `${percentual}%`,
                    }}
                />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-5">
                {itens.map((item) => (
                    <div
                        key={item.titulo}

                        className="rounded-2xl border border-zinc-800 bg-black/20 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-green-500/20"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-zinc-500">{item.titulo}</p>

                                <h3 className={`mt-3 text-3xl font-bold ${item.cor} `}>
                                    {formatarMoedaCompacta(item.valor)}
                                </h3>
                            </div>

                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.fundo} ${item.cor} `}
                            >
                                {item.icone}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 rounded-3xl border border-zinc-800 bg-black/20 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-zinc-500">Resultado da Empresa</p>

                        <h2
                            className={`mt-3 text-5xl font-bold ${resultado >= 0 ? 'text-green-400' : 'text-red-400'} `}
                        >
                            {formatarMoedaCompacta(resultado)}
                        </h2>
                    </div>

                    <div
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${
                            resultado >= 0
                                ? 'border-green-500/20 bg-green-500/10 text-green-400'
                                : 'border-red-500/20 bg-red-500/10 text-red-400'
                        } `}
                    >
                        <TrendingUp size={16} />

                        {resultado >= 0 ? 'Empresa Lucrando' : 'Empresa em Prejuízo'}
                    </div>
                </div>
            </div>
        </section>
    );
}
