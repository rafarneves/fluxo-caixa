'use client';

import { useState } from 'react';
import { criarRecebimento } from '@/actions/recebimentos';

interface Props {
    contratoId: string;
}

export default function NovoRecebimentoModal({ contratoId }: Props) {
    const [aberto, setAberto] = useState(false);

    return (
        <>
            <button
                onClick={() => setAberto(true)}
                className="rounded-lg bg-green-500 px-5 py-2 font-semibold text-black hover:bg-green-400"
            >
                + Novo Recebimento
            </button>

            {aberto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="w-[650px] rounded-2xl bg-[#161B22] p-8">
                        <div className="mb-8 flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Novo Recebimento</h2>

                            <button
                                onClick={() => setAberto(false)}
                                className="text-2xl text-zinc-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <form
                            action={async (formData) => {
                                await criarRecebimento({
                                    contrato_id: contratoId,
                                    competencia: String(formData.get('competencia')),
                                    valor: Number(formData.get('valor')),
                                    vencimento: String(formData.get('vencimento')),
                                });

                                setAberto(false);
                            }}
                        >
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="text-sm text-zinc-400">Competência</label>

                                    <input
                                        name="competencia"
                                        required
                                        className="mt-2 w-full rounded-xl border border-zinc-700 bg-[#0D1117] px-4 py-3"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-zinc-400">Valor</label>

                                    <input
                                        name="valor"
                                        type="number"
                                        required
                                        className="mt-2 w-full rounded-xl border border-zinc-700 bg-[#0D1117] px-4 py-3"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="text-sm text-zinc-400">Vencimento</label>

                                    <input
                                        name="vencimento"
                                        type="date"
                                        required
                                        className="mt-2 w-full rounded-xl border border-zinc-700 bg-[#0D1117] px-4 py-3"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setAberto(false)}
                                    className="rounded-lg bg-zinc-700 px-5 py-3"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="rounded-lg bg-green-500 px-6 py-3 font-semibold text-black hover:bg-green-400"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
