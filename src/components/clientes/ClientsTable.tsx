'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MapPin, Search, X } from 'lucide-react';

import { inativarCliente } from '@/actions/clientes';
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';

type ContratoCliente = {
    id: string;
    valor: number;
    status: string;
};

type Cliente = {
    id: string;
    nome: string;
    cidade: string | null;
    estado: string | null;
    bairro: string | null;
    status: string;
    contratos: ContratoCliente[] | null;
};

type Props = {
    clientes: Cliente[];
};

type FiltroStatus = 'todos' | 'ativo' | 'inativo';

const ITENS_POR_PAGINA = 10;

function normalizar(valor: string) {
    return valor
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pt-BR')
        .trim();
}

export default function ClientsTable({ clientes }: Props) {
    const { formatarMoeda } = useConfiguracoes();
    const [buscaNome, setBuscaNome] = useState('');
    const [buscaLocalizacao, setBuscaLocalizacao] = useState('');
    const [status, setStatus] = useState<FiltroStatus>('todos');
    const [pagina, setPagina] = useState(1);
    const clientesFiltrados = useMemo(() => {
        const nome = normalizar(buscaNome);
        const localizacao = normalizar(buscaLocalizacao);

        return clientes.filter((cliente) => {
            const statusCliente = normalizar(cliente.status ?? '');
            const correspondeNome = !nome || normalizar(cliente.nome).includes(nome);
            const localizacaoCliente = normalizar(
                [cliente.bairro, cliente.cidade, cliente.estado].filter(Boolean).join(' ')
            );
            const correspondeLocalizacao = !localizacao || localizacaoCliente.includes(localizacao);
            const correspondeStatus = status === 'todos' || statusCliente === status;

            return correspondeNome && correspondeLocalizacao && correspondeStatus;
        });
    }, [buscaLocalizacao, buscaNome, clientes, status]);
    const totalPaginas = Math.max(1, Math.ceil(clientesFiltrados.length / ITENS_POR_PAGINA));
    const paginaAtual = Math.min(pagina, totalPaginas);
    const indiceInicial = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const clientesPagina = clientesFiltrados.slice(indiceInicial, indiceInicial + ITENS_POR_PAGINA);

    function limparFiltros() {
        setBuscaNome('');
        setBuscaLocalizacao('');
        setStatus('todos');
        setPagina(1);
    }

    const possuiFiltros = Boolean(buscaNome || buscaLocalizacao || status !== 'todos');

    return (
        <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827]">
            <div className="grid gap-3 border-b border-zinc-800 p-5 md:grid-cols-2 xl:grid-cols-[1fr_1fr_220px_auto]">
                <label className="relative">
                    <span className="sr-only">Buscar por nome do cliente</span>
                    <Search
                        size={18}
                        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-zinc-500"
                    />
                    <input
                        type="search"
                        value={buscaNome}
                        onChange={(event) => {
                            setBuscaNome(event.target.value);
                            setPagina(1);
                        }}
                        placeholder="Buscar por nome do cliente"
                        className="w-full rounded-xl border border-zinc-800 bg-black/20 py-3 pr-4 pl-11 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-green-500/60 focus:ring-2 focus:ring-green-500/10"
                    />
                </label>

                <label className="relative">
                    <span className="sr-only">Buscar por localização</span>
                    <MapPin
                        size={18}
                        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-zinc-500"
                    />
                    <input
                        type="search"
                        value={buscaLocalizacao}
                        onChange={(event) => {
                            setBuscaLocalizacao(event.target.value);
                            setPagina(1);
                        }}
                        placeholder="Buscar por localização"
                        className="w-full rounded-xl border border-zinc-800 bg-black/20 py-3 pr-4 pl-11 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-green-500/60 focus:ring-2 focus:ring-green-500/10"
                    />
                </label>

                <label>
                    <span className="sr-only">Filtrar por status</span>
                    <select
                        value={status}
                        onChange={(event) => {
                            setStatus(event.target.value as FiltroStatus);
                            setPagina(1);
                        }}
                        className="w-full rounded-xl border border-zinc-800 bg-[#11161d] px-4 py-3 text-sm text-white outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/10"
                    >
                        <option value="todos">Todos os status</option>
                        <option value="ativo">Ativos</option>
                        <option value="inativo">Inativos</option>
                    </select>
                </label>

                {possuiFiltros && (
                    <button
                        type="button"
                        onClick={limparFiltros}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 px-4 py-3 text-sm font-semibold text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                    >
                        <X size={16} />
                        Limpar
                    </button>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
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
                        {clientesPagina.map((cliente) => {
                            const receitaCliente = (cliente.contratos ?? [])
                                .filter((contrato) => contrato.status === 'Ativo')
                                .reduce((total, contrato) => total + Number(contrato.valor), 0);
                            const ativo = normalizar(cliente.status) === 'ativo';
                            const localizacao = [cliente.cidade, cliente.estado].filter(Boolean).join(' - ');

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

                                    <td className="p-5 text-zinc-400">{localizacao || 'Sem localização'}</td>

                                    <td className="p-5 text-zinc-300">{cliente.contratos?.length ?? 0}</td>

                                    <td className="p-5 font-semibold text-green-400">
                                        {formatarMoeda(receitaCliente)}
                                    </td>

                                    <td className="p-5">
                                        <span
                                            className={`rounded-full px-3 py-1 text-sm ${
                                                ativo
                                                    ? 'bg-green-500/10 text-green-400'
                                                    : 'bg-zinc-700/60 text-zinc-400'
                                            }`}
                                        >
                                            {cliente.status}
                                        </span>
                                    </td>

                                    <td className="p-5 text-right whitespace-nowrap">
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

                                        {ativo && (
                                            <form action={inativarCliente.bind(null, cliente.id)} className="inline">
                                                <button className="ml-2 rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-400">
                                                    Inativar
                                                </button>
                                            </form>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}

                        {clientesPagina.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-zinc-500">
                                    Nenhum cliente encontrado com os filtros selecionados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {clientesFiltrados.length > 0 && (
                <div className="flex flex-col gap-3 border-t border-zinc-800 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-zinc-500">
                        Exibindo {indiceInicial + 1}–
                        {Math.min(indiceInicial + ITENS_POR_PAGINA, clientesFiltrados.length)} de{' '}
                        {clientesFiltrados.length}
                    </p>

                    <nav aria-label="Paginação de clientes" className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setPagina((paginaAnterior) => Math.max(1, paginaAnterior - 1))}
                            disabled={paginaAtual === 1}
                            aria-label="Página anterior"
                            className="rounded-lg border border-zinc-700 p-2 text-zinc-400 transition-colors hover:border-green-500/40 hover:text-green-400 disabled:cursor-not-allowed disabled:opacity-40"
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
                            className="rounded-lg border border-zinc-700 p-2 text-zinc-400 transition-colors hover:border-green-500/40 hover:text-green-400 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </nav>
                </div>
            )}
        </section>
    );
}
