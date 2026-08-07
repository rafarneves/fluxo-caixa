import jsPDF from 'jspdf';
import { drawHeader } from './header';
import { drawCards, PDFCard } from './cards';
import { drawTable, PDFTableColumn } from './table';

type PDFTemplateProps = {
    title: string;

    logo?: HTMLImageElement;

    cards?: PDFCard[];

    columns?: PDFTableColumn[];

    rows?: Record<string, any>[];

    fileName?: string;
};

export async function generatePDF({ title, logo, cards = [], columns = [], rows = [], fileName }: PDFTemplateProps) {
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    await drawHeader(pdf, {
        title,
        logo,
    });

    if (cards.length) {
        drawCards(pdf, cards);
    }

    if (columns.length && rows.length) {
        drawTable(pdf, columns, rows, 82);
    }

    pdf.save(fileName ?? `${title}.pdf`);
}
