'use client';

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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
    return (
        <ResponsiveContainer width="100%" height={360}>
            <LineChart data={data}>
                <CartesianGrid stroke="#27272A" />

                <XAxis dataKey="mes" stroke="#71717A" />

                <YAxis stroke="#71717A" />

                <Tooltip
                    contentStyle={{
                        background: '#18181B',
                        border: '1px solid #27272A',
                        borderRadius: 12,
                    }}
                />

                <Line type="monotone" dataKey="recebido" stroke="#22C55E" strokeWidth={3} />

                <Line type="monotone" dataKey="despesas" stroke="#EF4444" strokeWidth={3} />

                <Line type="monotone" dataKey="custos" stroke="#F59E0B" strokeWidth={3} />

                <Line type="monotone" dataKey="lucro" stroke="#38BDF8" strokeWidth={3} />
            </LineChart>
        </ResponsiveContainer>
    );
}
