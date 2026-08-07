"use client";

import { forwardRef, InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="mb-2 block text-sm font-medium text-zinc-300">{label}</label>}

        <input
          ref={ref}
          {...props}
          className={`
            w-full
            rounded-xl
            border
            border-zinc-700
            bg-[#111827]
            px-4
            py-3
            text-white
            placeholder:text-zinc-500
            outline-none
            transition-all
            duration-200
            focus:border-green-500
            focus:ring-2
            focus:ring-green-500/20
            ${className}
          `}
        />

        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
