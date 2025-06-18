// frontend/src/pages/EditProfile.jsx
import React, { useState, useEffect } from 'react';
import {
    Box, Typography, TextField, Button,
    CircularProgress, Grid, Snackbar, Alert
} from '@mui/material';
import MuiLink from '@mui/material/Link';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';

import { useAuth } from '../hooks/useAuth'; // Importa useAuth para usar updateUserProfile e addAddress

function EditProfile() {
    const { user, isAuthenticated, updateUserProfile, addAddress } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Estados para o endereço do formulário
    const [addressId, setAddressId] = useState(null);
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Estados para feedback do usuário
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // success, error, info, warning

    // Estados para validação de campos
    const [errors, setErrors] = useState({});

    // Preenche os campos do formulário com os dados atuais do usuário
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/Login');
            return;
        }
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');

            const defaultAddress = user.addresses?.find(addr => addr.isDefault) || user.addresses?.[0];

            if (defaultAddress) {
                setAddressId(defaultAddress.id);
                setStreet(defaultAddress.street || '');
                setCity(defaultAddress.city || '');
                setState(defaultAddress.state || '');
                setZipCode(defaultAddress.zip_code || '');
            } else {
                setAddressId(null);
                setStreet('');
                setCity('');
                setState('');
                setZipCode('');
            }
        }
    }, [user, isAuthenticated, navigate]);

    // Função de validação
    const validate = () => {
        let tempErrors = {};
        let isValid = true;

        if (!name) {
            tempErrors.name = 'Name is required.';
            isValid = false;
        }

        if (!email) {
            tempErrors.email = 'Email is required.';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            tempErrors.email = 'Email is not valid.';
            isValid = false;
        }

        if (phone && !/^\d{10,15}$/.test(phone)) { // Exemplo: 10 a 15 dígitos
            tempErrors.phone = 'Phone number is not valid (10-15 digits expected).';
            isValid = false;
        }

        if (password && password.length < 6) {
            tempErrors.password = 'Password must be at least 6 characters long.';
            isValid = false;
        }

        if (password && password !== confirmPassword) {
            tempErrors.confirmPassword = 'Passwords do not match.';
            isValid = false;
        }

        // Validação de endereço (opcional, só se houver dados preenchidos)
        if (zipCode && !/^\d{5}(-\d{4})?$/.test(zipCode) && !/^\d{8}$/.test(zipCode)) { // Exemplo: valida CEP americano ou brasileiro (apenas dígitos)
            tempErrors.zipCode = 'ZIP/Postal Code is not valid.';
            isValid = false;
        }
        if (street && street.length < 3) {
            tempErrors.street = 'Street is too short.';
            isValid = false;
        }
        if (city && city.length < 3) {
            tempErrors.city = 'City is too short.';
            isValid = false;
        }
        if (state && state.length < 2) {
            tempErrors.state = 'State/Province is too short.';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSnackbarOpen(false); // Fechar qualquer snackbar anterior

        if (!validate()) {
            setSnackbarMessage('Please correct the errors in the form.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        setLoading(true);

        try {
            const profileUpdateData = {
                name,
                email,
                phone,
            };
            if (password) {
                profileUpdateData.password = password;
            }

            // 1. Chamar updateUserProfile do useAuth para atualizar dados gerais
            const resultGeneral = await updateUserProfile(profileUpdateData);

            if (!resultGeneral.success) {
                throw new Error(resultGeneral.message || 'Failed to update general profile information.');
            }

            // 2. Chamar addAddress do useAuth para atualizar/adicionar o endereço
            // Só tenta atualizar se os campos de endereço não estiverem vazios
            if (street || city || state || zipCode) {
                const addressUpdateData = {
                    street,
                    city,
                    state,
                    zip_code: zipCode,
                    phone: phone, // Assumindo que o telefone do perfil principal é usado para o endereço
                    ...(addressId && { id: addressId }), // Inclui 'id' se estiver atualizando um endereço existente
                };

                const resultAddress = await addAddress(addressUpdateData);

                if (!resultAddress.success) {
                    throw new Error(resultAddress.message || 'Failed to update address information.');
                }
            }

            setSnackbarMessage('Profile updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            setTimeout(() => {
                navigate('/my-account');
            }, 1500); 
            
        } catch (err) {
            console.error("Error updating profile:", err);
            const errorMessage = err.message || 'An unexpected error occurred.';
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
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

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <>
            <Header />

            <Box className="login-page-container">
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
                            onChange={(e) => {
                                setName(e.target.value);
                                setErrors(prev => ({ ...prev, name: '' })); // Limpa erro ao digitar
                            }}
                            sx={{ mb: 2 }}
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                        <TextField
                            label="Email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrors(prev => ({ ...prev, email: '' }));
                            }}
                            required
                            sx={{ mb: 2 }}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                        <TextField
                            label="Phone"
                            type="tel"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                setErrors(prev => ({ ...prev, phone: '' }));
                            }}
                            sx={{ mb: 2 }}
                            error={!!errors.phone}
                            helperText={errors.phone}
                        />

                        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}>Address</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="ZIP / Postal Code"
                                    variant="outlined"
                                    fullWidth
                                    value={zipCode}
                                    onChange={(e) => {
                                        setZipCode(e.target.value);
                                        setErrors(prev => ({ ...prev, zipCode: '' }));
                                    }}
                                    sx={{ mb: 2 }}
                                    error={!!errors.zipCode}
                                    helperText={errors.zipCode}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Street"
                                    variant="outlined"
                                    fullWidth
                                    value={street}
                                    onChange={(e) => {
                                        setStreet(e.target.value);
                                        setErrors(prev => ({ ...prev, street: '' }));
                                    }}
                                    sx={{ mb: 2 }}
                                    error={!!errors.street}
                                    helperText={errors.street}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="City"
                                    variant="outlined"
                                    fullWidth
                                    value={city}
                                    onChange={(e) => {
                                        setCity(e.target.value);
                                        setErrors(prev => ({ ...prev, city: '' }));
                                    }}
                                    sx={{ mb: 2 }}
                                    error={!!errors.city}
                                    helperText={errors.city}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="State/Province"
                                    variant="outlined"
                                    fullWidth
                                    value={state}
                                    onChange={(e) => {
                                        setState(e.target.value);
                                        setErrors(prev => ({ ...prev, state: '' }));
                                    }}
                                    sx={{ mb: 2 }}
                                    error={!!errors.state}
                                    helperText={errors.state}
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
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setErrors(prev => ({ ...prev, password: '', confirmPassword: '' }));
                            }}
                            sx={{ mb: 2 }}
                            error={!!errors.password}
                            helperText={errors.password}
                        />
                        <TextField
                            label="Confirm New Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setErrors(prev => ({ ...prev, confirmPassword: '' }));
                            }}
                            sx={{ mb: 3 }}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                        />

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

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

export default EditProfile;