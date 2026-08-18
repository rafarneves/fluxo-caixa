'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';

const periodos = [
    { value: 'mes', label: 'Este mês' },
    { value: 'semana', label: 'Semana' },
    { value: '30dias', label: '30 dias' },
    { value: 'ano', label: 'Este ano' },
    { value: 'todos', label: 'Todo período' },
];

export default function ReportPeriodFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const periodo = searchParams.get('periodo') ?? 'mes';

    function handleChange(value: string) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('periodo', value);

        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        });
    }

    return (
        <label data-export-ignore className="relative inline-flex items-center">
            <span className="sr-only">Período do relatório</span>
            <select
                value={periodo}
                onChange={(event) => handleChange(event.target.value)}
                disabled={isPending}
                className="appearance-none rounded-2xl border border-zinc-700 bg-zinc-900 py-3 pr-11 pl-4 text-sm font-semibold text-zinc-200 transition outline-none hover:border-green-500/40 focus:border-green-500 disabled:opacity-60"
            >
                {periodos.map((item) => (
                    <option key={item.value} value={item.value}>
                        {item.label}
                    </option>
                ))}
            </select>
            {isPending && (
                <Loader2 size={16} className="pointer-events-none absolute right-3 animate-spin text-green-400" />
            )}
        </label>
    );
}
