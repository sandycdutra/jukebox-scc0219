// frontend/src/pages/Cart.jsx
import React from 'react';
import { Box, Typography, Button, Select, MenuItem, Breadcrumbs } from '@mui/material';
import MuiLink from '@mui/material/Link'; // Importe Link do MUI
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// Importe os hooks de carrinho e autenticação
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth'; // <--- IMPORTE O HOOK DE AUTENTICAÇÃO

import Header from '../components/Header';
import Footer from '../components/Footer';

import '../css/main.css';
import '../css/cart.css';

function Cart() {
    const { cartItems, removeFromCart, updateQuantity, getCartSubtotal } = useCart();
    const { isAuthenticated } = useAuth(); // <--- OBTENHA O ESTADO DE AUTENTICAÇÃO
    const navigate = useNavigate();

    const handleRemoveItem = (productId) => {
        removeFromCart(productId);
    };

    const handleQuantityChange = (event, productId) => {
        updateQuantity(productId, event.target.value);
    };

    const handleBuyCart = () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty! Add products before purchasing.');
            return; // Não faz nada se o carrinho estiver vazio
        }

        if (!isAuthenticated) { // <--- VERIFICA SE O USUÁRIO ESTÁ AUTENTICADO
            alert('Please log in or register to continue with your purchase.');
            navigate('/Login'); // Redireciona para a página de Login
            return; // Interrompe a função aqui
        }

        // Se o usuário estiver autenticado e o carrinho não estiver vazio, navega para o Checkout
        navigate('/Checkout');
    };

    return (
        <>
            <Header />

            <Box className="cart-page-container">
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4, mt: 2 }}>
                    <MuiLink underline="hover" color="inherit" component={RouterLink} to="/">
                        Home
                    </MuiLink>
                    <Typography color="text.primary">Shopping Cart</Typography>
                </Breadcrumbs>

                <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
                    Shopping Cart
                </Typography>

                {cartItems.length === 0 ? (
                    <Box sx={{ textAlign: 'center', mt: 8 }}>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                            Seu carrinho está vazio.
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: '#2009EA', '&:hover': { backgroundColor: '#1a07bb' } }}
                            onClick={() => navigate('/')}
                        >
                            Explorar Produtos
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        {/* Cabeçalhos da tabela do carrinho */}
                        <Box className="cart-header-row">
                            <Typography variant="subtitle1" className="cart-header-product" sx={{ fontWeight: 'bold' }}>Product</Typography>
                            <Typography variant="subtitle1" className="cart-header-quantity" sx={{ fontWeight: 'bold' }}>Quantity</Typography>
                            <Typography variant="subtitle1" className="cart-header-unitary-price" sx={{ fontWeight: 'bold' }}>Unitary Price</Typography>
                            <Typography variant="subtitle1" className="cart-header-total-price" sx={{ fontWeight: 'bold' }}>Total price</Typography>
                        </Box>
                        <hr className="cart-header-separator" />

                        {/* Itens do carrinho */}
                        {cartItems.map((item) => (
                            <Box key={item.id} className="cart-item-row">
                                <Box className="cart-item-product-info">
                                    <img src={item.image} alt={item.title} className="cart-item-image" />
                                    <Box className="cart-item-text-info">
                                        <Typography variant="caption" className="cart-item-type">{item.type.toUpperCase()}</Typography>
                                        <Typography variant="h6" className="cart-item-title">{item.title}</Typography>
                                        <Typography variant="body2" className="cart-item-artist">{item.artist}</Typography>
                                        <MuiLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleRemoveItem(item.id);
                                            }}
                                            className="cart-remove-link"
                                            sx={{ fontWeight: 'bold' }}
                                        >
                                            Remove Item
                                        </MuiLink>
                                    </Box>
                                </Box>

                                <Box className="cart-item-quantity">
                                    <Select
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(e, item.id)}
                                        sx={{ minWidth: 80, borderRadius: '8px' }}
                                        inputProps={{ 'aria-label': `Quantidade de ${item.title}` }}
                                    >
                                        {[...Array(10)].map((_, i) => (
                                            <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                                        ))}
                                    </Select>
                                </Box>

                                <Typography variant="body1" className="cart-item-unitary-price" sx={{ fontWeight: 'bold' }}>
                                    ${item.price.toFixed(2)}
                                </Typography>

                                <Typography variant="body1" className="cart-item-total-price" sx={{ color: '#2009EA', fontWeight: 'bold' }}>
                                    ${(item.price * item.quantity).toFixed(2)}
                                </Typography>
                            </Box>
                        ))}
                        <hr className="cart-summary-separator" />

                        {/* Subtotal e botão de compra */}
                        <Box className="cart-summary">
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Subtotal: <span style={{ color: '#2009EA' }}>${getCartSubtotal().toFixed(2)}</span>
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={handleBuyCart}
                                className="buy-cart-button"
                                sx={{
                                    backgroundColor: '#2009EA',
                                    color: '#fff',
                                    '&:hover': { backgroundColor: '#1a07bb' },
                                    borderRadius: '8px',
                                    padding: '12px 0',
                                    textTransform: 'uppercase',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                }}
                                disabled={cartItems.length === 0}
                            >
                                BUY SHOPPING CART
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>

            <Footer />
        </>
    );
}

export default Cart;