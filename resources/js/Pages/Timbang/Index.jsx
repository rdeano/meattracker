import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import DateNavigator from '@/Components/DateNavigator';
import { router, useForm } from '@inertiajs/react';
import {
    Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent,
    DialogTitle, IconButton, Table, TableBody, TableCell, TableHead, TableRow,
    TextField, Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const peso = (v) => `₱${Number(v || 0).toFixed(2)}`;

export default function TimbangIndex({ records, date, total }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        date,
        weight_kg: '',
        price_per_kg: '',
        notes: '',
    });

    const computed = (parseFloat(data.weight_kg || 0) * parseFloat(data.price_per_kg || 0)).toFixed(2);

    const submit = (e) => {
        e.preventDefault();
        post(route('timbang.store'), {
            onSuccess: () => { reset(); setOpen(false); },
        });
    };

    const destroy = (id) => {
        if (!confirm('Delete this record?')) return;
        router.delete(route('timbang.destroy', id));
    };

    return (
        <AppLayout title="Timbang Carabao">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <DateNavigator date={date} routeName="timbang.index" />
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    Add
                </Button>
            </Box>

            <Card>
                <CardContent sx={{ p: 0 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Weight (kg)</TableCell>
                                <TableCell>Price/kg</TableCell>
                                <TableCell align="right">Total</TableCell>
                                <TableCell>Notes</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {records.map((r) => (
                                <TableRow key={r.id}>
                                    <TableCell>{r.weight_kg}</TableCell>
                                    <TableCell>{peso(r.price_per_kg)}</TableCell>
                                    <TableCell align="right">{peso(r.total)}</TableCell>
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
                                    <TableCell colSpan={5} align="center" sx={{ color: 'text.secondary', py: 3 }}>
                                        No records for this date
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
                <DialogTitle>Add Timbang</DialogTitle>
                <form onSubmit={submit}>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Weight (kg)"
                            type="number"
                            value={data.weight_kg}
                            onChange={(e) => setData('weight_kg', e.target.value)}
                            inputProps={{ step: 0.1, min: 0 }}
                            size="small"
                            error={!!errors.weight_kg}
                            helperText={errors.weight_kg}
                            required
                        />
                        <TextField
                            label="Price per kg"
                            type="number"
                            value={data.price_per_kg}
                            onChange={(e) => setData('price_per_kg', e.target.value)}
                            inputProps={{ step: 0.5, min: 0 }}
                            size="small"
                            error={!!errors.price_per_kg}
                            helperText={errors.price_per_kg}
                            required
                        />
                        <Typography variant="body2">Total: {peso(computed)}</Typography>
                        <TextField
                            label="Notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            size="small"
                            multiline
                            rows={2}
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
