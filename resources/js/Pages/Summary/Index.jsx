import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { router } from '@inertiajs/react';
import Grid from '@mui/material/Grid2';
import {
    Box, Card, CardContent, Chip, Divider, IconButton, Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const peso = (v) => `₱${Number(v || 0).toFixed(2)}`;

function Row({ label, value }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography variant="body2" fontWeight={600}>{peso(value)}</Typography>
        </Box>
    );
}

export default function SummaryIndex({ date, reconciliation, profit }) {
    const current = dayjs(date);

    const go = (d) => {
        router.get(route('summary.index'), { date: d.format('YYYY-MM-DD') });
    };

    return (
        <AppLayout title="Daily Summary">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <IconButton size="small" onClick={() => go(current.subtract(1, 'day'))}>
                    <ChevronLeftIcon />
                </IconButton>
                <DatePicker
                    value={current}
                    onChange={(val) => val && go(val)}
                    slotProps={{ textField: { size: 'small', sx: { width: 150 } } }}
                />
                <IconButton size="small" onClick={() => go(current.add(1, 'day'))}>
                    <ChevronRightIcon />
                </IconButton>
                <Typography variant="h6" sx={{ ml: 1, fontWeight: 700 }}>
                    {current.format('MMMM D, YYYY')}
                </Typography>
            </Box>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={700} gutterBottom>Reconciliation</Typography>
                            <Typography variant="caption" color="text.secondary">+ Capital Side</Typography>
                            <Row label="Timbang Carabao" value={reconciliation.timbang} />
                            <Row label="Cash Received" value={reconciliation.cash_received} />
                            <Row label="Hango Items" value={reconciliation.hango_items} />
                            <Row label="Freezer Out (value)" value={reconciliation.freezer_out_value} />
                            <Box sx={{ textAlign: 'right', py: 0.5 }}>
                                <Typography variant="body2" fontWeight={700}>= {peso(reconciliation.capital_side)}</Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="caption" color="text.secondary">− Less</Typography>
                            <Row label="Collectibles" value={reconciliation.collectibles} />
                            <Row label="Freezer In (value)" value={reconciliation.freezer_in_value} />
                            <Row label="Cash Sales" value={reconciliation.cash_sales} />
                            <Row label="Cash Out" value={reconciliation.cash_out} />
                            <Divider sx={{ my: 1 }} />
                            <Chip
                                label={`Balance: ${peso(reconciliation.balance)}`}
                                color={reconciliation.balance >= 0 ? 'success' : 'error'}
                                sx={{ fontWeight: 700, fontSize: 15 }}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={700} gutterBottom>Profit</Typography>
                            <Typography variant="caption" color="text.secondary">+ Income</Typography>
                            <Row label="Cash Sales" value={profit.cash_sales} />
                            <Row label="Collectibles (sold)" value={profit.collectibles} />
                            <Row label="Entrails Sales" value={profit.entrails_sales} />
                            <Box sx={{ textAlign: 'right', py: 0.5 }}>
                                <Typography variant="body2" fontWeight={700}>= {peso(profit.income)}</Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="caption" color="text.secondary">− Costs</Typography>
                            <Row label="Timbang Carabao" value={profit.timbang} />
                            <Row label="Hango Items" value={profit.hango_items} />
                            <Row label="Cash Out" value={profit.cash_out} />
                            <Divider sx={{ my: 1 }} />
                            <Chip
                                label={`Net: ${peso(profit.net_gain)}`}
                                color={profit.net_gain >= 0 ? 'success' : 'error'}
                                sx={{ fontWeight: 700, fontSize: 15 }}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </AppLayout>
    );
}
