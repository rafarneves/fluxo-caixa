import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import FinanceiroContrato from '@/components/contratos/FinanceiroContrato';
import { formatarMoedaServidor, getContextoConfiguracoes } from '@/lib/configuracoes-server';

export default async function ContratoDetalhe({
    params,
}: {
    params: Promise<{
        id: string;
    }>;
}) {
    const supabase = await createClient();
    const { configuracoes } = await getContextoConfiguracoes();
    const formatMoney = (value: number) => formatarMoedaServidor(value, configuracoes);
    const { id } = await params;

    const { data: contrato } = await supabase
        .from('contratos')
        .select(
            `
      *,
      clientes (
        id,
        nome,
        telefone,
        cidade
      )
    `
        )
        .eq('id', id)
        .single();

    if (!contrato) {
        return <div className="text-2xl text-red-400">Contrato não encontrado.</div>;
    }

    const { data: recebimentos } = await supabase
        .from('recebimentos')
        .select('*')
        .eq('contrato_id', contrato.id)
        .order('vencimento', {
            ascending: false,
        });

    const recebimentosData = recebimentos ?? [];

    const recebido = recebimentosData
        .filter((r) => r.status === 'Pago')
        .reduce((total, r) => total + Number(r.valor), 0);

    const pendente = recebimentosData
        .filter((r) => r.status === 'Pendente' || r.status === 'Ativo')
        .reduce((total, r) => total + Number(r.valor), 0);

    return (
        <main className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-5xl font-bold text-green-400">{contrato.nome}</h1>

                    <p className="mt-2 text-zinc-400">Detalhes do contrato</p>
                </div>

                <Link href="/contratos" className="rounded-xl bg-zinc-800 px-6 py-3 hover:bg-zinc-700">
                    ← Contratos
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <div className="rounded-3xl border border-zinc-800 bg-[#161B22] p-6">
                    <p className="text-zinc-500">Cliente</p>

                    <h2 className="mt-3 font-bold text-white">{contrato.clientes?.nome}</h2>
                </div>

                <div className="rounded-3xl border border-zinc-800 bg-[#161B22] p-6">
                    <p className="text-zinc-500">Valor Mensal</p>

                    <h2 className="mt-3 text-2xl font-bold text-green-400">{formatMoney(Number(contrato.valor))}</h2>
                </div>

                <div className="rounded-3xl border border-zinc-800 bg-[#161B22] p-6">
                    <p className="text-zinc-500">Vencimento</p>

                    <h2 className="mt-3 font-bold text-white">Dia {contrato.vencimento}</h2>
                </div>

                <div className="rounded-3xl border border-zinc-800 bg-[#161B22] p-6">
                    <p className="text-zinc-500">Status</p>

                    <h2 className="mt-3 font-bold text-green-400">{contrato.status}</h2>
                </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-[#161B22] p-8">
                <h2 className="mb-6 text-2xl font-bold">Informações do Cliente</h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div>
                        <p className="text-zinc-500">Cidade</p>

                        <p className="mt-2">{contrato.clientes?.cidade ?? '-'}</p>
                    </div>

                    <div>
                        <p className="text-zinc-500">Telefone</p>

                        <p className="mt-2">{contrato.clientes?.telefone ?? '-'}</p>
                    </div>

                    <div>
                        <Link href={`/clientes/${contrato.clientes?.id}`} className="text-green-400 hover:underline">
                            Ver perfil completo do cliente
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-3xl border border-zinc-800 bg-[#161B22] p-6">
                    <p className="text-zinc-500">Recebido</p>

                    <h2 className="mt-3 text-3xl font-bold text-green-400">{formatMoney(recebido)}</h2>
                </div>

                <div className="rounded-3xl border border-zinc-800 bg-[#161B22] p-6">
                    <p className="text-zinc-500">Pendente</p>

                    <h2 className="mt-3 text-3xl font-bold text-yellow-400">{formatMoney(pendente)}</h2>
                </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-[#161B22] p-8">
                <h2 className="mb-6 text-2xl font-bold">Recebimentos</h2>

                <div className="space-y-3">
                    {recebimentosData.map((recebimento) => (
                        <div key={recebimento.id} className="flex justify-between rounded-xl bg-zinc-900/60 p-5">
                            <div>
                                <p>{recebimento.competencia}</p>

                                <p className="text-sm text-zinc-500">Vencimento {recebimento.vencimento}</p>
                            </div>

                            <div className="text-right">
                                <p className="font-bold">{formatMoney(Number(recebimento.valor))}</p>

                                <p className="text-zinc-400">{recebimento.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <FinanceiroContrato contratoId={contrato.id} receita={Number(contrato.valor)} />
        </main>
    );
}
