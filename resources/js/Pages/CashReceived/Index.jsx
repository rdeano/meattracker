import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import DateNavigator from '@/Components/DateNavigator';
import NameInput from '@/Components/NameInput';
import { router, useForm } from '@inertiajs/react';
import {
    Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent,
    DialogTitle, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const peso = (v) => `₱${Number(v || 0).toFixed(2)}`;

export default function CashReceivedIndex({ records, date, total, sukis }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        date,
        name: '',
        suki_id: null,
        amount: '',
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('cash-received.store'), {
            onSuccess: () => { reset(); setOpen(false); },
        });
    };

    const destroy = (id) => {
        if (!confirm('Delete this record?')) return;
        router.delete(route('cash-received.destroy', id));
    };

    return (
        <AppLayout title="Cash Received">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <DateNavigator date={date} routeName="cash-received.index" />
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    Add
                </Button>
            </Box>

            <Card>
                <CardContent sx={{ p: 0 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>From</TableCell>
                                <TableCell align="right">Amount</TableCell>
                                <TableCell>Notes</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {records.map((r) => (
                                <TableRow key={r.id}>
                                    <TableCell>{r.name || '—'}</TableCell>
                                    <TableCell align="right">{peso(r.amount)}</TableCell>
                                    <TableCell>{r.notes || '—'}</TableCell>
                                    <TableCell>
                                        <IconButton size="small" onClick={() => destroy(r.id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {records.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ color: 'text.secondary', py: 3 }}>
                                        No cash received for this date
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {records.length > 0 && (
                <Box sx={{ mt: 1, textAlign: 'right' }}>
                    <Chip label={`Total: ${peso(total)}`} color="success" />
                </Box>
            )}

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Add Cash Received</DialogTitle>
                <form onSubmit={submit}>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <NameInput
                            label="From"
                            sukis={sukis}
                            value={data.name}
                            onChange={(v) => setData('name', v)}
                            sukiId={data.suki_id}
                            onSukiChange={(id) => setData('suki_id', id)}
                        />
                        <TextField
                            label="Amount"
                            type="number"
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            inputProps={{ step: 0.01, min: 0 }}
                            size="small"
                            required
                        />
                        <TextField
                            label="Notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            size="small"
                            placeholder="e.g. payment for March 5"
                        />
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
