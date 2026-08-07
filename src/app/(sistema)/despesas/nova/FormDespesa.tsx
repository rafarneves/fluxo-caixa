"use client";

import { useState } from "react";
import { criarDespesa } from "./actions";

export default function FormDespesa() {
  const [tipo, setTipo] = useState("Fixa");

  const inputClass = `
    w-full
    mt-2
    bg-[#0B0F14]
    border
    border-zinc-800
    rounded-xl
    px-4
    py-3
    text-white
    placeholder:text-zinc-600
    outline-none
    focus:border-green-500
    transition
  `;

  const labelClass = `
    text-sm
    font-semibold
    text-zinc-400
  `;

  return (
    <form
      action={criarDespesa}

      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className={labelClass}>Descrição</label>

          <input
            name="descricao"

            placeholder="Ex: Assinatura ChatGPT"

            className={inputClass}

            required
          />
        </div>

        <div>
          <label className={labelClass}>Categoria</label>

          <select
            name="categoria"

            defaultValue="Softwares"

            className={inputClass}
          >
            <option>Pró-labore</option>
            <option>Salários</option>
            <option>Estrutura</option>
            <option>Softwares</option>
            <option>Marketing</option>
            <option>Transporte</option>
            <option>Comercial</option>
            <option>Telefonia</option>
            <option>Equipamentos</option>
            <option>Informática</option>
            <option>Capacitação</option>
            <option>Contabilidade e Jurídico</option>
            <option>Impostos</option>
            <option>Financeiro</option>
            <option>Materiais</option>
            <option>Benefícios</option>
            <option>Eventos</option>
            <option>Outros</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Tipo da despesa</label>

          <select
            name="tipo"

            value={tipo}

            onChange={(e) => setTipo(e.target.value)}

            className={inputClass}
          >
            <option value="Fixa">Fixa</option>

            <option value="Variável">Variável</option>
          </select>
        </div>

        {tipo === "Fixa" && (
          <div>
            <label className={labelClass}>Dia do vencimento</label>

            <input
              name="dia_vencimento"

              type="number"

              min="1"

              max="31"

              placeholder="Ex: 5"

              className={inputClass}
            />
          </div>
        )}

        {tipo === "Variável" && (
          <div>
            <label className={labelClass}>Data</label>

            <input
              name="data"

              type="date"

              className={inputClass}
            />
          </div>
        )}

        <div>
          <label className={labelClass}>Valor</label>

          <input
            name="valor"

            type="number"

            step="0.01"

            min="0"

            placeholder="Ex: 120,00"

            className={inputClass}

            required
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-zinc-800">
        <button className="bg-green-500 hover:bg-green-400 transition text-black font-bold px-10 py-4 rounded-xl shadow-lg">
          Salvar Despesa
        </button>
      </div>
    </form>
  );
}
