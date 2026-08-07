import { FileText, CalendarDays, DollarSign } from "lucide-react";

import Badge from "@/components/ui/Badge";

type Contrato = {
  id: string;
  cliente_id: string;
  valor: number;
  vencimento: number;
  nome: string | null;
  status: string;
};

type Props = {
  contratos: Contrato[];
};

function moeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function ContractsTable({ contratos }: Props) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.20em] text-zinc-500">
            OPERAÇÃO
          </p>

          <h2 className="mt-3 text-2xl font-bold">Contratos Ativos</h2>

          <p className="mt-2 text-zinc-500">{contratos.length} contrato(s) ativo(s)</p>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10 text-green-400">
          <FileText size={24} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="pb-4 text-left text-xs uppercase tracking-[0.15em] text-zinc-500">
                Plano
              </th>

              <th className="pb-4 text-left text-xs uppercase tracking-[0.15em] text-zinc-500">
                Valor
              </th>

              <th className="pb-4 text-left text-xs uppercase tracking-[0.15em] text-zinc-500">
                Vencimento
              </th>

              <th className="pb-4 text-right text-xs uppercase tracking-[0.15em] text-zinc-500">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {contratos.map((contrato) => (
              <tr
                key={contrato.id}
                className="border-b border-zinc-900 transition-all duration-200 hover:bg-white/[0.03]"
              >
                <td className="py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-green-400 font-bold">
                      {(contrato.nome ?? "P").charAt(0)}
                    </div>

                    <div>
                      <p className="font-semibold text-white">
                        {contrato.nome ?? "Plano Personalizado"}
                      </p>

                      <p className="text-sm text-zinc-500">Contrato ativo</p>
                    </div>
                  </div>
                </td>

                <td>
                  <div className="flex items-center gap-2 font-semibold text-green-400">
                    <DollarSign size={16} />

                    {moeda(Number(contrato.valor))}
                  </div>
                </td>

                <td>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <CalendarDays size={16} />
                    Dia {contrato.vencimento}
                  </div>
                </td>

                <td className="text-right">
                  <div className="flex justify-end">
                    <Badge color="green">{contrato.status}</Badge>
                  </div>
                </td>
              </tr>
            ))}

            {contratos.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-zinc-500">
                  Nenhum contrato ativo encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
