import Link from "next/link";
import FormDespesa from "./FormDespesa";

export default function NovaDespesaPage() {
  return (
    <main className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] font-semibold text-zinc-500">
            FINANCEIRO
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            Nova
            <span className="text-green-400"> Despesa</span>
          </h1>

          <p className="mt-3 text-zinc-400 text-lg">
            Cadastre um novo custo operacional da empresa.
          </p>
        </div>

        <Link
          href="/despesas"

          className="bg-[#1C2430] border border-zinc-800 hover:border-zinc-600 transition px-6 py-3 rounded-xl font-semibold text-white"
        >
          ← Voltar
        </Link>
      </div>

      <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Informações da despesa</h2>

          <p className="text-zinc-500 mt-2">
            Preencha os dados abaixo para registrar o lançamento financeiro.
          </p>
        </div>

        <FormDespesa />
      </section>
    </main>
  );
}
