import jsPDF from 'jspdf';
import { PDF_THEME } from './theme';

export type PDFCard = {
    title: string;
    value: string;
    color: [number, number, number];
};

export function drawCards(pdf: jsPDF, cards: PDFCard[]) {
    const margin = PDF_THEME.page.margin;

    const gap = 5;

    const pageWidth = pdf.internal.pageSize.getWidth();

    const width = (pageWidth - margin * 2 - gap * 3) / 4;

    const height = 27;

    const y = 46;

    cards.forEach((card, index) => {
        const x = margin + index * (width + gap);

        // Fundo

        pdf.setFillColor(255, 255, 255);

        pdf.roundedRect(x, y, width, height, 3, 3, 'F');

        // Linha colorida superior

        pdf.setFillColor(...card.color);

        pdf.roundedRect(x, y, width, 2.5, 3, 3, 'F');

        // Título

        pdf.setFont('helvetica', 'bold');

        pdf.setFontSize(8);

        pdf.setTextColor(100, 100, 100);

        pdf.text(card.title.toUpperCase(), x + 4, y + 10);

        // Valor

        pdf.setFont('helvetica', 'bold');

        pdf.setFontSize(13);

        pdf.setTextColor(...card.color);

        pdf.text(card.value, x + 4, y + 21);
    });
}
