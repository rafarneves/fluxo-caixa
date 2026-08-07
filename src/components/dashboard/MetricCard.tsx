type Props = {
    title: string;
    value: string | number;
    subtitle: string;
    color?: string;
  };
  
  export default function MetricCard({
    title,
    value,
    subtitle,
    color = "text-white",
  }: Props) {
    return (
      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-zinc-800
          bg-gradient-to-br
          from-[#181f29]
          via-[#141a22]
          to-[#10151b]
          p-8
          shadow-xl
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-green-500/40
          min-h-[220px]
        "
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-green-500/5 blur-3xl" />
  
        <div className="relative h-full flex flex-col justify-between">
  
          <div>
  
            <p className="uppercase tracking-[4px] text-xs text-zinc-500">
              {title}
            </p>
  
            <h2
              className={`
                mt-6
                text-5xl
                font-bold
                leading-none
                whitespace-nowrap
                ${color}
              `}
            >
              {value}
            </h2>
  
          </div>
  
          <p className="text-zinc-400 text-lg">
            {subtitle}
          </p>
  
        </div>
      </div>
    );
  }