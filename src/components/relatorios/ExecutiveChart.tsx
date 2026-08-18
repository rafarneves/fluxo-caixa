'use client';

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';

type Props = {
    data: {
        mes: string;
        recebido: number;
        despesas: number;
        custos: number;
        lucro: number;
    }[];
};

export default function ExecutiveChart({ data }: Props) {
    const { formatarMoedaCompacta, formatarMoeda } = useConfiguracoes();

    if (data.length === 0) {
        return (
            <div className="flex h-[360px] items-center justify-center text-sm text-zinc-500">
                Sem dados no período.
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={360}>
            <LineChart data={data}>
                <CartesianGrid stroke="#27272A" />

                <XAxis dataKey="mes" stroke="#71717A" />

                <YAxis stroke="#71717A" tickFormatter={(value) => formatarMoedaCompacta(Number(value))} width={86} />

                <Tooltip
                    contentStyle={{
                        background: '#18181B',
                        border: '1px solid #27272A',
                        borderRadius: 12,
                    }}
                    formatter={(value) => formatarMoeda(Number(value ?? 0))}
                />

                <Legend />

                <Line type="monotone" dataKey="recebido" name="Recebido" stroke="#22C55E" strokeWidth={3} />

                <Line type="monotone" dataKey="despesas" name="Despesas" stroke="#EF4444" strokeWidth={3} />

                <Line type="monotone" dataKey="custos" name="Custos" stroke="#F59E0B" strokeWidth={3} />

                <Line type="monotone" dataKey="lucro" name="Lucro" stroke="#38BDF8" strokeWidth={3} />
            </LineChart>
        </ResponsiveContainer>
    );
}
