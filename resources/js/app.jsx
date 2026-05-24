import './bootstrap';
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2563eb',
            dark: '#1d4ed8',
            light: '#60a5fa',
            contrastText: '#fff',
        },
        secondary: {
            main: '#64748b',
            contrastText: '#fff',
        },
        success: { main: '#16a34a', light: '#dcfce7', dark: '#15803d' },
        error:   { main: '#dc2626', light: '#fee2e2', dark: '#b91c1c' },
        warning: { main: '#d97706', light: '#fef3c7', dark: '#b45309' },
        info:    { main: '#0284c7', light: '#e0f2fe', dark: '#0369a1' },
        background: {
            default: '#f1f5f9',
            paper: '#ffffff',
        },
        text: {
            primary: '#0f172a',
            secondary: '#64748b',
        },
        divider: '#e2e8f0',
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
        h5: { fontWeight: 700, letterSpacing: '-0.3px' },
        h6: { fontWeight: 600, letterSpacing: '-0.2px' },
        subtitle1: { fontWeight: 600 },
        subtitle2: { fontWeight: 600 },
        body1: { fontSize: '0.9375rem' },
        body2: { fontSize: '0.8125rem' },
        caption: { fontSize: '0.75rem' },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 10 },
    shadows: [
        'none',
        '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        ...Array(19).fill('none'),
    ],
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: { backgroundColor: '#f1f5f9' },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#0f172a',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.3)',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#0f172a',
                    color: '#cbd5e1',
                    borderRight: 'none',
                },
            },
        },
        MuiCard: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.06)',
                    borderRadius: 12,
                },
            },
        },
        MuiCardHeader: {
            styleOverrides: {
                root: { paddingBottom: 4 },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': { boxShadow: 'none' },
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: { borderRadius: 8 },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: { fontWeight: 600, fontSize: '0.7rem' },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: { borderRadius: 14 },
            },
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: { fontWeight: 700, fontSize: '1rem', paddingBottom: 8 },
            },
        },
        MuiTextField: {
            defaultProps: { size: 'small' },
        },
        MuiSelect: {
            defaultProps: { size: 'small' },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    margin: '1px 8px',
                    width: 'calc(100% - 16px)',
                    '&:hover': { backgroundColor: 'rgb(255 255 255 / 0.07)' },
                    '&.Mui-selected': {
                        backgroundColor: 'rgb(37 99 235 / 0.25)',
                        '&:hover': { backgroundColor: 'rgb(37 99 235 / 0.35)' },
                    },
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: { borderColor: '#e2e8f0' },
            },
        },
    },
});

const appName = import.meta.env.VITE_APP_NAME || 'MeatTracker';

createInertiaApp({
    title: (title) => `${title} ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <App {...props} />
                </LocalizationProvider>
            </ThemeProvider>
        );
    },
    progress: { color: '#60a5fa' },
});
