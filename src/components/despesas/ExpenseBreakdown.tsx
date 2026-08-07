type Despesa = {
    categoria: string | null;
    valor: number;
  };
  
  type Props = {
    despesas: Despesa[];
  };
  
  
  function moeda(valor:number){
  
    return valor.toLocaleString(
      "pt-BR",
      {
        style:"currency",
        currency:"BRL",
        maximumFractionDigits:0,
      }
    );
  
  }
  
  
  
  export default function ExpenseBreakdown({
    despesas,
  }:Props){
  
  
    const categorias =
      despesas.reduce(
        (
          acc:Record<string,number>,
          despesa
        )=>{
  
          const categoria =
            despesa.categoria || "Outros";
  
  
          acc[categoria] =
            (acc[categoria] || 0)
            +
            Number(despesa.valor);
  
  
          return acc;
  
        },
        {}
      );
  
  
  
    const lista =
      Object.entries(categorias)
        .sort(
          (a,b)=>b[1]-a[1]
        );
  
  
  
    const total =
      lista.reduce(
        (
          acc,
          [,valor]
        )=>acc + valor,
        0
      );
  
  
  
    return (
  
      <section
        className="
          rounded-3xl
          border
          border-zinc-800
          bg-gradient-to-b
          from-[#171F2B]
          to-[#111827]
          p-8
        "
      >
  
        <div className="mb-8">
  
          <p className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.20em]
            text-zinc-500
          ">
            ANÁLISE
          </p>
  
  
          <h2 className="mt-3 text-2xl font-bold">
            Despesas por Categoria
          </h2>
  
  
          <p className="mt-2 text-zinc-500">
            Distribuição dos custos operacionais.
          </p>
  
  
        </div>
  
  
  
        <div className="space-y-6">
  
  
          {
            lista.length === 0
            &&
  
            (
              <div className="
                rounded-2xl
                border
                border-dashed
                border-zinc-700
                py-10
                text-center
                text-zinc-500
              ">
                Nenhuma despesa cadastrada.
              </div>
            )
          }
  
  
  
          {
            lista.map(
              (
                [
                  categoria,
                  valor
                ]
              )=>{
  
  
                const percentual =
                  total > 0
                  ?
                  (valor / total) * 100
                  :
                  0;
  
  
  
                return (
  
                  <div
                    key={categoria}
                  >
  
  
                    <div className="
                      flex
                      justify-between
                      mb-3
                    ">
  
  
                      <span className="font-medium">
                        {categoria}
                      </span>
  
  
  
                      <div className="text-right">
  
  
                        <p className="
                          font-bold
                          text-red-400
                        ">
                          {moeda(valor)}
                        </p>
  
  
                        <p className="
                          text-xs
                          text-zinc-500
                        ">
                          {percentual.toFixed(1)}%
                        </p>
  
  
                      </div>
  
  
                    </div>
  
  
  
  
  
                    <div className="
                      h-3
                      rounded-full
                      bg-zinc-800
                      overflow-hidden
                    ">
  
  
                      <div
                        className="
                          h-full
                          rounded-full
                          bg-green-500
                          transition-all
                        "
                        style={{
                          width:`${percentual}%`
                        }}
                      />
  
  
                    </div>
  
  
  
                  </div>
  
                );
  
              }
            )
          }
  
  
  
        </div>
  
  
  
      </section>
  
    );
  
  }