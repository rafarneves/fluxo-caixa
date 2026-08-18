'use client';

import { useState } from 'react';

import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';

import { exportPDF } from '@/lib/export/exportPDF';

type ReportExportProps = {
    reportId?: string;
    reportTitle?: string;

    onExportPDF?: () => void | Promise<void>;
    onExportExcel?: () => void | Promise<void>;

    loadingExcel?: boolean;

    disabledPDF?: boolean;
    disabledExcel?: boolean;
};

export default function ReportExport({
    reportId = 'report-content',
    reportTitle,

    onExportPDF,
    onExportExcel,

    loadingExcel = false,

    disabledPDF = false,
    disabledExcel = false,
}: ReportExportProps) {
    const [loadingPDF, setLoadingPDF] = useState(false);
    const [loadingSpreadsheet, setLoadingSpreadsheet] = useState(false);
    const [loadingAll, setLoadingAll] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function getReport() {
        const report = document.getElementById(reportId);

        if (!report) {
            throw new Error('Não foi possível localizar o conteúdo do relatório para exportação.');
        }

        return report;
    }

    function getTitle() {
        return reportTitle ?? getReport().querySelector('h1')?.textContent?.trim() ?? 'Relatório';
    }

    function csvCell(value: string) {
        return `"${value.replace(/\s+/g, ' ').trim().replace(/"/g, '""')}"`;
    }

    function downloadSpreadsheet() {
        const report = getReport();
        const tables = Array.from(report.querySelectorAll('table'));

        if (tables.length === 0) {
            throw new Error('Este relatório não possui uma tabela para exportar ao Excel.');
        }

        const lines: string[] = [];

        tables.forEach((table, tableIndex) => {
            const section = table.closest('section');
            const sectionTitle = section?.querySelector('h2')?.textContent?.trim();

            if (sectionTitle) lines.push(csvCell(sectionTitle));

            Array.from(table.rows).forEach((row) => {
                const cells = Array.from(row.cells).filter((cell) => !cell.hasAttribute('data-export-ignore'));
                lines.push(cells.map((cell) => csvCell(cell.textContent ?? '')).join(';'));
            });

            if (tableIndex < tables.length - 1) lines.push('');
        });

        const blob = new Blob([`\uFEFF${lines.join('\r\n')}`], {
            type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const fileName = getTitle()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9-_ ]/g, '')
            .trim()
            .replace(/\s+/g, '-');

        link.href = url;
        link.download = `${fileName || 'relatorio'}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }

    async function handleExportPDF() {
        try {
            setError(null);
            setLoadingPDF(true);

            if (onExportPDF) {
                await onExportPDF();
            } else {
                await exportPDF(reportId, {
                    title: getTitle(),
                    fileName: getTitle(),
                });
            }
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : 'Não foi possível exportar o PDF.');
        } finally {
            setLoadingPDF(false);
        }
    }

    async function handleExportExcel() {
        try {
            setError(null);
            setLoadingSpreadsheet(true);

            if (onExportExcel) await onExportExcel();
            else downloadSpreadsheet();
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : 'Não foi possível exportar a planilha.');
        } finally {
            setLoadingSpreadsheet(false);
        }
    }

    async function handleExportAll() {
        try {
            setError(null);
            setLoadingAll(true);

            if (!disabledPDF) {
                if (onExportPDF) await onExportPDF();
                else await exportPDF(reportId, { title: getTitle(), fileName: getTitle() });
            }

            if (!disabledExcel) {
                if (onExportExcel) await onExportExcel();
                else downloadSpreadsheet();
            }
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : 'Não foi possível concluir as exportações.');
        } finally {
            setLoadingAll(false);
        }
    }

    return (
        <div data-export-ignore className="flex flex-wrap items-center gap-3">
            <button
                type="button"
                onClick={handleExportPDF}
                disabled={disabledPDF || loadingPDF}
                className="inline-flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400 transition hover:border-red-500/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loadingPDF ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                Exportar PDF
            </button>

            <button
                type="button"
                onClick={handleExportExcel}
                disabled={disabledExcel || loadingExcel || loadingSpreadsheet}
                className="inline-flex items-center gap-2 rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-3 text-sm font-semibold text-green-400 transition hover:border-green-500/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loadingExcel || loadingSpreadsheet ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : (
                    <FileSpreadsheet size={18} />
                )}
                Exportar Excel
            </button>

            <button
                type="button"
                onClick={handleExportAll}
                disabled={(disabledPDF && disabledExcel) || loadingAll}
                className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-800/50 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loadingAll ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                Exportar Tudo
            </button>

            {error && (
                <p role="alert" className="w-full text-right text-xs text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}
