'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Search, Store, Wallet, X } from 'lucide-react';

import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';
import Badge from '@/components/ui/Badge';

type Recebimento = {
    id: string;
    valor: number;
    vencimento: string;
    status: string | null;
    contratos: {
        nome: string | null;
        clientes: {
            nome: string;
        } | null;
    } | null;
};

type Props = {
    recebimentos: Recebimento[];
};

const ITENS_POR_PAGINA = 10;

function normalizarBusca(valor: string) {
    return valor
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pt-BR')
        .trim();
}

export default function UpcomingReceivables({ recebimentos }: Props) {
    const { formatarMoedaCompacta, formatarData } = useConfiguracoes();
    const [busca, setBusca] = useState('');
    const [pagina, setPagina] = useState(1);
    const termoBusca = normalizarBusca(busca);
    const recebimentosFiltrados = useMemo(
        () =>
            [...recebimentos]
                .filter((item) => {
                    if (item.status === 'Pago') {
                        return false;
                    }

                    if (!termoBusca) {
                        return true;
                    }

                    const nomePessoa = normalizarBusca(item.contratos?.clientes?.nome ?? '');
                    const nomeLoja = normalizarBusca(item.contratos?.nome ?? '');

                    return nomePessoa.includes(termoBusca) || nomeLoja.includes(termoBusca);
                })
                .sort((a, b) => new Date(a.vencimento).getTime() - new Date(b.vencimento).getTime()),
        [recebimentos, termoBusca]
    );
    const totalPaginas = Math.max(1, Math.ceil(recebimentosFiltrados.length / ITENS_POR_PAGINA));
    const paginaAtual = Math.min(pagina, totalPaginas);
    const indiceInicial = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const lista = recebimentosFiltrados.slice(indiceInicial, indiceInicial + ITENS_POR_PAGINA);

    const total = recebimentosFiltrados.reduce((acc, item) => acc + Number(item.valor), 0);

    return (
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">
            <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-[0.20em] text-zinc-500 uppercase">FINANCEIRO</p>

                    <h2 className="mt-3 text-2xl font-bold">Próximos Recebimentos</h2>

                    <p className="mt-2 text-zinc-500">Cobranças previstas para os próximos dias</p>
                </div>

                <div className="text-right">
                    <p className="text-3xl font-bold text-green-400">{formatarMoedaCompacta(total)}</p>

                    <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Total Previsto</p>
                </div>
            </div>

            <div className="relative mb-6">
                <Search
                    size={18}
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-zinc-500"
                />

                <input
                    type="search"
                    value={busca}
                    onChange={(event) => {
                        setBusca(event.target.value);
                        setPagina(1);
                    }}
                    placeholder="Buscar por pessoa ou loja"
                    aria-label="Buscar recebimento por nome da pessoa ou da loja"
                    className="w-full rounded-xl border border-zinc-800 bg-black/20 py-3 pr-12 pl-11 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-green-500/60 focus:ring-2 focus:ring-green-500/10"
                />

                {busca && (
                    <button
                        type="button"
                        onClick={() => {
                            setBusca('');
                            setPagina(1);
                        }}
                        aria-label="Limpar busca"
                        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {lista.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-zinc-700 py-12 text-center text-zinc-500">
                        {termoBusca ? 'Nenhum recebimento encontrado para a busca.' : 'Nenhum recebimento pendente.'}
                    </div>
                )}

                {lista.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-black/20 p-5 transition-all duration-300 hover:border-green-500/20 hover:bg-black/30"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
                                <Wallet size={20} />
                            </div>

                            <div>
                                <h3 className="font-semibold text-white">
                                    {item.contratos?.clientes?.nome ?? 'Cliente'}
                                </h3>

                                <div className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
                                    <Store size={14} />

                                    <span>{item.contratos?.nome ?? 'Loja não informada'}</span>
                                </div>

                                <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500">
                                    <CalendarDays size={14} />

                                    {formatarData(item.vencimento)}
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-2xl font-bold text-white">{formatarMoedaCompacta(Number(item.valor))}</p>

                            <div className="mt-2 flex justify-end">
                                {item.status === 'Vencido' ? (
                                    <Badge color="red">Vencido</Badge>
                                ) : (
                                    <Badge color="yellow">{item.status ?? 'Pendente'}</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {recebimentosFiltrados.length > 0 && (
                <div className="mt-6 flex flex-col gap-3 border-t border-zinc-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-zinc-500">
                        Exibindo {indiceInicial + 1}–
                        {Math.min(indiceInicial + ITENS_POR_PAGINA, recebimentosFiltrados.length)} de{' '}
                        {recebimentosFiltrados.length}
                    </p>

                    <nav aria-label="Paginação dos próximos recebimentos" className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setPagina((paginaAnterior) => Math.max(1, paginaAnterior - 1))}
                            disabled={paginaAtual === 1}
                            aria-label="Página anterior"
                            className="rounded-lg border border-zinc-700 p-2 text-zinc-400 transition-colors hover:border-green-500/40 hover:text-green-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-zinc-700 disabled:hover:text-zinc-400"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <span className="min-w-24 text-center text-sm text-zinc-400">
                            Página <strong className="text-white">{paginaAtual}</strong> de {totalPaginas}
                        </span>

                        <button
                            type="button"
                            onClick={() => setPagina((paginaAnterior) => Math.min(totalPaginas, paginaAnterior + 1))}
                            disabled={paginaAtual === totalPaginas}
                            aria-label="Próxima página"
                            className="rounded-lg border border-zinc-700 p-2 text-zinc-400 transition-colors hover:border-green-500/40 hover:text-green-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-zinc-700 disabled:hover:text-zinc-400"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </nav>
                </div>
            )}
        </section>
    );
}
