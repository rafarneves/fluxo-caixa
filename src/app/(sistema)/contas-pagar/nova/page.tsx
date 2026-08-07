'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export default function NovaContaPage() {
    const router = useRouter();

    const [descricao, setDescricao] = useState('');
    const [categoria, setCategoria] = useState('');
    const [valor, setValor] = useState('');
    const [vencimento, setVencimento] = useState('');

    async function salvarConta() {
        const { error } = await supabase.from('contas_pagar').insert({
            descricao,
            categoria,
            valor: Number(valor),
            vencimento: Number(vencimento),
            status: 'Pendente',
        });

        if (error) {
            alert(error.message);
            return;
        }

        router.push('/contas-pagar');
        router.refresh();
    }

    return (
        <div>
            <h1 className="text-5xl font-bold text-green-400">Nova Conta</h1>

            <p className="mt-2 mb-10 text-zinc-400">Cadastre uma nova despesa.</p>

            <div className="max-w-2xl rounded-2xl bg-[#161B22] p-8">
                <label className="mb-2 block">Descrição</label>

                <input
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="mb-6 w-full rounded-xl bg-zinc-900 p-4"
                />

                <label className="mb-2 block">Categoria</label>

                <input
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="mb-6 w-full rounded-xl bg-zinc-900 p-4"
                />

                <label className="mb-2 block">Valor</label>

                <input
                    type="number"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    className="mb-6 w-full rounded-xl bg-zinc-900 p-4"
                />

                <label className="mb-2 block">Dia do vencimento</label>

                <input
                    type="number"
                    min="1"
                    max="31"
                    value={vencimento}
                    onChange={(e) => setVencimento(e.target.value)}
                    className="mb-8 w-full rounded-xl bg-zinc-900 p-4"
                />

                <button
                    onClick={salvarConta}
                    className="rounded-xl bg-green-500 px-8 py-4 font-bold text-black hover:bg-green-400"
                >
                    Salvar Conta
                </button>
            </div>
        </div>
    );
}
