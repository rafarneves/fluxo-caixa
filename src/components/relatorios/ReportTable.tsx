import React from 'react';

export type ReportColumn<T> = {
    key: keyof T | string;
    title: string;
    align?: 'left' | 'center' | 'right';
    render?: (item: T) => React.ReactNode;
};

type ReportTableProps<T> = {
    title: string;
    description?: string;
    columns: ReportColumn<T>[];
    data: T[];
    actions?: React.ReactNode;
    emptyMessage?: string;
};

export default function ReportTable<T>({
    title,
    description,
    columns,
    data,
    actions,
    emptyMessage = 'Nenhum registro encontrado.',
}: ReportTableProps<T>) {
    return (
        <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827]">
            <div className="flex flex-col gap-6 border-b border-zinc-800 p-8 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-[0.20em] text-zinc-500 uppercase">RELATÓRIO</p>

                    <h2 className="mt-3 text-3xl font-bold text-white">{title}</h2>

                    {description && <p className="mt-2 text-zinc-500">{description}</p>}
                </div>

                {actions && <div>{actions}</div>}
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="border-b border-zinc-800 bg-black/20">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={String(column.key)}
                                    className={`px-6 py-4 text-xs tracking-[0.18em] text-zinc-500 uppercase ${
                                        column.align === 'center'
                                            ? 'text-center'
                                            : column.align === 'right'
                                              ? 'text-right'
                                              : 'text-left'
                                    } `}
                                >
                                    {column.title}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-14 text-center text-zinc-500">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((item, index) => (
                                <tr key={index} className="border-b border-zinc-800 hover:bg-black/20">
                                    {columns.map((column) => (
                                        <td
                                            key={String(column.key)}
                                            className={`px-6 py-5 text-sm text-zinc-300 ${
                                                column.align === 'center'
                                                    ? 'text-center'
                                                    : column.align === 'right'
                                                      ? 'text-right'
                                                      : 'text-left'
                                            } `}
                                        >
                                            {column.render ? column.render(item) : (item as any)[column.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="border-t border-zinc-800 bg-black/20 px-8 py-5">
                <span className="text-sm text-zinc-500">
                    Total de registros:
                    <strong className="ml-1 text-white">{data.length}</strong>
                </span>
            </div>
        </section>
    );
}
