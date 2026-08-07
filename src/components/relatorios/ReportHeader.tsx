import { ReactNode } from 'react';

type ReportHeaderProps = {
    title: string;
    description?: string;
    actions?: ReactNode;
};

export default function ReportHeader({ title, description, actions }: ReportHeaderProps) {
    return (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-green-400 uppercase">RELATÓRIOS</p>

                <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">{title}</h1>

                {description && <p className="mt-3 max-w-3xl leading-relaxed text-zinc-400">{description}</p>}
            </div>

            {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
        </div>
    );
}
