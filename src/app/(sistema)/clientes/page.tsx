import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { inativarCliente } from '@/actions/clientes';
import { Users, Wallet, TrendingUp } from 'lucide-react';
import { formatarMoedaServidor, getContextoConfiguracoes } from '@/lib/configuracoes-server';

export default async function ClientesPage() {
    const supabase = await createClient();
    const { configuracoes } = await getContextoConfiguracoes();
    const formatMoney = (value: number) => formatarMoedaServidor(value, configuracoes);
    const { data: clientes } = await supabase
        .from('clientes')
        .select(
            `
      *,
      contratos (
        id,
        valor,
        status
      )
    `
        )
        .eq('status', 'Ativo')
        .order('created_at', {
            ascending: false,
        });

    const clientesData = clientes ?? [];

    const totalClientes = clientesData.length;

    const receita = clientesData.reduce((total, cliente) => {
        const contratos = cliente.contratos ?? [];

        return (
            total +
            contratos
                .filter((c: any) => c.status === 'Ativo')
                .reduce((acc: number, contrato: any) => acc + Number(contrato.valor), 0)
        );
    }, 0);

    const ticketMedio = totalClientes === 0 ? 0 : receita / totalClientes;

    return (
        <div className="space-y-10">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">CLIENTES</p>

                    <h1 className="mt-3 text-5xl font-bold text-white">Clientes</h1>

                    <p className="mt-3 text-lg text-zinc-400">
                        Gerencie sua carteira de clientes, contratos e relacionamento.
                    </p>
                </div>

                <Link
                    href="/clientes/novo"
                    prefetch={false}
                    className="rounded-2xl bg-green-500 px-6 py-4 font-bold text-black transition hover:-translate-y-0.5 hover:bg-green-400"
                >
                    + Novo Cliente
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <CardResumo
                    titulo="Clientes Ativos"
                    valor={String(totalClientes)}
                    icone={<Users size={22} />}
                ></CardResumo>

                <CardResumo
                    titulo="Receita Recorrente"
                    valor={formatMoney(receita)}
                    icone={<Wallet size={22} />}
                ></CardResumo>

                <CardResumo
                    titulo="Ticket Médio"
                    valor={formatMoney(ticketMedio)}
                    icone={<TrendingUp size={22} />}
                ></CardResumo>
            </div>

            <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827]">
                <table className="w-full">
                    <thead className="bg-black/20">
                        <tr>
                            <th className="p-5 text-left text-zinc-400">Cliente</th>

                            <th className="p-5 text-left text-zinc-400">Localização</th>

                            <th className="p-5 text-left text-zinc-400">Contratos</th>

                            <th className="p-5 text-left text-zinc-400">Receita Mensal</th>

                            <th className="p-5 text-left text-zinc-400">Status</th>

                            <th className="p-5 text-right text-zinc-400">Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {clientesData.map((cliente) => {
                            const receitaCliente = (cliente.contratos ?? [])
                                .filter((c: any) => c.status === 'Ativo')
                                .reduce((acc: number, c: any) => acc + Number(c.valor), 0);

                            return (
                                <tr key={cliente.id} className="border-t border-zinc-800 transition hover:bg-black/20">
                                    <td className="p-5">
                                        <Link
                                            href={`/clientes/${cliente.id}`}
                                            className="font-semibold text-white hover:text-green-400"
                                        >
                                            {cliente.nome}
                                        </Link>
                                    </td>

                                    <td className="p-5 text-zinc-400">{cliente.cidade ?? 'Sem cidade'}</td>

                                    <td className="p-5 text-zinc-300">{cliente.contratos?.length ?? 0}</td>

                                    <td className="p-5 font-semibold text-green-400">{formatMoney(receitaCliente)}</td>

                                    <td className="p-5">
                                        <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-400">
                                            Ativo
                                        </span>
                                    </td>

                                    <td className="p-5 text-right">
                                        <Link
                                            href={`/clientes/${cliente.id}`}
                                            className="mr-2 rounded-xl bg-green-500/10 px-4 py-2 text-sm text-green-400"
                                        >
                                            Ver
                                        </Link>

                                        <Link
                                            href={`/clientes/editar/${cliente.id}`}
                                            className="rounded-xl bg-zinc-700 px-4 py-2 text-sm"
                                        >
                                            Editar
                                        </Link>

                                        <form
                                            action={async () => {
                                                'use server';

                                                await inativarCliente(cliente.id);
                                            }}
                                            className="inline"
                                        >
                                            <button className="ml-2 rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-400">
                                                Inativar
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function CardResumo({ titulo, valor, icone }: { titulo: string; valor: string; icone: React.ReactNode }) {
    return (
        <div className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-zinc-500">{titulo}</p>

                    <h2 className="mt-4 text-4xl font-bold text-green-400">{valor}</h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
                    {icone}
                </div>
            </div>
        </div>
    );
}
