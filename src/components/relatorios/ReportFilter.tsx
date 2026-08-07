'use client';

type Periodo = 'hoje' | 'semana' | 'mes' | 'ano' | 'personalizado';

type ReportFilterProps = {
    value: Periodo;
    onChange: (value: Periodo) => void;
};

const filtros: {
    label: string;
    value: Periodo;
}[] = [
    {
        label: 'Hoje',
        value: 'hoje',
    },
    {
        label: 'Semana',
        value: 'semana',
    },
    {
        label: 'Mês',
        value: 'mes',
    },
    {
        label: 'Ano',
        value: 'ano',
    },
    {
        label: 'Personalizado',
        value: 'personalizado',
    },
];

export default function ReportFilter({ value, onChange }: ReportFilterProps) {
    return (
        <div className="flex flex-wrap gap-3">
            {filtros.map((filtro) => {
                const ativo = value === filtro.value;

                return (
                    <button
                        key={filtro.value}
                        type="button"
                        onClick={() => onChange(filtro.value)}
                        className={`rounded-xl border px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                            ativo
                                ? `border-green-500 bg-green-500 text-black shadow-lg shadow-green-500/20`
                                : `border-zinc-800 bg-[#111315] text-zinc-400 hover:border-green-500/40 hover:text-white`
                        } `}
                    >
                        {filtro.label}
                    </button>
                );
            })}
        </div>
    );
}
