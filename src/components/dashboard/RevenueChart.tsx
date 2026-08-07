"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { TrendingUp } from "lucide-react";

type RevenueData = {
  mes: string;
  valor: number;
};

type RevenueChartProps = {
  data?: RevenueData[];
  title?: string;
  description?: string;
};

function moeda(valor: number) {
  if (valor >= 1000) {
    return `R$ ${(valor / 1000).toFixed(0)}k`;
  }

  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function RevenueChart({
  data = [],
  title = "Evolução do Faturamento",
  description = "Receita mensal dos últimos meses",
}: RevenueChartProps) {
  const ultimoValor = data.length > 0 ? data[data.length - 1].valor : 0;

  const primeiroValor = data.length > 0 ? data[0].valor : 0;

  const crescimento =
    primeiroValor === 0 ? 0 : ((ultimoValor - primeiroValor) / primeiroValor) * 100;

  return (
    <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
            PERFORMANCE
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white">{title}</h2>

          <p className="mt-2 text-zinc-500">{description}</p>
        </div>

        <div className="text-right">
          <div className="flex items-center justify-end gap-2 text-green-400">
            <TrendingUp size={18} />

            <span className="font-semibold">
              {crescimento >= 0 ? "+" : ""}
              {crescimento.toFixed(1)}%
            </span>
          </div>

          <p className="mt-2 text-3xl font-bold text-green-400">{moeda(ultimoValor)}</p>

          <p className="text-xs text-zinc-500">Último período</p>
        </div>
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
                dataKey="mes"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#71717A",
                  fontSize: 13,
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={moeda}
                tick={{
                  fill: "#71717A",
                  fontSize: 12,
                }}
              />

              <Tooltip
                formatter={(value: any) => [moeda(Number(value)), "Receita"]}
                cursor={{
                  stroke: "#22C55E",
                  strokeDasharray: "4 4",
                }}
                contentStyle={{
                  background: "#111827",
                  border: "1px solid #27272A",
                  borderRadius: "14px",
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
                  fill: "#22C55E",
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
