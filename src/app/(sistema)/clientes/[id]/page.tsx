import Link from "next/link";
import { supabase } from "@/lib/supabase";

function formatMoney(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR");
}

export default async function ClienteDetalhe({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { data: cliente } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!cliente) {
    return <div className="text-red-400 text-2xl">Cliente não encontrado.</div>;
  }

  const { data: contratos } = await supabase
    .from("contratos")
    .select("*")
    .eq("cliente_id", cliente.id)
    .order("created_at", {
      ascending: false,
    });

  const contratosData = contratos ?? [];

  const contratoIds = contratosData.map((contrato: any) => contrato.id);

  const { data: recebimentos } =
    contratoIds.length > 0
      ? await supabase
          .from("recebimentos")
          .select("*")
          .in("contrato_id", contratoIds)
          .order("vencimento", {
            ascending: true,
          })
      : {
          data: [],
        };

  const recebimentosData = recebimentos ?? [];

  return (
    <main className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">CLIENTE</p>

          <h1 className="mt-3 text-5xl font-bold text-green-400">{cliente.nome}</h1>

          <p className="text-zinc-400 mt-2">Dados cadastrais, contratos e recebimentos.</p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/clientes"

            className="bg-zinc-800 px-6 py-3 rounded-xl hover:bg-zinc-700"
          >
            ← Clientes
          </Link>

          <Link
            href={`/clientes/editar/${cliente.id}`}

            className="bg-zinc-700 px-6 py-3 rounded-xl hover:bg-zinc-600"
          >
            Editar Cliente
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">
        <h2 className="text-2xl font-bold mb-6">Informações do Cliente</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-zinc-500">Cidade</p>

            <p className="mt-2 font-semibold">{cliente.cidade ?? "-"}</p>
          </div>

          <div>
            <p className="text-zinc-500">Telefone</p>

            <p className="mt-2 font-semibold">{cliente.telefone ?? "-"}</p>
          </div>

          <div>
            <p className="text-zinc-500">Cliente desde</p>

            <p className="mt-2 font-semibold">{formatDate(cliente.created_at)}</p>
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Contratos</h2>

          <Link
            href={`/contratos/novo?cliente=${cliente.id}`}
            className="rounded-xl bg-green-500 px-5 py-3 font-bold text-black hover:bg-green-400"
          >
            + Novo Contrato
          </Link>
        </div>

        <div className="space-y-4">
          {contratosData.map((contrato: any) => (
            <div
              key={contrato.id}

              className="rounded-2xl border border-zinc-800 bg-black/20 p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <Link
                    href={`/contratos/${contrato.id}`}

                    className="text-xl font-bold text-white hover:text-green-400"
                  >
                    {contrato.nome}
                  </Link>

                  <p className="text-zinc-500 mt-2">{contrato.recorrencia ?? "Mensal"}</p>
                </div>

                <div className="text-right">
                  <p className="text-green-400 font-bold text-2xl">
                    {formatMoney(Number(contrato.valor))}
                  </p>

                  <span className="inline-block mt-2 rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-400">
                    {contrato.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <p className="text-zinc-500">Início</p>

                  <p className="mt-2">
                    {contrato.data_inicio ? formatDate(contrato.data_inicio) : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500">Vencimento</p>

                  <p className="mt-2">Dia {contrato.vencimento ?? "-"}</p>
                </div>

                <div>
                  <p className="text-zinc-500">Recorrência</p>

                  <p className="mt-2">{contrato.recorrencia ?? "-"}</p>
                </div>
              </div>
            </div>
          ))}

          {contratosData.length === 0 && (
            <p className="text-zinc-500">Nenhum contrato encontrado.</p>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">
        <h2 className="text-2xl font-bold mb-6">Próximos Recebimentos</h2>

        <div className="space-y-4">
          {recebimentosData
            .filter((r: any) => r.status !== "Pago")
            .map((r: any) => (
              <div
                key={r.id}

                className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-black/20 p-5"
              >
                <div>
                  <p className="font-semibold">Competência {r.competencia}</p>

                  <p className="text-sm text-zinc-500 mt-1">
                    Vencimento: {formatDate(r.vencimento)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-green-400">{formatMoney(Number(r.valor))}</p>

                  <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-400">
                    {r.status}
                  </span>
                </div>
              </div>
            ))}

          {recebimentosData.filter((r: any) => r.status !== "Pago").length === 0 && (
            <p className="text-zinc-500">Nenhum recebimento pendente.</p>
          )}
        </div>
      </div>
    </main>
  );
}
