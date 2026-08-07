import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { pagarConta } from '@/actions/contasPagar';
import { formatarMoedaServidor, getContextoConfiguracoes } from '@/lib/configuracoes-server';

export default async function ContasPagarPage() {
    const supabase = await createClient();
    const { configuracoes } = await getContextoConfiguracoes();
    const formatMoney = (value: number) => formatarMoedaServidor(value, configuracoes);
    const { data: contas } = await supabase.from('contas_pagar').select('*').order('vencimento', { ascending: true });

    const total = contas?.reduce((acc, conta) => acc + Number(conta.valor), 0) ?? 0;

    const pendentes = contas?.filter((c) => c.status === 'Pendente').length ?? 0;

    const pagas = contas?.filter((c) => c.status === 'Pago').length ?? 0;

    return (
        <div>
            <div className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-5xl font-bold text-green-400">Contas a Pagar</h1>

                    <p className="mt-2 text-zinc-400">Controle de despesas da empresa.</p>
                </div>

                <Link
                    href="/contas-pagar/nova"
                    className="rounded-xl bg-green-500 px-6 py-4 font-bold text-black hover:bg-green-400"
                >
                    + Nova Conta
                </Link>
            </div>

            <div className="mb-10 grid grid-cols-3 gap-6">
                <div className="rounded-2xl bg-[#161B22] p-6">
                    <p className="text-zinc-400">Total</p>

                    <h2 className="mt-4 text-4xl font-bold text-red-500">{formatMoney(total)}</h2>
                </div>

                <div className="rounded-2xl bg-[#161B22] p-6">
                    <p className="text-zinc-400">Pendentes</p>

                    <h2 className="mt-4 text-4xl font-bold text-yellow-400">{pendentes}</h2>
                </div>

                <div className="rounded-2xl bg-[#161B22] p-6">
                    <p className="text-zinc-400">Pagas</p>

                    <h2 className="mt-4 text-4xl font-bold text-green-400">{pagas}</h2>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-[#161B22]">
                <table className="w-full">
                    <thead className="bg-[#222B3A]">
                        <tr>
                            <th className="p-5 text-left">Descrição</th>
                            <th className="p-5 text-left">Categoria</th>
                            <th className="p-5 text-left">Valor</th>
                            <th className="p-5 text-left">Vencimento</th>
                            <th className="p-5 text-left">Status</th>
                            <th className="p-5 text-right">Ação</th>
                        </tr>
                    </thead>

                    <tbody>
                        {contas?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-10 text-center text-zinc-500">
                                    Nenhuma conta cadastrada.
                                </td>
                            </tr>
                        )}

                        {contas?.map((conta) => (
                            <tr key={conta.id} className="border-t border-zinc-800 hover:bg-zinc-900">
                                <td className="p-5">{conta.descricao}</td>

                                <td className="p-5">{conta.categoria}</td>

                                <td className="p-5 font-semibold text-red-500">{formatMoney(Number(conta.valor))}</td>

                                <td className="p-5">Dia {conta.vencimento}</td>

                                <td className="p-5">
                                    <span
                                        className={
                                            conta.status === 'Pago'
                                                ? 'rounded-full bg-green-500/20 px-3 py-1 text-green-400'
                                                : 'rounded-full bg-yellow-500/20 px-3 py-1 text-yellow-400'
                                        }
                                    >
                                        {conta.status}
                                    </span>
                                </td>

                                <td className="p-5 text-right">
                                    {conta.status === 'Pago' ? (
                                        <span className="font-semibold text-green-400">Pago</span>
                                    ) : (
                                        <form
                                            action={async () => {
                                                'use server';

                                                await pagarConta(conta.id, conta.descricao, Number(conta.valor));
                                            }}
                                        >
                                            <button
                                                type="submit"
                                                className="rounded-lg bg-red-600 px-5 py-2 font-semibold hover:bg-red-500"
                                            >
                                                Pagar
                                            </button>
                                        </form>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
