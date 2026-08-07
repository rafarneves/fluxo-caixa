type Props = {
  children: React.ReactNode;
  color?: "green" | "red" | "yellow" | "blue" | "gray";
};

export default function Badge({ children, color = "gray" }: Props) {
  const colors = {
    green: `
        bg-green-500/15
        text-green-400
        border-green-500/20
      `,

    red: `
        bg-red-500/15
        text-red-400
        border-red-500/20
      `,

    yellow: `
        bg-yellow-500/15
        text-yellow-400
        border-yellow-500/20
      `,

    blue: `
        bg-cyan-500/15
        text-cyan-400
        border-cyan-500/20
      `,

    gray: `
        bg-zinc-800
        text-zinc-300
        border-zinc-700
      `,
  };

  return (
    <span
      className={`
          inline-flex
          items-center
          rounded-full
          border
          px-3
          py-1
          text-xs
          font-semibold
          whitespace-nowrap
          ${colors[color]}
        `}
    >
      {children}
    </span>
  );
}
