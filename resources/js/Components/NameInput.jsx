import { useState } from 'react';
import { Autocomplete, Box, FormControlLabel, Switch, TextField } from '@mui/material';

export default function NameInput({ label = 'Customer', sukis = [], value, onChange, sukiId, onSukiChange, sukiOnly = false, freeTextOnly = false }) {
    // checked = free text; unchecked = suki/supplier picker
    const [freeText, setFreeText] = useState(!sukiId);

    const handleModeToggle = (e) => {
        setFreeText(e.target.checked);
        onChange('');
        onSukiChange(null);
    };

    const autocomplete = (
        <Autocomplete
            options={sukis}
            getOptionLabel={(o) => o.name}
            value={sukis.find((s) => s.id === sukiId) || null}
            onChange={(_, val) => {
                onSukiChange(val?.id || null);
                onChange(val?.name || '');
            }}
            renderInput={(params) => (
                <TextField {...params} label={label} size="small" fullWidth />
            )}
            isOptionEqualToValue={(o, v) => o.id === v.id}
        />
    );

    // sukiOnly — no toggle, always autocomplete
    if (sukiOnly) return autocomplete;

    // freeTextOnly — no toggle, always plain text field
    if (freeTextOnly) return (
        <TextField
            label={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            size="small"
            fullWidth
        />
    );

    return (
        <Box>
            <FormControlLabel
                control={<Switch size="small" checked={freeText} onChange={handleModeToggle} />}
                label="Free Text"
                sx={{ mb: 0.5 }}
            />
            {freeText ? (
                <TextField
                    label={label}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    size="small"
                    fullWidth
                />
            ) : autocomplete}
        </Box>
    );
}
