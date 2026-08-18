import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type ReportHeaderProps = {
    title: string;
    description?: string;
    actions?: ReactNode;
    backHref?: string | false;
};

export default function ReportHeader({ title, description, actions, backHref = '/relatorios' }: ReportHeaderProps) {
    return (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
                {backHref && (
                    <Link
                        href={backHref}
                        data-export-ignore
                        className="mb-5 inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-2 text-sm font-semibold text-zinc-400 transition hover:border-green-500/40 hover:text-green-400"
                    >
                        <ArrowLeft size={17} />
                        Voltar
                    </Link>
                )}

                <p className="text-xs font-semibold tracking-[0.22em] text-green-400 uppercase">RELATÓRIOS</p>

                <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">{title}</h1>

                {description && <p className="mt-3 max-w-3xl leading-relaxed text-zinc-400">{description}</p>}
            </div>

            {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
        </div>
    );
}
