"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { mes: "Jan", valor: 1200 },
  { mes: "Fev", valor: 2200 },
  { mes: "Mar", valor: 1800 },
  { mes: "Abr", valor: 3100 },
  { mes: "Mai", valor: 2600 },
  { mes: "Jun", valor: 4200 },
  { mes: "Jul", valor: 3800 },
];

export default function GraficoFaturamento() {
  return (
    <div className="bg-[#161B22] rounded-2xl p-6 h-[420px]">
      <h2 className="text-2xl font-bold text-white mb-6">Faturamento Mensal</h2>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid stroke="#2C3442" />

          <XAxis dataKey="mes" stroke="#A1A1AA" />

          <YAxis stroke="#A1A1AA" />

          <Tooltip />

          <Line type="monotone" dataKey="valor" stroke="#00E676" strokeWidth={4} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
