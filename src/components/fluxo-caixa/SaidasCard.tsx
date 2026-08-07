import { ArrowUpCircle, Receipt } from "lucide-react";

type Despesa = {
  id: string;
  descricao: string;
  categoria: string;
  tipo: string;
  dia_vencimento: number | null;
  valor: number;
};

type Props = {
  despesas: Despesa[];
};

function moeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function SaidasCard({ despesas }: Props) {
  const total = despesas.reduce((acc, item) => acc + Number(item.valor), 0);

  return (
    <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.20em] text-zinc-500">SAÍDAS</p>

          <h2 className="mt-3 text-2xl font-bold">Despesas</h2>

          <p className="mt-2 text-zinc-500">Gastos registrados no período</p>
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold text-red-400">{moeda(total)}</p>

          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Total</p>
        </div>
      </div>

      <div className="space-y-3">
        {despesas.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-black/20 p-5 transition-all duration-300 hover:border-red-500/20"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <Receipt size={18} />
              </div>

              <div>
                <p className="font-semibold">{item.descricao}</p>

                <p className="text-sm text-zinc-500">{item.categoria}</p>

                <p className="mt-1 text-xs text-zinc-600">
                  {item.tipo === "Fixa" ? `Fixa • Dia ${item.dia_vencimento}` : "Variável"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-bold text-red-400">
              <ArrowUpCircle size={18} />

              {moeda(Number(item.valor))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
