'use client';

import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip, XAxis, YAxis, Dot } from 'recharts';
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';

type Props = {
    dados: {
        mes: string;
        receita: number;
        lucro: number;
    }[];
};

function formatarMes(valor: string) {
    if (!valor.includes('-')) {
        return valor;
    }

    const [ano, mes] = valor.split('-');

    const nomes = [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
    ];

    return `${nomes[Number(mes) - 1]}/${ano.slice(2)}`;
}

function CustomTooltip({ active, payload, label }: any) {
    const moeda = useConfiguracoes().formatarMoeda;

    if (!active || !payload?.length) {
        return null;
    }

    return (
        <div className="min-w-[180px] rounded-2xl border border-zinc-700 bg-[#090B10] p-4 shadow-2xl">
            <p className="mb-4 text-sm text-zinc-400">{formatarMes(label)}</p>

            <div className="space-y-2">
                <div className="flex justify-between gap-6">
                    <span className="text-sm text-green-400">Receita</span>

                    <strong className="text-white">{moeda(payload[0]?.value ?? 0)}</strong>
                </div>

                <div className="flex justify-between gap-6">
                    <span className="text-sm text-cyan-400">Lucro</span>

                    <strong className="text-white">{moeda(payload[1]?.value ?? 0)}</strong>
                </div>
            </div>
        </div>
    );
}

export default function DRECharts({ dados }: Props) {
    const { formatarMoedaCompacta } = useConfiguracoes();

    return (
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">
            <div className="mb-8">
                <p className="text-xs font-semibold tracking-[0.20em] text-zinc-500 uppercase">PERFORMANCE</p>

                <h2 className="mt-3 text-2xl font-bold">Evolução Financeira</h2>

                <p className="mt-2 text-zinc-500">Comparativo entre receita e lucro líquido.</p>
            </div>

            <div className="h-[360px]">
                {dados.length === 0 ? (
                    <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-zinc-700 text-zinc-500">
                        Nenhum dado disponível para o período selecionado.
                    </div>
                ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dados}>
                        <defs>
                            <linearGradient id="receitaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />

                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>

                            <linearGradient id="lucroGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.18} />

                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid stroke="#27272a" vertical={false} />

                        <XAxis
                            dataKey="mes"

                            tickFormatter={formatarMes}

                            stroke="#71717a"

                            axisLine={false}

                            tickLine={false}
                        />

                        <YAxis
                            stroke="#71717a"

                            axisLine={false}

                            tickLine={false}

                            tickFormatter={(valor) => formatarMoedaCompacta(Number(valor))}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        <Area
                            type="monotone"

                            dataKey="receita"

                            name="Receita"

                            stroke="#22c55e"

                            strokeWidth={3}

                            fill="url(#receitaGradient)"

                            animationDuration={1200}

                            dot={{
                                r: 4,
                            }}

                            activeDot={{
                                r: 7,
                            }}
                        />

                        <Area
                            type="monotone"

                            dataKey="lucro"

                            name="Lucro"

                            stroke="#06b6d4"

                            strokeWidth={3}

                            fill="url(#lucroGradient)"

                            animationDuration={1400}

                            dot={{
                                r: 4,
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
