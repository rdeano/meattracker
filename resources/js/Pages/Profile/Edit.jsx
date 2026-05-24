import AppLayout from '@/Layouts/AppLayout';
import { useForm } from '@inertiajs/react';
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';

export default function ProfileEdit({ auth }) {
    const { data, setData, patch, processing } = useForm({ name: auth.user.name, email: auth.user.email });
    const submit = (e) => { e.preventDefault(); patch(route('profile.update')); };
    return (
        <AppLayout title="Profile">
            <Card sx={{ maxWidth: 400 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={700} gutterBottom>Update Profile</Typography>
                    <form onSubmit={submit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField label="Name" value={data.name} onChange={(e) => setData('name', e.target.value)} size="small" fullWidth required />
                            <TextField label="Email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} size="small" fullWidth required />
                            <Button type="submit" variant="contained" disabled={processing}>Save</Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
