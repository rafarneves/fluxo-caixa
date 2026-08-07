type Props = {
  receita: number;
  custos: number;
};

function formatMoney(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function CardsFinanceiros({ receita, custos }: Props) {
  const lucro = receita - custos;

  const margem = receita > 0 ? (lucro / receita) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="rounded-3xl border border-zinc-800 bg-[#161B22] p-6">
        <p className="text-zinc-500">Receita</p>

        <h2 className="mt-3 text-3xl font-bold text-green-400">{formatMoney(receita)}</h2>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-[#161B22] p-6">
        <p className="text-zinc-500">Custos</p>

        <h2 className="mt-3 text-3xl font-bold text-red-400">{formatMoney(custos)}</h2>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-[#161B22] p-6">
        <p className="text-zinc-500">Lucro</p>

        <h2 className={`mt-3 text-3xl font-bold ${lucro >= 0 ? "text-green-400" : "text-red-400"}`}>
          {formatMoney(lucro)}
        </h2>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-[#161B22] p-6">
        <p className="text-zinc-500">Margem</p>

        <h2
          className={`mt-3 text-3xl font-bold ${
            margem >= 30 ? "text-green-400" : margem >= 15 ? "text-yellow-400" : "text-red-400"
          }`}
        >
          {margem.toFixed(1)}%
        </h2>
      </div>
    </div>
  );
}
