'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
import { ArrowLeft, Handshake, Save, UserRound, Gift } from 'lucide-react';

export default function EditarIndicacaoPage() {
    const router = useRouter();
    const params = useParams();

    const id = params.id as string;

    const [clientes, setClientes] = useState<any[]>([]);

    const [clienteIndicador, setClienteIndicador] = useState('');
    const [clienteIndicado, setClienteIndicado] = useState('');

    const [valorDesconto, setValorDesconto] = useState('200');

    const [status, setStatus] = useState('Ativo');

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        carregar();
    }, []);

    async function carregar() {
        const { data: clientesData } = await supabase
            .from('clientes')
            .select('id,nome')
            .eq('status', 'Ativo')
            .order('nome');

        if (clientesData) {
            setClientes(clientesData);
        }

        const { data: indicacao } = await supabase.from('indicacoes').select('*').eq('id', id).single();

        if (indicacao) {
            setClienteIndicador(indicacao.cliente_indicador);
            setClienteIndicado(indicacao.cliente_indicado);
            setValorDesconto(String(indicacao.valor_desconto));
            setStatus(indicacao.status);
        }

        setCarregando(false);
    }
    async function salvar() {
        if (!clienteIndicador || !clienteIndicado) {
            alert('Selecione os clientes.');
            return;
        }

        if (clienteIndicador === clienteIndicado) {
            alert('O cliente indicador não pode ser o mesmo cliente indicado.');
            return;
        }

        setSalvando(true);

        const { error } = await supabase
            .from('indicacoes')
            .update({
                cliente_indicador: clienteIndicador,
                cliente_indicado: clienteIndicado,
                valor_desconto: Number(valorDesconto),
                status,
            })
            .eq('id', id);

        setSalvando(false);

        if (error) {
            alert(error.message);
            return;
        }

        alert('Indicação atualizada com sucesso!');

        router.push('/indicacoes');
        router.refresh();
    }

    if (carregando) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-lg text-zinc-400">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-white md:text-5xl">Editar Indicação</h1>

                    <p className="mt-2 text-lg text-zinc-400">Atualize os dados da indicação.</p>
                </div>

                <button
                    onClick={() => router.push('/indicacoes')}
                    className="flex items-center gap-2 rounded-2xl bg-zinc-800 px-5 py-3 transition-all duration-300 hover:-translate-y-1 hover:bg-zinc-700"
                >
                    <ArrowLeft size={18} />
                    Voltar
                </button>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#171F2B] to-[#111827] p-8 shadow-2xl">
                <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/20">
                        <Handshake className="text-green-400" size={28} />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white">Dados da Indicação</h2>

                        <p className="text-zinc-400">Edite as informações abaixo.</p>
                    </div>
                </div>

                <div className="grid gap-7">
                    <div>
                        <label className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-300">
                            <UserRound size={18} />
                            Cliente Indicador
                        </label>

                        <select
                            value={clienteIndicador}
                            onChange={(e) => setClienteIndicador(e.target.value)}
                            className="w-full rounded-2xl border border-zinc-700 bg-[#0F172A] px-5 py-4 text-white"
                        >
                            <option value="">Selecione</option>

                            {clientes.map((cliente) => (
                                <option key={cliente.id} value={cliente.id}>
                                    {cliente.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-300">
                            <UserRound size={18} />
                            Cliente Indicado
                        </label>

                        <select
                            value={clienteIndicado}
                            onChange={(e) => setClienteIndicado(e.target.value)}
                            className="w-full rounded-2xl border border-zinc-700 bg-[#0F172A] px-5 py-4 text-white"
                        >
                            <option value="">Selecione</option>

                            {clientes.map((cliente) => (
                                <option key={cliente.id} value={cliente.id}>
                                    {cliente.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-300">
                            <Gift size={18} />
                            Benefício Mensal
                        </label>

                        <input
                            type="number"
                            value={valorDesconto}
                            onChange={(e) => setValorDesconto(e.target.value)}
                            className="w-full rounded-2xl border border-zinc-700 bg-[#0F172A] px-5 py-4 text-white"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-sm font-medium text-zinc-300">Status</label>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full rounded-2xl border border-zinc-700 bg-[#0F172A] px-5 py-4 text-white"
                        >
                            <option value="Ativo">Ativo</option>
                            <option value="Suspenso">Suspenso</option>
                        </select>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            onClick={salvar}
                            disabled={salvando}
                            className="flex items-center gap-3 rounded-2xl bg-green-500 px-8 py-4 font-bold text-black transition-all duration-300 hover:-translate-y-1 hover:bg-green-400 disabled:opacity-50"
                        >
                            <Save size={20} />
                            {salvando ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
