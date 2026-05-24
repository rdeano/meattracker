import { useForm } from '@inertiajs/react';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing } = useForm({ email: '' });
    const submit = (e) => { e.preventDefault(); post(route('password.email')); };
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
            <Paper sx={{ p: 4, width: '100%', maxWidth: 400 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>Forgot Password</Typography>
                {status && <Typography color="success.main" sx={{ mb: 2 }}>{status}</Typography>}
                <form onSubmit={submit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField label="Email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} size="small" fullWidth required />
                        <Button type="submit" variant="contained" disabled={processing} fullWidth>Send Reset Link</Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}
