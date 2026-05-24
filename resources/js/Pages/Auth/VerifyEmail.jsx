import { useForm } from '@inertiajs/react';
import { Box, Button, Paper, Typography } from '@mui/material';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
            <Paper sx={{ p: 4, width: '100%', maxWidth: 400 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>Verify Email</Typography>
                {status === 'verification-link-sent' && <Typography color="success.main" sx={{ mb: 2 }}>Verification link sent!</Typography>}
                <Button variant="contained" disabled={processing} onClick={() => post(route('verification.send'))} fullWidth>
                    Resend Verification Email
                </Button>
            </Paper>
        </Box>
    );
}
