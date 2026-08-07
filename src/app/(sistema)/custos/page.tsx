import { supabase } from "@/lib/supabase";
import NovoCusto from "./components/NovoCusto";
import ExcluirCusto from "./components/ExcluirCusto";

function formatMoney(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default async function CustosPage() {
  const { data: custos } = await supabase
    .from("custos_contrato")
    .select(`
      *,
      contratos(
        nome,
        clientes(nome)
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  const { data: contratos } = await supabase
    .from("contratos")
    .select(`
      id,
      nome,
      clientes(nome)
    `)
    .eq("status", "Ativo");

  const dados = custos ?? [];

  const listaContratos = (contratos ?? []).map((c: any) => ({
    id: c.id,
    cliente: c.clientes?.nome ?? c.nome,
  }));

  const total = dados.reduce(
    (soma: number, custo: any) =>
      soma + Number(custo.valor),
    0
  );

  return (
    <main className="space-y-8">
      <div>
        <h1 className="text-5xl font-bold text-green-400">
          Custos
        </h1>

        <p className="text-zinc-400 mt-2">
          Controle de custos dos contratos.
        </p>
      </div>

      <NovoCusto contratos={listaContratos} />

      <div className="grid grid-cols-2 gap-5">
        <div className="bg-[#161B22] rounded-2xl p-6">
          <p className="text-zinc-400">
            Total Custos
          </p>

          <h2 className="text-3xl font-bold mt-3 text-red-400">
            {formatMoney(total)}
          </h2>
        </div>

        <div className="bg-[#161B22] rounded-2xl p-6">
          <p className="text-zinc-400">
            Registros
          </p>

          <h2 className="text-3xl font-bold mt-3 text-green-400">
            {dados.length}
          </h2>
        </div>
      </div>

      <div className="bg-[#161B22] rounded-3xl p-8">
        <h2 className="text-2xl font-bold mb-6">
          Histórico de Custos
        </h2>

        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-zinc-400">
              <th className="pb-4">
                Descrição
              </th>

              <th>
                Contrato
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
            {dados.map((c: any) => (
              <tr
                key={c.id}
                className="border-b border-zinc-800"
              >
                <td className="py-5">
                  {c.descricao}
                </td>

                <td>
                  {c.contratos?.clientes?.nome ?? "-"}
                </td>

                <td className="text-right text-red-400 font-bold">
                  {formatMoney(Number(c.valor))}
                </td>

                <td className="text-center">
                  <ExcluirCusto id={c.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}