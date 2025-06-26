// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material'; 
import MuiLink from '@mui/material/Link';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';

import { useAuth } from '../hooks/useAuth';

import '../css/main.css';
import '../css/login.css';

function Register () {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState(''); 

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setFormErrors({}); // Limpa erros de formulário anteriores

        // --- Validação Frontend ---
        let currentFormErrors = {};

        if (!name) currentFormErrors.name = 'Name is required.';
        if (!email) currentFormErrors.email = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(email)) currentFormErrors.email = 'Email is invalid.';

        if (!phone) currentFormErrors.phone = 'Phone number is required.'; // Validação do telefone
        
        if (!password) currentFormErrors.password = 'Password is required.';
        if (password && password.length < 6) currentFormErrors.password = 'Password must be at least 6 characters.';
        if (!confirmPassword) currentFormErrors.confirmPassword = 'Confirm Password is required.';
        if (password !== confirmPassword) currentFormErrors.confirmPassword = 'Passwords do not match.';

        if (Object.keys(currentFormErrors).length > 0) {
            setFormErrors(currentFormErrors);
            setLoading(false);
            return;
        }

        // Dados do usuário para registro
        const userData = {
            name,
            email,
            password,
            phone,
        };

        const result = await register(userData);

        if (result.success) {
            alert('Registration successful! Please log in to continue.');
            navigate('/Login');
        } else {
            setError(result.message || 'Registration failed. Please try again.');
        }
        setLoading(false);
    };

    return (
        <>
            <Header />

            <Box className="login-page-container">
                <Box className="login-box">
                    <Typography variant="h5" component="h1" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
                        Register
                    </Typography>

                    <form onSubmit={handleRegister}>
                        <TextField
                            label="Name"
                            type="text"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            error={!!formErrors.email}
                            helperText={formErrors.email}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Phone Number"
                            type="tel"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            error={!!formErrors.phone}
                            helperText={formErrors.phone}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            error={!!formErrors.password}
                            helperText={formErrors.password}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Confirm Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            error={!!formErrors.confirmPassword}
                            helperText={formErrors.confirmPassword}
                            sx={{ mb: 3 }}
                        />

                        {error && (
                            <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
                                {error}
                            </Typography>
                        )}

                        <Button
                            variant="contained"
                            type="submit"
                            fullWidth
                            sx={{
                                backgroundColor: '#2009EA',
                                color: '#fff',
                                '&:hover': { backgroundColor: '#1a07bb' },
                                borderRadius: '8px',
                                padding: '12px 0',
                                textTransform: 'uppercase',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                mb: 2
                            }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                        </Button>
                    </form>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Already have an account?{' '}
                            <MuiLink component={RouterLink} to="/Login" variant="body2" underline="hover" sx={{ fontWeight: 'bold' }}>
                                Login here
                            </MuiLink>
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Footer />
        </>
    );
}

export default Register;