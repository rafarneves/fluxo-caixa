import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

import ExcluirDespesa from './ExcluirDespesa';

import ExpenseSummary from '@/components/despesas/ExpenseSummary';
import ExpenseBreakdown from '@/components/despesas/ExpenseBreakdown';
import { formatarDataServidor, formatarMoedaServidor, getContextoConfiguracoes } from '@/lib/configuracoes-server';

export default async function DespesasPage() {
    const supabase = await createClient();
    const { configuracoes } = await getContextoConfiguracoes();
    const formatMoney = (value: number) => formatarMoedaServidor(value, configuracoes);
    const formatDate = (date: string) => formatarDataServidor(date, configuracoes);
    const { data: despesas } = await supabase.from('despesas').select('*').order('created_at', {
        ascending: false,
    });

    const dados = despesas ?? [];

    const total = dados.reduce((total, d: any) => total + Number(d.valor), 0);

    const fixas = dados.filter((d: any) => d.tipo === 'Fixa').reduce((total, d: any) => total + Number(d.valor), 0);

    const variaveis = dados
        .filter((d: any) => d.tipo === 'Variável')
        .reduce((total, d: any) => total + Number(d.valor), 0);

    return (
        <main className="space-y-8">
            <div>
                <p className="text-xs font-semibold tracking-[0.20em] text-zinc-500 uppercase">FINANCEIRO</p>

                <h1 className="mt-3 text-5xl font-bold text-white">Despesas</h1>

                <p className="mt-2 text-zinc-400">Controle dos custos operacionais da empresa.</p>
            </div>

            <ExpenseSummary total={total} quantidade={dados.length} fixas={fixas} variaveis={variaveis} />

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8 xl:col-span-2">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Lista de Despesas</h2>

                            <p className="mt-1 text-zinc-500">{dados.length} lançamento(s)</p>
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
                        {dados.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-zinc-700 py-10 text-center text-zinc-500">
                                Nenhuma despesa cadastrada.
                            </div>
                        )}

                        {dados.map((d: any) => (
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
                                    <p className="text-2xl font-bold text-red-400">{formatMoney(Number(d.valor))}</p>

                                    {d.tipo === 'Variável' && d.data && (
                                        <p className="mt-2 text-sm text-zinc-500">{formatDate(d.data)}</p>
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
                    <ExpenseBreakdown despesas={dados} />
                </div>
            </div>
        </main>
    );
}
