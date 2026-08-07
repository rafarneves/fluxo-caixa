import NovoRecebimentoModal from "./NovoRecebimentoModal";

interface Props {
  contratoId: string;
}

export default function FiltroRecebimentos({ contratoId }: Props) {
  return (
    <div className="bg-[#161B22] rounded-2xl p-5 mb-6 flex items-center justify-between">
      <input
        type="text"
        placeholder="Pesquisar cliente..."
        className="bg-[#0D1117] border border-zinc-700 rounded-xl px-4 py-3 w-80 outline-none focus:border-green-500"
      />

      <div className="flex items-center gap-3">
        <button className="bg-green-500 text-black px-4 py-2 rounded-lg font-semibold">
          Todos
        </button>

        <button className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg">Pendentes</button>

        <button className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg">Pagos</button>

        <button className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg">Atrasados</button>

        <NovoRecebimentoModal contratoId={contratoId} />
      </div>
    </div>
  );
}
