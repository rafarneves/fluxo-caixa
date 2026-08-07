import {
  CalendarDays,
  Wallet,
} from "lucide-react";

import Badge from "@/components/ui/Badge";

type Recebimento = {
  id: string;
  valor: number;
  vencimento: string;
  status: string | null;
  contratos: {
    clientes: {
      nome: string;
    } | null;
  } | null;
};

type Props = {
  recebimentos: Recebimento[];
};

function formatCompact(value: number) {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(1)}k`;
  }

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR");
}

export default function UpcomingReceivables({
  recebimentos,
}: Props) {
  const lista = [...recebimentos]
    .filter((item) => item.status !== "Pago")
    .sort(
      (a, b) =>
        new Date(a.vencimento).getTime() -
        new Date(b.vencimento).getTime()
    )
    .slice(0, 5);

  const total = lista.reduce(
    (acc, item) => acc + Number(item.valor),
    0
  );

  return (
    <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">

      <div className="flex items-center justify-between mb-8">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.20em] text-zinc-500">
            FINANCEIRO
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Próximos Recebimentos
          </h2>

          <p className="mt-2 text-zinc-500">
            Cobranças previstas para os próximos dias
          </p>

        </div>

        <div className="text-right">

          <p className="text-3xl font-bold text-green-400">
            {formatCompact(total)}
          </p>

          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Total Previsto
          </p>

        </div>

      </div>

      <div className="space-y-3">

        {lista.length === 0 && (
          <div className="rounded-2xl border border-dashed border-zinc-700 py-12 text-center text-zinc-500">
            Nenhum recebimento pendente.
          </div>
        )}

        {lista.map((item) => (
          <div
            key={item.id}
            className="
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-zinc-800
              bg-black/20
              p-5
              transition-all
              duration-300
              hover:border-green-500/20
              hover:bg-black/30
            "
          >
            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
                <Wallet size={20} />
              </div>

              <div>

                <h3 className="font-semibold text-white">
                  {item.contratos?.clientes?.nome ?? "Cliente"}
                </h3>

                <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500">

                  <CalendarDays size={14} />

                  {formatDate(item.vencimento)}

                </div>

              </div>

            </div>

            <div className="text-right">

              <p className="text-2xl font-bold text-white">
                {formatCompact(Number(item.valor))}
              </p>

              <div className="mt-2 flex justify-end">

                {item.status === "Vencido" ? (
                  <Badge color="red">
                    Vencido
                  </Badge>
                ) : (
                  <Badge color="yellow">
                    {item.status ?? "Pendente"}
                  </Badge>
                )}

              </div>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}