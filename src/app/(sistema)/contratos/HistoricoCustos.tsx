"use client";

import ExcluirCusto from "@/app/(sistema)/custos/components/ExcluirCusto";

type Custo = {
  id: string;
  descricao: string;
  valor: number;
};

type Props = {
  custos: Custo[];
};

function formatMoney(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function HistoricoCustos({
  custos,
}: Props) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-[#161B22] p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          Custos do Contrato
        </h2>

        <span className="text-zinc-500">
          {custos.length} lançamento{custos.length !== 1 ? "s" : ""}
        </span>
      </div>

      {custos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-700 p-8 text-center text-zinc-500">
          Nenhum custo cadastrado.
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-zinc-400">
              <th className="pb-4">
                Descrição
              </th>

              <th className="text-right">
                Valor
              </th>

              <th className="text-center">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {custos.map((custo) => (
              <tr
                key={custo.id}
                className="border-b border-zinc-800"
              >
                <td className="py-5">
                  {custo.descricao}
                </td>

                <td className="text-right font-bold text-red-400">
                  {formatMoney(Number(custo.valor))}
                </td>

                <td className="text-center">
                  <ExcluirCusto id={custo.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}