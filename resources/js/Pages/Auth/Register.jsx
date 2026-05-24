import { useForm, Link } from '@inertiajs/react';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({ name: '', email: '', password: '', password_confirmation: '' });
    const submit = (e) => { e.preventDefault(); post(route('register')); };
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
            <Paper sx={{ p: 4, width: '100%', maxWidth: 400 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom color="primary">Register</Typography>
                <form onSubmit={submit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField label="Name" value={data.name} onChange={(e) => setData('name', e.target.value)} size="small" fullWidth required />
                        <TextField label="Email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} size="small" fullWidth required />
                        <TextField label="Password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} size="small" fullWidth required />
                        <TextField label="Confirm Password" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} size="small" fullWidth required />
                        <Button type="submit" variant="contained" disabled={processing} fullWidth>Register</Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}
