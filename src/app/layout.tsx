import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Altuza ERP',
    description: 'Sistema de gestão',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className="bg-[#0B0F14] text-white">{children}</body>
        </html>
    );
}
