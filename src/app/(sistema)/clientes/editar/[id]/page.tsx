'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export default function EditarCliente() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = params.id;

    const [cliente, setCliente] = useState<any>(null);

    useEffect(() => {
        async function carregarCliente() {
            const { data } = await supabase.from('clientes').select('*').eq('id', id).single();

            setCliente(data);
        }

        void carregarCliente();
    }, [id]);

    if (!cliente) {
        return <div className="text-white">Carregando...</div>;
    }

    async function salvar() {
        const { error } = await supabase
            .from('clientes')
            .update({
                nome: cliente.nome,

                telefone: cliente.telefone,

                cidade: cliente.cidade,
            })
            .eq('id', id);

        if (error) {
            alert(error.message);

            return;
        }

        router.push('/clientes');

        router.refresh();
    }

    return (
        <main className="space-y-8">
            <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">CLIENTES</p>

                <h1 className="mt-3 text-5xl font-bold text-white">Editar Cliente</h1>

                <p className="mt-2 text-lg text-zinc-400">Altere as informações cadastrais do cliente.</p>
            </div>

            <div className="max-w-3xl space-y-6 rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">
                <div>
                    <label className="text-sm text-zinc-400">Nome</label>

                    <input
                        value={cliente.nome ?? ''}

                        onChange={(e) =>
                            setCliente({
                                ...cliente,
                                nome: e.target.value,
                            })
                        }

                        className="mt-2 w-full rounded-xl border border-zinc-800 bg-[#0B0F14] p-4 text-white outline-none focus:border-green-500"
                    />
                </div>

                <div>
                    <label className="text-sm text-zinc-400">Telefone</label>

                    <input
                        value={cliente.telefone ?? ''}

                        onChange={(e) =>
                            setCliente({
                                ...cliente,
                                telefone: e.target.value,
                            })
                        }

                        className="mt-2 w-full rounded-xl border border-zinc-800 bg-[#0B0F14] p-4 text-white outline-none focus:border-green-500"
                    />
                </div>

                <div>
                    <label className="text-sm text-zinc-400">Cidade</label>

                    <input
                        value={cliente.cidade ?? ''}

                        onChange={(e) =>
                            setCliente({
                                ...cliente,
                                cidade: e.target.value,
                            })
                        }

                        className="mt-2 w-full rounded-xl border border-zinc-800 bg-[#0B0F14] p-4 text-white outline-none focus:border-green-500"
                    />
                </div>

                <button
                    onClick={salvar}

                    className="mt-4 rounded-xl bg-green-500 px-8 py-4 font-bold text-black shadow-lg shadow-green-500/20 transition hover:-translate-y-0.5 hover:bg-green-400"
                >
                    Salvar Alterações
                </button>
            </div>
        </main>
    );
}
