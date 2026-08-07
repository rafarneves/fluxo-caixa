import {
  UserPlus,
  FileText,
  BadgeDollarSign,
} from "lucide-react";

import Badge from "@/components/ui/Badge";

type Activity = {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  tipo: "cliente" | "contrato" | "pagamento";
};

type Props = {
  atividades: Activity[];
};

function getStyle(tipo: Activity["tipo"]) {
  switch (tipo) {
    case "cliente":
      return {
        label: "Cliente",
        color: "blue" as const,
        icon: <UserPlus size={18} />,
      };

    case "contrato":
      return {
        label: "Contrato",
        color: "yellow" as const,
        icon: <FileText size={18} />,
      };

    case "pagamento":
      return {
        label: "Pagamento",
        color: "green" as const,
        icon: <BadgeDollarSign size={18} />,
      };

    default:
      return {
        label: "Atividade",
        color: "blue" as const,
        icon: <UserPlus size={18} />,
      };
  }
}

export default function RecentActivity({
  atividades,
}: Props) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">

      <div className="mb-8">

        <p className="text-xs font-semibold uppercase tracking-[0.20em] text-zinc-500">
          SISTEMA
        </p>

        <h2 className="mt-3 text-2xl font-bold">
          Atividades Recentes
        </h2>

        <p className="mt-2 text-zinc-500">
          Últimas movimentações registradas
        </p>

      </div>

      <div className="relative">

        {atividades.length === 0 && (
          <div className="rounded-2xl border border-dashed border-zinc-700 py-12 text-center text-zinc-500">
            Nenhuma atividade recente.
          </div>
        )}

        <div className="space-y-6">

          {atividades.map((atividade, index) => {
            const style = getStyle(atividade.tipo);

            return (
              <div
                key={atividade.id}
                className="relative flex gap-5"
              >
                {index !== atividades.length - 1 && (
                  <div className="absolute left-6 top-14 h-full w-px bg-zinc-800" />
                )}

                <div
                  className="
                    relative
                    z-10
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-black/30
                    text-green-400
                  "
                >
                  {style.icon}
                </div>

                <div
                  className="
                    flex-1
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-black/20
                    p-5
                    transition-all
                    duration-300
                    hover:border-green-500/20
                    hover:bg-black/30
                  "
                >
                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="font-semibold text-white">
                        {atividade.titulo}
                      </h3>

                      <p className="mt-2 text-sm text-zinc-500">
                        {atividade.descricao}
                      </p>

                    </div>

                    <p className="text-xs text-zinc-500 whitespace-nowrap">
                      {atividade.data}
                    </p>

                  </div>

                  <div className="mt-4">

                    <Badge color={style.color}>
                      {style.label}
                    </Badge>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}