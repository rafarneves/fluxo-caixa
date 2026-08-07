type Custo = {
    id: string;
    descricao: string;
    valor: number;
  };
  
  type Props = {
    custos: Custo[];
  };
  
  function formatMoney(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
  
  export default function HistoricoCustos({
    custos,
  }: Props) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-[#161B22] p-8">
        <h2 className="text-2xl font-bold mb-6">
          Histórico de Custos
        </h2>
  
        {custos.length === 0 ? (
          <p className="text-zinc-500">
            Nenhum custo cadastrado.
          </p>
        ) : (
          <div className="space-y-3">
            {custos.map((custo) => (
              <div
                key={custo.id}
                className="
                  rounded-xl
                  bg-zinc-900/60
                  p-5
                  flex
                  justify-between
                  items-center
                "
              >
                <div>
                  <p className="font-semibold text-white">
                    {custo.descricao}
                  </p>
                </div>
  
                <div className="text-right">
                  <p className="font-bold text-red-400">
                    {formatMoney(Number(custo.valor))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }