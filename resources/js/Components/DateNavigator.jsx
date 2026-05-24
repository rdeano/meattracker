import { router } from '@inertiajs/react';
import { Box, IconButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import dayjs from 'dayjs';

export default function DateNavigator({ date, routeName }) {
    const current = dayjs(date);

    const go = (newDate) => {
        router.get(route(routeName), { date: newDate.format('YYYY-MM-DD') }, { preserveState: true });
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
        </Box>
    );
}
