'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { CalendarDays, Loader2 } from 'lucide-react';

const periodos = [
    {
        value: 'hoje',
        label: 'Hoje',
    },
    {
        value: 'semana',
        label: 'Esta Semana',
    },
    {
        value: 'mes',
        label: 'Este Mês',
    },
    {
        value: '30dias',
        label: 'Últimos 30 dias',
    },
    {
        value: 'ano',
        label: 'Este Ano',
    },
    {
        value: 'personalizado',
        label: 'Personalizado',
    },
];

export default function PeriodFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const periodo = searchParams.get('periodo') ?? 'mes';
    const hoje = new Date();
    const dataLocalISO = (data: Date) =>
        `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
    const inicioPadrao = dataLocalISO(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
    const fimPadrao = dataLocalISO(hoje);
    const inicio = searchParams.get('inicio') ?? inicioPadrao;
    const fim = searchParams.get('fim') ?? fimPadrao;

    function navegar(params: URLSearchParams) {
        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        });
    }

    function alterarPeriodo(novoPeriodo: string) {
        const params = new URLSearchParams(searchParams.toString());

        params.set('periodo', novoPeriodo);

        if (novoPeriodo === 'personalizado') {
            if (!params.get('inicio')) params.set('inicio', inicioPadrao);
            if (!params.get('fim')) params.set('fim', fimPadrao);
        } else {
            params.delete('inicio');
            params.delete('fim');
        }

        navegar(params);
    }

    function alterarData(campo: 'inicio' | 'fim', value: string) {
        if (!value) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set('periodo', 'personalizado');
        params.set(campo, value);

        const novoInicio = campo === 'inicio' ? value : inicio;
        const novoFim = campo === 'fim' ? value : fim;

        if (novoInicio > novoFim) {
            params.set(campo === 'inicio' ? 'fim' : 'inicio', value);
        }

        navegar(params);
    }

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2 rounded-2xl border border-zinc-800 bg-[#161B22] p-1">
                {periodos.map((item) => {
                    const ativo = periodo === item.value;

                    return (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => alterarPeriodo(item.value)}
                            disabled={isPending}
                            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-60 ${
                                ativo
                                    ? `border border-green-500/40 bg-green-500/20 text-green-400 shadow-lg shadow-green-500/10`
                                    : `border border-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white`
                            } `}
                        >
                            {item.label}
                        </button>
                    );
                })}

                {isPending && <Loader2 size={18} className="m-3 animate-spin text-green-400" />}
            </div>

            {periodo === 'personalizado' && (
                <div className="flex flex-col gap-3 rounded-2xl border border-green-500/20 bg-green-500/5 p-4 sm:flex-row sm:items-end">
                    <CalendarDays size={20} className="hidden self-center text-green-400 sm:block" />

                    <label className="flex-1 space-y-2">
                        <span className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">
                            Data inicial
                        </span>
                        <input
                            type="date"
                            value={inicio}
                            max={fim}
                            onChange={(event) => alterarData('inicio', event.target.value)}
                            disabled={isPending}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-200 scheme-dark transition outline-none focus:border-green-500 disabled:opacity-60"
                        />
                    </label>

                    <label className="flex-1 space-y-2">
                        <span className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">Data final</span>
                        <input
                            type="date"
                            value={fim}
                            min={inicio}
                            onChange={(event) => alterarData('fim', event.target.value)}
                            disabled={isPending}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-200 scheme-dark transition outline-none focus:border-green-500 disabled:opacity-60"
                        />
                    </label>
                </div>
            )}
        </div>
    );
}
