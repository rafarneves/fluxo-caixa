'use client';

import { useState } from 'react';
import { adicionarCustoContrato } from '../actions';

type Props = {
    contratoId: string;
};

export default function NovoCustoContrato({ contratoId }: Props) {
    const [pending, setPending] = useState(false);

    return (
        <form
            action={async (formData) => {
                setPending(true);

                try {
                    await adicionarCustoContrato(contratoId, formData);

                    window.location.reload();
                } finally {
                    setPending(false);
                }
            }}
            className="space-y-5 rounded-3xl border border-zinc-800 bg-[#161B22] p-8"
        >
            <h2 className="text-2xl font-bold text-white">Adicionar Custo</h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <select name="categoria" required className="rounded-xl bg-zinc-900 p-4">
                    <option value="">Categoria</option>

                    <option>Editor</option>
                    <option>Designer</option>
                    <option>Tráfego Pago</option>
                    <option>Combustível</option>
                    <option>Pedágio</option>
                    <option>Alimentação</option>
                    <option>Hospedagem</option>
                    <option>Hotel</option>
                    <option>Freelancer</option>
                    <option>Impressão</option>
                    <option>Equipamentos</option>
                    <option>Outros</option>
                </select>

                <input
                    type="number"
                    name="valor"
                    step="0.01"
                    placeholder="Valor"
                    required
                    className="rounded-xl bg-zinc-900 p-4"
                />
            </div>

            <input name="descricao" placeholder="Descrição" className="w-full rounded-xl bg-zinc-900 p-4" />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <input type="month" name="competencia" className="rounded-xl bg-zinc-900 p-4" />

                <label className="flex items-center gap-3 rounded-xl bg-zinc-900 p-4">
                    <input type="checkbox" name="recorrente" />

                    <span>Custo recorrente</span>
                </label>
            </div>

            <textarea
                rows={4}
                name="observacao"
                placeholder="Observações"
                className="w-full resize-none rounded-xl bg-zinc-900 p-4"
            />

            <button
                disabled={pending}
                className="w-full rounded-xl bg-green-500 py-4 font-bold text-black hover:bg-green-400 disabled:opacity-50"
            >
                {pending ? 'Salvando...' : 'Salvar Custo'}
            </button>
        </form>
    );
}
