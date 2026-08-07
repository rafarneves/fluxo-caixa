"use client";

import { Download } from "lucide-react";

import PeriodFilter from "@/components/filters/PeriodFilter";

export default function DREHeader() {
  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">

      <div>

        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
          FINANCEIRO
        </p>

        <h1 className="mt-3 text-5xl font-bold text-white">
          DRE Executivo
        </h1>

        <p className="mt-3 max-w-3xl text-lg text-zinc-400">
          Análise completa da rentabilidade da empresa,
          acompanhando receitas, custos, despesas e resultado líquido.
        </p>

      </div>


      <div className="flex flex-col items-end gap-4">

        <PeriodFilter />


        <button
          className="
            inline-flex
            items-center
            gap-3
            rounded-2xl
            bg-green-500
            px-6
            py-4
            font-semibold
            text-black
            transition-all
            duration-300
            hover:scale-[1.02]
            hover:bg-green-400
          "
        >

          <Download size={20} />

          Exportar DRE

        </button>


      </div>


    </div>
  );
}