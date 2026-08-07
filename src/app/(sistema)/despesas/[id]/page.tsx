import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { editarDespesa } from './actions';

export default async function EditarDespesaPage({
    params,
}: {
    params: Promise<{
        id: string;
    }>;
}) {
    const supabase = await createClient();
    const { id } = await params;

    const { data: despesa } = await supabase.from('despesas').select('*').eq('id', id).single();

    if (!despesa) {
        return <div className="text-2xl text-red-400">Despesa não encontrada.</div>;
    }

    const inputClass = `
    w-full
    mt-2
    bg-[#0B0F14]
    border
    border-zinc-800
    rounded-xl
    px-4
    py-3
    text-white
    outline-none
    focus:border-green-500
    transition
  `;

    const labelClass = `
    text-sm
    font-semibold
    text-zinc-400
  `;

    return (
        <main className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-[0.25em] text-zinc-500 uppercase">FINANCEIRO</p>

                    <h1 className="mt-3 text-5xl font-bold text-white">
                        Editar
                        <span className="text-green-400"> Despesa</span>
                    </h1>

                    <p className="mt-3 text-lg text-zinc-400">Atualize as informações do custo operacional.</p>
                </div>

                <Link
                    href="/despesas"

                    className="rounded-xl border border-zinc-800 bg-[#1C2430] px-6 py-3 font-semibold text-white transition hover:border-zinc-600"
                >
                    ← Voltar
                </Link>
            </div>

            <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white">Informações da despesa</h2>

                    <p className="mt-2 text-zinc-500">Altere os dados e salve as modificações.</p>
                </div>

                <form
                    action={editarDespesa.bind(null, despesa.id)}

                    className="space-y-8"
                >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className={labelClass}>Descrição</label>

                            <input
                                name="descricao"

                                defaultValue={despesa.descricao}

                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Categoria</label>

                            <input
                                name="categoria"

                                defaultValue={despesa.categoria}

                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Tipo da despesa</label>

                            <select
                                name="tipo"

                                defaultValue={despesa.tipo}

                                className={inputClass}
                            >
                                <option value="Fixa">Fixa</option>

                                <option value="Variável">Variável</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Valor</label>

                            <input
                                name="valor"

                                type="number"

                                step="0.01"

                                defaultValue={despesa.valor}

                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Dia vencimento (fixa)</label>

                            <input
                                name="dia_vencimento"

                                type="number"

                                defaultValue={despesa.dia_vencimento ?? ''}

                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Data (variável)</label>

                            <input
                                name="data"

                                type="date"

                                defaultValue={despesa.data ?? ''}

                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end border-t border-zinc-800 pt-4">
                        <button className="rounded-xl bg-green-500 px-10 py-4 font-bold text-black transition hover:bg-green-400">
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}
