import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link, router, useForm } from '@inertiajs/react';
import {
    Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent,
    DialogTitle, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

export default function SukiIndex({ sukis }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        contact: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('suki.store'), { onSuccess: () => { reset(); setOpen(false); } });
    };

    const destroy = (id) => {
        if (!confirm('Delete this suki? Their tab will also be deleted.')) return;
        router.delete(route('suki.destroy', id));
    };

    return (
        <AppLayout title="Suki (Customers)">
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    Add Suki
                </Button>
            </Box>

            <Card>
                <CardContent sx={{ p: 0 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Contact</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sukis.map((s) => (
                                <TableRow key={s.id}>
                                    <TableCell>{s.name}</TableCell>
                                    <TableCell>{s.contact || '—'}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            component={Link}
                                            href={route('suki.ledger', s.id)}
                                            title="View Ledger"
                                        >
                                            <AccountBalanceWalletIcon fontSize="small" />
                                        </IconButton>
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
                <DialogTitle>Add Suki</DialogTitle>
                <form onSubmit={submit}>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            size="small"
                            required
                        />
                        <TextField
                            label="Contact (optional)"
                            value={data.contact}
                            onChange={(e) => setData('contact', e.target.value)}
                            size="small"
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
