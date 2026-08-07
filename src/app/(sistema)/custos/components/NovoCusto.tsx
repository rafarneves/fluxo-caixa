'use client';

import { useState } from 'react';
import { criarCusto } from '../actions';

type Contrato = {
    id: string;
    cliente: string;
};

export default function NovoCusto({ contratos }: { contratos: Contrato[] }) {
    const [pending, setPending] = useState(false);

    return (
        <form
            action={async (formData) => {
                setPending(true);

                try {
                    await criarCusto(formData);
                    window.location.reload();
                } finally {
                    setPending(false);
                }
            }}
            className="space-y-5 rounded-2xl bg-[#161B22] p-6"
        >
            <h2 className="text-2xl font-bold">Novo Custo</h2>

            <select name="contrato_id" required className="w-full rounded-xl bg-zinc-900 p-4">
                <option value="">Selecione o contrato</option>

                {contratos.map((contrato) => (
                    <option key={contrato.id} value={contrato.id}>
                        {contrato.cliente}
                    </option>
                ))}
            </select>

            <select name="descricao" required className="w-full rounded-xl bg-zinc-900 p-4">
                <option value="">Selecione o custo</option>

                <option value="Tráfego Pago">Tráfego Pago</option>

                <option value="Designer">Designer</option>

                <option value="Social Media">Social Media</option>

                <option value="Planejamento">Planejamento</option>

                <option value="Combustível">Combustível</option>

                <option value="Alimentação">Alimentação</option>
            </select>

            <input
                type="number"
                name="valor"
                step="0.01"
                required
                placeholder="Valor"
                className="w-full rounded-xl bg-zinc-900 p-4"
            />

            <button
                type="submit"
                disabled={pending}
                className="rounded-xl bg-green-500 px-8 py-4 font-bold text-black transition hover:bg-green-400 disabled:opacity-50"
            >
                {pending ? 'Salvando...' : 'Salvar Custo'}
            </button>
        </form>
    );
}
