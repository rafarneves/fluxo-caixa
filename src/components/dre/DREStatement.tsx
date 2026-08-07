import { TrendingUp, Receipt, Wallet } from "lucide-react";

type Despesa = {
  id?: string;
  categoria: string;
  valor: number;
};

type Props = {
  receitaBruta: number;
  custos: number;
  despesasOperacionais: number;
  despesas: Despesa[];
};

function moeda(valor: number) {
  const absoluto = Math.abs(valor);

  if (absoluto >= 1000000) {
    return `${valor < 0 ? "-" : ""}R$ ${(absoluto / 1000000).toFixed(1)}M`;
  }

  if (absoluto >= 1000) {
    return `${valor < 0 ? "-" : ""}R$ ${(absoluto / 1000).toFixed(1)}k`;
  }

  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function percentual(valor: number, receita: number) {
  if (receita <= 0) return "0%";

  return `${((valor / receita) * 100).toFixed(1)}%`;
}

export default function DREStatement({
  receitaBruta,
  custos,
  despesasOperacionais,
  despesas,
}: Props) {
  const lucroBruto = receitaBruta - custos;

  const lucroLiquido = lucroBruto - despesasOperacionais;

  const despesasAgrupadas = despesas.reduce<Record<string, number>>((acc, despesa) => {
    const categoria = despesa.categoria || "Outros";

    acc[categoria] = (acc[categoria] || 0) + Number(despesa.valor);

    return acc;
  }, {});

  const categorias = Object.entries(despesasAgrupadas).sort((a, b) => b[1] - a[1]);

  return (
    <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] overflow-hidden">
      <div className="p-8 border-b border-zinc-800">
        <div className="flex items-center gap-4 group">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-400 transition-transform duration-300 group-hover:scale-110">
            <TrendingUp size={26} />
          </div>

          <div>
            <h2 className="text-2xl font-bold">Demonstrativo Gerencial</h2>

            <p className="text-zinc-500 mt-1">Visão detalhada da formação do resultado</p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-5">
        <Linha
          titulo="Receita Bruta"

          valor={receitaBruta}

          percentual="100%"

          cor="green"

          icone={<Wallet size={18} />}
        />
        <Linha
          titulo="Custos dos Contratos"

          valor={custos}

          percentual={percentual(custos, receitaBruta)}

          cor="red"

          icone={<Receipt size={18} />}
        />
        <div className="rounded-2xl bg-black/20 border border-zinc-800 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-600 hover:shadow-xl">
          <p className="text-zinc-400">Lucro Bruto</p>

          <div className="flex justify-between items-center mt-3">
            <strong
              className={`
                text-3xl

                ${lucroBruto >= 0 ? "text-green-400" : "text-red-400"}
              `}
            >
              {moeda(lucroBruto)}
            </strong>

            <span className="text-zinc-400">{percentual(lucroBruto, receitaBruta)}</span>
          </div>
        </div>{" "}
        <Linha
          titulo="Despesas Operacionais"

          valor={despesasOperacionais}

          percentual={percentual(despesasOperacionais, receitaBruta)}

          cor="red"

          icone={<Receipt size={18} />}
        />
        <div className="pl-6 border-l border-zinc-800 space-y-3">
          {categorias.map(([categoria, valor]) => (
            <div
              key={categoria}

              className="flex justify-between text-sm"
            >
              <span className="text-zinc-500">{categoria}</span>

              <span className="text-red-300">{moeda(valor)}</span>
            </div>
          ))}
        </div>
        <div className="rounded-3xl bg-green-500/10 border border-green-500/20 p-7 mt-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <p className="text-zinc-400">Lucro Líquido</p>

          <div className="flex items-end justify-between mt-3">
            <h3
              className={
                lucroLiquido >= 0
                  ? "text-4xl font-bold text-green-400"
                  : "text-4xl font-bold text-red-400"
              }
            >
              {moeda(lucroLiquido)}
            </h3>

            <span className="text-lg font-bold text-green-400">
              {percentual(lucroLiquido, receitaBruta)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Linha({
  titulo,
  valor,
  percentual,
  cor,
  icone,
}: {
  titulo: string;
  valor: number;
  percentual: string;
  cor: "green" | "red";
  negativo?: boolean;
  icone: React.ReactNode;
}) {
  return (
    <div className="group flex items-center justify-between rounded-2xl border border-zinc-800 bg-black/20 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-600 hover:shadow-lg">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-zinc-900 p-2 text-zinc-400 transition-transform duration-300 group-hover:scale-110">
          {icone}
        </div>

        <span>{titulo}</span>
      </div>

      <div className="text-right">
        <p className={cor === "green" ? "font-bold text-green-400" : "font-bold text-red-400"}>
          {moeda(valor)}
        </p>

        <span className="text-xs text-zinc-500">{percentual}</span>
      </div>
    </div>
  );
}
