'use client';

import { ReactNode } from 'react';

type Props = {
    title: string;
    description?: string;
    actions?: ReactNode;
};

export default function PageHeader({ title, description, actions }: Props) {
    return (
        <div className="mb-8 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
                <h1 className="text-4xl font-bold tracking-tight text-white">{title}</h1>

                {description && <p className="mt-2 max-w-3xl leading-relaxed text-zinc-400">{description}</p>}
            </div>

            {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
    );
}
