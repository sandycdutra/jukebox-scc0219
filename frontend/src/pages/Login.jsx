import React, { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import MuiLink from '@mui/material/Link';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';

import { useAuth } from '../hooks/useAuth'; 
import mockUsers from '../mockdata/users'; 

import '../css/main.css';
import '../css/login.css';

function Login () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault(); 
        setLoading(true);
        setError('');



        await new Promise(resolve => setTimeout(resolve, 1500));
        //busca o usuário mockado
        const foundUser = mockUsers.find(
            user => user.email === email && user.password === password
        );

        if (foundUser) {
            console.log('Login successful!', foundUser);
            login(foundUser); 
            alert('Login successful!');
            navigate('/'); //redireciona para a página inicial
        } else {
            setError('Invalid email or password.');
        }
        setLoading(false);
    };

    return (
        <>
            <Header />

            <Box className="login-page-container">
                <Box className="login-box">
                    <Typography variant="h5" component="h1" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
                        Login
                    </Typography>

                    <form onSubmit={handleLogin}>
                        <TextField
                            label="Email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
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
                            disabled={loading} // Desabilita o botão durante o carregamento
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                        </Button>
                    </form>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <MuiLink component={RouterLink} to="/forgot-password" variant="body2" underline="hover" sx={{ display: 'block', mb: 1 }}>
                            Forgot your password?
                        </MuiLink>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Don't have an account?{' '}
                            <MuiLink component={RouterLink} to="/Register" variant="body2" underline="hover" sx={{ fontWeight: 'bold' }}>
                                Sign up
                            </MuiLink>
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Footer />
        </>
    );
}

export default Login;