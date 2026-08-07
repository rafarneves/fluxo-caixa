'use client';

import { criarCustoContrato } from '@/actions/criarCustoContrato';

type Props = {
    contratoId: string;
};

export default function NovoCustoContrato({ contratoId }: Props) {
    return (
        <form action={criarCustoContrato} className="rounded-3xl border border-zinc-800 bg-[#161B22] p-8">
            <h2 className="mb-6 text-2xl font-bold">Adicionar Custo</h2>

            <input type="hidden" name="contrato_id" value={contratoId} />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm text-zinc-400">Descrição</label>

                    <select
                        name="descricao"
                        required
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-3"
                    >
                        <option value="">Selecione</option>

                        <option value="Tráfego Pago">Tráfego Pago</option>

                        <option value="Designer">Designer</option>

                        <option value="Social Media">Social Media</option>

                        <option value="Planejamento">Planejamento</option>

                        <option value="Combustível">Combustível</option>

                        <option value="Alimentação">Alimentação</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm text-zinc-400">Valor</label>

                    <input
                        type="number"
                        name="valor"
                        step="0.01"
                        required
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-3"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="mt-8 rounded-xl bg-green-500 px-6 py-3 font-semibold text-black hover:bg-green-400"
            >
                Salvar Custo
            </button>
        </form>
    );
}
