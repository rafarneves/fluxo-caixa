import React from "react";

type ReportChartProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  height?: number;
};

export default function ReportChart({
  title,
  description,
  children,
  actions,
  height = 420,
}: ReportChartProps) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.20em] text-zinc-500">ANÁLISE</p>

          <h2 className="mt-3 text-3xl font-bold text-white">{title}</h2>

          {description && <p className="mt-2 text-zinc-500">{description}</p>}
        </div>

        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>

      <div
        className="rounded-2xl border border-zinc-800 bg-black/20 p-4"
        style={{
          minHeight: height,
        }}
      >
        {children}
      </div>
    </section>
  );
}
