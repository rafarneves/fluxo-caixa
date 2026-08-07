'use client';

import { CheckCircle2, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';

type Props = {
    receitaBruta: number;
    custos: number;
    despesasOperacionais: number;
    lucroLiquido: number;
    margem: number;
};

export default function DREResume({ receitaBruta, custos, despesasOperacionais, lucroLiquido, margem }: Props) {
    const moeda = useConfiguracoes().formatarMoeda;
    const percentualCustos = receitaBruta > 0 ? (custos / receitaBruta) * 100 : 0;

    const percentualDespesas = receitaBruta > 0 ? (despesasOperacionais / receitaBruta) * 100 : 0;

    const positivo = lucroLiquido >= 0;

    const cardHover = `
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-xl
      hover:border-zinc-600
    `;

    return (
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">
            <div className="mb-6">
                <p className="text-xs font-semibold tracking-[0.20em] text-zinc-500 uppercase">ANÁLISE AUTOMÁTICA</p>

                <h2 className="mt-3 text-2xl font-bold">Resumo Executivo</h2>

                <p className="mt-2 text-zinc-500">Leitura rápida da performance financeira do período.</p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div
                    className={`group cursor-pointer rounded-2xl border p-5 ${cardHover} ${
                        positivo ? 'border-green-500/20 bg-green-500/10' : 'border-red-500/20 bg-red-500/10'
                    } `}
                >
                    <div className="flex items-center gap-3">
                        {positivo ? (
                            <CheckCircle2 className="text-green-400 transition-transform duration-300 group-hover:scale-110" />
                        ) : (
                            <AlertTriangle className="text-red-400 transition-transform duration-300 group-hover:scale-110" />
                        )}

                        <h3 className="font-semibold">Resultado</h3>
                    </div>

                    <p className="mt-4 text-sm text-zinc-400">
                        {positivo
                            ? 'A empresa apresentou lucro no período.'
                            : 'O período apresentou resultado negativo.'}
                    </p>

                    <strong className={`mt-3 block text-2xl ${positivo ? 'text-green-400' : 'text-red-400'} `}>
                        {moeda(lucroLiquido)}
                    </strong>
                </div>

                <div
                    className={`group cursor-pointer rounded-2xl border border-zinc-800 bg-black/20 p-5 ${cardHover} `}
                >
                    <div className="flex items-center gap-3">
                        <TrendingUp className="text-blue-400 transition-transform duration-300 group-hover:scale-110" />

                        <h3 className="font-semibold">Rentabilidade</h3>
                    </div>

                    <p className="mt-4 text-sm text-zinc-400">Margem líquida atual da operação.</p>

                    <strong className="mt-3 block text-2xl text-blue-400">{margem.toFixed(1)}%</strong>
                </div>

                <div
                    className={`group cursor-pointer rounded-2xl border border-zinc-800 bg-black/20 p-5 ${cardHover} `}
                >
                    <div className="flex items-center gap-3">
                        <TrendingDown className="text-yellow-400 transition-transform duration-300 group-hover:scale-110" />

                        <h3 className="font-semibold">Estrutura de Custos</h3>
                    </div>

                    <p className="mt-4 text-sm text-zinc-400">
                        Custos: {percentualCustos.toFixed(1)}%
                        <br />
                        Despesas: {percentualDespesas.toFixed(1)}%
                    </p>

                    <strong className="mt-3 block text-2xl text-yellow-400">
                        {moeda(custos + despesasOperacionais)}
                    </strong>
                </div>
            </div>
        </section>
    );
}
