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

  const cards = [
    {
      titulo: "Receita",
      valor: formatMoney(receita),
      cor: "text-green-400",
    },
    {
      titulo: "Custos",
      valor: formatMoney(custos),
      cor: "text-red-400",
    },
    {
      titulo: "Lucro",
      valor: formatMoney(lucro),
      cor: lucro >= 0 ? "text-green-400" : "text-red-400",
    },
    {
      titulo: "Margem",
      valor: `${margem.toFixed(1)}%`,
      cor: margem >= 0 ? "text-green-400" : "text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div key={card.titulo} className="rounded-3xl border border-zinc-800 bg-[#161B22] p-6">
          <p className="text-zinc-500">{card.titulo}</p>

          <h2 className={`mt-3 text-3xl font-bold ${card.cor}`}>{card.valor}</h2>
        </div>
      ))}
    </div>
  );
}
