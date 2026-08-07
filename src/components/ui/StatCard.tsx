type Props = {
  titulo: string;
  valor: string;

  subtitulo?: string;

  icone?: React.ReactNode;

  status?: string;

  tendencia?: string;

  progresso?: number;

  cor?: "green" | "red" | "blue" | "yellow";
};

export default function StatCard({
  titulo,
  valor,
  subtitulo,
  icone,
  status,
  tendencia,
  progresso,
  cor = "green",
}: Props) {
  const cores = {
    green: {
      texto: "text-green-400",
      fundo: "bg-green-500/10",
      borda: "border-green-500/20",
      glow: "hover:shadow-green-500/10",
      barra: "bg-green-500",
    },

    red: {
      texto: "text-red-400",
      fundo: "bg-red-500/10",
      borda: "border-red-500/20",
      glow: "hover:shadow-red-500/10",
      barra: "bg-red-500",
    },

    blue: {
      texto: "text-cyan-400",
      fundo: "bg-cyan-500/10",
      borda: "border-cyan-500/20",
      glow: "hover:shadow-cyan-500/10",
      barra: "bg-cyan-500",
    },

    yellow: {
      texto: "text-yellow-400",
      fundo: "bg-yellow-500/10",
      borda: "border-yellow-500/20",
      glow: "hover:shadow-yellow-500/10",
      barra: "bg-yellow-500",
    },
  };

  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-3xl
        border
        ${cores[cor].borda}
        bg-gradient-to-b
        from-[#171F2B]
        to-[#111827]
        p-5
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-2xl
        ${cores[cor].glow}
      `}
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-3xl" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            {titulo}
          </p>

          <h2
            className={`
              mt-3
              text-3xl
              font-bold
              tracking-tight
              ${cores[cor].texto}
            `}
          >
            {valor}
          </h2>

          {subtitulo && <p className="mt-2 text-sm text-zinc-500">{subtitulo}</p>}
        </div>

        {icone && (
          <div
            className={`
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                border
                ${cores[cor].borda}
                ${cores[cor].fundo}
                ${cores[cor].texto}
                transition-transform
                duration-300
                hover:scale-110
              `}
          >
            {icone}
          </div>
        )}
      </div>

      {(status || tendencia) && (
        <div className="relative mt-3 flex items-center justify-between gap-3">
          {status && (
            <span
              className={`
                    inline-flex
                    items-center
                    rounded-full
                    border
                    px-2
                    py-0.5
                    text-[10px]
                    font-semibold
                    ${cores[cor].borda}
                    ${cores[cor].texto}
                    ${cores[cor].fundo}
                  `}
            >
              {status}
            </span>
          )}

          {tendencia && (
            <span
              className={`
                    text-[10px]
                    font-medium
                    ${cores[cor].texto}
                  `}
            >
              {tendencia}
            </span>
          )}
        </div>
      )}

      {progresso !== undefined && cor !== "red" && (
        <div className="relative mt-5">
          <div className="h-2 overflow-hidden rounded-full bg-black/30">
            <div
              className={`
                  h-full
                  rounded-full
                  ${cores[cor].barra}
                  transition-all
                  duration-500
                `}

              style={{
                width: `${Math.min(Math.max(progresso, 0), 100)}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
