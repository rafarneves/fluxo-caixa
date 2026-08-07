type DashboardCardProps = {
  titulo: string;
  valor: string | number;
  descricao: string;
  icone: string;
  cor: string;
};

export default function DashboardCard({
  titulo,
  valor,
  descricao,
  icone,
  cor,
}: DashboardCardProps) {
  return (
    <div className="bg-[#161B22] border border-zinc-800 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-zinc-500 text-sm uppercase tracking-widest">{titulo}</p>

          <h2 className={`text-4xl font-bold mt-4 ${cor}`}>{valor}</h2>

          <p className="text-zinc-400 mt-4">{descricao}</p>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-3xl">
          {icone}
        </div>
      </div>
    </div>
  );
}
