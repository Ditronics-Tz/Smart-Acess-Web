import React, { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';

const OTPVerifyView: React.FC = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(e.target.value);
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setError('OTP must be 6 digits');
            return;
        }
        // TODO: Add OTP verification logic here
        alert('OTP Verified!');
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
        >
            <Typography variant="h5" gutterBottom>
                Enter OTP
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="OTP"
                    value={otp}
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                    inputProps={{ maxLength: 6 }}
                    error={!!error}
                    helperText={error}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Verify
                </Button>
            </form>
        </Box>
    );
};

export default OTPVerifyView;