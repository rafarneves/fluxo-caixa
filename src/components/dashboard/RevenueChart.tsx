'use client';

import { useMemo, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

import { CalendarDays, TrendingUp } from 'lucide-react';
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';
import { calcularEvolucaoFaturamentoPorPeriodo, type RecebimentoFaturamento } from '@/lib/financeiro';

type TipoPeriodo = 'dia' | 'semana' | 'mes' | 'personalizado';

type RevenueChartProps = {
    recebimentos?: RecebimentoFaturamento[];
    title?: string;
    description?: string;
};

const filtros: Array<{ valor: TipoPeriodo; label: string }> = [
    { valor: 'dia', label: '1 dia' },
    { valor: 'semana', label: '7 dias' },
    { valor: 'mes', label: '1 mês' },
    { valor: 'personalizado', label: 'Personalizar' },
];

function formatarDataIso(data: Date) {
    return [
        data.getFullYear(),
        String(data.getMonth() + 1).padStart(2, '0'),
        String(data.getDate()).padStart(2, '0'),
    ].join('-');
}

function subtrairDias(dataIso: string, dias: number) {
    const [ano, mes, dia] = dataIso.split('-').map(Number);
    const data = new Date(ano, mes - 1, dia);

    data.setDate(data.getDate() - dias);

    return formatarDataIso(data);
}

function formatarPeriodo(valor: string) {
    const partes = valor.split('-').map(Number);
    const data = new Date(partes[0], partes[1] - 1, partes[2] ?? 1);

    if (Number.isNaN(data.getTime())) {
        return valor;
    }

    if (partes.length === 3) {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'short',
        })
            .format(data)
            .replace('.', '');
    }

    const nomeMes = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(data).replace('.', '');

    return `${nomeMes.charAt(0).toUpperCase()}${nomeMes.slice(1)}/${String(partes[0]).slice(2)}`;
}

export default function RevenueChart({
    recebimentos = [],
    title = 'Evolução do Faturamento',
    description = 'Receita no período selecionado',
}: RevenueChartProps) {
    const { formatarMoedaCompacta, fusoHorario } = useConfiguracoes();
    const hoje = useMemo(() => {
        const partes = new Intl.DateTimeFormat('pt-BR', {
            timeZone: fusoHorario,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })
            .formatToParts(new Date())
            .reduce<Record<string, string>>((resultado, parte) => {
                resultado[parte.type] = parte.value;
                return resultado;
            }, {});

        return `${partes.year}-${partes.month}-${partes.day}`;
    }, [fusoHorario]);
    const [periodo, setPeriodo] = useState<TipoPeriodo>('mes');
    const [inicioPersonalizado, setInicioPersonalizado] = useState(() => subtrairDias(hoje, 29));
    const [fimPersonalizado, setFimPersonalizado] = useState(hoje);

    const intervalo = useMemo(() => {
        if (periodo === 'dia') {
            return { inicio: hoje, fim: hoje };
        }

        if (periodo === 'semana') {
            return { inicio: subtrairDias(hoje, 6), fim: hoje };
        }

        if (periodo === 'personalizado') {
            return { inicio: inicioPersonalizado, fim: fimPersonalizado };
        }

        return { inicio: subtrairDias(hoje, 29), fim: hoje };
    }, [fimPersonalizado, hoje, inicioPersonalizado, periodo]);

    const data = useMemo(
        () => calcularEvolucaoFaturamentoPorPeriodo(recebimentos, intervalo.inicio, intervalo.fim),
        [intervalo.fim, intervalo.inicio, recebimentos]
    );
    const ultimoValor = data.length > 0 ? data[data.length - 1].valor : 0;

    const primeiroValor = data.length > 0 ? data[0].valor : 0;

    const crescimento = primeiroValor === 0 ? 0 : ((ultimoValor - primeiroValor) / primeiroValor) * 100;

    return (
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">
            <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">PERFORMANCE</p>

                    <h2 className="mt-3 text-3xl font-bold text-white">{title}</h2>

                    <p className="mt-2 text-zinc-500">{description}</p>
                </div>

                <div className="text-right">
                    <div className="flex items-center justify-end gap-2 text-green-400">
                        <TrendingUp size={18} />

                        <span className="font-semibold">
                            {crescimento >= 0 ? '+' : ''}
                            {crescimento.toFixed(1)}%
                        </span>
                    </div>

                    <p className="mt-2 text-3xl font-bold text-green-400">{formatarMoedaCompacta(ultimoValor)}</p>

                    <p className="text-xs text-zinc-500">Último período</p>
                </div>
            </div>

            <div className="mb-8 flex flex-col gap-4 border-y border-zinc-800/80 py-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-xl bg-zinc-950/50 p-1">
                    {filtros.map((filtro) => {
                        const ativo = periodo === filtro.valor;

                        return (
                            <button
                                type="button"
                                key={filtro.valor}
                                onClick={() => setPeriodo(filtro.valor)}
                                aria-pressed={ativo}
                                className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                                    ativo
                                        ? 'bg-green-500/15 text-green-400 ring-1 ring-green-500/30'
                                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                                }`}
                            >
                                {filtro.label}
                            </button>
                        );
                    })}
                </div>

                {periodo === 'personalizado' && (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <CalendarDays size={18} className="hidden shrink-0 text-zinc-500 sm:block" />

                        <label className="flex items-center gap-2 text-sm text-zinc-400">
                            <span>De</span>
                            <input
                                type="date"
                                value={inicioPersonalizado}
                                max={fimPersonalizado}
                                onChange={(event) => setInicioPersonalizado(event.target.value)}
                                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white [color-scheme:dark] outline-none focus:border-green-500"
                            />
                        </label>

                        <label className="flex items-center gap-2 text-sm text-zinc-400">
                            <span>Até</span>
                            <input
                                type="date"
                                value={fimPersonalizado}
                                min={inicioPersonalizado}
                                max={hoje}
                                onChange={(event) => setFimPersonalizado(event.target.value)}
                                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white [color-scheme:dark] outline-none focus:border-green-500"
                            />
                        </label>
                    </div>
                )}
            </div>

            <div className="h-[360px]">
                {data.length === 0 ? (
                    <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-zinc-700 text-zinc-500">
                        Nenhum dado encontrado para o período.
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="receitaGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#22C55E" stopOpacity={0.45} />

                                    <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid stroke="#222831" strokeDasharray="4 4" vertical={false} />

                            <XAxis
                                dataKey="periodo"
                                tickFormatter={formatarPeriodo}
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: '#71717A',
                                    fontSize: 13,
                                }}
                            />

                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => formatarMoedaCompacta(Number(value))}
                                tick={{
                                    fill: '#71717A',
                                    fontSize: 12,
                                }}
                            />

                            <Tooltip
                                formatter={(value: unknown) => [formatarMoedaCompacta(Number(value)), 'Receita']}
                                labelFormatter={(label) => formatarPeriodo(String(label))}
                                cursor={{
                                    stroke: '#22C55E',
                                    strokeDasharray: '4 4',
                                }}
                                contentStyle={{
                                    background: '#111827',
                                    border: '1px solid #27272A',
                                    borderRadius: '14px',
                                }}
                            />

                            <Area
                                type="monotone"
                                dataKey="valor"
                                stroke="#22C55E"
                                strokeWidth={4}
                                fill="url(#receitaGradient)"
                                dot={{
                                    r: 4,
                                    fill: '#22C55E',
                                }}
                                activeDot={{
                                    r: 7,
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </section>
    );
}
