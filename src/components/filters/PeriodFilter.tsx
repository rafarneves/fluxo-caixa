'use client';

import { useRouter, useSearchParams } from 'next/navigation';

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
    const searchParams = useSearchParams();

    const periodo = searchParams.get('periodo') ?? 'mes';

    function alterarPeriodo(novoPeriodo: string) {
        const params = new URLSearchParams(searchParams.toString());

        params.set('periodo', novoPeriodo);

        router.push(`?${params.toString()}`);
    }

    return (
        <div className="flex flex-wrap gap-2 rounded-2xl border border-zinc-800 bg-[#161B22] p-1">
            {periodos.map((item) => {
                const ativo = periodo === item.value;

                return (
                    <button
                        key={item.value}
                        onClick={() => alterarPeriodo(item.value)}
                        className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                            ativo
                                ? `border border-green-500/40 bg-green-500/20 text-green-400 shadow-lg shadow-green-500/10`
                                : `border border-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white`
                        } `}
                    >
                        {item.label}
                    </button>
                );
            })}
        </div>
    );
}
