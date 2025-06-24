// frontend/src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';

function AdminDashboard() {
    const { isAuthenticatedAdmin, isAuthenticated, token, logout, user } = useAuth();
    const navigate = useNavigate();
    const [loadingContent, setLoadingContent] = useState(true);

    useEffect(() => {
        if (!loadingContent) { // Espera o user carregar no useAuth
            if (!isAuthenticated) {
                alert('You need to be logged in to access the admin dashboard.');
                navigate('/Login');
            } else if (!isAuthenticatedAdmin) {
                alert('You do not have administrative access.');
                navigate('/');
            }
        }
    }, [isAuthenticated, isAuthenticatedAdmin, loadingContent, navigate]);

    useEffect(() => {
        if (user !== undefined && token !== undefined) {
            setLoadingContent(false);
        }
    }, [user, token]);


    if (loadingContent) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Verifying access...</Typography>
            </Box>
        );
    }

    if (!isAuthenticatedAdmin && !loadingContent) {
        return (
            <Box sx={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
                <Typography variant="h4" component="h1" color="error" sx={{ mb: 4 }}>Access Denied</Typography>
                <Typography variant="body1">You do not have administrative access to view this page.</Typography>
                <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>Go to Home</Button>
            </Box>
        );
    }
    
    return (
        <>
            <Header />
            <Box sx={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
                <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
                    Admin Dashboard
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                    Welcome, Administrator {user?.name || ''}!
                </Typography>
                <Typography variant="body1" sx={{ mb: 4 }}>
                    Here you can manage products, users, orders, and more.
                </Typography>
                
                <Button variant="contained" component={RouterLink} to="/admin/products" sx={{ mr: 2, mb: 2 }}>
                    Manage Products
                </Button>
                <Button variant="contained" component={RouterLink} to="/admin/users" sx={{ mr: 2, mb: 2 }}>
                    Manage Users
                </Button>
                <Button variant="contained" component={RouterLink} to="/admin/orders" sx={{ mr: 2, mb: 2 }}> 
                    View All Orders
                </Button>
                <Button variant="outlined" sx={{ mr: 2, mb: 2 }} onClick={() => navigate('/')}>Back to Store</Button>
            </Box>
            <Footer />
        </>
    );
}

export default AdminDashboard;