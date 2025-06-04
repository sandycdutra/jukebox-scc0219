import React, { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import MuiLink from '@mui/material/Link';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';

import '../css/main.css';
import '../css/login.css';

function Login () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Previne o recarregamento da página quando o formulário é enviado
        setLoading(true);
        setError('');

        // --- Lógica de Autenticação (Apenas Mock/Exemplo) ---
        // Em um projeto real, você faria uma chamada para o seu backend aqui:
        // try {
        //     const response = await fetch('/api/login', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({ email, password })
        //     });
        //     const data = await response.json();
        //     if (response.ok) {
        //         // Autenticação bem-sucedida
        //         console.log('Login bem-sucedido:', data);
        //         // Ex: Salvar token no localStorage, redirecionar para a home ou dashboard
        //         navigate('/');
        //     } else {
        //         // Erro na autenticação
        //         setError(data.message || 'Credenciais inválidas.');
        //     }
        // } catch (err) {
        //     setError('Erro ao conectar ao servidor. Tente novamente.');
        //     console.error('Erro de rede ou servidor:', err);
        // } finally {
        //     setLoading(false);
        // }

        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulação de atraso de rede
        if (email === 'test@example.com' && password === 'password123') {
            console.log('Login local bem-sucedido!');
            alert('Login bem-sucedido!');
            navigate('/'); // Redirecionamento
        } else {
            setError('Email ou senha inválidos.');
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