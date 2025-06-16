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

import { useAuth } from '../hooks/useAuth'; // Importa useAuth para usar updateUserProfile e addAddress

function EditProfile() {
    // Importa updateUserProfile e addAddress do useAuth
    const { user, isAuthenticated, navigate, updateUserProfile, addAddress } = useAuth(); 

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    
    // Estados para o endereço do formulário, que representará o endereço padrão (ou o primeiro)
    const [addressId, setAddressId] = useState(null); // Para guardar o ID do endereço que está sendo editado
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Preenche os campos do formulário com os dados atuais do usuário ao carregar ou quando 'user' muda
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/Login');
            return;
        }
        if (user) { // user é a dependência, então este efeito re-executa quando o 'user' no contexto muda
            setName(user.name || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
            
            // Encontrar o endereço padrão ou o primeiro endereço no array
            const defaultAddress = user.addresses?.find(addr => addr.isDefault) || user.addresses?.[0];

            if (defaultAddress) {
                setAddressId(defaultAddress.id); // Guardar o ID do endereço para futuras atualizações
                setStreet(defaultAddress.street || '');
                setCity(defaultAddress.city || '');
                setState(defaultAddress.state || '');
                setZipCode(defaultAddress.zip_code || '');
            } else {
                // Se não há endereços, garanta que os campos de endereço estejam vazios
                setAddressId(null);
                setStreet('');
                setCity('');
                setState('');
                setZipCode('');
            }
        }
    }, [user, isAuthenticated, navigate]); // user é uma dependência essencial aqui

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
            const profileUpdateData = { // Dados para a atualização geral do perfil (nome, email, phone, password)
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
                setError(resultGeneral.message || 'Falha ao atualizar informações gerais do perfil.');
                setLoading(false);
                return;
            }

            // 2. Chamar addAddress do useAuth para atualizar/adicionar o endereço
            // Esta lógica assume que 'addAddress' no useAuth (e seu backend) lida com adição OU atualização
            if (street || city || state || zipCode) { // Só tenta atualizar se os campos de endereço não estiverem vazios
                 const addressUpdateData = {
                    street,
                    city,
                    state,
                    zip_code: zipCode,
                    phone: phone, // Assume que o telefone do perfil principal é usado para o endereço também
                    ...(addressId && { id: addressId }), // Inclui 'id' se estiver atualizando um endereço existente
                 };

                 const resultAddress = await addAddress(addressUpdateData); 

                 if (!resultAddress.success) {
                    setError(resultAddress.message || 'Falha ao atualizar informações de endereço.');
                    setLoading(false);
                    return;
                 }
            }
            
            // Neste ponto, o estado 'user' no useAuth JÁ foi atualizado
            // pelas chamadas a 'updateUserProfile' e 'addAddress' (via 'updateUserContext').
            // Então, não é necessária uma nova requisição para obter os dados.

            setSuccessMessage('Perfil atualizado com sucesso!');
            alert('Perfil atualizado com sucesso!'); // Alerta de sucesso
            navigate('/my-account'); // Redireciona para My Account, que exibirá os dados atualizados
        } catch (err) {
            console.error("Erro ao atualizar perfil:", err);
            setError('Erro do servidor: Não foi possível atualizar o perfil.');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Redirecionando para login...</Typography>
            </Box>
        );
    }

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

                        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}>Address</Typography>
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