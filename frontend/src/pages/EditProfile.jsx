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

import { useAuth } from '../hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';
function EditProfile() {
    // AQUI: Pegue o 'user' mais recente do useAuth
    const { user, isAuthenticated, updateUserProfile, addAddress } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [addressId, setAddressId] = useState(null);
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const [errors, setErrors] = useState({});

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

        if (zipCode && !/^\d{5}(-\d{4})?$/.test(zipCode) && !/^\d{8}$/.test(zipCode)) {
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
        setSnackbarOpen(false);

        if (!validate()) {
            setSnackbarMessage('Please correct the errors in the form.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        setLoading(true);

        try {
            // Crie um objeto com os dados básicos do perfil (que estão nos TextFields)
            const updatedProfileData = {
                name: name,
                email: email,
                phone: phone,
                ...(password && { password: password }),
            };

            // Combine com os dados ATUAIS do usuário para garantir que nada seja perdido
            // Ex: favorite_products, role, etc.
            // É CRUCIAL que user seja o MAIS RECENTE possível aqui.
            // Para garantir isso, a gente vai pegar o user que já está no estado do useAuth
            // OU, se você tiver certeza que o backend retorna TUDO na primeira chamada
            // de `updateUserProfile`, você poderia fazer uma única chamada.

            // VAMOS ASSUMIR que `user` (do useAuth) já está atualizado ou que o backend vai lidar com o merge
            // Corrigindo a lógica do endereço
            let finalAddresses = user.addresses ? [...user.addresses] : []; // Começa com uma cópia dos endereços atuais

            // Se algum campo de endereço foi preenchido, prepare o objeto do endereço
            if (street || city || state || zipCode) {
                const addressToSave = {
                    street,
                    city,
                    state,
                    zip_code: zipCode,
                    // É comum ter um telefone específico para o endereço de entrega,
                    // mas se for sempre o mesmo do usuário, pode simplificar ou remover.
                    phone: phone, // Usando o telefone do perfil principal para o endereço
                };

                if (addressId) {
                    // ATUALIZAR endereço existente e garantir que seja o padrão
                    finalAddresses = finalAddresses.map(addr => ({
                        ...addr,
                        ...(addr.id === addressId ? { ...addressToSave, isDefault: true } : { isDefault: false }) // Este se torna padrão, outros não
                    }));
                } else {
                    // ADICIONAR novo endereço e torná-lo o único padrão
                    finalAddresses = finalAddresses.map(addr => ({ ...addr, isDefault: false })); // Desmarca todos
                    const newAddressWithId = { ...addressToSave, id: uuidv4(), isDefault: true }; // Adiciona o novo como padrão
                    finalAddresses.push(newAddressWithId);
                }

            }

            // Combine todos os dados para o objeto FINAL que será enviado ao backend
            const fullUpdatedUserData = {
                ...user, // Começa com o user atual do useAuth (que já tem _id, role, favs, etc.)
                ...updatedProfileData, // Sobrescreve name, email, phone, password
                addresses: finalAddresses, // Adiciona/atualiza o array de endereços
            };

            // CHAME updateUserProfile APENAS UMA VEZ COM TODOS OS DADOS CONSOLIDADOS
            const result = await updateUserProfile(fullUpdatedUserData);

            if (!result.success) {
                throw new Error(result.message || 'Failed to update profile information.');
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
                        {/* ... (Your TextFields for name, email, phone, password) ... */}
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