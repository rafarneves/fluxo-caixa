'use client';

import { PieChart, TrendingDown } from 'lucide-react';
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';

type Despesa = {
    categoria: string | null;
    valor: number;
};

type Props = {
    despesas: Despesa[];
};

export default function DREExpenseBreakdown({ despesas }: Props) {
    const moeda = useConfiguracoes().formatarMoedaCompacta;
    const categorias = despesas.reduce((acc: Record<string, number>, despesa) => {
        const categoria = despesa.categoria || 'Outros';

        acc[categoria] = (acc[categoria] || 0) + Number(despesa.valor);

        return acc;
    }, {});

    const lista = Object.entries(categorias).sort((a, b) => b[1] - a[1]);

    const total = lista.reduce((acc, [, valor]) => acc + valor, 0);

    const maiorDespesa = lista[0];

    return (
        <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827]">
            <div className="border-b border-zinc-800 p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.20em] text-zinc-500 uppercase">ANÁLISE</p>

                        <h2 className="mt-3 text-2xl font-bold">Despesas por Categoria</h2>

                        <p className="mt-2 text-zinc-500">Distribuição dos custos operacionais</p>
                    </div>

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                        <PieChart size={24} />
                    </div>
                </div>

                {maiorDespesa && (
                    <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                        <p className="text-sm text-zinc-400">Maior despesa</p>

                        <div className="mt-2 flex justify-between">
                            <span className="font-semibold">{maiorDespesa[0]}</span>

                            <span className="font-bold text-red-400">{moeda(maiorDespesa[1])}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-6 p-8">
                {lista.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-zinc-700 py-10 text-center text-zinc-500">
                        Nenhuma despesa encontrada.
                    </div>
                )}

                {lista.map(([categoria, valor]) => {
                    const percentual = total > 0 ? (valor / total) * 100 : 0;

                    return (
                        <div key={categoria}>
                            <div className="mb-3 flex justify-between">
                                <div className="flex items-center gap-2">
                                    <TrendingDown size={16} className="text-red-400" />

                                    <span className="font-medium">{categoria}</span>
                                </div>

                                <div className="text-right">
                                    <p className="font-bold text-red-400">{moeda(valor)}</p>

                                    <p className="text-xs text-zinc-500">{percentual.toFixed(1)}%</p>
                                </div>
                            </div>

                            <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                                <div
                                    className="h-full rounded-full bg-green-500 transition-all duration-500"
                                    style={{
                                        width: `${percentual}%`,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
