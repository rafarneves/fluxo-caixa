'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
import { Handshake, UserRound, Gift, ArrowLeft, Save } from 'lucide-react';
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';

export default function NovaIndicacaoPage() {
    const router = useRouter();
    const { moeda } = useConfiguracoes();

    const [clientes, setClientes] = useState<any[]>([]);
    const [clienteIndicador, setClienteIndicador] = useState('');
    const [clienteIndicado, setClienteIndicado] = useState('');
    const [valorDesconto, setValorDesconto] = useState('200');
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        carregarClientes();
    }, []);

    async function carregarClientes() {
        const { data } = await supabase.from('clientes').select('id,nome').eq('status', 'Ativo').order('nome');

        if (data) {
            setClientes(data);
        }
    }

    async function salvarIndicacao() {
        if (!clienteIndicador || !clienteIndicado) {
            alert('Selecione os clientes.');
            return;
        }

        if (clienteIndicador === clienteIndicado) {
            alert('O cliente indicador não pode ser o mesmo cliente indicado.');
            return;
        }

        setSalvando(true);

        const { error } = await supabase.from('indicacoes').insert({
            cliente_indicador: clienteIndicador,
            cliente_indicado: clienteIndicado,
            valor_desconto: Number(valorDesconto),
            status: 'Ativo',
        });

        setSalvando(false);

        if (error) {
            alert(error.message);
            return;
        }

        alert('Indicação criada com sucesso!');

        router.push('/indicacoes');
        router.refresh();
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-white md:text-5xl">Nova Indicação</h1>

                    <p className="mt-2 text-lg text-zinc-400">
                        Cadastre uma nova indicação e configure o benefício mensal.
                    </p>
                </div>

                <button
                    onClick={() => router.back()}
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
                        <h2 className="text-2xl font-bold text-white">Cadastro da Indicação</h2>

                        <p className="text-zinc-400">Informe os clientes participantes da indicação.</p>
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
                            className="w-full rounded-2xl border border-zinc-700 bg-[#0F172A] px-5 py-4 text-white transition-all duration-300 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
                        >
                            <option value="">Selecione quem indicou</option>

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
                            className="w-full rounded-2xl border border-zinc-700 bg-[#0F172A] px-5 py-4 text-white transition-all duration-300 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
                        >
                            <option value="">Selecione o cliente indicado</option>

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
                            Benefício Mensal ({moeda})
                        </label>

                        <input
                            type="number"
                            value={valorDesconto}
                            onChange={(e) => setValorDesconto(e.target.value)}
                            className="w-full rounded-2xl border border-zinc-700 bg-[#0F172A] px-5 py-4 text-white transition-all duration-300 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
                        />
                    </div>
                </div>

                <div className="mt-10 flex justify-end">
                    <button
                        onClick={salvarIndicacao}
                        disabled={salvando}
                        className="flex items-center gap-3 rounded-2xl bg-green-500 px-8 py-4 font-bold text-black shadow-lg shadow-green-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Save size={20} />

                        {salvando ? 'Salvando...' : 'Salvar Indicação'}
                    </button>
                </div>
            </div>
        </div>
    );
}
