import Link from "next/link";
import { Plus } from "lucide-react";

export default function FluxoHeader() {
  return (
    <div className="flex items-start justify-between">

      <div>

        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
          FINANCEIRO
        </p>

        <h1 className="mt-3 text-5xl font-bold text-white">
          Fluxo de Caixa
        </h1>

        <p className="mt-3 max-w-3xl text-lg text-zinc-400">
          Acompanhe todas as entradas, saídas, despesas e o resultado financeiro
          da empresa em tempo real.
        </p>

      </div>

      <Link
        href="/despesas/nova"
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
        <Plus size={20} />

        Nova Despesa
      </Link>

    </div>
  );
}