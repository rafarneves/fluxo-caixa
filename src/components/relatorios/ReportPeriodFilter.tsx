'use client';

import { useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CircularProgress, MenuItem, TextField } from '@mui/material';

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
        startTransition(() => router.replace(`${pathname}?${params.toString()}`, { scroll: false }));
    }

    return (
        <TextField
            data-export-ignore
            select
            size="small"
            label="Período"
            value={periodo}
            onChange={(event) => handleChange(event.target.value)}
            disabled={isPending}
            sx={{ minWidth: 180 }}
            slotProps={{
                input: { endAdornment: isPending ? <CircularProgress size={16} sx={{ mr: 2 }} /> : undefined },
            }}
        >
            {periodos.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                    {item.label}
                </MenuItem>
            ))}
        </TextField>
    );
}
