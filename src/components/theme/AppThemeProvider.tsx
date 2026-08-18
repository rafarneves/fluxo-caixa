'use client';

import type { ReactNode } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
    cssVariables: true,
    palette: {
        mode: 'dark',
        primary: { main: '#22c55e', light: '#4ade80', dark: '#16a34a', contrastText: '#061009' },
        secondary: { main: '#22d3ee' },
        background: { default: '#0b0f14', paper: '#10151c' },
        text: { primary: '#f8fafc', secondary: '#9ca3af' },
        divider: 'rgba(148, 163, 184, 0.14)',
        error: { main: '#f87171' },
        warning: { main: '#fbbf24' },
    },
    shape: { borderRadius: 12 },
    typography: {
        fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        button: { textTransform: 'none', fontWeight: 600 },
    },
    transitions: {
        duration: { shortest: 120, shorter: 160, short: 200, standard: 240 },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundImage: 'radial-gradient(circle at 85% 0%, rgba(34, 197, 94, 0.055), transparent 28rem)',
                },
                '::selection': { backgroundColor: 'rgba(34, 197, 94, 0.28)', color: '#ffffff' },
            },
        },
        MuiTooltip: {
            defaultProps: { arrow: true, enterDelay: 350 },
        },
    },
});

export default function AppThemeProvider({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            {children}
        </ThemeProvider>
    );
}
