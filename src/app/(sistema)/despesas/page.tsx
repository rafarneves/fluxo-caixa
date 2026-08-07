import Link from "next/link";
import { supabase } from "@/lib/supabase";

import ExcluirDespesa from "./ExcluirDespesa";

import ExpenseSummary from "@/components/despesas/ExpenseSummary";
import ExpenseBreakdown from "@/components/despesas/ExpenseBreakdown";

function formatMoney(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default async function DespesasPage() {
  const { data: despesas } = await supabase.from("despesas").select("*").order("created_at", {
    ascending: false,
  });

  const dados = despesas ?? [];

  const total = dados.reduce((total, d: any) => total + Number(d.valor), 0);

  const fixas = dados
    .filter((d: any) => d.tipo === "Fixa")
    .reduce((total, d: any) => total + Number(d.valor), 0);

  const variaveis = dados
    .filter((d: any) => d.tipo === "Variável")
    .reduce((total, d: any) => total + Number(d.valor), 0);

  return (
    <main className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.20em] text-zinc-500">
          FINANCEIRO
        </p>

        <h1 className="mt-3 text-5xl font-bold text-white">Despesas</h1>

        <p className="text-zinc-400 mt-2">Controle dos custos operacionais da empresa.</p>
      </div>

      <ExpenseSummary total={total} quantidade={dados.length} fixas={fixas} variaveis={variaveis} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <section className="xl:col-span-2 rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Lista de Despesas</h2>

              <p className="text-zinc-500 mt-1">{dados.length} lançamento(s)</p>
            </div>

            <Link
              href="/despesas/nova"
              prefetch={false}
              className="bg-green-500 hover:bg-green-400 transition text-black px-6 py-3 rounded-xl font-bold"
            >
              + Nova Despesa
            </Link>
          </div>

          <div className="space-y-4">
            {dados.length === 0 && (
              <div className="rounded-2xl border border-dashed border-zinc-700 py-10 text-center text-zinc-500">
                Nenhuma despesa cadastrada.
              </div>
            )}

            {dados.map((d: any) => (
              <div
                key={d.id}
                className="rounded-2xl border border-zinc-800 bg-black/20 p-5 flex justify-between items-center hover:border-zinc-700 transition"
              >
                <div>
                  <h3 className="font-semibold text-white">{d.descricao}</h3>

                  <p className="text-zinc-500 mt-1">{d.categoria}</p>

                  <span
                    className={`
                          inline-flex
                          mt-3
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-semibold

                          ${
                            d.tipo === "Fixa"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : "bg-blue-500/10 text-blue-400"
                          }
                        `}
                  >
                    {d.tipo === "Fixa" ? `Fixa • Todo dia ${d.dia_vencimento}` : "Variável"}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-red-400">{formatMoney(Number(d.valor))}</p>

                  {d.tipo === "Variável" && d.data && (
                    <p className="text-sm text-zinc-500 mt-2">
                      {new Date(d.data).toLocaleDateString("pt-BR")}
                    </p>
                  )}

                  <div className="mt-4 flex gap-3 justify-end">
                    <Link
                      href={`/despesas/${d.id}`}
                      className="bg-zinc-800 hover:bg-zinc-700 transition px-4 py-2 rounded-lg text-sm font-semibold text-white"
                    >
                      Editar
                    </Link>

                    <ExcluirDespesa id={d.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div>
          <ExpenseBreakdown despesas={dados} />
        </div>
      </div>
    </main>
  );
}
