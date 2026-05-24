import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { router, useForm } from '@inertiajs/react';
import {
    Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent,
    DialogTitle, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export default function SuppliersIndex({ suppliers }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, reset } = useForm({ name: '', notes: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('suppliers.store'), { onSuccess: () => { reset(); setOpen(false); } });
    };

    const destroy = (id) => {
        if (!confirm('Delete this supplier?')) return;
        router.delete(route('suppliers.destroy', id));
    };

    return (
        <AppLayout title="Suppliers">
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    Add
                </Button>
            </Box>
            <Card>
                <CardContent sx={{ p: 0 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Notes</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {suppliers.map((s) => (
                                <TableRow key={s.id}>
                                    <TableCell>{s.name}</TableCell>
                                    <TableCell>{s.notes || '—'}</TableCell>
                                    <TableCell>
                                        <IconButton size="small" onClick={() => destroy(s.id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Add Supplier</DialogTitle>
                <form onSubmit={submit}>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField label="Name" value={data.name} onChange={(e) => setData('name', e.target.value)} size="small" required />
                        <TextField label="Notes" value={data.notes} onChange={(e) => setData('notes', e.target.value)} size="small" multiline rows={2} />
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
