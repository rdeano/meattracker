import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    AppBar, Box, Drawer, IconButton, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Toolbar, Typography, Snackbar, Alert, Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScaleIcon from '@mui/icons-material/Scale';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import SetMealIcon from '@mui/icons-material/SetMeal';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import KitchenIcon from '@mui/icons-material/Kitchen';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CategoryIcon from '@mui/icons-material/Category';
import SettingsIcon from '@mui/icons-material/Settings';

const DRAWER_WIDTH = 228;

const navItems = [
    { label: 'Dashboard', href: '/', icon: <DashboardIcon fontSize="small" /> },
    { divider: true, label: 'Operations' },
    { label: 'Timbang', href: '/timbang', icon: <ScaleIcon fontSize="small" /> },
    { label: 'Hango', href: '/hango', icon: <ShoppingCartIcon fontSize="small" /> },
    { label: 'Collectibles', href: '/collectibles', icon: <ReceiptIcon fontSize="small" /> },
    { label: 'Cash Sales', href: '/cash-sales', icon: <PointOfSaleIcon fontSize="small" /> },
    { label: 'Entrails Sales', href: '/entrails', icon: <SetMealIcon fontSize="small" /> },
    { label: 'Cash Received', href: '/cash-received', icon: <AttachMoneyIcon fontSize="small" /> },
    { label: 'Cash Out', href: '/cash-out', icon: <MoneyOffIcon fontSize="small" /> },
    { divider: true, label: 'Freezer' },
    { label: 'Freezer In', href: '/freezer-in', icon: <KitchenIcon fontSize="small" /> },
    { label: 'Freezer Out', href: '/freezer-out', icon: <KitchenIcon fontSize="small" /> },
    { label: 'Freezer Stock', href: '/freezer-stock', icon: <KitchenIcon fontSize="small" /> },
    { divider: true, label: 'Reports & Config' },
    { label: 'Daily Summary', href: '/summary', icon: <BarChartIcon fontSize="small" /> },
    { label: 'Suki', href: '/suki', icon: <PeopleIcon fontSize="small" /> },
    { label: 'Suppliers', href: '/suppliers', icon: <LocalShippingIcon fontSize="small" /> },
    { label: 'Cuts', href: '/cuts', icon: <CategoryIcon fontSize="small" /> },
    { label: 'Settings', href: '/settings', icon: <SettingsIcon fontSize="small" /> },
];

function SectionLabel({ label }) {
    return (
        <Typography
            variant="caption"
            sx={{
                display: 'block',
                px: 2,
                pt: 2,
                pb: 0.5,
                color: '#475569',
                fontWeight: 700,
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
            }}
        >
            {label}
        </Typography>
    );
}

export default function AppLayout({ children, title }) {
    const [open, setOpen] = useState(false);
    const { flash } = usePage().props;
    const [snackOpen, setSnackOpen] = useState(!!(flash?.success || flash?.error));

    useEffect(() => {
        if (flash?.success || flash?.error) setSnackOpen(true);
    }, [flash?.success, flash?.error]);
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Logo */}
            <Box sx={{ px: 2.5, py: 2.5, borderBottom: '1px solid #1e293b' }}>
                <Typography variant="subtitle1" sx={{ color: '#f1f5f9', fontWeight: 700, letterSpacing: '-0.3px' }}>
                    Karne ni Nanay
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Daily Operations
                </Typography>
            </Box>

            {/* Nav */}
            <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
                {navItems.map((item, idx) => {
                    if (item.divider) {
                        return <SectionLabel key={idx} label={item.label} />;
                    }
                    const active = currentPath === item.href;
                    return (
                        <ListItem key={item.href} disablePadding>
                            <ListItemButton
                                component={Link}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                sx={{
                                    py: 0.7,
                                    borderRadius: '8px',
                                    mx: 1,
                                    width: 'auto',
                                    backgroundColor: active ? 'rgb(37 99 235 / 0.2)' : 'transparent',
                                    '&:hover': { backgroundColor: active ? 'rgb(37 99 235 / 0.25)' : 'rgb(255 255 255 / 0.06)' },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 32, color: active ? '#60a5fa' : '#94a3b8' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontSize: '0.8125rem',
                                        fontWeight: active ? 600 : 400,
                                        color: active ? '#e2e8f0' : '#94a3b8',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar variant="dense" sx={{ minHeight: 52 }}>
                    <IconButton color="inherit" edge="start" onClick={() => setOpen(!open)} sx={{ mr: 1.5 }}>
                        <MenuIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600, letterSpacing: '-0.2px' }}>
                        {title || 'Karne ni Nanay'}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="temporary"
                open={open}
                onClose={() => setOpen(false)}
                sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}
            >
                {drawer}
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    px: { xs: 2, sm: 3 },
                    py: 2.5,
                    mt: '52px',
                    maxWidth: '100%',
                    minHeight: 'calc(100vh - 52px)',
                }}
            >
                {children}
            </Box>

            {(flash?.success || flash?.error) && (
                <Snackbar
                    open={snackOpen}
                    autoHideDuration={3500}
                    onClose={() => setSnackOpen(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        severity={flash?.error ? 'error' : 'success'}
                        onClose={() => setSnackOpen(false)}
                        variant="filled"
                        sx={{ borderRadius: 2, fontWeight: 500 }}
                    >
                        {flash?.success || flash?.error}
                    </Alert>
                </Snackbar>
            )}
        </Box>
    );
}
