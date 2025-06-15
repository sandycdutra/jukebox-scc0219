// frontend/src/pages/MyAccount.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Breadcrumbs, Grid, CircularProgress, Collapse, IconButton } from '@mui/material';
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
import { useCart } from '../hooks/useCart';


import '../css/main.css';
import '../css/myaccount.css';

function MyAccount() {
    const { user, isAuthenticated, token, logout } = useAuth();
    const { clearCart } = useCart();
    const navigate = useNavigate();

    const [loadingOrders, setLoadingOrders] = useState(true);
    const [userOrders, setUserOrders] = useState([]);
    const [errorOrders, setErrorOrders] = useState(null);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    const formatAddress = (addressObj) => {
        if (!addressObj) return 'N/A';
        return `${addressObj.street || 'N/A'}, ${addressObj.city || 'N/A'} - ${addressObj.state || 'N/A'}, ${addressObj.zip_code || 'N/A'}`;
    };

    const formatDate = (dateString) => {
        try {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(dateString).toLocaleDateString('pt-BR', options);
        } catch (e) {
            return dateString;
        }
    };


    useEffect(() => {
        const fetchUserOrders = async () => {
            if (!isAuthenticated || !token || !user?._id) {
                navigate('/Login');
                return;
            }

            setLoadingOrders(true);
            setErrorOrders(null);
            try {
                const response = await fetch(`http://localhost:5000/api/orders/myorders`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        logout();
                        alert("Your session has expired. Please log in again.");
                        navigate('/Login');
                    }
                    const errorData = await response.json().catch(() => ({ message: 'Unknown error (JSON parse failed)' }));
                    throw new Error(errorData.message || `Failed to fetch orders. Status: ${response.status}`);
                }
                const data = await response.json();
                setUserOrders(data);
            } catch (error) {
                console.error("Error fetching user orders:", error);
                setErrorOrders('Failed to load your orders: ' + error.message);
                setUserOrders([]);
            } finally {
                setLoadingOrders(false);
            }
        };

        fetchUserOrders();
    }, [isAuthenticated, token, user, navigate, logout]);

    const handleLogout = async () => {
        await logout();
        await clearCart();
        navigate('/');
    };

    const handleToggleOrderDetails = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    if (loadingOrders || !isAuthenticated) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Loading account details...</Typography>
            </Box>
        );
    }
    if (errorOrders) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                <Typography color="error" variant="h6">{errorOrders}</Typography>
                <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>Retry</Button>
            </Box>
        );
    }


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
                    {/* Minhas Informações */}
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
                                <Typography variant="body1">{user.phone || 'N/A'}</Typography>
                            </Box>
                            <Box className="info-item">
                                <LocationOnIcon sx={{ mr: 1 }} />
                                <Typography variant="body1">{formatAddress(user.cep)}</Typography>
                            </Box>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/edit-profile')} // <--- NAVEGA PARA A TELA DE EDIÇÃO
                                sx={{ mt: 3, color: '#2009EA', borderColor: '#2009EA', '&:hover': { borderColor: '#1a07bb' } }}
                            >
                                Edit Profile
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleLogout}
                                sx={{ mt: 3, ml: 2, backgroundColor: '#dc3545', '&:hover': { backgroundColor: '#c82333' } }}
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
                                    <Box key={order._id} className="order-item-card">
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleToggleOrderDetails(order._id)}>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Order ID: {order._id.substring(0, 8)}...</Typography>
                                                <Typography variant="body2">Total: ${order.total_amount.toFixed(2)}</Typography>
                                                <Typography variant="body2" sx={{ color: order.payment_status === 'completed' ? 'green' : 'red' }}>Status: {order.payment_status.toUpperCase()}</Typography>
                                                <Typography variant="body2" sx={{ mt: 0.5 }}>Date: {formatDate(order.createdAt)}</Typography>
                                            </Box>
                                            <IconButton>
                                                {expandedOrderId === order._id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                            </IconButton>
                                        </Box>
                                        <Collapse in={expandedOrderId === order._id} timeout="auto" unmountOnExit>
                                            <Box sx={{ mt: 2, borderTop: '1px solid #eee', pt: 2 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Delivery Address:</Typography>
                                                <Typography variant="body2">{formatAddress(order.shipping_address)}</Typography>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>Items:</Typography>
                                                {order.items.map(item => (
                                                    <Box key={item.product_id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, alignItems: 'center' }}>
                                                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                                            {item.name} (x{item.quantity})
                                                        </Typography>
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