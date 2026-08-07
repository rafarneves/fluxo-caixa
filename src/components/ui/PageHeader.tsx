"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export default function PageHeader({
  title,
  description,
  actions,
}: Props) {
  return (
    <div
      className="
        flex
        flex-col
        gap-6
        xl:flex-row
        xl:items-center
        xl:justify-between
        mb-8
      "
    >
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-white">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-zinc-400 max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}