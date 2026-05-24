import { Link } from '@inertiajs/react';
import { Box, Button, Typography } from '@mui/material';

export default function Welcome() {
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
                    Karne ni Nanay
                </Typography>
                <Button component={Link} href="/login" variant="contained">
                    Log In
                </Button>
            </Box>
        </Box>
    );
}
