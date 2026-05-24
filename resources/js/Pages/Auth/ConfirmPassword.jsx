import { useForm } from '@inertiajs/react';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';

export default function ConfirmPassword() {
    const { data, setData, post, processing } = useForm({ password: '' });
    const submit = (e) => { e.preventDefault(); post(route('password.confirm')); };
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
            <Paper sx={{ p: 4, width: '100%', maxWidth: 400 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>Confirm Password</Typography>
                <form onSubmit={submit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField label="Password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} size="small" fullWidth required />
                        <Button type="submit" variant="contained" disabled={processing} fullWidth>Confirm</Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}
