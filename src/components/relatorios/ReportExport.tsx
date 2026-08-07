'use client';

import { useState } from 'react';

import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';

import { exportPDF } from '@/lib/export/exportPDF';

type ReportExportProps = {
    reportId?: string;
    reportTitle?: string;

    onExportExcel?: () => void;

    loadingExcel?: boolean;

    disabledPDF?: boolean;
    disabledExcel?: boolean;
};

export default function ReportExport({
    reportId = 'report-content',
    reportTitle = 'Relatório',

    onExportExcel,

    loadingExcel = false,

    disabledPDF = false,
    disabledExcel = false,
}: ReportExportProps) {
    const [loadingPDF, setLoadingPDF] = useState(false);

    async function handleExportPDF() {
        try {
            setLoadingPDF(true);

            await exportPDF(reportId, {
                title: reportTitle,
                fileName: reportTitle,
            });
        } catch (error) {
            console.error(error);
            alert(String(error));
        } finally {
            setLoadingPDF(false);
        }
    }

    return (
        <div className="flex flex-wrap items-center gap-3">
            <button
                type="button"
                onClick={handleExportPDF}
                disabled={disabledPDF || loadingPDF}
                className="inline-flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400"
            >
                {loadingPDF ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                Exportar PDF
            </button>

            <button
                type="button"
                onClick={onExportExcel}
                disabled={disabledExcel || loadingExcel}
                className="inline-flex items-center gap-2 rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-3 text-sm font-semibold text-green-400"
            >
                <FileSpreadsheet size={18} />
                Exportar Excel
            </button>

            <button
                type="button"
                className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-800/50 px-5 py-3 text-sm font-semibold text-zinc-300"
            >
                <Download size={18} />
                Exportar Tudo
            </button>
        </div>
    );
}
