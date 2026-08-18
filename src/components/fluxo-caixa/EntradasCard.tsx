'use client';

import { ArrowDownCircle, User } from 'lucide-react';
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';

type Recebimento = {
    id: string;
    valor: number;
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

export default function EntradasCard({ recebimentos }: Props) {
    const moeda = useConfiguracoes().formatarMoeda;
    const total = recebimentos.reduce((acc, item) => acc + Number(item.valor), 0);

    return (
        <section className="min-w-0 rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex min-w-0 flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-[0.20em] text-zinc-500 uppercase">ENTRADAS</p>

                    <h2 className="mt-3 text-2xl font-bold">Recebimentos</h2>

                    <p className="mt-2 text-zinc-500">Valores já recebidos</p>
                </div>

                <div className="min-w-0 text-left sm:text-right">
                    <p className="text-2xl font-bold break-words text-green-400 sm:text-3xl">{moeda(total)}</p>

                    <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Total</p>
                </div>
            </div>

            <div className="space-y-3">
                {recebimentos.map((item) => (
                    <div
                        key={item.id}
                        className="flex min-w-0 flex-col gap-4 rounded-2xl border border-zinc-800 bg-black/20 p-4 transition-all duration-300 hover:border-green-500/20 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                    >
                        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                                <User size={18} />
                            </div>

                            <div className="min-w-0">
                                <p className="font-semibold break-words">
                                    {item.contratos?.clientes?.nome ?? '-'}
                                    {item.contratos?.clientes?.loja && (
                                        <span className="ml-2 text-sm font-normal text-zinc-400">
                                            ({item.contratos.clientes.loja})
                                        </span>
                                    )}
                                </p>

                                <p className="text-sm break-words text-zinc-500">{item.contratos?.nome ?? '-'}</p>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 self-end font-bold whitespace-nowrap text-green-400 sm:self-auto">
                            <ArrowDownCircle size={18} />

                            {moeda(Number(item.valor))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
