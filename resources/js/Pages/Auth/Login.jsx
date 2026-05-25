import { useForm } from '@inertiajs/react';
import { Box, Button, Checkbox, FormControlLabel, Paper, TextField, Typography } from '@mui/material';

export default function Login({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
            <Paper sx={{ p: 4, width: '100%', maxWidth: 400 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom color="primary">Meat Tracker</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Daily operations management</Typography>
                {status && <Typography color="success.main" sx={{ mb: 2 }}>{status}</Typography>}
                <form onSubmit={submit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField label="Email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} size="small" fullWidth autoFocus error={!!errors.email} helperText={errors.email} required />
                        <TextField label="Password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} size="small" fullWidth error={!!errors.password} helperText={errors.password} required />
                        <FormControlLabel control={<Checkbox checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} size="small" />} label="Remember me" />
                        <Button type="submit" variant="contained" disabled={processing} fullWidth>Log In</Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}
