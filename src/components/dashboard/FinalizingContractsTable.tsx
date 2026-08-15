'use client';

import { AlertTriangle, CalendarClock, DollarSign, UserRound } from 'lucide-react';

import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';
import Badge from '@/components/ui/Badge';

type ContratoFinalizacao = {
    id: string;
    valor: number;
    nome: string | null;
    status: string;
    data_fim: string | null;
    clientes: {
        nome: string;
    } | null;
};

type Props = {
    contratos: ContratoFinalizacao[];
};

export default function FinalizingContractsTable({ contratos }: Props) {
    const { formatarMoeda, formatarData } = useConfiguracoes();

    return (
        <section className="rounded-3xl border border-amber-500/20 bg-gradient-to-b from-[#1d2028] to-[#111827] p-8">
            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-[0.20em] text-amber-500/70 uppercase">ATENÇÃO</p>

                    <h2 className="mt-3 text-2xl font-bold">Contratos em Finalização</h2>

                    <p className="mt-2 text-zinc-500">{contratos.length} contrato(s) vencendo nos próximos 30 dias</p>
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                    <AlertTriangle size={24} />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-zinc-800">
                            <th className="pb-4 text-left text-xs tracking-[0.15em] text-zinc-500 uppercase">
                                Cliente
                            </th>

                            <th className="pb-4 text-left text-xs tracking-[0.15em] text-zinc-500 uppercase">Plano</th>

                            <th className="pb-4 text-left text-xs tracking-[0.15em] text-zinc-500 uppercase">Valor</th>

                            <th className="pb-4 text-left text-xs tracking-[0.15em] text-zinc-500 uppercase">
                                Finalização
                            </th>

                            <th className="pb-4 text-right text-xs tracking-[0.15em] text-zinc-500 uppercase">
                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {contratos.map((contrato) => (
                            <tr
                                key={contrato.id}
                                className="border-b border-zinc-900 transition-all duration-200 hover:bg-white/[0.03]"
                            >
                                <td className="py-5">
                                    <div className="flex items-center gap-3">
                                        <UserRound size={17} className="shrink-0 text-amber-400" />

                                        <span className="font-semibold text-white">
                                            {contrato.clientes?.nome ?? 'Cliente não informado'}
                                        </span>
                                    </div>
                                </td>

                                <td className="text-zinc-300">{contrato.nome ?? 'Plano personalizado'}</td>

                                <td>
                                    <div className="flex items-center gap-2 font-semibold text-amber-400">
                                        <DollarSign size={16} />

                                        {formatarMoeda(Number(contrato.valor))}
                                    </div>
                                </td>

                                <td>
                                    <div className="flex items-center gap-2 text-zinc-300">
                                        <CalendarClock size={16} />

                                        {contrato.data_fim ? formatarData(contrato.data_fim) : 'Data não informada'}
                                    </div>
                                </td>

                                <td className="text-right">
                                    <div className="flex justify-end">
                                        <Badge color="yellow">Próximo do vencimento</Badge>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {contratos.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-zinc-500">
                                    Nenhum contrato vencendo nos próximos 30 dias.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
