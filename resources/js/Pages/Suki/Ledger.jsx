import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm, router } from '@inertiajs/react';
import Grid from '@mui/material/Grid2';
import {
    Autocomplete,
    Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent,
    DialogTitle, Divider, IconButton, Tab, Tabs, Table, TableBody, TableCell,
    TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const peso = (v) => `₱${Number(v || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const emptyItem = () => ({ cut_id: '', kilo: '', price_per_kilo: '' });

// ── Inline item editor (same pattern as Dashboard ItemsEditor) ────────────────
function ItemsEditor({ items, setItems, cuts }) {
    const addRow    = () => setItems([...items, emptyItem()]);
    const removeRow = (i) => setItems(items.filter((_, idx) => idx !== i));
    const updateRow = (i, field, val) => {
        const next = [...items];
        next[i] = { ...next[i], [field]: val };
        setItems(next);
    };
    const rowTotal  = (r) => (parseFloat(r.kilo) || 0) * (parseFloat(r.price_per_kilo) || 0);
    const subtotal  = items.reduce((s, r) => s + rowTotal(r), 0);

    return (
        <Box>
            {items.map((row, i) => (
                <Box key={i} sx={{ p: 1.5, mb: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Autocomplete
                        options={cuts}
                        getOptionLabel={(o) => o.name}
                        value={cuts.find((c) => c.id === row.cut_id) || null}
                        onChange={(_, val) => updateRow(i, 'cut_id', val?.id ?? '')}
                        isOptionEqualToValue={(o, v) => o.id === v.id}
                        size="small"
                        sx={{ mb: 1.5 }}
                        renderInput={(params) => <TextField {...params} label="Cut" fullWidth />}
                    />
                    <Grid container spacing={1.5} alignItems="center">
                        <Grid size={{ xs: 5 }}>
                            <TextField fullWidth size="small" label="Kilo" type="number"
                                value={row.kilo} onChange={(e) => updateRow(i, 'kilo', e.target.value)}
                                inputProps={{ min: 0, step: 0.01 }} />
                        </Grid>
                        <Grid size={{ xs: 5 }}>
                            <TextField fullWidth size="small" label="₱ / kg" type="number"
                                value={row.price_per_kilo} onChange={(e) => updateRow(i, 'price_per_kilo', e.target.value)}
                                inputProps={{ min: 0, step: 0.01 }} />
                        </Grid>
                        <Grid size={{ xs: 2 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <IconButton size="small" color="error" onClick={() => removeRow(i)}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Grid>
                    </Grid>
                    {rowTotal(row) > 0 && (
                        <Box sx={{ mt: 1, textAlign: 'right' }}>
                            <Typography variant="body2" fontWeight={700} color="text.secondary">
                                = {peso(rowTotal(row))}
                            </Typography>
                        </Box>
                    )}
                </Box>
            ))}
            <Button size="small" startIcon={<AddIcon />} onClick={addRow}>Add item</Button>
            {subtotal > 0 && (
                <Box sx={{ textAlign: 'right', mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" fontWeight={700}>Subtotal: {peso(subtotal)}</Typography>
                </Box>
            )}
        </Box>
    );
}

// ── Summary card ──────────────────────────────────────────────────────────────
function SummaryCard({ totalCharges, totalPayments, balance }) {
    const stat = (label, value, color) => (
        <Box sx={{ textAlign: 'center', px: 1 }}>
            <Typography variant="caption" sx={{
                display: 'block', fontWeight: 700, fontSize: '0.6rem',
                letterSpacing: '0.08em', textTransform: 'uppercase', color: 'text.secondary', mb: 0.3,
            }}>
                {label}
            </Typography>
            <Typography variant="subtitle2" fontWeight={700} sx={{ color }}>
                {peso(value)}
            </Typography>
        </Box>
    );
    return (
        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(15,23,42,0.07)' }}>
            <CardContent sx={{ py: '10px !important', px: '12px !important' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, divideX: 1 }}>
                    {stat('Total Charges', totalCharges, 'error.main')}
                    <Box sx={{ width: '1px', height: 32, bgcolor: 'divider' }} />
                    {stat('Total Paid', totalPayments, 'success.main')}
                    <Box sx={{ width: '1px', height: 32, bgcolor: 'divider' }} />
                    {stat('Balance Owed', balance, balance > 0 ? 'error.main' : 'success.main')}
                </Box>
            </CardContent>
        </Card>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SukiLedger({ suki, rows, balance, total_charges, total_payments, cuts }) {
    const [tab, setTab] = useState(0);
    const [chargeOpen, setChargeOpen] = useState(false);
    const [payOpen, setPayOpen] = useState(false);
    const [chargeDate, setChargeDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [chargeItems, setChargeItems] = useState([emptyItem()]);

    const payForm = useForm({ date: dayjs().format('YYYY-MM-DD'), amount: '', notes: '' });

    const submitCharge = (e) => {
        e.preventDefault();
        router.post(route('suki.entries.store', suki.id), {
            date: chargeDate,
            items: chargeItems.map(({ cut_id, kilo, price_per_kilo }) => ({ cut_id, kilo, price_per_kilo })),
        }, {
            preserveScroll: true,
            onSuccess: () => { setChargeItems([emptyItem()]); setChargeOpen(false); },
        });
    };

    const submitPay = (e) => {
        e.preventDefault();
        payForm.post(route('suki.payments.store', suki.id), {
            onSuccess: () => { payForm.reset(); setPayOpen(false); },
        });
    };

    const deleteEntry   = (id) => { if (!confirm('Delete this entry?'))   return; router.delete(route('suki.entries.destroy', id)); };
    const deletePayment = (id) => { if (!confirm('Delete this payment?')) return; router.delete(route('suki.payments.destroy', id)); };

    const charges  = rows.filter(r => r.type === 'charge');
    const payments = rows.filter(r => r.type === 'payment');
    const visible  = tab === 0 ? rows : tab === 1 ? charges : payments;

    return (
        <AppLayout title={`${suki.name} — Ledger`}>

            {/* ── Header row ── */}
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 'grow' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <IconButton component={Link} href="/suki" size="small">
                            <ArrowBackIcon />
                        </IconButton>
                        <Box>
                            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
                                {suki.name}
                            </Typography>
                            {suki.contact && (
                                <Typography variant="caption" color="text.secondary">
                                    {suki.contact}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 'auto' }}>
                    <SummaryCard
                        totalCharges={total_charges}
                        totalPayments={total_payments}
                        balance={balance}
                    />
                </Grid>
            </Grid>

            {/* ── Action buttons ── */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button variant="contained" size="small" onClick={() => setChargeOpen(true)}>
                    + Add Charge
                </Button>
                <Button variant="outlined" size="small" onClick={() => setPayOpen(true)}>
                    + Record Payment
                </Button>
            </Box>

            {/* ── Tabs ── */}
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 1 }}>
                <Tab label={`All (${rows.length})`} />
                <Tab label={`Charges (${charges.length})`} />
                <Tab label={`Payments (${payments.length})`} />
            </Tabs>

            {/* ── Ledger table ── */}
            <Card>
                <CardContent sx={{ p: 0 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell align="right">Charge</TableCell>
                                <TableCell align="right">Payment</TableCell>
                                <TableCell align="right">Running Balance</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visible.map((r) => (
                                <TableRow key={`${r.type}-${r.id}`}>
                                    <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary', fontSize: '0.78rem' }}>
                                        {r.date}
                                    </TableCell>
                                    <TableCell>{r.description}</TableCell>

                                    {/* Charge column */}
                                    <TableCell align="right" sx={{ fontWeight: 600, color: r.type === 'charge' ? 'error.main' : 'text.disabled' }}>
                                        {r.type === 'charge' ? peso(r.amount) : '—'}
                                    </TableCell>

                                    {/* Payment column */}
                                    <TableCell align="right" sx={{ fontWeight: 600, color: r.type === 'payment' ? 'success.main' : 'text.disabled' }}>
                                        {r.type === 'payment' ? peso(r.amount) : '—'}
                                    </TableCell>

                                    {/* Running balance */}
                                    <TableCell align="right" sx={{
                                        fontWeight: 700,
                                        color: r.running_balance > 0 ? 'error.main' : 'success.main',
                                    }}>
                                        {peso(r.running_balance)}
                                    </TableCell>

                                    <TableCell sx={{ width: 36 }}>
                                        <IconButton size="small"
                                            onClick={() => r.type === 'charge' ? deleteEntry(r.id) : deletePayment(r.id)}
                                            sx={{ color: '#94a3b8', '&:hover': { color: 'error.main' } }}>
                                            <DeleteIcon sx={{ fontSize: 15 }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {rows.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ color: 'text.secondary', py: 3 }}>
                                        No entries yet
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* ── Add Charge dialog ── */}
            <Dialog open={chargeOpen} onClose={() => setChargeOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add Charge — {suki.name}</DialogTitle>
                <form onSubmit={submitCharge}>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <DatePicker
                            label="Date"
                            value={dayjs(chargeDate)}
                            onChange={(v) => setChargeDate(v?.format('YYYY-MM-DD'))}
                            slotProps={{ textField: { size: 'small', fullWidth: true } }}
                        />
                        <Divider><Typography variant="caption" color="text.secondary">Items</Typography></Divider>
                        <ItemsEditor items={chargeItems} setItems={setChargeItems} cuts={cuts} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setChargeOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="contained">Save</Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* ── Record Payment dialog ── */}
            <Dialog open={payOpen} onClose={() => setPayOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Record Payment</DialogTitle>
                <form onSubmit={submitPay}>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <DatePicker
                            label="Date"
                            value={dayjs(payForm.data.date)}
                            onChange={(v) => payForm.setData('date', v?.format('YYYY-MM-DD'))}
                            slotProps={{ textField: { size: 'small', fullWidth: true } }}
                        />
                        <TextField
                            label="Amount"
                            type="number"
                            value={payForm.data.amount}
                            onChange={(e) => payForm.setData('amount', e.target.value)}
                            inputProps={{ step: 0.01, min: 0 }}
                            size="small"
                            required
                        />
                        <TextField
                            label="Notes"
                            value={payForm.data.notes}
                            onChange={(e) => payForm.setData('notes', e.target.value)}
                            size="small"
                            placeholder="e.g. partial, 2-week payment"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setPayOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={payForm.processing}>Save</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </AppLayout>
    );
}
