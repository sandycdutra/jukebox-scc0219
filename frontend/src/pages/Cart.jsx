// frontend/src/pages/Cart.jsx
import React from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Grid,
    RadioGroup, FormControlLabel, Radio, IconButton,
    Breadcrumbs
} from '@mui/material';
import MuiLink from '@mui/material/Link';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// Ícones para + e -
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// Importe os hooks de carrinho e autenticação
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

import Header from '../components/Header';
import Footer from '../components/Footer';

import '../css/main.css';
import '../css/cart.css';

function Cart() {
    const { cartItems, removeFromCart, updateQuantity, getCartSubtotal, loadingCart, errorCart } = useCart(); // <--- OBTER loadingCart e errorCart
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleRemoveItem = (productId) => {
        removeFromCart(productId);
    };

    const handleQuantityInputChange = (e, productId) => {
        const value = parseInt(e.target.value, 10);
        if (isNaN(value) || value < 1) {
            updateQuantity(productId, 1);
        } else {
            updateQuantity(productId, value);
        }
    };

    const handleIncreaseQuantity = (productId, currentQuantity, productStock) => {
        const maxAllowed = Math.min(productStock, 10); // Limite visual de 10 ou estoque
        if (currentQuantity < maxAllowed) {
            updateQuantity(productId, currentQuantity + 1);
        } else if (currentQuantity >= maxAllowed) {
            alert(`You cannot add more than ${maxAllowed} units for this item.`);
        }
    };

    const handleDecreaseQuantity = (productId, currentQuantity) => {
        if (currentQuantity > 1) {
            updateQuantity(productId, currentQuantity - 1);
        }
    };

    const handleBuyCart = () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty! Add products before purchasing.');
            return;
        }

        if (!isAuthenticated) {
            alert('Please log in or register to continue with your purchase.');
            navigate('/Login');
            return;
        }

        navigate('/Checkout');
    };

    // <--- ADICIONAR CONDICIONAIS DE CARREGAMENTO E ERRO AQUI
    if (loadingCart) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Loading cart...</Typography>
            </Box>
        );
    }
    if (errorCart) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                <Typography color="error" variant="h6">{errorCart}</Typography>
                <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>Retry</Button>
            </Box>
        );
    }


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
                            Your shopping cart is empty.
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: '#2009EA', '&:hover': { backgroundColor: '#1a07bb' } }}
                            onClick={() => navigate('/')}
                        >
                            Go to products
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
                                    {/* <--- AQUI: Usa item.image para a imagem */}
                                    <img
                                        src={item.image || 'https://placehold.co/100x100/cccccc/333333?text=No+Image'}
                                        alt={item.name}
                                        className="cart-item-image"
                                    />
                                    <Box className="cart-item-text-info">
                                        <Typography variant="caption" className="cart-item-type">{item.type.toUpperCase()}</Typography>
                                        <Typography variant="h6" className="cart-item-title">{item.name}</Typography>
                                        <Typography variant="body2" className="cart-item-artist">{item.metadata?.artist}</Typography>
                                        <MuiLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleRemoveItem(item.id);
                                            }}
                                            className="cart-remove-link"
                                            sx={{ fontWeight: 'bold', color: '#2009EA' }}
                                        >
                                            Remove Item
                                        </MuiLink>
                                    </Box>
                                </Box>

                                {/* CONTROLE DE QUANTIDADE: BOTÕES + e - */}
                                <Box className="cart-item-quantity">
                                    <Box className="quantity-control">
                                        <IconButton
                                            onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                                            disabled={item.quantity <= 1}
                                            size="small"
                                            sx={{
                                                border: '1px solid #2009EA',
                                                borderRadius: '4px',
                                                backgroundColor: '#2009EA',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#1a07bb',
                                                    borderColor: '#1a07bb'
                                                }
                                            }}
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                        <TextField
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityInputChange(e, item.id)}
                                            inputProps={{
                                                min: 1,
                                                max: Math.min(item.stock_quantity || 10, 10), // <--- Usa item.stock_quantity
                                                style: { textAlign: 'center' }
                                            }}
                                            sx={{ width: '60px', mx: 1 }}
                                            size="small"
                                            disabled={item.stock_quantity === 0} // <--- Desabilita se estoque for 0
                                        />
                                        <IconButton
                                            onClick={() => handleIncreaseQuantity(item.id, item.quantity, item.stock_quantity)} // <--- Usa item.stock_quantity
                                            disabled={item.quantity >= (item.stock_quantity || 10) || item.quantity >= 10 || item.stock_quantity === 0} // <--- Desabilita se estoque ou limite de 10
                                            size="small"
                                            sx={{
                                                border: '1px solid #2009EA',
                                                borderRadius: '4px',
                                                backgroundColor: '#2009EA',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#1a07bb',
                                                    borderColor: '#1a07bb'
                                                }
                                            }}
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    </Box>
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