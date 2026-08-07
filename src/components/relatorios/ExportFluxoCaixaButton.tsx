"use client";

import { useState } from "react";

import {
  FileText,
  Loader2,
} from "lucide-react";

import { gerarPDFFluxoCaixa } from "@/lib/relatorios/fluxoCaixa";

type Linha = {
  tipo: string;
  descricao: string;
  valor: number;
};

type ExportFluxoCaixaButtonProps = {
  linhas: Linha[];
  entradas: number;
  saidas: number;
  custos: number;
  saldo: number;
};

export default function ExportFluxoCaixaButton({
  linhas,
  entradas,
  saidas,
  custos,
  saldo,
}: ExportFluxoCaixaButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    try {
      setLoading(true);

      gerarPDFFluxoCaixa(
        linhas,
        entradas,
        saidas,
        custos,
        saldo
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={loading}
      className="
        inline-flex
        items-center
        gap-2
        rounded-2xl
        border
        border-red-500/20
        bg-red-500/10
        px-5
        py-3
        text-sm
        font-semibold
        text-red-400
        transition-all
        duration-300
        hover:scale-105
        hover:border-red-500/40
        hover:shadow-lg
        hover:shadow-red-500/10
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      {loading ? (
        <Loader2
          size={18}
          className="animate-spin"
        />
      ) : (
        <FileText size={18} />
      )}

      Exportar PDF
    </button>
  );
}