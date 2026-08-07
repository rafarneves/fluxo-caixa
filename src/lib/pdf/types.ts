export type PDFCard = {
    title: string;
    value: string;
    color: [number, number, number];
};

export type PDFColumn = {
    header: string;
    dataKey: string;
};

export type PDFDocument = {
    title: string;
    logo?: HTMLImageElement;

    cards?: PDFCard[];

    columns?: PDFColumn[];

    rows?: Record<string, any>[];

    fileName?: string;
};
