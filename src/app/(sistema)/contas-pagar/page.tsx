import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { pagarConta } from "@/actions/contasPagar";

export default async function ContasPagarPage() {
  const { data: contas } = await supabase
    .from("contas_pagar")
    .select("*")
    .order("vencimento", { ascending: true });

  const total =
    contas?.reduce((acc, conta) => acc + Number(conta.valor), 0) ?? 0;

  const pendentes =
    contas?.filter((c) => c.status === "Pendente").length ?? 0;

  const pagas =
    contas?.filter((c) => c.status === "Pago").length ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-5xl font-bold text-green-400">
            Contas a Pagar
          </h1>

          <p className="text-zinc-400 mt-2">
            Controle de despesas da empresa.
          </p>
        </div>

        <Link
          href="/contas-pagar/nova"
          className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-4 rounded-xl"
        >
          + Nova Conta
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-[#161B22] rounded-2xl p-6">
          <p className="text-zinc-400">Total</p>

          <h2 className="text-4xl font-bold text-red-500 mt-4">
            {total.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </h2>
        </div>

        <div className="bg-[#161B22] rounded-2xl p-6">
          <p className="text-zinc-400">Pendentes</p>

          <h2 className="text-4xl font-bold text-yellow-400 mt-4">
            {pendentes}
          </h2>
        </div>

        <div className="bg-[#161B22] rounded-2xl p-6">
          <p className="text-zinc-400">Pagas</p>

          <h2 className="text-4xl font-bold text-green-400 mt-4">
            {pagas}
          </h2>
        </div>

      </div>

      <div className="bg-[#161B22] rounded-2xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-[#222B3A]">

            <tr>
              <th className="text-left p-5">Descrição</th>
              <th className="text-left p-5">Categoria</th>
              <th className="text-left p-5">Valor</th>
              <th className="text-left p-5">Vencimento</th>
              <th className="text-left p-5">Status</th>
              <th className="text-right p-5">Ação</th>
            </tr>

          </thead>

          <tbody>

            {contas?.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-zinc-500 p-10"
                >
                  Nenhuma conta cadastrada.
                </td>
              </tr>
            )}

            {contas?.map((conta) => (

              <tr
                key={conta.id}
                className="border-t border-zinc-800 hover:bg-zinc-900"
              >

                <td className="p-5">{conta.descricao}</td>

                <td className="p-5">{conta.categoria}</td>

                <td className="p-5 text-red-500 font-semibold">
                  {Number(conta.valor).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>

                <td className="p-5">
                  Dia {conta.vencimento}
                </td>

                <td className="p-5">
                  <span
                    className={
                      conta.status === "Pago"
                        ? "bg-green-500/20 text-green-400 px-3 py-1 rounded-full"
                        : "bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full"
                    }
                  >
                    {conta.status}
                  </span>
                </td>

                <td className="p-5 text-right">

                  {conta.status === "Pago" ? (

                    <span className="text-green-400 font-semibold">
                      Pago
                    </span>

                  ) : (

                    <form
                      action={async () => {
                        "use server";

                        await pagarConta(
                          conta.id,
                          conta.descricao,
                          Number(conta.valor)
                        );
                      }}
                    >

                      <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-500 px-5 py-2 rounded-lg font-semibold"
                      >
                        Pagar
                      </button>

                    </form>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
    </div>
  );
}