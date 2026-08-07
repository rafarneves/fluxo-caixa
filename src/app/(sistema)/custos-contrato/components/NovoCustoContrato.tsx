"use client";

import { useState } from "react";
import { criarCustoContrato } from "../actions";

type Contrato = {
  id: string;
  cliente: string;
};

export default function NovoCustoContrato({
  contratos,
}: {
  contratos: Contrato[];
}) {
  const [pending, setPending] = useState(false);

  return (
    <form
      action={async (formData) => {
        setPending(true);

        try {
          await criarCustoContrato(formData);

          window.location.reload();
        } finally {
          setPending(false);
        }
      }}
      className="bg-[#161B22] rounded-2xl p-6 space-y-5"
    >
      <h2 className="text-2xl font-bold">
        Novo Custo do Contrato
      </h2>

      <select
        name="contrato_id"
        required
        className="w-full bg-zinc-900 rounded-xl p-4"
      >
        <option value="">
          Selecione o contrato
        </option>

        {contratos.map((c) => (
          <option
            key={c.id}
            value={c.id}
          >
            {c.cliente}
          </option>
        ))}
      </select>

      <select
        name="categoria"
        required
        className="w-full bg-zinc-900 rounded-xl p-4"
      >
        <option value="">
          Categoria
        </option>

        <option>Editor</option>
        <option>Designer</option>
        <option>Tráfego Pago</option>
        <option>Combustível</option>
        <option>Pedágio</option>
        <option>Alimentação</option>
        <option>Hospedagem</option>
        <option>Hotel</option>
        <option>Freelancer</option>
        <option>Impressão</option>
        <option>Equipamentos</option>
        <option>Outros</option>
      </select>

      <input
        name="descricao"
        placeholder="Descrição"
        className="w-full bg-zinc-900 rounded-xl p-4"
      />

      <input
        name="valor"
        type="number"
        step="0.01"
        placeholder="Valor"
        required
        className="w-full bg-zinc-900 rounded-xl p-4"
      />

      <input
        name="competencia"
        type="month"
        className="w-full bg-zinc-900 rounded-xl p-4"
      />

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="recorrente"
        />

        <span>
          Custo recorrente
        </span>
      </label>

      <textarea
        name="observacao"
        placeholder="Observações"
        rows={4}
        className="w-full bg-zinc-900 rounded-xl p-4 resize-none"
      />

      <button
        disabled={pending}
        className="
          bg-green-500
          text-black
          px-8
          py-4
          rounded-xl
          font-bold
          w-full
        "
      >
        {pending
          ? "Salvando..."
          : "Salvar Custo"}
      </button>
    </form>
  );
}