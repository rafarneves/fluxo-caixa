interface CardResumoProps {
    titulo: string;
    valor: number;
    cor: string;
  }
  
  export default function CardResumo({
    titulo,
    valor,
    cor,
  }: CardResumoProps) {
    return (
      <div className="bg-[#161B22] rounded-2xl p-6">
        <p className="text-zinc-400 text-sm">{titulo}</p>
  
        <h2 className={`text-3xl font-bold mt-2 ${cor}`}>
          {valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </h2>
      </div>
    );
  }