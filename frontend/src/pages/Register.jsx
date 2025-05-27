// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import MuiLink from '@mui/material/Link'; // Importe Link do MUI
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // Importe Link do React Router

import Header from '../components/Header';
import Footer from '../components/Footer';

import '../css/main.css';
import '../css/login.css'; // Reutiliza o CSS da tela de login

function Register () {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            setLoading(false);
            return;
        }

        // --- Lógica de Registro (Apenas Mock/Exemplo) ---
        // Em um projeto real, você faria uma chamada para o seu backend aqui:
        // try {
        //     const response = await fetch('/api/register', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({ name, email, password })
        //     });
        //     const data = await response.json();
        //     if (response.ok) {
        //         console.log('Registro bem-sucedido:', data);
        //         alert('Registro bem-sucedido! Faça login para continuar.');
        //         navigate('/Login'); // Redireciona para a página de login
        //     } else {
        //         setError(data.message || 'Erro no registro. Tente novamente.');
        //     }
        // } catch (err) {
        //     setError('Erro ao conectar ao servidor. Tente novamente.');
        //     console.error('Erro de rede ou servidor:', err);
        // } finally {
        //     setLoading(false);
        // }

        // Exemplo de simulação de registro local
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simula um atraso de rede
        if (email && password && name) { // Validação básica
            console.log('Registro local simulado com sucesso!');
            alert('Registro bem-sucedido! Por favor, faça login.');
            navigate('/Login'); // Redireciona para a página de login
        } else {
            setError('Por favor, preencha todos os campos.');
        }
        setLoading(false);
    };

    return (
        <>
            <Header />

            <Box className="login-page-container"> {/* Reutiliza a classe para centralização e fundo */}
                <Box className="login-box"> {/* Reutiliza a classe para a caixa do formulário */}
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