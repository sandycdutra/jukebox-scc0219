// frontend/src/pages/Cart.jsx
import React from 'react';
import { Box, Typography, Button, Select, MenuItem, Breadcrumbs, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Importe o hook de carrinho
import { useCart } from '../hooks/useCart';

// Importe Header e Footer
import Header from '../components/Header';
import Footer from '../components/Footer';

import '../css/main.css';
import '../css/cart.css'; // Mantenha este import para outros estilos de layout

function Cart() {
    const { cartItems, removeFromCart, updateQuantity, getCartSubtotal } = useCart();
    const navigate = useNavigate();

    const handleRemoveItem = (productId) => {
        removeFromCart(productId);
    };

    const handleQuantityChange = (event, productId) => {
        updateQuantity(productId, event.target.value);
    };

    const handleBuyCart = () => {
        console.log('Finalizar compra do carrinho:', cartItems);
        alert('Funcionalidade de compra não implementada! Carrinho no console.');
    };

    return (
        <>
            <Header />

            <Box className="cart-page-container">
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4, mt: 2 }}>
                    <Link underline="hover" color="inherit" href="/">
                        Home
                    </Link>
                    <Typography color="text.primary">Shopping Cart</Typography>
                </Breadcrumbs>

                <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
                    Shopping Cart
                </Typography>

                {cartItems.length === 0 ? (
                    <Box sx={{ textAlign: 'center', mt: 8 }}>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                            Your shopping cart is empty.
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: '#2009EA', '&:hover': { backgroundColor: '#1a07bb' } }}
                            onClick={() => navigate('/')}
                        >
                            GO TO PRODUCTS
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        {/* Cabeçalhos da tabela do carrinho */}
                        <Box className="cart-header-row">
                            {/* <Typography variant="subtitle1" className="cart-header-product">Product</Typography> */}
                            {/* Ajuste o Typography para usar fontWeight diretamente via sx */}
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
                                        <Link
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleRemoveItem(item.id);
                                            }}
                                            className="cart-remove-link" // Use a classe para estilos de Link
                                            sx={{ fontWeight: 'bold' }} // <--- Adicione fontWeight aqui para o link
                                        >
                                            Remove Item
                                        </Link>
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

                                {/* Adicione fontWeight via sx para os valores numéricos */}
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
                                    padding: '12px 30px',
                                    textTransform: 'uppercase',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold', // <--- Mantém aqui para o botão principal
                                    width: '100%',
                                    mt: 3
                                }}
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