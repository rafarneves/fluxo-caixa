"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function NovaContaPage() {
  const router = useRouter();

  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [valor, setValor] = useState("");
  const [vencimento, setVencimento] = useState("");

  async function salvarConta() {
    const { error } = await supabase
      .from("contas_pagar")
      .insert({
        descricao,
        categoria,
        valor: Number(valor),
        vencimento: Number(vencimento),
        status: "Pendente",
      });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/contas-pagar");
    router.refresh();
  }

  return (
    <div>

      <h1 className="text-5xl font-bold text-green-400">
        Nova Conta
      </h1>

      <p className="text-zinc-400 mt-2 mb-10">
        Cadastre uma nova despesa.
      </p>

      <div className="max-w-2xl bg-[#161B22] rounded-2xl p-8">

        <label className="block mb-2">
          Descrição
        </label>

        <input
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full bg-zinc-900 rounded-xl p-4 mb-6"
        />

        <label className="block mb-2">
          Categoria
        </label>

        <input
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full bg-zinc-900 rounded-xl p-4 mb-6"
        />

        <label className="block mb-2">
          Valor
        </label>

        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="w-full bg-zinc-900 rounded-xl p-4 mb-6"
        />

        <label className="block mb-2">
          Dia do vencimento
        </label>

        <input
          type="number"
          min="1"
          max="31"
          value={vencimento}
          onChange={(e) => setVencimento(e.target.value)}
          className="w-full bg-zinc-900 rounded-xl p-4 mb-8"
        />

        <button
          onClick={salvarConta}
          className="bg-green-500 hover:bg-green-400 text-black px-8 py-4 rounded-xl font-bold"
        >
          Salvar Conta
        </button>

      </div>

    </div>
  );
}