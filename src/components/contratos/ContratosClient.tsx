'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import StatusBadge from '@/components/financeiro/StatusBadge';
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';
import { cancelarContrato } from '@/actions/contratos';

type Contrato = {
    id: string;
    nome: string | null;
    valor: number;
    data_inicio: string | null;
    vencimento: number | null;
    status: string;
    clientes: {
        id: string;
        nome: string;
        loja: string | null;
    } | null;
};

type Props = {
    contratos: Contrato[];
};

function normalizar(valor: string) {
    return valor
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pt-BR')
        .trim();
}

export default function ContratosClient({ contratos }: Props) {
    const { formatarMoeda, formatarData } = useConfiguracoes();
    const [busca, setBusca] = useState('');
    const [statusFiltro, setStatusFiltro] = useState('todos');
    const [lojaFiltro, setLojaFiltro] = useState('todas');

    const lojas = useMemo(() => {
        const nomes = contratos
            .map(c => c.clientes?.loja)
            .filter((loja): loja is string => Boolean(loja));
        return Array.from(new Set(nomes)).sort((a, b) => a.localeCompare(b, 'pt-BR'));
    }, [contratos]);

    const contratosFiltrados = useMemo(() => {
        let filtrados = contratos;

        if (busca) {
            const termo = normalizar(busca);
            filtrados = filtrados.filter(c => {
                const nomeCliente = normalizar(c.clientes?.nome ?? '');
                const nomeLoja = normalizar(c.clientes?.loja ?? '');
                const nomePlano = normalizar(c.nome ?? '');
                return nomeCliente.includes(termo) || nomeLoja.includes(termo) || nomePlano.includes(termo);
            });
        }

        if (statusFiltro !== 'todos') {
            filtrados = filtrados.filter(c => c.status === statusFiltro);
        }

        if (lojaFiltro !== 'todas') {
            filtrados = filtrados.filter(c => (c.clientes?.loja ?? '') === lojaFiltro);
        }

        return filtrados;
    }, [contratos, busca, statusFiltro, lojaFiltro]);

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <label>
                    <span className="mb-2 block text-sm text-zinc-400">Buscar</span>
                    <div className="relative">
                        <Search size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-zinc-500" />
                        <input
                            type="search"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            placeholder="Cliente, loja ou plano"
                            className="w-full rounded-xl border border-zinc-800 bg-[#11161d] py-3 pr-4 pl-11 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-green-500/60 focus:ring-2 focus:ring-green-500/10"
                        />
                    </div>
                </label>

                <label>
                    <span className="mb-2 block text-sm text-zinc-400">Status</span>
                    <select
                        value={statusFiltro}
                        onChange={(e) => setStatusFiltro(e.target.value)}
                        className="w-full rounded-xl border border-zinc-800 bg-[#11161d] px-4 py-3 text-sm text-white outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/10"
                    >
                        <option value="todos">Todos</option>
                        <option value="Ativo">Ativos</option>
                        <option value="Cancelado">Cancelados</option>
                    </select>
                </label>

                <label>
                    <span className="mb-2 block text-sm text-zinc-400">Loja</span>
                    <select
                        value={lojaFiltro}
                        onChange={(e) => setLojaFiltro(e.target.value)}
                        className="w-full rounded-xl border border-zinc-800 bg-[#11161d] px-4 py-3 text-sm text-white outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/10"
                    >
                        <option value="todas">Todas</option>
                        {lojas.map((loja) => (
                            <option key={loja} value={loja}>
                                {loja}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <p className="text-sm text-zinc-500">
                {contratosFiltrados.length} de {contratos.length} contrato(s)
            </p>

            <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827]">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-black/20">
                            <tr>
                                <th className="p-5 text-left text-xs tracking-[0.15em] text-zinc-500 uppercase">Cliente</th>
                                <th className="p-5 text-left text-xs tracking-[0.15em] text-zinc-500 uppercase">Loja</th>
                                <th className="p-5 text-left text-xs tracking-[0.15em] text-zinc-500 uppercase">Plano</th>
                                <th className="p-5 text-left text-xs tracking-[0.15em] text-zinc-500 uppercase">Valor</th>
                                <th className="p-5 text-left text-xs tracking-[0.15em] text-zinc-500 uppercase">Início</th>
                                <th className="p-5 text-left text-xs tracking-[0.15em] text-zinc-500 uppercase">Vencimento</th>
                                <th className="p-5 text-left text-xs tracking-[0.15em] text-zinc-500 uppercase">Status</th>
                                <th className="p-5 text-right text-xs tracking-[0.15em] text-zinc-500 uppercase">Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            {contratosFiltrados.map((contrato) => (
                                <tr
                                    key={contrato.id}
                                    className="border-t border-zinc-800 transition hover:bg-black/20"
                                >
                                    <td className="p-5">
                                        <Link
                                            href={`/clientes/${contrato.clientes?.id}`}
                                            className="font-semibold text-white hover:text-green-400"
                                        >
                                            {contrato.clientes?.nome ?? '-'}
                                        </Link>
                                    </td>

                                    <td className="p-5 text-zinc-400">{contrato.clientes?.loja ?? '-'}</td>

                                    <td className="p-5">
                                        <Link
                                            href={`/contratos/${contrato.id}`}
                                            className="font-semibold text-white hover:text-green-400"
                                        >
                                            {contrato.nome ?? '-'}
                                        </Link>
                                    </td>

                                    <td className="p-5 font-semibold text-green-400">
                                        {formatarMoeda(Number(contrato.valor))}
                                    </td>

                                    <td className="p-5 text-zinc-300">
                                        {contrato.data_inicio ? formatarData(contrato.data_inicio) : '-'}
                                    </td>

                                    <td className="p-5">Dia {contrato.vencimento}</td>

                                    <td className="p-5">
                                        <StatusBadge status={contrato.status} />
                                    </td>

                                    <td className="p-5 text-right">
                                        {contrato.status !== 'Cancelado' && (
                                            <form action={cancelarContrato.bind(null, contrato.id)}>
                                                <button type="submit" className="rounded-xl bg-red-500 px-5 py-2 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-red-400">
                                                    Cancelar
                                                </button>
                                            </form>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {contratosFiltrados.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-zinc-500">
                                        Nenhum contrato encontrado com os filtros atuais.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
