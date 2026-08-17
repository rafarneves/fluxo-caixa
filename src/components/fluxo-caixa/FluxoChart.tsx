'use client';

import { useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';

type Recebimento = {
    valor: number;
    vencimento: string;
};

type Despesa = {
    valor: number;
    dia_vencimento: number | null;
    data?: string;
    tipo: string;
};

type Props = {
    recebimentos: Recebimento[];
    despesas: Despesa[];
};

export default function FluxoChart({ recebimentos, despesas }: Props) {
    const { formatarMoeda } = useConfiguracoes();

    const chartData = useMemo(() => {
        // Group by YYYY-MM
        const map = new Map<string, { entradas: number; saidas: number }>();

        recebimentos.forEach(r => {
            if (!r.vencimento) return;
            const month = r.vencimento.substring(0, 7); // YYYY-MM
            const current = map.get(month) || { entradas: 0, saidas: 0 };
            current.entradas += Number(r.valor);
            map.set(month, current);
        });

        despesas.forEach(d => {
            let month = '';
            if (d.data) {
                month = d.data.substring(0, 7);
            } else if (d.tipo === 'Fixa') {
                // Se for fixa e não tem data, vamos atribuir ao mês atual por simplificação
                month = new Date().toISOString().substring(0, 7);
            }
            if (!month) return;
            
            const current = map.get(month) || { entradas: 0, saidas: 0 };
            current.saidas += Number(d.valor);
            map.set(month, current);
        });

        const sortedMonths = Array.from(map.keys()).sort();
        
        return sortedMonths.map(month => {
            const [year, m] = month.split('-');
            return {
                name: `${m}/${year}`,
                entradas: map.get(month)?.entradas || 0,
                saidas: map.get(month)?.saidas || 0
            };
        });
    }, [recebimentos, despesas]);

    if (chartData.length === 0) {
        return (
            <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8 text-center text-zinc-500">
                Não há dados para exibir no gráfico neste período.
            </section>
        );
    }

    return (
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">
            <div className="mb-6">
                <h3 className="text-lg font-bold">Evolução do Fluxo</h3>
                <p className="text-sm text-zinc-500">Comparativo entre Entradas (Recebimentos) e Saídas (Despesas)</p>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis 
                            dataKey="name" 
                            stroke="#52525b" 
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis 
                            stroke="#52525b" 
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `R$ ${value}`}
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '0.75rem' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: number) => formatarMoeda(value)}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="entradas" 
                            name="Entradas"
                            stroke="#4ade80" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorEntradas)" 
                        />
                        <Area 
                            type="monotone" 
                            dataKey="saidas" 
                            name="Saídas"
                            stroke="#f87171" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorSaidas)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}
