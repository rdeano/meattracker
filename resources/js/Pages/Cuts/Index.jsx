import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { router, useForm } from '@inertiajs/react';
import {
    Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent,
    DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select,
    Table, TableBody, TableCell, TableHead, TableRow, TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CutsIndex({ cuts }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, reset } = useForm({ name: '', type: 'meat' });

    const submit = (e) => {
        e.preventDefault();
        post(route('cuts.store'), { onSuccess: () => { reset(); setOpen(false); } });
    };

    const destroy = (id) => {
        if (!confirm('Delete this cut?')) return;
        router.delete(route('cuts.destroy', id));
    };

    return (
        <AppLayout title="Cuts">
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    Add Cut
                </Button>
            </Box>

            <Card>
                <CardContent sx={{ p: 0 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cuts.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell>{c.name}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={c.type}
                                            size="small"
                                            color={c.type === 'meat' ? 'error' : 'warning'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton size="small" onClick={() => destroy(c.id)}>
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
                <DialogTitle>Add Cut</DialogTitle>
                <form onSubmit={submit}>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            size="small"
                            required
                        />
                        <FormControl size="small" fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={data.type}
                                label="Type"
                                onChange={(e) => setData('type', e.target.value)}
                            >
                                <MenuItem value="meat">Meat</MenuItem>
                                <MenuItem value="entrails">Entrails</MenuItem>
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
