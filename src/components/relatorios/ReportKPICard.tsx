import {
  LucideIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { formatMoneyCompact } from "@/lib/formatMoneyCompact";

type ReportKPICardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  color?: "green" | "blue" | "red" | "yellow";
  trend?: number;

  // NOVO
  isCurrency?: boolean;
};

const colors = {
  green: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    border: "border-green-500/20",
    hover:
      "hover:border-green-500/40 hover:shadow-green-500/10",
  },

  blue: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/20",
    hover:
      "hover:border-cyan-500/40 hover:shadow-cyan-500/10",
  },

  red: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
    hover:
      "hover:border-red-500/40 hover:shadow-red-500/10",
  },

  yellow: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    border: "border-yellow-500/20",
    hover:
      "hover:border-yellow-500/40 hover:shadow-yellow-500/10",
  },
};

export default function ReportKPICard({
  title,
  value,
  icon: Icon,
  description,
  color = "green",
  trend,
  isCurrency = true,
}: ReportKPICardProps) {
  const style = colors[color];

  const displayValue =
    typeof value === "number"
      ? isCurrency
        ? formatMoneyCompact(value)
        : value.toLocaleString("pt-BR")
      : value;

  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-3xl
        border
        ${style.border}
        bg-gradient-to-b
        from-[#171F2B]
        to-[#111827]
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-2xl
        ${style.hover}
      `}
    >
      <div
        className="
          absolute
          -right-10
          -top-10
          h-32
          w-32
          rounded-full
          bg-white/5
          blur-3xl
        "
      />

      <div
        className="
          relative
          flex
          items-start
          justify-between
        "
      >
        <div
          className="
            flex-1
            min-w-0
          "
        >
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.18em]
              text-zinc-500
            "
          >
            {title}
          </p>

          <h2
            className={`
              mt-4
              text-3xl
              font-bold
              tracking-tight
              whitespace-nowrap
              ${style.text}
            `}
          >
            {displayValue}
          </h2>

          {description && (
            <p className="mt-2 text-sm text-zinc-500">
              {description}
            </p>
          )}
        </div>

        <div
          className={`
            ml-5
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-2xl
            ${style.bg}
            ${style.text}
          `}
        >
          <Icon size={20} />
        </div>
      </div>

      {trend !== undefined && (
        <div className="relative mt-6 flex justify-end">
          <div
            className={`
              flex
              items-center
              gap-2
              rounded-full
              px-3
              py-1
              text-xs
              font-semibold
              ${
                trend >= 0
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }
            `}
          >
            {trend >= 0 ? (
              <TrendingUp size={14} />
            ) : (
              <TrendingDown size={14} />
            )}

            {Math.abs(trend).toFixed(1)}%
          </div>
        </div>
      )}
    </div>
  );
}