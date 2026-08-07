"use client";

import { useRouter, useSearchParams } from "next/navigation";

const periodos = [
  {
    value: "hoje",
    label: "Hoje",
  },
  {
    value: "semana",
    label: "Esta Semana",
  },
  {
    value: "mes",
    label: "Este Mês",
  },
  {
    value: "30dias",
    label: "Últimos 30 dias",
  },
  {
    value: "ano",
    label: "Este Ano",
  },
  {
    value: "personalizado",
    label: "Personalizado",
  },
];

export default function PeriodFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const periodo =
    searchParams.get("periodo") ?? "mes";

  function alterarPeriodo(novoPeriodo: string) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("periodo", novoPeriodo);

    router.push(`?${params.toString()}`);
  }

  return (
    <div
      className="
        flex
        flex-wrap
        gap-2
        p-1
        rounded-2xl
        bg-[#161B22]
        border
        border-zinc-800
      "
    >
      {periodos.map((item) => {
        const ativo = periodo === item.value;

        return (
          <button
            key={item.value}
            onClick={() => alterarPeriodo(item.value)}
            className={`
              px-5
              py-2.5
              rounded-xl
              text-sm
              font-semibold
              transition-all
              duration-200
              ${
                ativo
                  ? `
                    bg-green-500/20
                    border
                    border-green-500/40
                    text-green-400
                    shadow-lg
                    shadow-green-500/10
                  `
                  : `
                    border
                    border-transparent
                    text-zinc-400
                    hover:text-white
                    hover:bg-zinc-800
                  `
              }
            `}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}