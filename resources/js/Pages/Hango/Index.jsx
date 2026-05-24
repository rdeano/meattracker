import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import DateNavigator from '@/Components/DateNavigator';
import ItemsTable from '@/Components/ItemsTable';
import NameInput from '@/Components/NameInput';
import { router, useForm } from '@inertiajs/react';
import {
    Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip,
    Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const peso = (v) => `₱${Number(v || 0).toFixed(2)}`;

export default function HangoIndex({ transactions, date, suppliers, cuts }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        date,
        supplier_name: '',
        supplier_id: null,
        items: [{ cut_id: '', kilo: '', price_per_kilo: '', total: 0 }],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('hango.store'), {
            onSuccess: () => { reset(); setOpen(false); },
        });
    };

    const destroy = (id) => {
        if (!confirm('Delete this transaction?')) return;
        router.delete(route('hango.destroy', id));
    };

    const dayTotal = transactions.reduce((s, t) => s + Number(t.total), 0);

    return (
        <AppLayout title="Hango (Market Buy)">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <DateNavigator date={date} routeName="hango.index" />
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    Add
                </Button>
            </Box>

            {transactions.map((t) => (
                <Accordion key={t.id} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pr: 1 }}>
                            <Typography fontWeight={600}>{t.supplier_name || 'Unknown'}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip label={peso(t.total)} size="small" color="primary" />
                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); destroy(t.id); }}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                        <table style={{ width: '100%', fontSize: 13 }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '4px 8px' }}>Cut</th>
                                    <th style={{ padding: '4px 8px' }}>Kilo</th>
                                    <th style={{ padding: '4px 8px' }}>Price</th>
                                    <th style={{ textAlign: 'right', padding: '4px 8px' }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {t.items.map((item) => (
                                    <tr key={item.id}>
                                        <td style={{ padding: '4px 8px' }}>{item.cut_name}</td>
                                        <td style={{ textAlign: 'center', padding: '4px 8px' }}>{item.kilo}</td>
                                        <td style={{ textAlign: 'center', padding: '4px 8px' }}>{peso(item.price_per_kilo)}</td>
                                        <td style={{ textAlign: 'right', padding: '4px 8px' }}>{peso(item.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </AccordionDetails>
                </Accordion>
            ))}

            {transactions.length === 0 && (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No hango transactions for this date
                </Typography>
            )}

            {transactions.length > 0 && (
                <Box sx={{ textAlign: 'right', mt: 1 }}>
                    <Chip label={`Day Total: ${peso(dayTotal)}`} color="primary" />
                </Box>
            )}

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add Hango Transaction</DialogTitle>
                <form onSubmit={submit}>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <NameInput
                            label="Supplier"
                            sukis={suppliers}
                            value={data.supplier_name}
                            onChange={(v) => setData('supplier_name', v)}
                            sukiId={data.supplier_id}
                            onSukiChange={(id) => setData('supplier_id', id)}
                        />
                        <ItemsTable
                            items={data.items}
                            cuts={cuts}
                            onChange={(items) => setData('items', items)}
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
