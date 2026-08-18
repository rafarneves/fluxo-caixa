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
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    borderColor: 'rgba(148, 163, 184, 0.14)',
                },
            },
        },
        MuiCard: {
            defaultProps: { variant: 'outlined' },
            styleOverrides: {
                root: {
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 20,
                    background: 'linear-gradient(180deg, rgba(23, 31, 43, 0.96), rgba(17, 24, 39, 0.96))',
                    boxShadow: '0 18px 55px rgba(0, 0, 0, 0.16)',
                    transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
                },
            },
        },
        MuiButton: {
            defaultProps: { variant: 'contained', disableElevation: true },
            styleOverrides: {
                root: { minHeight: 40, borderRadius: 11, paddingInline: 18 },
                contained: { boxShadow: '0 10px 28px rgba(34, 197, 94, 0.16)' },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    fontSize: '0.95rem',
                    lineHeight: 1.4375,
                },
                input: {
                    minWidth: 0,
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    minHeight: 56,
                    borderRadius: 12,
                    backgroundColor: 'rgba(3, 7, 18, 0.45)',
                    transition: 'border-color 160ms ease, box-shadow 160ms ease',
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(74, 222, 128, 0.42)' },
                    '&.Mui-focused': { boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.11)' },
                    '&.MuiInputBase-sizeSmall': {
                        minHeight: 48,
                    },
                    '&.MuiInputBase-multiline': {
                        minHeight: 'auto',
                        padding: '16.5px 14px',
                    },
                    '&.MuiInputBase-multiline.MuiInputBase-sizeSmall': {
                        padding: '12.5px 14px',
                    },
                },
                input: {
                    boxSizing: 'border-box',
                    height: 'auto',
                    minHeight: '1.4375em',
                    padding: '16.5px 14px',
                    '.MuiInputBase-sizeSmall &': {
                        padding: '12.5px 14px',
                    },
                    '.MuiInputBase-multiline &': {
                        padding: 0,
                    },
                    '&[type="date"], &[type="month"]': {
                        colorScheme: 'dark',
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    boxSizing: 'content-box',
                    height: 'auto',
                    minHeight: '1.4375em',
                    padding: '16.5px 32px 16.5px 14px',
                    '.MuiInputBase-sizeSmall &': {
                        padding: '12.5px 32px 12.5px 14px',
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: { color: '#9ca3af' },
                sizeSmall: {
                    '&.MuiInputLabel-outlined:not(.MuiInputLabel-shrink)': {
                        transform: 'translate(14px, 13px) scale(1)',
                    },
                },
            },
        },
        MuiTableContainer: {
            styleOverrides: { root: { borderRadius: 16 } },
        },
        MuiTableCell: {
            styleOverrides: {
                root: { borderColor: 'rgba(148, 163, 184, 0.12)' },
                head: {
                    color: '#9ca3af',
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    backgroundColor: 'rgba(2, 6, 23, 0.32)',
                },
            },
        },
        MuiDialog: {
            styleOverrides: { paper: { borderRadius: 22, border: '1px solid rgba(148, 163, 184, 0.14)' } },
        },
        MuiChip: {
            styleOverrides: { root: { borderRadius: 999, fontWeight: 700 } },
        },
        MuiAlert: {
            styleOverrides: { root: { borderRadius: 14 } },
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
