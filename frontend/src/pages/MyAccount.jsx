// frontend/src/pages/MyAccount.jsx
import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Breadcrumbs, Grid, CircularProgress, Collapse, // Componentes MUI existentes
    IconButton 
} from '@mui/material';
import MuiLink from '@mui/material/Link';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person'; 
import EmailIcon from '@mui/icons-material/Email'; 
import PhoneIcon from '@mui/icons-material/Phone'; 
import LocationOnIcon from '@mui/icons-material/LocationOn'; 
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'; 
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; 
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'; 


import Header from '../components/Header';
import Footer from '../components/Footer';

import { useAuth } from '../hooks/useAuth'; 
import mockOrders from '../mockdata/orders'; 
import allProducts from '../mockdata/products';

import '../css/main.css';
import '../css/myaccount.css'; // 

function MyAccount() {
    const { user, isAuthenticated, logout } = useAuth(); 
    const navigate = useNavigate();

    const [loadingOrders, setLoadingOrders] = useState(true);
    const [userOrders, setUserOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null); 

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/Login'); // Redireciona para login se não estiver autenticado
            return;
        }

        // Simula busca de pedidos do usuário (tipo um fettch)
        setLoadingOrders(true);
        const fetchedOrders = mockOrders.filter(order => order.user_id === user.id);
        setTimeout(() => {
            setUserOrders(fetchedOrders);
            setLoadingOrders(false);
        }, 800);
    }, [isAuthenticated, user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/'); // Redireciona para a home após o logout
    };

    const handleToggleOrderDetails = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    if (loadingOrders || !isAuthenticated) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Loading account...</Typography>
            </Box>
        );
    }

    // Formata o CEP para exibição
    const formatCep = (cepObj) => {
        if (!cepObj) return 'N/A';
        return `${cepObj.street}, ${cepObj.city} - ${cepObj.state}, ${cepObj.zip_code}`;
    };

    // Formata a data
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    return (
        <>
            <Header />

            <Box className="my-account-page-container">
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4, mt: 2 }}>
                    <MuiLink underline="hover" color="inherit" component={RouterLink} to="/">Home</MuiLink>
                    <Typography color="text.primary">My Account</Typography>
                </Breadcrumbs>

                <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
                    My Account
                </Typography>

                <Grid container spacing={4} className="my-account-grid">
                    <Grid item xs={12} md={6}>
                        <Box className="my-information-box">
                            <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                                My information
                            </Typography>
                            <Box className="info-item">
                                <PersonIcon sx={{ mr: 1 }} />
                                <Typography variant="body1">{user.name}</Typography>
                            </Box>
                            <Box className="info-item">
                                <EmailIcon sx={{ mr: 1 }} />
                                <Typography variant="body1">{user.email}</Typography>
                            </Box>
                            <Box className="info-item">
                                <PhoneIcon sx={{ mr: 1 }} />
                                <Typography variant="body1">{user.phone}</Typography>
                            </Box>
                            <Box className="info-item">
                                <LocationOnIcon sx={{ mr: 1 }} />
                                <Typography variant="body1">{formatCep(user.cep)}</Typography>
                            </Box>
                            <Button
                                variant="outlined"
                                onClick={() => alert('Profile editing functionality not implemented.')}
                                sx={{ mt: 3, color: '#2009EA', borderColor: '#2009EA', '&:hover': { borderColor: '#1a07bb' } }}
                            >
                                Edit Profile
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleLogout}
                                sx={{ mt: 2, ml: 2, backgroundColor: '#dc3545', '&:hover': { backgroundColor: '#c82333' } }}
                            >
                                Logout
                            </Button>
                        </Box>
                    </Grid>

                    {/* Meus Pedidos */}
                    <Grid item xs={12} md={6}>
                        <Box className="my-orders-box">
                            <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                                My orders
                            </Typography>
                            {userOrders.length === 0 ? (
                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                    You have no orders yet.
                                </Typography>
                            ) : (
                                userOrders.map(order => (
                                    <Box key={order.id} className="order-item-card">
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleToggleOrderDetails(order.id)}>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Date: {formatDate(order.created_at)}</Typography>
                                                <Typography variant="body2">Total: ${order.total_amount.toFixed(2)}</Typography>
                                                <Typography variant="body2" sx={{ color: order.payment_status === 'completed' ? 'green' : 'red' }}>Status: {order.payment_status.toUpperCase()}</Typography>
                                            </Box>
                                            <IconButton>
                                                {expandedOrderId === order.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                            </IconButton>
                                        </Box>
                                        <Collapse in={expandedOrderId === order.id} timeout="auto" unmountOnExit>
                                            <Box sx={{ mt: 2, borderTop: '1px solid #eee', pt: 2 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Delivery Address:</Typography>
                                                <Typography variant="body2">{order.delivery_address}</Typography>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>Items:</Typography>
                                                {order.items.map(item => (
                                                    <Box key={item.product_id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                        <Typography variant="body2">{item.title} (x{item.quantity})</Typography>
                                                        <Typography variant="body2">${item.unit_price.toFixed(2)}</Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Collapse>
                                    </Box>
                                ))
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Footer />
        </>
    );
}

export default MyAccount;