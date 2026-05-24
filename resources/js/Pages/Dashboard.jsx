import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import DateNavigator from '@/Components/DateNavigator';
import NameInput from '@/Components/NameInput';
import Grid from '@mui/material/Grid2';
import {
    Autocomplete,
    Box, Button, Card, CardContent, Dialog, DialogActions,
    DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, IconButton,
    InputLabel, MenuItem, Select, Stack, Switch, TextField, Tooltip, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PostAddIcon from '@mui/icons-material/PostAdd';

const peso = (v) =>
    `₱${Number(v || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ── Section card — floating chip label above card ─────────────────────────────
function SectionCard({ title, total, onAdd, children, contentSx }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', pt: '10px' }}>
            {/* Floating chip */}
            <Box sx={{ pl: 1.5, mb: '-11px', position: 'relative', zIndex: 1 }}>
                <Typography component="span" sx={{
                    display: 'inline-block',
                    fontSize: '0.6rem', fontWeight: 800,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: '#64748b',
                    bgcolor: '#e8edf2',
                    border: '1px solid #d1d9e0',
                    px: 1.3, py: 0.45,
                    borderRadius: 10,
                }}>
                    {title}
                </Typography>
            </Box>
            {/* Card body */}
            <Card sx={{
                flex: 1, display: 'flex', flexDirection: 'column',
                borderRadius: 3,
                boxShadow: '0 2px 8px rgba(15,23,42,0.06), 0 0 0 1px rgba(15,23,42,0.06)',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pt: 2, pb: 1 }}>
                    <Typography sx={{ flex: 1, fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                        {peso(total)}
                    </Typography>
                    <IconButton size="small" onClick={onAdd} sx={{
                        width: 26, height: 26,
                        bgcolor: '#e2e8f0', color: '#475569',
                        '&:hover': { bgcolor: '#cbd5e1', color: '#0f172a' },
                    }}>
                        <AddIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                </Box>
                <Divider sx={{ mx: 2 }} />
                <CardContent sx={{ flex: 1, overflowY: 'auto', p: '8px 12px !important', ...contentSx }}>
                    {children}
                </CardContent>
            </Card>
        </Box>
    );
}

// ── Common row components ─────────────────────────────────────────────────────
function RecordRow({ primary, secondary, amount, onDelete }) {
    return (
        <Box sx={{
            display: 'flex', alignItems: 'center', py: 0.75, gap: 1,
            borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 'none' },
        }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.3 }} noWrap>{primary}</Typography>
                {secondary && <Typography variant="caption" color="text.secondary">{secondary}</Typography>}
            </Box>
            {amount !== undefined && (
                <Typography variant="body2" sx={{ fontWeight: 600, flexShrink: 0 }}>{peso(amount)}</Typography>
            )}
            <Tooltip title="Delete" arrow>
                <IconButton size="small" onClick={onDelete}
                    sx={{ color: '#94a3b8', '&:hover': { color: 'error.main', bgcolor: 'error.light' }, width: 24, height: 24 }}>
                    <DeleteIcon sx={{ fontSize: 14 }} />
                </IconButton>
            </Tooltip>
        </Box>
    );
}

function TransactionRecord({ transaction, onDelete, onEdit, onAddToTab, synced }) {
    return (
        <Box sx={{ py: 0.75, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 'none' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="body2" sx={{ flex: 1, fontWeight: 600 }} noWrap>
                    {transaction.supplier_name || transaction.customer_name || '—'}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, flexShrink: 0 }}>{peso(transaction.total)}</Typography>
                {onEdit && (
                    <Tooltip title="Edit items" arrow>
                        <IconButton size="small" onClick={onEdit}
                            sx={{ color: '#94a3b8', '&:hover': { color: 'primary.main', bgcolor: 'primary.lighter' }, width: 24, height: 24 }}>
                            <EditIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                    </Tooltip>
                )}
                {/* Show suki tab button only when suki is linked */}
                {(onAddToTab || synced) && (
                    synced ? (
                        <Tooltip title="Already in suki tab" arrow>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: 24, height: 24, justifyContent: 'center' }}>
                                <CheckCircleIcon sx={{ fontSize: 14, color: 'success.main' }} />
                            </Box>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Add to suki tab" arrow>
                            <IconButton size="small" onClick={onAddToTab}
                                sx={{ color: '#94a3b8', '&:hover': { color: 'warning.main', bgcolor: 'warning.light' }, width: 24, height: 24 }}>
                                <PostAddIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                        </Tooltip>
                    )
                )}
                <Tooltip title="Delete" arrow>
                    <IconButton size="small" onClick={onDelete}
                        sx={{ color: '#94a3b8', '&:hover': { color: 'error.main', bgcolor: 'error.light' }, width: 24, height: 24 }}>
                        <DeleteIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                </Tooltip>
            </Box>
            {transaction.items.map((item) => (
                <Typography key={item.id} variant="caption" display="block" color="text.secondary" sx={{ pl: 0.5, lineHeight: 1.6 }}>
                    {item.cut_name}: {item.kilo} kg × {peso(item.price_per_kilo)} = {peso(item.total)}
                </Typography>
            ))}
        </Box>
    );
}

function Empty() {
    return (
        <Typography variant="caption" color="text.disabled"
            sx={{ display: 'block', textAlign: 'center', py: 2 }}>
            No records yet
        </Typography>
    );
}

// ── Timbang full-row display — floating chip style ────────────────────────────
function TimbangCard({ records, total, onAdd, onDelete }) {
    return (
        <Box sx={{ pt: '10px' }}>
            {/* Floating chip */}
            <Box sx={{ pl: 1.5, mb: '-11px', position: 'relative', zIndex: 1 }}>
                <Typography component="span" sx={{
                    display: 'inline-block',
                    fontSize: '0.6rem', fontWeight: 800,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: '#64748b',
                    bgcolor: '#e8edf2',
                    border: '1px solid #d1d9e0',
                    px: 1.3, py: 0.45,
                    borderRadius: 10,
                }}>
                    Timbang Carabao
                </Typography>
            </Box>
            <Card sx={{
                borderRadius: 3,
                boxShadow: '0 2px 8px rgba(15,23,42,0.06), 0 0 0 1px rgba(15,23,42,0.06)',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pt: 2, pb: 1 }}>
                    <Typography sx={{ flex: 1, fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                        {peso(total)}
                    </Typography>
                    <IconButton size="small" onClick={onAdd} sx={{
                        width: 26, height: 26, bgcolor: '#e2e8f0', color: '#475569',
                        '&:hover': { bgcolor: '#cbd5e1', color: '#0f172a' },
                    }}>
                        <AddIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                </Box>
                <Divider sx={{ mx: 2 }} />
                <CardContent sx={{ py: '12px !important', px: '16px !important' }}>
                    {records.length === 0 ? (
                        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', textAlign: 'center', py: 1 }}>
                            No records yet
                        </Typography>
                    ) : (
                        <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={1.5}>
                            {records.map((r) => (
                                <Box key={r.id} sx={{
                                    display: 'flex', alignItems: 'center', gap: 1,
                                    px: 2, py: 1, borderRadius: 2,
                                    border: '1px solid #e2e8f0',
                                    bgcolor: '#f8fafc',
                                    minWidth: 200,
                                }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" fontWeight={700} color="#0f172a">
                                            {peso(r.total)}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {r.weight_kg} kg × {peso(r.price_per_kg)}/kg
                                            {r.notes ? `  ·  ${r.notes}` : ''}
                                        </Typography>
                                    </Box>
                                    <Tooltip title="Delete" arrow>
                                        <IconButton size="small" onClick={() => onDelete(r.id)}
                                            sx={{ color: '#94a3b8', '&:hover': { color: 'error.main', bgcolor: 'error.light' }, width: 24, height: 24 }}>
                                            <DeleteIcon sx={{ fontSize: 14 }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            ))}
                        </Stack>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}

// ── Item editor ───────────────────────────────────────────────────────────────
function ItemsEditor({ items, setItems, cuts }) {
    const addRow = () => setItems([...items, { cut_id: '', kilo: '', price_per_kilo: '' }]);
    const removeRow = (i) => setItems(items.filter((_, idx) => idx !== i));
    const updateRow = (i, field, val) => {
        const next = [...items];
        next[i] = { ...next[i], [field]: val };
        setItems(next);
    };
    const subtotal = items.reduce((s, r) => s + (parseFloat(r.kilo) || 0) * (parseFloat(r.price_per_kilo) || 0), 0);
    const rowTotal = (r) => (parseFloat(r.kilo) || 0) * (parseFloat(r.price_per_kilo) || 0);

    return (
        <Box>
            {items.map((row, i) => (
                <Box key={i} sx={{
                    p: 1.5, mb: 1.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                }}>
                    {/* Cut — searchable autocomplete */}
                    <Autocomplete
                        options={cuts}
                        getOptionLabel={(o) => o.name}
                        value={cuts.find((c) => c.id === row.cut_id) || null}
                        onChange={(_, val) => updateRow(i, 'cut_id', val?.id ?? '')}
                        isOptionEqualToValue={(o, v) => o.id === v.id}
                        size="small"
                        sx={{ mb: 1.5 }}
                        renderInput={(params) => (
                            <TextField {...params} label="Cut" fullWidth />
                        )}
                    />

                    {/* Kilo · Price · Delete */}
                    <Grid container spacing={1.5} alignItems="center">
                        <Grid size={{ xs: 5 }}>
                            <TextField fullWidth size="small" label="Kilo" type="number"
                                value={row.kilo}
                                onChange={(e) => updateRow(i, 'kilo', e.target.value)}
                                inputProps={{ min: 0, step: 0.01 }} />
                        </Grid>
                        <Grid size={{ xs: 5 }}>
                            <TextField fullWidth size="small" label="₱ / kg" type="number"
                                value={row.price_per_kilo}
                                onChange={(e) => updateRow(i, 'price_per_kilo', e.target.value)}
                                inputProps={{ min: 0, step: 0.01 }} />
                        </Grid>
                        <Grid size={{ xs: 2 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <IconButton size="small" color="error" onClick={() => removeRow(i)}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Grid>
                    </Grid>

                    {/* Row total */}
                    {rowTotal(row) > 0 && (
                        <Box sx={{ mt: 1, textAlign: 'right' }}>
                            <Typography variant="body2" fontWeight={700} color="text.secondary">
                                = {peso(rowTotal(row))}
                            </Typography>
                        </Box>
                    )}
                </Box>
            ))}

            <Button size="small" startIcon={<AddIcon />} onClick={addRow}>
                Add item
            </Button>

            {subtotal > 0 && (
                <Box sx={{ textAlign: 'right', mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" fontWeight={700}>
                        Subtotal: {peso(subtotal)}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

// ── Summary bar ───────────────────────────────────────────────────────────────
function SummaryBar({ balance, netGain }) {
    const pill = (label, value, pos) => (
        <Box sx={{
            px: 2, py: 1, borderRadius: 2,
            bgcolor: pos ? 'success.light' : 'error.light',
            border: '1px solid', borderColor: pos ? '#86efac' : '#fca5a5',
        }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: pos ? 'success.dark' : 'error.dark', display: 'block', lineHeight: 1 }}>
                {label}
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: pos ? 'success.dark' : 'error.dark' }}>
                {peso(value)}
            </Typography>
        </Box>
    );
    return (
        <Stack direction="row" spacing={2}>
            {pill('Balance', balance, balance >= 0)}
            {pill('Net Gain', netGain, netGain >= 0)}
        </Stack>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
const emptyItem = () => ({ cut_id: '', kilo: '', price_per_kilo: '' });

export default function Dashboard({
    date, summary,
    timbang, hango, collectibles, cashSales, entrails, cashReceived, cashOut,
    cuts, sukis, suppliers,
}) {
    const [dialog, setDialog]   = useState(null);
    const [form, setForm]       = useState({});
    const [items, setItems]     = useState([emptyItem()]);
    const [editId, setEditId]   = useState(null);
    const [editItems, setEditItems] = useState([emptyItem()]);
    const [editType, setEditType]   = useState(null); // 'collectibles' | 'hango'

    // Always derive from live props so deletes reflect immediately
    const editTransaction = editType === 'hango'
        ? hango.find((t) => t.id === editId) ?? null
        : collectibles.find((t) => t.id === editId) ?? null;

    const openDialog = (name) => { setDialog(name); setForm({ payment_type: 'cash' }); setItems([emptyItem()]); };
    const closeDialog = () => setDialog(null);
    const f = (key, val) => setForm((p) => ({ ...p, [key]: val }));

    const openEdit = (t, type) => { setEditId(t.id); setEditItems([emptyItem()]); setEditType(type); };
    const closeEdit = () => { setEditId(null); setEditType(null); };

    const del = (routeName, id) => {
        if (!window.confirm('Delete this record?')) return;
        router.delete(route(routeName, id), { preserveScroll: true });
    };
    const submit = (routeName, data) =>
        router.post(route(routeName), { ...data, date }, { preserveScroll: true, onSuccess: closeDialog });

    const timbangTotal      = timbang.reduce((s, r) => s + parseFloat(r.total || 0), 0);
    const cashReceivedTotal = cashReceived.reduce((s, r) => s + parseFloat(r.amount || 0), 0);
    const hangoTotal        = hango.reduce((s, t) => s + parseFloat(t.total || 0), 0);
    const collectiblesTotal = collectibles.reduce((s, t) => s + parseFloat(t.total || 0), 0);
    const cashSalesTotal    = cashSales.reduce((s, t) => s + parseFloat(t.total || 0), 0);
    const cashOutTotal      = cashOut.reduce((s, r) => s + parseFloat(r.amount || 0), 0);
    const entrailsTotal     = entrails.reduce((s, r) => s + parseFloat(r.total || 0), 0);

    const balance = summary?.reconciliation?.balance ?? 0;
    const netGain = summary?.profit?.net_gain ?? 0;
    const itemsPayload = items.map(({ cut_id, kilo, price_per_kilo }) => ({ cut_id, kilo, price_per_kilo }));

    return (
        <AppLayout title="Dashboard">
            {/* Header */}
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between"
                alignItems={{ sm: 'center' }} spacing={2} sx={{ mb: 2.5 }}>
                <DateNavigator date={date} routeName="dashboard" />
                <SummaryBar balance={balance} netGain={netGain} />
            </Stack>

            <Stack spacing={2}>
                {/* ── Row 1: Timbang full-width centered ── */}
                <TimbangCard
                    records={timbang}
                    total={timbangTotal}
                    onAdd={() => openDialog('timbang')}
                    onDelete={(id) => del('timbang.destroy', id)}
                />

                {/* ── Row 2 onward: 25 / 25 / 50 three-column layout ── */}
                <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>

                    {/* COLUMN 1 — 25%: Cash Received · Cash Sales · Entrails */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Stack spacing={2}>
                            {/* Cash Received */}
                            <SectionCard title="Cash Received" total={cashReceivedTotal}
                                onAdd={() => openDialog('cashReceived')}>
                                {cashReceived.length === 0 ? <Empty /> : cashReceived.map((r) => (
                                    <RecordRow key={r.id} primary={r.name || '—'} secondary={r.notes}
                                        amount={r.amount} onDelete={() => del('cash-received.destroy', r.id)} />
                                ))}
                            </SectionCard>

                            {/* Cash Sales */}
                            <SectionCard title="Cash Sales" total={cashSalesTotal}
                                onAdd={() => openDialog('cashSales')}>
                                {cashSales.length === 0 ? <Empty /> : cashSales.map((t) => (
                                    <TransactionRecord key={t.id} transaction={t}
                                        onDelete={() => del('cash-sales.destroy', t.id)} />
                                ))}
                            </SectionCard>

                            {/* Entrails Sales — informational only, not in balance/profit */}
                            <SectionCard title="Entrails Sales" total={entrailsTotal}
                                onAdd={() => openDialog('entrails')}>
                                <Typography variant="caption" sx={{ display: 'block', color: 'text.disabled', fontStyle: 'italic', mb: 0.5 }}>
                                    bonus · not counted in balance
                                </Typography>
                                {entrails.length === 0 ? <Empty /> : entrails.map((r) => (
                                    <RecordRow key={r.id}
                                        primary={`${r.customer_name || '—'} — ${r.cut_name}`}
                                        secondary={`${r.kilo} kg  ·  ${r.payment_type === 'credit' ? 'Credit' : 'Cash'}`}
                                        amount={r.total}
                                        onDelete={() => del('entrails.destroy', r.id)} />
                                ))}
                            </SectionCard>
                        </Stack>
                    </Grid>

                    {/* COLUMN 2 — 25%: Hango · Cash Out */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Stack spacing={2}>
                            {/* Hango */}
                            <SectionCard title="Hango — Market Buy" total={hangoTotal}
                                onAdd={() => openDialog('hango')}>
                                {hango.length === 0 ? <Empty /> : hango.map((t) => (
                                    <TransactionRecord key={t.id} transaction={t}
                                        onEdit={() => openEdit(t, 'hango')}
                                        onDelete={() => del('hango.destroy', t.id)} />
                                ))}
                            </SectionCard>

                            {/* Cash Out */}
                            <SectionCard title="Cash Out" total={cashOutTotal}
                                onAdd={() => openDialog('cashOut')}>
                                {cashOut.length === 0 ? <Empty /> : cashOut.map((r) => (
                                    <RecordRow key={r.id} primary={r.name} secondary={r.notes}
                                        amount={r.amount} onDelete={() => del('cash-out.destroy', r.id)} />
                                ))}
                            </SectionCard>
                        </Stack>
                    </Grid>

                    {/* COLUMN 3 — 50%: Collectibles tall card */}
                    <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
                        <SectionCard
                            title="Collectibles — Credit Sales"
                            total={collectiblesTotal}
                            onAdd={() => openDialog('collectibles')}
                            contentSx={{ maxHeight: 'none', flex: 1 }}
                        >
                            {collectibles.length === 0 ? <Empty /> : collectibles.map((t) => (
                                <TransactionRecord key={t.id} transaction={t}
                                    onEdit={() => openEdit(t, 'collectibles')}
                                    onAddToTab={t.suki_id && !t.synced_to_suki_tab ? () => router.post(route('collectibles.add-to-suki-tab', t.id), {}, { preserveScroll: true }) : undefined}
                                    synced={t.suki_id ? t.synced_to_suki_tab : undefined}
                                    onDelete={() => del('collectibles.destroy', t.id)} />
                            ))}
                        </SectionCard>
                    </Grid>
                </Grid>
            </Stack>

            {/* ── Dialogs ──────────────────────────────────────────────────── */}

            {/* Cash Received */}
            <Dialog open={dialog === 'cashReceived'} onClose={closeDialog} maxWidth="xs" fullWidth>
                <DialogTitle>Cash Received</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 0.5 }}>
                        <NameInput label="From" sukis={sukis} value={form.name || ''} onChange={(v) => f('name', v)}
                            sukiId={form.suki_id || null} onSukiChange={(v) => f('suki_id', v)} />
                        <TextField label="Amount (₱)" type="number" fullWidth value={form.amount || ''}
                            onChange={(e) => f('amount', e.target.value)} inputProps={{ min: 0, step: 0.01 }} />
                        <TextField label="Notes" fullWidth value={form.notes || ''}
                            onChange={(e) => f('notes', e.target.value)} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={closeDialog} color="inherit">Cancel</Button>
                    <Button variant="contained" onClick={() => submit('cash-received.store', form)}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Cash Out */}
            <Dialog open={dialog === 'cashOut'} onClose={closeDialog} maxWidth="xs" fullWidth>
                <DialogTitle>Cash Out</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 0.5 }}>
                        <TextField label="For" fullWidth value={form.name || ''}
                            onChange={(e) => f('name', e.target.value)} />
                        <TextField label="Amount (₱)" type="number" fullWidth value={form.amount || ''}
                            onChange={(e) => f('amount', e.target.value)} inputProps={{ min: 0, step: 0.01 }} />
                        <TextField label="Notes" fullWidth value={form.notes || ''}
                            onChange={(e) => f('notes', e.target.value)} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={closeDialog} color="inherit">Cancel</Button>
                    <Button variant="contained" onClick={() => submit('cash-out.store', form)}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Timbang */}
            <Dialog open={dialog === 'timbang'} onClose={closeDialog} maxWidth="xs" fullWidth>
                <DialogTitle>Timbang Carabao</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 0.5 }}>
                        <TextField label="Weight (kg)" type="number" fullWidth value={form.weight_kg || ''}
                            onChange={(e) => f('weight_kg', e.target.value)} inputProps={{ min: 0, step: 0.01 }} />
                        <TextField label="Price per kg (₱)" type="number" fullWidth value={form.price_per_kg || ''}
                            onChange={(e) => f('price_per_kg', e.target.value)} inputProps={{ min: 0, step: 0.01 }} />
                        {(form.weight_kg && form.price_per_kg) && (
                            <Box sx={{ px: 1.5, py: 1, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                                <Typography variant="body2" fontWeight={600}>
                                    Total: {peso((parseFloat(form.weight_kg) || 0) * (parseFloat(form.price_per_kg) || 0))}
                                </Typography>
                            </Box>
                        )}
                        <TextField label="Notes" fullWidth value={form.notes || ''}
                            onChange={(e) => f('notes', e.target.value)} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={closeDialog} color="inherit">Cancel</Button>
                    <Button variant="contained" onClick={() => submit('timbang.store', form)}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Hango */}
            <Dialog open={dialog === 'hango'} onClose={closeDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Hango — Market Buy</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 0.5 }}>
                        <NameInput label="Supplier" sukis={suppliers} value={form.supplier_name || ''}
                            onChange={(v) => f('supplier_name', v)} sukiId={form.supplier_id || null}
                            onSukiChange={(v) => f('supplier_id', v)} />
                        <Divider><Typography variant="caption" color="text.secondary">Items</Typography></Divider>
                        <ItemsEditor items={items} setItems={setItems} cuts={cuts.all} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={closeDialog} color="inherit">Cancel</Button>
                    <Button variant="contained" onClick={() => submit('hango.store', { ...form, items: itemsPayload })}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Collectibles */}
            <Dialog open={dialog === 'collectibles'} onClose={closeDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Collectible — Credit Sale</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 0.5 }}>
                        <NameInput label="Customer" sukis={sukis} value={form.customer_name || ''}
                            onChange={(v) => f('customer_name', v)} sukiId={form.suki_id || null}
                            onSukiChange={(v) => f('suki_id', v)} sukiOnly />
                        <Divider><Typography variant="caption" color="text.secondary">Items</Typography></Divider>
                        <ItemsEditor items={items} setItems={setItems} cuts={cuts.all} />
                        {form.suki_id && (
                            <FormControlLabel
                                control={
                                    <Switch
                                        size="small"
                                        checked={!!form.add_to_suki_tab}
                                        onChange={(e) => f('add_to_suki_tab', e.target.checked)}
                                    />
                                }
                                label={
                                    <Typography variant="body2" color="text.secondary">
                                        Also add to suki tab
                                    </Typography>
                                }
                            />
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={closeDialog} color="inherit">Cancel</Button>
                    <Button variant="contained" onClick={() => submit('collectibles.store', { ...form, items: itemsPayload })}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Cash Sales */}
            <Dialog open={dialog === 'cashSales'} onClose={closeDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Cash Sale</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 0.5 }}>
                        <NameInput label="Customer" sukis={sukis} value={form.customer_name || ''}
                            onChange={(v) => f('customer_name', v)} sukiId={form.suki_id || null}
                            onSukiChange={(v) => f('suki_id', v)} />
                        <Divider><Typography variant="caption" color="text.secondary">Items</Typography></Divider>
                        <ItemsEditor items={items} setItems={setItems} cuts={cuts.meat} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={closeDialog} color="inherit">Cancel</Button>
                    <Button variant="contained" onClick={() => submit('cash-sales.store', { ...form, items: itemsPayload })}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Entrails */}
            <Dialog open={dialog === 'entrails'} onClose={closeDialog} maxWidth="xs" fullWidth>
                <DialogTitle>Entrails Sale</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 0.5 }}>
                        <NameInput label="Customer" sukis={sukis} value={form.customer_name || ''}
                            onChange={(v) => f('customer_name', v)} sukiId={form.suki_id || null}
                            onSukiChange={(v) => f('suki_id', v)} />
                        <Autocomplete
                            options={cuts.entrails}
                            getOptionLabel={(o) => o.name}
                            value={cuts.entrails.find((c) => c.id === form.cut_id) || null}
                            onChange={(_, val) => f('cut_id', val?.id ?? '')}
                            isOptionEqualToValue={(o, v) => o.id === v.id}
                            size="small"
                            renderInput={(params) => (
                                <TextField {...params} label="Cut" fullWidth />
                            )}
                        />
                        <Stack direction="row" spacing={1.5}>
                            <TextField label="Kilo" type="number" fullWidth value={form.kilo || ''}
                                onChange={(e) => f('kilo', e.target.value)} inputProps={{ min: 0, step: 0.01 }} />
                            <TextField label="₱ / kg" type="number" fullWidth value={form.price_per_kilo || ''}
                                onChange={(e) => f('price_per_kilo', e.target.value)} inputProps={{ min: 0, step: 0.01 }} />
                        </Stack>
                        {(form.kilo && form.price_per_kilo) && (
                            <Box sx={{ px: 1.5, py: 1, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                                <Typography variant="body2" fontWeight={600}>
                                    Total: {peso((parseFloat(form.kilo) || 0) * (parseFloat(form.price_per_kilo) || 0))}
                                </Typography>
                            </Box>
                        )}
                        <FormControl fullWidth>
                            <InputLabel>Payment</InputLabel>
                            <Select value={form.payment_type || 'cash'} label="Payment"
                                onChange={(e) => f('payment_type', e.target.value)}>
                                <MenuItem value="cash">Cash</MenuItem>
                                <MenuItem value="credit">Credit</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={closeDialog} color="inherit">Cancel</Button>
                    <Button variant="contained"
                        onClick={() => submit('entrails.store', { ...form, payment_type: form.payment_type || 'cash' })}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Edit transaction (Collectibles or Hango) ── */}
            <Dialog open={!!editTransaction} onClose={closeEdit} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Edit — {editTransaction?.customer_name || editTransaction?.supplier_name || '—'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 0.5 }}>
                        {/* Existing items */}
                        {editTransaction?.items?.length > 0 && (
                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                                    Current items
                                </Typography>
                                {editTransaction.items.map((item) => (
                                    <Box key={item.id} sx={{
                                        display: 'flex', alignItems: 'center', gap: 1,
                                        py: 0.75,
                                        borderBottom: '1px solid', borderColor: 'divider',
                                        '&:last-child': { borderBottom: 'none' },
                                    }}>
                                        <Typography variant="body2" sx={{ flex: 1 }}>
                                            {item.cut_name}: {item.kilo} kg × {peso(item.price_per_kilo)}
                                        </Typography>
                                        <Typography variant="body2" fontWeight={700} sx={{ flexShrink: 0 }}>
                                            {peso(item.total)}
                                        </Typography>
                                        <Tooltip title="Remove item" arrow>
                                        <IconButton size="small"
                                            onClick={() => del(
                                                editType === 'hango' ? 'hango-items.destroy' : 'collectible-items.destroy',
                                                item.id
                                            )}
                                            sx={{ color: '#94a3b8', '&:hover': { color: 'error.main', bgcolor: 'error.light' }, width: 24, height: 24 }}>
                                            <DeleteIcon sx={{ fontSize: 14 }} />
                                        </IconButton>
                                        </Tooltip>
                                    </Box>
                                ))}
                            </Box>
                        )}

                        <Divider><Typography variant="caption" color="text.secondary">Add items</Typography></Divider>
                        <ItemsEditor items={editItems} setItems={setEditItems} cuts={cuts.all} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={closeEdit} color="inherit">Close</Button>
                    <Button variant="contained" onClick={() => {
                        router.post(
                            route(editType === 'hango' ? 'hango.add-items' : 'collectibles.add-items', editTransaction.id),
                            { items: editItems.map(({ cut_id, kilo, price_per_kilo }) => ({ cut_id, kilo, price_per_kilo })) },
                            { preserveScroll: true, onSuccess: closeEdit }
                        );
                    }}>
                        Add items
                    </Button>
                </DialogActions>
            </Dialog>
        </AppLayout>
    );
}
