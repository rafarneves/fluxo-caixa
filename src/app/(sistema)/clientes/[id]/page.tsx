import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatarDataServidor, formatarMoedaServidor, getContextoConfiguracoes } from '@/lib/configuracoes-server';

// Contratos antigos guardam apenas a recorrencia; os novos guardam a fidelidade em meses.
function formatarFidelidade(contrato: { fidelidade_meses?: number | null; recorrencia?: string | null }) {
    if (contrato.fidelidade_meses) {
        return `${contrato.fidelidade_meses} ${contrato.fidelidade_meses === 1 ? 'mês' : 'meses'}`;
    }

    return contrato.recorrencia ?? '-';
}

export default async function ClienteDetalhe({
    params,
}: {
    params: Promise<{
        id: string;
    }>;
}) {
    const supabase = await createClient();
    const { configuracoes } = await getContextoConfiguracoes();
    const formatMoney = (value: number) => formatarMoedaServidor(value, configuracoes);
    const formatDate = (date: string) => formatarDataServidor(date, configuracoes);
    const { id } = await params;

    const { data: cliente } = await supabase.from('clientes').select('*').eq('id', id).single();

    if (!cliente) {
        return <div className="text-2xl text-red-400">Cliente não encontrado.</div>;
    }

    const { data: contratos } = await supabase
        .from('contratos')
        .select('*')
        .eq('cliente_id', cliente.id)
        .order('created_at', {
            ascending: false,
        });

    const contratosData = contratos ?? [];

    const contratoIds = contratosData.map((contrato: any) => contrato.id);

    const { data: recebimentos } =
        contratoIds.length > 0
            ? await supabase.from('recebimentos').select('*').in('contrato_id', contratoIds).order('vencimento', {
                  ascending: true,
              })
            : {
                  data: [],
              };

    const recebimentosData = recebimentos ?? [];

    return (
        <main className="space-y-8">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">CLIENTE</p>

                    <h1 className="mt-3 text-5xl font-bold text-green-400">{cliente.nome}</h1>

                    <p className="mt-2 text-zinc-400">Dados cadastrais, contratos e recebimentos.</p>
                </div>

                <div className="flex gap-3">
                    <Link
                        href="/clientes"

                        className="rounded-xl bg-zinc-800 px-6 py-3 hover:bg-zinc-700"
                    >
                        ← Clientes
                    </Link>

                    <Link
                        href={`/clientes/editar/${cliente.id}`}

                        className="rounded-xl bg-zinc-700 px-6 py-3 hover:bg-zinc-600"
                    >
                        Editar Cliente
                    </Link>
                </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">
                <h2 className="mb-6 text-2xl font-bold">Informações do Cliente</h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div>
                        <p className="text-zinc-500">Cidade</p>

                        <p className="mt-2 font-semibold">{cliente.cidade ?? '-'}</p>
                    </div>

                    <div>
                        <p className="text-zinc-500">Telefone</p>

                        <p className="mt-2 font-semibold">{cliente.telefone ?? '-'}</p>
                    </div>

                    <div>
                        <p className="text-zinc-500">Cliente desde</p>

                        <p className="mt-2 font-semibold">{formatDate(cliente.created_at)}</p>
                    </div>
                </div>
            </div>
            <div className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Contratos</h2>

                    <Link
                        href={`/contratos/novo?cliente=${cliente.id}`}
                        className="rounded-xl bg-green-500 px-5 py-3 font-bold text-black hover:bg-green-400"
                    >
                        + Novo Contrato
                    </Link>
                </div>

                <div className="space-y-4">
                    {contratosData.map((contrato: any) => (
                        <div
                            key={contrato.id}

                            className="rounded-2xl border border-zinc-800 bg-black/20 p-6"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <Link
                                        href={`/contratos/${contrato.id}`}

                                        className="text-xl font-bold text-white hover:text-green-400"
                                    >
                                        {contrato.nome}
                                    </Link>

                                    <p className="mt-2 text-zinc-500">{formatarFidelidade(contrato)}</p>
                                </div>

                                <div className="text-right">
                                    <p className="text-2xl font-bold text-green-400">
                                        {formatMoney(Number(contrato.valor))}
                                    </p>

                                    <span className="mt-2 inline-block rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-400">
                                        {contrato.status}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div>
                                    <p className="text-zinc-500">Início</p>

                                    <p className="mt-2">
                                        {contrato.data_inicio ? formatDate(contrato.data_inicio) : '-'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-zinc-500">Vencimento</p>

                                    <p className="mt-2">Dia {contrato.vencimento ?? '-'}</p>
                                </div>

                                <div>
                                    <p className="text-zinc-500">Fidelidade</p>

                                    <p className="mt-2">{formatarFidelidade(contrato)}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {contratosData.length === 0 && <p className="text-zinc-500">Nenhum contrato encontrado.</p>}
                </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">
                <h2 className="mb-6 text-2xl font-bold">Próximos Recebimentos</h2>

                <div className="space-y-4">
                    {recebimentosData
                        .filter((r: any) => r.status !== 'Pago')
                        .map((r: any) => (
                            <div
                                key={r.id}

                                className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-black/20 p-5"
                            >
                                <div>
                                    <p className="font-semibold">Competência {r.competencia}</p>

                                    <p className="mt-1 text-sm text-zinc-500">Vencimento: {formatDate(r.vencimento)}</p>
                                </div>

                                <div className="text-right">
                                    <p className="text-xl font-bold text-green-400">{formatMoney(Number(r.valor))}</p>

                                    <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-400">
                                        {r.status}
                                    </span>
                                </div>
                            </div>
                        ))}

                    {recebimentosData.filter((r: any) => r.status !== 'Pago').length === 0 && (
                        <p className="text-zinc-500">Nenhum recebimento pendente.</p>
                    )}
                </div>
            </div>
        </main>
    );
}
