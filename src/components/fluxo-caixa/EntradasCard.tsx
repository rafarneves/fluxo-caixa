import {
    ArrowDownCircle,
    User,
  } from "lucide-react";
  
  type Recebimento = {
    id: string;
    valor: number;
    contratos: {
      nome: string | null;
      clientes: {
        nome: string;
      } | null;
    } | null;
  };
  
  type Props = {
    recebimentos: Recebimento[];
  };
  
  function moeda(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
  
  export default function EntradasCard({
    recebimentos,
  }: Props) {
    const total = recebimentos.reduce(
      (acc, item) => acc + Number(item.valor),
      0
    );
  
    return (
      <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">
  
        <div className="flex items-center justify-between mb-8">
  
          <div>
  
            <p className="text-xs font-semibold uppercase tracking-[0.20em] text-zinc-500">
              ENTRADAS
            </p>
  
            <h2 className="mt-3 text-2xl font-bold">
              Recebimentos
            </h2>
  
            <p className="mt-2 text-zinc-500">
              Valores já recebidos
            </p>
  
          </div>
  
          <div className="text-right">
  
            <p className="text-3xl font-bold text-green-400">
              {moeda(total)}
            </p>
  
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Total
            </p>
  
          </div>
  
        </div>
  
        <div className="space-y-3">
  
          {recebimentos.map((item) => (
  
            <div
              key={item.id}
              className="
                flex
                items-center
                justify-between
                rounded-2xl
                border
                border-zinc-800
                bg-black/20
                p-5
                transition-all
                duration-300
                hover:border-green-500/20
              "
            >
  
              <div className="flex items-center gap-4">
  
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                  <User size={18} />
                </div>
  
                <div>
  
                  <p className="font-semibold">
                    {item.contratos?.clientes?.nome ?? "-"}
                  </p>
  
                  <p className="text-sm text-zinc-500">
                    {item.contratos?.nome ?? "-"}
                  </p>
  
                </div>
  
              </div>
  
              <div className="flex items-center gap-2 text-green-400 font-bold">
  
                <ArrowDownCircle size={18} />
  
                {moeda(Number(item.valor))}
  
              </div>
  
            </div>
  
          ))}
  
        </div>
  
      </section>
    );
  }