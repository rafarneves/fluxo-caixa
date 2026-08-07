import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PDF_THEME } from "./theme";

export type PDFTableColumn = {
  header: string;
  dataKey: string;
};

export function drawTable(
  pdf: jsPDF,
  columns: PDFTableColumn[],
  rows: Record<string, any>[],
  startY = 85
) {
  autoTable(pdf, {

    startY,

    columns,

    body: rows,


    // ==========================
    // CABEÇALHO
    // ==========================

    headStyles: {
      fillColor:
        PDF_THEME.colors.primary,

      textColor: [
        255,
        255,
        255,
      ],

      fontStyle: "bold",

      fontSize: 10,

      halign: "left",

    },


    // ==========================
    // CORPO
    // ==========================

    bodyStyles: {

      fontSize: 9,

      textColor:
        PDF_THEME.colors.text,

      cellPadding: 5,

    },


    alternateRowStyles: {

      fillColor: [
        248,
        250,
        252,
      ],

    },


    // ==========================
    // BORDAS
    // ==========================

    styles: {

      lineColor:
        PDF_THEME.colors.border,

      lineWidth: 0.2,

    },


    // ==========================
    // VALOR DIREITA
    // ==========================

    columnStyles: {

      valor: {

        halign: "right",

      },

    },


    didParseCell(data) {

      if (
        data.section === "body" &&
        data.column.dataKey === "valor"
      ) {

        const texto =
          String(data.cell.text[0]);


        if (texto.includes("-")) {

          data.cell.styles.textColor =
            PDF_THEME.colors.danger;

        }

        else {

          data.cell.styles.textColor =
            PDF_THEME.colors.success;

        }

      }


      if (
        data.section === "body" &&
        data.row.raw.tipo === "Resultado"
      ) {

        data.cell.styles.fontStyle =
          "bold";

      }

    },

  });
}