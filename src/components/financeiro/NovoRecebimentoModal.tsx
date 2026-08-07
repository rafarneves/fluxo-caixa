"use client";

import { useState } from "react";
import { criarRecebimento } from "@/actions/recebimentos";

interface Props {
  contratoId: string;
}

export default function NovoRecebimentoModal({ contratoId }: Props) {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        className="bg-green-500 hover:bg-green-400 text-black px-5 py-2 rounded-lg font-semibold"
      >
        + Novo Recebimento
      </button>

      {aberto && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#161B22] rounded-2xl w-[650px] p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Novo Recebimento</h2>

              <button
                onClick={() => setAberto(false)}
                className="text-zinc-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <form
              action={async (formData) => {
                await criarRecebimento({
                  contrato_id: contratoId,
                  competencia: String(formData.get("competencia")),
                  valor: Number(formData.get("valor")),
                  vencimento: String(formData.get("vencimento")),
                });

                setAberto(false);
              }}
            >
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-zinc-400">Competência</label>

                  <input
                    name="competencia"
                    required
                    className="w-full mt-2 bg-[#0D1117] border border-zinc-700 rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="text-sm text-zinc-400">Valor</label>

                  <input
                    name="valor"
                    type="number"
                    required
                    className="w-full mt-2 bg-[#0D1117] border border-zinc-700 rounded-xl px-4 py-3"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm text-zinc-400">Vencimento</label>

                  <input
                    name="vencimento"
                    type="date"
                    required
                    className="w-full mt-2 bg-[#0D1117] border border-zinc-700 rounded-xl px-4 py-3"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setAberto(false)}
                  className="bg-zinc-700 px-5 py-3 rounded-lg"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-lg font-semibold"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
