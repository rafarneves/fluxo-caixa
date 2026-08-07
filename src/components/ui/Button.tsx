"use client";

import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  icon?: React.ReactNode;
};

export default function Button({
  children,
  variant = "primary",
  icon,
  className = "",
  ...props
}: Props) {
  const variants = {
    primary: `
      bg-green-500
      hover:bg-green-400
      text-black
      shadow-lg
      shadow-green-500/20
      border
      border-green-400/20
    `,

    secondary: `
      bg-zinc-800
      hover:bg-zinc-700
      text-white
      border
      border-zinc-700
    `,

    danger: `
      bg-red-500
      hover:bg-red-400
      text-white
      border
      border-red-400/20
    `,

    ghost: `
      bg-transparent
      hover:bg-zinc-800
      text-zinc-300
      border
      border-zinc-800
    `,
  };

  return (
    <button
      {...props}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        px-5
        py-3
        text-sm
        font-semibold
        transition-all
        duration-200
        active:scale-95
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
    >
      {icon}

      {children}
    </button>
  );
}