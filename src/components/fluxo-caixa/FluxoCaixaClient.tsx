'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import FluxoSummary from '@/components/fluxo-caixa/FluxoSummary';
import EntradasCard from '@/components/fluxo-caixa/EntradasCard';
import SaidasCard from '@/components/fluxo-caixa/SaidasCard';
import FluxoChart from './FluxoChart';

type Recebimento = {
    id: string;
    valor: number;
    vencimento: string;
    status: string;
    contratos: {
        nome: string | null;
        clientes: {
            nome: string;
            loja: string | null;
        } | null;
    } | null;
};

type Despesa = {
    id: string;
    descricao: string;
    categoria: string;
    tipo: string;
    dia_vencimento: number | null;
    valor: number;
    data?: string;
};

type Custo = {
    id: string;
    valor: number;
    data?: string;
};

type Props = {
    recebimentos: Recebimento[];
    despesas: Despesa[];
    custos: Custo[];
};

function normalizar(valor: string) {
    return valor
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pt-BR')
        .trim();
}

export default function FluxoCaixaClient({ recebimentos, despesas, custos }: Props) {
    const [busca, setBusca] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');

    const filtrados = useMemo(() => {
        let rec = recebimentos;
        let desp = despesas;
        let cust = custos;

        // Filtro por Data
        if (dataInicio && dataFim) {
            const inicio = new Date(dataInicio + 'T00:00:00');
            const fim = new Date(dataFim + 'T00:00:00');
            inicio.setHours(0, 0, 0, 0);
            fim.setHours(23, 59, 59, 999);

            rec = rec.filter(item => {
                if (!item.vencimento) return true;
                const d = new Date(item.vencimento + 'T00:00:00');
                return d >= inicio && d <= fim;
            });

            desp = desp.filter(item => {
                // Para despesas variáveis
                if (item.data) {
                    const d = new Date(item.data + 'T00:00:00');
                    return d >= inicio && d <= fim;
                }
                // Despesas fixas serão filtradas se a busca for muito longa?
                // Para manter a coerência, vamos mantê-las se não houver data,
                // já que costumam ocorrer todo mês.
                return true; 
            });

            cust = cust.filter(item => {
                if (!item.data) return true;
                const d = new Date(item.data + 'T00:00:00');
                return d >= inicio && d <= fim;
            });
        }

        // Filtro por Busca
        if (busca) {
            const termo = normalizar(busca);
            rec = rec.filter(item => {
                const nomeCliente = normalizar(item.contratos?.clientes?.nome ?? '');
                const nomeLoja = normalizar(item.contratos?.clientes?.loja ?? '');
                const nomePlano = normalizar(item.contratos?.nome ?? '');
                return nomeCliente.includes(termo) || nomeLoja.includes(termo) || nomePlano.includes(termo);
            });

            desp = desp.filter(item => {
                const desc = normalizar(item.descricao ?? '');
                const cat = normalizar(item.categoria ?? '');
                return desc.includes(termo) || cat.includes(termo);
            });
        }

        return { recebimentos: rec, despesas: desp, custos: cust };
    }, [recebimentos, despesas, custos, busca, dataInicio, dataFim]);

    const entradas = filtrados.recebimentos.reduce((total, r) => total + Number(r.valor), 0);
    const despesasFixas = filtrados.despesas.filter(d => d.tipo === 'Fixa').reduce((total, d) => total + Number(d.valor), 0);
    const despesasVariaveis = filtrados.despesas.filter(d => d.tipo === 'Variável').reduce((total, d) => total + Number(d.valor), 0);
    const custosContratos = filtrados.custos.reduce((total, c) => total + Number(c.valor), 0);
    const resultado = entradas - despesasFixas - despesasVariaveis - custosContratos;

    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-3">
                <label>
                    <span className="mb-2 block text-sm text-zinc-400">Buscar</span>
                    <div className="relative">
                        <Search size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-zinc-500" />
                        <input
                            type="search"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            placeholder="Pessoa, loja ou descrição"
                            className="w-full rounded-xl border border-zinc-800 bg-[#11161d] py-3 pr-4 pl-11 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-green-500/60 focus:ring-2 focus:ring-green-500/10"
                        />
                    </div>
                </label>

                <label>
                    <span className="mb-2 block text-sm text-zinc-400">Data Inicial</span>
                    <input
                        type="date"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                        className="w-full rounded-xl border border-zinc-800 bg-[#11161d] px-4 py-3 text-sm text-white outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/10"
                    />
                </label>
                
                <label>
                    <span className="mb-2 block text-sm text-zinc-400">Data Final</span>
                    <input
                        type="date"
                        value={dataFim}
                        onChange={(e) => setDataFim(e.target.value)}
                        className="w-full rounded-xl border border-zinc-800 bg-[#11161d] px-4 py-3 text-sm text-white outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/10"
                    />
                </label>
            </div>

            <FluxoSummary
                entradas={entradas}
                despesasFixas={despesasFixas}
                despesasVariaveis={despesasVariaveis}
                custosContratos={custosContratos}
                resultado={resultado}
            />

            <FluxoChart recebimentos={filtrados.recebimentos} despesas={filtrados.despesas} />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <EntradasCard recebimentos={filtrados.recebimentos} />
                <SaidasCard despesas={filtrados.despesas} />
            </div>
        </div>
    );
}
