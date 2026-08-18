import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import AppThemeProvider from '@/components/theme/AppThemeProvider';

import './globals.css';

export const metadata: Metadata = {
    title: 'Altuza ERP',
    description: 'Sistema de gestão',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="pt-BR">
            <body>
                <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                    <AppThemeProvider>{children}</AppThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
