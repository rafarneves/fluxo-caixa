'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, DollarSign, FileText, Search } from 'lucide-react';

import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';
import Badge from '@/components/ui/Badge';
import MarcarPago from '@/app/(sistema)/recebimentos/MarcarPago';

type Recebimento = {
    id: string;
    competencia: string | null;
    valor: number;
    vencimento: string;
    status: string | null;

    contratos: {
        nome: string | null;

        clientes: {
            nome: string;
            loja: string | null;
        } | null;
    } | null;
};

type Props = {
    recebimentos: Recebimento[];
};

type FiltroStatus = 'todos' | 'pago' | 'pendente' | 'atrasado' | 'receber_hoje';
type FiltroPeriodo = 'todos' | 'semanal' | 'mensal' | '6_meses' | 'personalizado';

const ITENS_POR_PAGINA = 10;

function normalizar(valor: string) {
    return valor
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pt-BR')
        .trim();
}

export default function RecebimentosTable({ recebimentos }: Props) {
    const { formatarMoeda, formatarData } = useConfiguracoes();

    const [buscaCliente, setBuscaCliente] = useState('');
    const [statusFiltro, setStatusFiltro] = useState<FiltroStatus>('todos');
    const [periodoFiltro, setPeriodoFiltro] = useState<FiltroPeriodo>('todos');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [pagina, setPagina] = useState(1);

    const recebimentosFiltrados = useMemo(() => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const dataHojeStr = hoje.toISOString().split('T')[0];

        let filtrados = recebimentos;

        if (buscaCliente) {
            const busca = normalizar(buscaCliente);
            filtrados = filtrados.filter((item) => {
                const nomeCliente = normalizar(item.contratos?.clientes?.nome ?? '');
                const nomeLoja = normalizar(item.contratos?.clientes?.loja ?? '');
                return nomeCliente.includes(busca) || nomeLoja.includes(busca);
            });
        }

        // Filtrar por Status
        if (statusFiltro !== 'todos') {
            filtrados = filtrados.filter((item) => {
                const dataVenc = new Date(item.vencimento + 'T00:00:00');
                dataVenc.setHours(0, 0, 0, 0);

                if (statusFiltro === 'pago') return item.status === 'Pago';
                if (statusFiltro === 'pendente') return item.status !== 'Pago' && dataVenc >= hoje;
                if (statusFiltro === 'atrasado') return item.status !== 'Pago' && dataVenc < hoje;
                if (statusFiltro === 'receber_hoje') return item.status !== 'Pago' && item.vencimento === dataHojeStr;
                
                return true;
            });
        }

        // Filtrar por Período
        if (periodoFiltro !== 'todos') {
            let inicio: Date | null = null;
            let fim: Date | null = null;

            if (periodoFiltro === 'semanal') {
                inicio = new Date(hoje);
                inicio.setDate(hoje.getDate() - 7);
                fim = new Date(hoje);
            } else if (periodoFiltro === 'mensal') {
                inicio = new Date(hoje);
                inicio.setMonth(hoje.getMonth() - 1);
                fim = new Date(hoje);
            } else if (periodoFiltro === '6_meses') {
                inicio = new Date(hoje);
                inicio.setMonth(hoje.getMonth() - 6);
                fim = new Date(hoje);
            } else if (periodoFiltro === 'personalizado' && dataInicio && dataFim) {
                inicio = new Date(dataInicio + 'T00:00:00');
                fim = new Date(dataFim + 'T00:00:00');
            }

            if (inicio && fim) {
                inicio.setHours(0, 0, 0, 0);
                fim.setHours(23, 59, 59, 999);

                filtrados = filtrados.filter((item) => {
                    const dataVenc = new Date(item.vencimento + 'T00:00:00');
                    return dataVenc >= inicio! && dataVenc <= fim!;
                });
            }
        }

        // Ordenação: Hoje pros mais recentes (decrescente por data de vencimento)
        filtrados.sort((a, b) => {
            return new Date(b.vencimento).getTime() - new Date(a.vencimento).getTime();
        });

        return filtrados;
    }, [recebimentos, statusFiltro, periodoFiltro, dataInicio, dataFim, buscaCliente]);

    const totalPaginas = Math.max(1, Math.ceil(recebimentosFiltrados.length / ITENS_POR_PAGINA));
    const paginaAtual = Math.min(pagina, totalPaginas);
    const indiceInicial = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const recebimentosPagina = recebimentosFiltrados.slice(indiceInicial, indiceInicial + ITENS_POR_PAGINA);

    return (
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-[0.20em] text-zinc-500 uppercase">FINANCEIRO</p>
                    <h2 className="mt-3 text-2xl font-bold">Histórico de Cobranças</h2>
                    <p className="mt-2 text-zinc-500">Todos os recebimentos cadastrados</p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10 text-green-400">
                    <FileText size={24} />
                </div>
            </div>

            {/* Filtros */}
            <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <label>
                    <span className="mb-2 block text-sm text-zinc-400">Buscar</span>
                    <div className="relative">
                        <Search
                            size={18}
                            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-zinc-500"
                        />
                        <input
                            type="search"
                            value={buscaCliente}
                            onChange={(e) => {
                                setBuscaCliente(e.target.value);
                                setPagina(1);
                            }}
                            placeholder="Cliente ou loja"
                            className="w-full rounded-xl border border-zinc-800 bg-[#11161d] py-3 pr-4 pl-11 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-green-500/60 focus:ring-2 focus:ring-green-500/10"
                        />
                    </div>
                </label>

                <label>
                    <span className="mb-2 block text-sm text-zinc-400">Status</span>
                    <select
                        value={statusFiltro}
                        onChange={(e) => {
                            setStatusFiltro(e.target.value as FiltroStatus);
                            setPagina(1);
                        }}
                        className="w-full rounded-xl border border-zinc-800 bg-[#11161d] px-4 py-3 text-sm text-white outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/10"
                    >
                        <option value="todos">Todos</option>
                        <option value="pago">Pagos</option>
                        <option value="pendente">Pendentes</option>
                        <option value="atrasado">Atrasados</option>
                        <option value="receber_hoje">Receber Hoje</option>
                    </select>
                </label>

                <label>
                    <span className="mb-2 block text-sm text-zinc-400">Período de Vencimento</span>
                    <select
                        value={periodoFiltro}
                        onChange={(e) => {
                            setPeriodoFiltro(e.target.value as FiltroPeriodo);
                            setPagina(1);
                        }}
                        className="w-full rounded-xl border border-zinc-800 bg-[#11161d] px-4 py-3 text-sm text-white outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/10"
                    >
                        <option value="todos">Todos</option>
                        <option value="semanal">Últimos 7 dias</option>
                        <option value="mensal">Último mês</option>
                        <option value="6_meses">Últimos 6 meses</option>
                        <option value="personalizado">Personalizado</option>
                    </select>
                </label>

                {periodoFiltro === 'personalizado' && (
                    <>
                        <label>
                            <span className="mb-2 block text-sm text-zinc-400">Data Inicial</span>
                            <input
                                type="date"
                                value={dataInicio}
                                onChange={(e) => {
                                    setDataInicio(e.target.value);
                                    setPagina(1);
                                }}
                                className="w-full rounded-xl border border-zinc-800 bg-[#11161d] px-4 py-3 text-sm text-white outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/10"
                            />
                        </label>
                        
                        <label>
                            <span className="mb-2 block text-sm text-zinc-400">Data Final</span>
                            <input
                                type="date"
                                value={dataFim}
                                onChange={(e) => {
                                    setDataFim(e.target.value);
                                    setPagina(1);
                                }}
                                className="w-full rounded-xl border border-zinc-800 bg-[#11161d] px-4 py-3 text-sm text-white outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/10"
                            />
                        </label>
                    </>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                    <thead>
                        <tr className="border-b border-zinc-800 bg-black/20">
                            <th className="p-5 text-left text-xs tracking-[0.15em] text-zinc-500 uppercase">Cliente</th>
                            <th className="p-5 text-left text-xs tracking-[0.15em] text-zinc-500 uppercase">Loja</th>
                            <th className="p-5 text-left text-xs tracking-[0.15em] text-zinc-500 uppercase">Plano</th>
                            <th className="p-5 text-left text-xs tracking-[0.15em] text-zinc-500 uppercase">Competência</th>
                            <th className="p-5 text-left text-xs tracking-[0.15em] text-zinc-500 uppercase">Valor</th>
                            <th className="p-5 text-left text-xs tracking-[0.15em] text-zinc-500 uppercase">Vencimento</th>
                            <th className="p-5 text-center text-xs tracking-[0.15em] text-zinc-500 uppercase">Status</th>
                            <th className="p-5 text-center text-xs tracking-[0.15em] text-zinc-500 uppercase">Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {recebimentosPagina.map((item) => (
                            <tr
                                key={item.id}
                                className="border-b border-zinc-900 transition-all duration-200 hover:bg-white/[0.03]"
                            >
                                <td className="p-5">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 font-bold text-green-400">
                                            {(item.contratos?.clientes?.nome ?? 'C').charAt(0).toUpperCase()}
                                        </div>

                                        <div>
                                            <p className="font-semibold text-white">
                                                {item.contratos?.clientes?.nome ?? '-'}
                                            </p>
                                            <p className="text-sm text-zinc-500">Cliente</p>
                                        </div>
                                    </div>
                                </td>

                                <td className="p-5 text-zinc-400">{item.contratos?.clientes?.loja ?? '-'}</td>

                                <td className="p-5 text-zinc-300">{item.contratos?.nome ?? '-'}</td>

                                <td className="p-5 text-zinc-400">{item.competencia ?? '-'}</td>

                                <td className="p-5">
                                    <div className="flex items-center gap-2 font-semibold text-green-400">
                                        <DollarSign size={16} />
                                        {formatarMoeda(Number(item.valor))}
                                    </div>
                                </td>

                                <td className="p-5">
                                    <div className="flex items-center gap-2 text-zinc-300">
                                        <CalendarDays size={16} />
                                        {formatarData(item.vencimento)}
                                    </div>
                                </td>

                                <td className="p-5">
                                    <div className="flex justify-center">
                                        {item.status === 'Pago' ? (
                                            <Badge color="green">Pago</Badge>
                                        ) : (
                                            <Badge color="yellow">Pendente</Badge>
                                        )}
                                    </div>
                                </td>

                                <td className="p-5">
                                    <div className="flex justify-center">
                                        {item.status !== 'Pago' && <MarcarPago id={item.id} />}
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {recebimentosPagina.length === 0 && (
                            <tr>
                                <td colSpan={8} className="py-12 text-center text-zinc-500">
                                    Nenhuma cobrança encontrada com os filtros atuais.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginação */}
            {recebimentosFiltrados.length > 0 && (
                <div className="mt-8 flex flex-col gap-3 border-t border-zinc-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-zinc-500">
                        Exibindo {indiceInicial + 1}–
                        {Math.min(indiceInicial + ITENS_POR_PAGINA, recebimentosFiltrados.length)} de{' '}
                        {recebimentosFiltrados.length}
                    </p>

                    <nav aria-label="Paginação de cobranças" className="flex items-center gap-2">
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
