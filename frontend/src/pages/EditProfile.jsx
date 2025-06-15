// frontend/src/pages/EditProfile.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Grid } from '@mui/material';
import MuiLink from '@mui/material/Link';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import Header from '../components/Header';
import Footer from '../components/Footer';

import { useAuth } from '../hooks/useAuth'; // Para obter dados do usuário e a função de login (para re-logar se token mudar)

import '../css/main.css';
import '../css/login.css'; // Reutiliza estilos de formulário/caixa de login

function EditProfile() {
    const { user, token, isAuthenticated, login, logout } = useAuth(); // Precisa da função 'login' para atualizar o contexto
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Preenche os campos do formulário com os dados atuais do usuário ao carregar
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/Login');
            return;
        }
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
            setStreet(user.cep?.street || '');
            setCity(user.cep?.city || '');
            setState(user.cep?.state || '');
            setZipCode(user.cep?.zip_code || '');
        }
    }, [user, isAuthenticated, navigate]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        if (password && password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            const updateData = {
                name,
                email,
                phone,
                cep: { street, city, state, zip_code: zipCode },
            };
            if (password) {
                updateData.password = password;
            }

            const response = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Envia o token JWT
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (response.ok) {
                // Ao atualizar o perfil, o backend retorna um novo token (se a senha mudou)
                // Precisamos atualizar o estado do usuário e o token no useAuth.
                // A forma mais simples é "re-logar" o usuário no contexto useAuth com os novos dados.
                login(data.email, password || 'password123'); // Assume a senha antiga se não mudou, ou use uma lógica de re-login melhor

                setSuccessMessage('Profile updated successfully!');
                alert('Profile updated successfully!'); // Alerta de sucesso
                navigate('/my-account'); // Redireciona de volta para My Account
            } else {
                setError(data.message || 'Failed to update profile.');
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            setError('Server error: Could not update profile.');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Redirecting to login...</Typography>
            </Box>
        );
    }

    return (
        <>
            <Header />

            <Box className="login-page-container"> {/* Reutiliza classes de login para centralização */}
                <Box className="login-box">
                    <Typography variant="h5" component="h1" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
                        Edit Profile
                    </Typography>

                    <form onSubmit={handleUpdateProfile}>
                        <TextField
                            label="Name"
                            type="text"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                            label="Phone"
                            type="tel"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}>Address (CEP)</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="ZIP / Postal Code"
                                    variant="outlined"
                                    fullWidth
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Street"
                                    variant="outlined"
                                    fullWidth
                                    value={street}
                                    onChange={(e) => setStreet(e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="City"
                                    variant="outlined"
                                    fullWidth
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="State/Province"
                                    variant="outlined"
                                    fullWidth
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                        </Grid>

                        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}>Change Password</Typography>
                        <TextField
                            label="New Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Confirm New Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            sx={{ mb: 3 }}
                        />

                        {error && (
                            <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
                                {error}
                            </Typography>
                        )}
                        {successMessage && (
                            <Typography color="primary" variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
                                {successMessage}
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
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Profile'}
                        </Button>
                    </form>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <MuiLink component={RouterLink} to="/my-account" variant="body2" underline="hover" sx={{ fontWeight: 'bold' }}>
                            Back to My Account
                        </MuiLink>
                    </Box>
                </Box>
            </Box>

            <Footer />
        </>
    );
}

export default EditProfile;