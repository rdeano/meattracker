import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import DateNavigator from '@/Components/DateNavigator';
import { router, useForm } from '@inertiajs/react';
import {
    Autocomplete,
    Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent,
    DialogTitle, IconButton,
    Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export default function FreezerInIndex({ records, date, total_kg, cuts }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        date,
        cut_id: '',
        weight_kg: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('freezer-in.store'), {
            onSuccess: () => { reset(); setOpen(false); },
        });
    };

    const destroy = (id) => {
        if (!confirm('Delete this record?')) return;
        router.delete(route('freezer-in.destroy', id));
    };

    return (
        <AppLayout title="Freezer In">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <DateNavigator date={date} routeName="freezer-in.index" />
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    Add
                </Button>
            </Box>

            <Card>
                <CardContent sx={{ p: 0 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Cut</TableCell>
                                <TableCell align="right">Weight (kg)</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {records.map((r) => (
                                <TableRow key={r.id}>
                                    <TableCell>{r.cut_name}</TableCell>
                                    <TableCell align="right">{r.weight_kg} kg</TableCell>
                                    <TableCell>
                                        <IconButton size="small" onClick={() => destroy(r.id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {records.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} align="center" sx={{ color: 'text.secondary', py: 3 }}>
                                        No freezer-in records for this date
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {records.length > 0 && (
                <Box sx={{ mt: 1, textAlign: 'right' }}>
                    <Chip label={`Total: ${total_kg} kg`} color="primary" />
                </Box>
            )}

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Add Freezer In</DialogTitle>
                <form onSubmit={submit}>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Autocomplete
                            options={cuts}
                            getOptionLabel={(o) => `${o.name} (${o.type})`}
                            value={cuts.find((c) => c.id === data.cut_id) || null}
                            onChange={(_, val) => setData('cut_id', val?.id ?? '')}
                            isOptionEqualToValue={(o, v) => o.id === v.id}
                            size="small"
                            renderInput={(params) => (
                                <TextField {...params} label="Cut" fullWidth required />
                            )}
                        />
                        <TextField
                            label="Weight (kg)"
                            type="number"
                            value={data.weight_kg}
                            onChange={(e) => setData('weight_kg', e.target.value)}
                            inputProps={{ step: 0.1, min: 0 }}
                            size="small"
                            required
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
