import {
    Box, Button, IconButton, MenuItem, Select, Table, TableBody,
    TableCell, TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const peso = (v) => `₱${Number(v || 0).toFixed(2)}`;

export default function ItemsTable({ items, cuts, onChange }) {
    const addRow = () => {
        onChange([...items, { cut_id: '', kilo: '', price_per_kilo: '', total: 0 }]);
    };

    const removeRow = (idx) => {
        onChange(items.filter((_, i) => i !== idx));
    };

    const updateRow = (idx, field, val) => {
        const updated = items.map((row, i) => {
            if (i !== idx) return row;
            const next = { ...row, [field]: val };
            next.total = parseFloat(next.kilo || 0) * parseFloat(next.price_per_kilo || 0);
            return next;
        });
        onChange(updated);
    };

    const subtotal = items.reduce((s, r) => s + (r.total || 0), 0);

    return (
        <Box>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Cut</TableCell>
                        <TableCell>Kilo</TableCell>
                        <TableCell>Price/kg</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((row, idx) => (
                        <TableRow key={idx}>
                            <TableCell sx={{ minWidth: 120 }}>
                                <Select
                                    size="small"
                                    value={row.cut_id}
                                    onChange={(e) => updateRow(idx, 'cut_id', e.target.value)}
                                    displayEmpty
                                    fullWidth
                                >
                                    <MenuItem value="" disabled>Select cut</MenuItem>
                                    {cuts.map((c) => (
                                        <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                    ))}
                                </Select>
                            </TableCell>
                            <TableCell>
                                <TextField
                                    size="small"
                                    type="number"
                                    value={row.kilo}
                                    onChange={(e) => updateRow(idx, 'kilo', e.target.value)}
                                    inputProps={{ min: 0, step: 0.1 }}
                                    sx={{ width: 90 }}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    size="small"
                                    type="number"
                                    value={row.price_per_kilo}
                                    onChange={(e) => updateRow(idx, 'price_per_kilo', e.target.value)}
                                    inputProps={{ min: 0, step: 0.5 }}
                                    sx={{ width: 100 }}
                                />
                            </TableCell>
                            <TableCell align="right">{peso(row.total)}</TableCell>
                            <TableCell>
                                <IconButton size="small" onClick={() => removeRow(idx)}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Button size="small" startIcon={<AddIcon />} onClick={addRow}>
                    Add Row
                </Button>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Subtotal: {peso(subtotal)}
                </Typography>
            </Box>
        </Box>
    );
}
