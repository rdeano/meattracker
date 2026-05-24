import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import DateNavigator from '@/Components/DateNavigator';
import NameInput from '@/Components/NameInput';
import { router, useForm } from '@inertiajs/react';
import {
    Autocomplete,
    Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent,
    DialogTitle, IconButton, MenuItem, Select, Table, TableBody, TableCell,
    TableHead, TableRow, TextField, Typography, FormControl, InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const peso = (v) => `₱${Number(v || 0).toFixed(2)}`;

export default function EntrailsIndex({ records, date, total, sukis, cuts }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        date,
        customer_name: '',
        suki_id: null,
        cut_id: '',
        kilo: '',
        price_per_kilo: '',
        payment_type: 'cash',
    });

    const computed = (parseFloat(data.kilo || 0) * parseFloat(data.price_per_kilo || 0)).toFixed(2);

    const submit = (e) => {
        e.preventDefault();
        post(route('entrails.store'), {
            onSuccess: () => { reset(); setOpen(false); },
        });
    };

    const destroy = (id) => {
        if (!confirm('Delete this record?')) return;
        router.delete(route('entrails.destroy', id));
    };

    return (
        <AppLayout title="Entrails Sales">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <DateNavigator date={date} routeName="entrails.index" />
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    Add
                </Button>
            </Box>

            <Card>
                <CardContent sx={{ p: 0 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Customer</TableCell>
                                <TableCell>Cut</TableCell>
                                <TableCell>Kilo</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell align="right">Total</TableCell>
                                <TableCell>Payment</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {records.map((r) => (
                                <TableRow key={r.id}>
                                    <TableCell>{r.customer_name || '—'}</TableCell>
                                    <TableCell>{r.cut_name}</TableCell>
                                    <TableCell>{r.kilo}</TableCell>
                                    <TableCell>{peso(r.price_per_kilo)}</TableCell>
                                    <TableCell align="right">{peso(r.total)}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={r.payment_type}
                                            size="small"
                                            color={r.payment_type === 'cash' ? 'success' : 'warning'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton size="small" onClick={() => destroy(r.id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {records.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ color: 'text.secondary', py: 3 }}>
                                        No entrails sales for this date
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {records.length > 0 && (
                <Box sx={{ mt: 1, textAlign: 'right' }}>
                    <Chip label={`Total: ${peso(total)}`} color="primary" />
                </Box>
            )}

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Add Entrails Sale</DialogTitle>
                <form onSubmit={submit}>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <NameInput
                            label="Customer"
                            sukis={sukis}
                            value={data.customer_name}
                            onChange={(v) => setData('customer_name', v)}
                            sukiId={data.suki_id}
                            onSukiChange={(id) => setData('suki_id', id)}
                        />
                        <Autocomplete
                            options={cuts}
                            getOptionLabel={(o) => o.name}
                            value={cuts.find((c) => c.id === data.cut_id) || null}
                            onChange={(_, val) => setData('cut_id', val?.id ?? '')}
                            isOptionEqualToValue={(o, v) => o.id === v.id}
                            size="small"
                            renderInput={(params) => (
                                <TextField {...params} label="Cut (Entrails)" fullWidth required />
                            )}
                        />
                        <TextField
                            label="Kilo"
                            type="number"
                            value={data.kilo}
                            onChange={(e) => setData('kilo', e.target.value)}
                            inputProps={{ step: 0.1, min: 0 }}
                            size="small"
                            required
                        />
                        <TextField
                            label="Price per kilo"
                            type="number"
                            value={data.price_per_kilo}
                            onChange={(e) => setData('price_per_kilo', e.target.value)}
                            inputProps={{ step: 0.5, min: 0 }}
                            size="small"
                            required
                        />
                        <Typography variant="body2">Total: {peso(computed)}</Typography>
                        <FormControl size="small" fullWidth>
                            <InputLabel>Payment Type</InputLabel>
                            <Select
                                value={data.payment_type}
                                label="Payment Type"
                                onChange={(e) => setData('payment_type', e.target.value)}
                            >
                                <MenuItem value="cash">Cash</MenuItem>
                                <MenuItem value="credit">Credit</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={processing}>Save</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </AppLayout>
    );
}
