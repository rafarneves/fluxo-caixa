'use client';

import { CalendarDays, DollarSign, FileText } from 'lucide-react';

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
        } | null;
    } | null;
};

type Props = {
    recebimentos: Recebimento[];
};

export default function RecebimentosTable({ recebimentos }: Props) {
    const { formatarMoeda, formatarData } = useConfiguracoes();
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

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-zinc-800">
                            <th className="pb-4 text-left text-xs tracking-[0.15em] text-zinc-500 uppercase">
                                Cliente
                            </th>

                            <th className="pb-4 text-left text-xs tracking-[0.15em] text-zinc-500 uppercase">Plano</th>

                            <th className="pb-4 text-left text-xs tracking-[0.15em] text-zinc-500 uppercase">
                                Competência
                            </th>

                            <th className="pb-4 text-left text-xs tracking-[0.15em] text-zinc-500 uppercase">Valor</th>

                            <th className="pb-4 text-left text-xs tracking-[0.15em] text-zinc-500 uppercase">
                                Vencimento
                            </th>

                            <th className="pb-4 text-center text-xs tracking-[0.15em] text-zinc-500 uppercase">
                                Status
                            </th>

                            <th className="pb-4 text-center text-xs tracking-[0.15em] text-zinc-500 uppercase">
                                Ações
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {recebimentos.map((item) => (
                            <tr
                                key={item.id}
                                className="border-b border-zinc-900 transition-all duration-200 hover:bg-white/[0.03]"
                            >
                                <td className="py-5">
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

                                <td className="text-zinc-300">{item.contratos?.nome ?? '-'}</td>

                                <td className="text-zinc-400">{item.competencia ?? '-'}</td>

                                <td>
                                    <div className="flex items-center gap-2 font-semibold text-green-400">
                                        <DollarSign size={16} />

                                        {formatarMoeda(Number(item.valor))}
                                    </div>
                                </td>

                                <td>
                                    <div className="flex items-center gap-2 text-zinc-300">
                                        <CalendarDays size={16} />

                                        {formatarData(item.vencimento)}
                                    </div>
                                </td>

                                <td>
                                    <div className="flex justify-center">
                                        {item.status === 'Pago' ? (
                                            <Badge color="green">Pago</Badge>
                                        ) : (
                                            <Badge color="yellow">Pendente</Badge>
                                        )}
                                    </div>
                                </td>

                                <td>
                                    <div className="flex justify-center">
                                        {item.status !== 'Pago' && <MarcarPago id={item.id} />}
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {recebimentos.length === 0 && (
                            <tr>
                                <td colSpan={7} className="py-12 text-center text-zinc-500">
                                    Nenhuma cobrança encontrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
