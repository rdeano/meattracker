import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Box, Card, CardContent, Chip, Tab, Tabs, Table, TableBody, TableCell,
    TableHead, TableRow, Typography,
} from '@mui/material';

const peso = (v) => `₱${Number(v || 0).toFixed(2)}`;

export default function FreezerStock({ stock, entries, total_kg, total_value, default_price }) {
    const [tab, setTab] = useState(0);

    return (
        <AppLayout title="Freezer Stock">
            {/* Summary chips */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <Chip label={`Total: ${total_kg} kg`} color="primary" />
                <Chip label={`Value: ${peso(total_value)}`} color="success" />
                {default_price > 0 && (
                    <Chip label={`@ ${peso(default_price)}/kg`} variant="outlined" />
                )}
            </Box>

            {default_price === 0 && (
                <Typography variant="body2" color="warning.main" sx={{ mb: 2 }}>
                    Set default meat price in Settings to see peso values.
                </Typography>
            )}

            {/* Tab switcher */}
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                <Tab label="Individual entries" />
                <Tab label="Totals per cut" />
            </Tabs>

            {/* ── Tab 0: Individual freezer-in entries ── */}
            {tab === 0 && (
                <Card>
                    <CardContent sx={{ p: 0 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Cut</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell align="right">Weight (kg)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {entries.map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell>{r.date}</TableCell>
                                        <TableCell>{r.cut_name}</TableCell>
                                        <TableCell sx={{ textTransform: 'capitalize', color: 'text.secondary' }}>
                                            {r.cut_type}
                                        </TableCell>
                                        <TableCell align="right">{r.weight_kg} kg</TableCell>
                                    </TableRow>
                                ))}
                                {entries.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ color: 'text.secondary', py: 3 }}>
                                            No freezer-in records yet
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* ── Tab 1: Totals per cut ── */}
            {tab === 1 && (
                <Card>
                    <CardContent sx={{ p: 0 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Cut</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell align="right">In (kg)</TableCell>
                                    <TableCell align="right">Out (kg)</TableCell>
                                    <TableCell align="right">Stock (kg)</TableCell>
                                    <TableCell align="right">Value</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stock.map((row) => (
                                    <TableRow
                                        key={row.cut_id}
                                        sx={{ bgcolor: row.current_kg < 0 ? 'error.light' : 'inherit' }}
                                    >
                                        <TableCell>{row.cut_name}</TableCell>
                                        <TableCell sx={{ textTransform: 'capitalize', color: 'text.secondary' }}>
                                            {row.cut_type}
                                        </TableCell>
                                        <TableCell align="right">{row.total_in}</TableCell>
                                        <TableCell align="right">{row.total_out}</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                                            {row.current_kg}
                                        </TableCell>
                                        <TableCell align="right">{peso(row.peso_value)}</TableCell>
                                    </TableRow>
                                ))}
                                {stock.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ color: 'text.secondary', py: 3 }}>
                                            No freezer stock recorded yet
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </AppLayout>
    );
}
