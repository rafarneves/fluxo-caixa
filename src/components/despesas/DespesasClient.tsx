'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ExpenseSummary from '@/components/despesas/ExpenseSummary';
import ExpenseBreakdown from '@/components/despesas/ExpenseBreakdown';
import ExcluirDespesa from '@/app/(sistema)/despesas/ExcluirDespesa';
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';

type Despesa = {
    id: string;
    descricao: string;
    categoria: string;
    tipo: string;
    dia_vencimento: number | null;
    valor: number;
    data?: string;
    created_at?: string;
};

type Props = {
    despesas: Despesa[];
};

export default function DespesasClient({ despesas }: Props) {
    const { formatarMoeda, formatarData } = useConfiguracoes();

    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');

    const dadosFiltrados = useMemo(() => {
        let filtrados = despesas;

        if (dataInicio && dataFim) {
            const inicio = new Date(dataInicio + 'T00:00:00');
            const fim = new Date(dataFim + 'T00:00:00');
            inicio.setHours(0, 0, 0, 0);
            fim.setHours(23, 59, 59, 999);

            filtrados = filtrados.filter(item => {
                if (item.data) {
                    const d = new Date(item.data + 'T00:00:00');
                    return d >= inicio && d <= fim;
                }
                // Despesas fixas passam por padrão se não tiverem data específica
                return true; 
            });
        }

        return filtrados;
    }, [despesas, dataInicio, dataFim]);

    const total = dadosFiltrados.reduce((acc, d) => acc + Number(d.valor), 0);
    const fixas = dadosFiltrados.filter(d => d.tipo === 'Fixa').reduce((acc, d) => acc + Number(d.valor), 0);
    const variaveis = dadosFiltrados.filter(d => d.tipo === 'Variável').reduce((acc, d) => acc + Number(d.valor), 0);

    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <label>
                    <span className="mb-2 block text-sm text-zinc-400">Data Inicial</span>
                    <input
                        type="date"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                        className="w-full rounded-xl border border-zinc-800 bg-[#11161d] px-4 py-3 text-sm text-white outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/10"
                    />
                </label>
                
                <label>
                    <span className="mb-2 block text-sm text-zinc-400">Data Final</span>
                    <input
                        type="date"
                        value={dataFim}
                        onChange={(e) => setDataFim(e.target.value)}
                        className="w-full rounded-xl border border-zinc-800 bg-[#11161d] px-4 py-3 text-sm text-white outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/10"
                    />
                </label>
            </div>

            <ExpenseSummary total={total} quantidade={dadosFiltrados.length} fixas={fixas} variaveis={variaveis} />

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8 xl:col-span-2">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Lista de Despesas</h2>
                            <p className="mt-1 text-zinc-500">{dadosFiltrados.length} lançamento(s)</p>
                        </div>

                        <Link
                            href="/despesas/nova"
                            prefetch={false}
                            className="rounded-xl bg-green-500 px-6 py-3 font-bold text-black transition hover:bg-green-400"
                        >
                            + Nova Despesa
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {dadosFiltrados.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-zinc-700 py-10 text-center text-zinc-500">
                                Nenhuma despesa encontrada para este período.
                            </div>
                        )}

                        {dadosFiltrados.map((d: any) => (
                            <div
                                key={d.id}
                                className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-black/20 p-5 transition hover:border-zinc-700"
                            >
                                <div>
                                    <h3 className="font-semibold text-white">{d.descricao}</h3>

                                    <p className="mt-1 text-zinc-500">{d.categoria}</p>

                                    <span
                                        className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                            d.tipo === 'Fixa'
                                                ? 'bg-yellow-500/10 text-yellow-400'
                                                : 'bg-blue-500/10 text-blue-400'
                                        } `}
                                    >
                                        {d.tipo === 'Fixa' ? `Fixa • Todo dia ${d.dia_vencimento}` : 'Variável'}
                                    </span>
                                </div>

                                <div className="text-right">
                                    <p className="text-2xl font-bold text-red-400">{formatarMoeda(Number(d.valor))}</p>

                                    {d.tipo === 'Variável' && d.data && (
                                        <p className="mt-2 text-sm text-zinc-500">{formatarData(d.data)}</p>
                                    )}

                                    <div className="mt-4 flex justify-end gap-3">
                                        <Link
                                            href={`/despesas/${d.id}`}
                                            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700"
                                        >
                                            Editar
                                        </Link>

                                        <ExcluirDespesa id={d.id} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div>
                    <ExpenseBreakdown despesas={dadosFiltrados} />
                </div>
            </div>
        </div>
    );
}
