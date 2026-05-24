import AppLayout from '@/Layouts/AppLayout';
import { useForm } from '@inertiajs/react';
import {
    Box, Button, Card, CardContent, TextField, Typography,
} from '@mui/material';

export default function SettingsIndex({ default_meat_price_per_kg }) {
    const { data, setData, put, processing } = useForm({
        default_meat_price_per_kg: default_meat_price_per_kg || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('settings.update'));
    };

    return (
        <AppLayout title="Settings">
            <Card sx={{ maxWidth: 400 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={700} gutterBottom>App Settings</Typography>
                    <form onSubmit={submit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Default Meat Price per kg (₱)"
                                type="number"
                                value={data.default_meat_price_per_kg}
                                onChange={(e) => setData('default_meat_price_per_kg', e.target.value)}
                                inputProps={{ step: 0.5, min: 0 }}
                                size="small"
                                helperText="Used for freezer stock peso value calculation"
                                required
                            />
                            <Button type="submit" variant="contained" disabled={processing}>
                                Save Settings
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
