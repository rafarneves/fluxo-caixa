'use client';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';

type Periodo = 'hoje' | 'semana' | 'mes' | 'ano' | 'personalizado';
type ReportFilterProps = { value: Periodo; onChange: (value: Periodo) => void };
const filtros: { label: string; value: Periodo }[] = [
    { label: 'Hoje', value: 'hoje' },
    { label: 'Semana', value: 'semana' },
    { label: 'Mês', value: 'mes' },
    { label: 'Ano', value: 'ano' },
    { label: 'Personalizado', value: 'personalizado' },
];

export default function ReportFilter({ value, onChange }: ReportFilterProps) {
    return (
        <ToggleButtonGroup
            value={value}
            exclusive
            onChange={(_, next: Periodo | null) => next && onChange(next)}
            size="small"
            sx={{
                flexWrap: 'wrap',
                gap: 1,
                '& .MuiToggleButtonGroup-grouped': {
                    m: 0,
                    px: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '11px !important',
                },
                '& .Mui-selected': { color: '#061009 !important', bgcolor: 'primary.main !important' },
            }}
        >
            {filtros.map((filtro) => (
                <ToggleButton key={filtro.value} value={filtro.value}>
                    {filtro.label}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}
