// frontend/src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import {
    Box, Typography, TextField, Button, CircularProgress, Grid,
    RadioGroup, FormControlLabel, Radio, IconButton, // Adicionados para rádio buttons e ícones
    Breadcrumbs // Importado corretamente
} from '@mui/material';
import MuiLink from '@mui/material/Link';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// Ícones
import EditIcon from '@mui/icons-material/Edit'; // Ícone de editar
import DeleteIcon from '@mui/icons-material/Delete'; // Ícone de deletar
import AddIcon from '@mui/icons-material/Add'; // Ícone de adicionar

// Importe os hooks de carrinho
import { useCart } from '../hooks/useCart';

import Header from '../components/Header';
import Footer from '../components/Footer';

import '../css/main.css';
import '../css/checkout.css'; // <--- Crie este arquivo CSS para a tela de checkout

function Checkout() {
    const { cartItems, getCartSubtotal, setCartItems, updateProductStock, getStock } = useCart();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // --- Estados para Endereços e Pagamento Simulados ---
    const [selectedAddress, setSelectedAddress] = useState('addr1'); // Endereço selecionado
    const [addresses, setAddresses] = useState([ // Lista de endereços simulados
        { id: 'addr1', fullAddress: 'Rua Principal, 123, Bairro Central, Cidade, SP, 12345-678' },
        { id: 'addr2', fullAddress: 'Avenida Secundária, 456, Bairro Longe, Cidade, SP, 98765-432' },
    ]);
    const [paymentMethod, setPaymentMethod] = useState('credit_card'); // Método de pagamento selecionado
    const [selectedCard, setSelectedCard] = useState('card1'); // Cartão selecionado
    const [cards, setCards] = useState([ // Lista de cartões simulados
        { id: 'card1', display: 'Mastercard XXXX-XXXX-XXXX-1234' },
        { id: 'card2', display: 'Visa XXXX-XXXX-XXXX-5678' },
    ]);

    // Estados para os campos do formulário de entrega (ainda necessários para 'Add new address' ou se não houver endereços salvos)
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    // Estados para os campos do formulário de pagamento (ainda necessários para 'Add new card')
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');

    const subtotal = getCartSubtotal();
    const shippingCost = subtotal > 0 ? 15.00 : 0;
    const total = subtotal + shippingCost;

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/Cart');
        }
    }, [cartItems, navigate]);


    const validateForm = () => {
        let errors = {};
        // Validação agora se aplica ao "endereço selecionado" ou ao "novo endereço"
        // Para simplificar, vou manter a validação dos campos de texto (como se fosse para adicionar um novo)
        // Mas em um sistema real, você validaria o endereço/cartão selecionado ou os campos do novo.
        if (!selectedAddress && addresses.length > 0) { // Se não tem endereço selecionado e há endereços, erro
             errors.addressSelection = 'Please select a delivery address.';
        }
        if (!selectedAddress && addresses.length === 0 && !address1) { // Se não tem endereço e nenhum novo preenchido
             errors.address1 = 'Address is required';
        }
        // ... (resto das validações de entrega se estiverem preenchendo um novo) ...

        if (!selectedCard && paymentMethod === 'credit_card' && cards.length > 0) {
             errors.cardSelection = 'Please select a card.';
        }
        if (paymentMethod === 'credit_card' && !selectedCard && cards.length === 0 && !cardNumber) {
             errors.cardNumber = 'Card Number is required';
        }
        // ... (resto das validações de cartão se estiverem preenchendo um novo) ...

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('Please fill in all required fields correctly!');
            return;
        }

        setLoading(true);

        // Simulação de processamento do pedido
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (subtotal > 0) {
            // DIMINUIR O ESTOQUE SIMULADO PARA CADA ITEM DO CARRINHO
            cartItems.forEach(item => {
                const currentStockInSystem = getStock(item.id); // <--- OBTÉM O ESTOQUE ATUAL DO SISTEMA DE ESTOQUE SIMULADO
                const newStock = currentStockInSystem - item.quantity;

                // Garante que o estoque não fique negativo (embora a validação já devesse impedir isso)
                if (newStock >= 0) {
                    updateProductStock(item.id, newStock); // <--- AGORA DIMINUI CORRETAMENTE O ESTOQUE ATUAL
                } else {
                    // Isso não deveria acontecer se a validação addToCart e updateQuantity funcionarem bem
                    console.error(`Error: Attempt to set negative stock for product ${item.id}. Quantity: ${item.quantity}, Current Stock: ${currentStockInSystem}`);
                }
            });

            console.log('Order completed:', {
                items: cartItems,
                subtotal: subtotal,
                shipping: shippingCost,
                total: total,
                // ... (deliveryInfo e paymentInfo) ...
            });
            alert('Request placed successfully! You will receive a confirmation email shortly.');
            setCartItems([]); // Limpa o carrinho após o pedido
            navigate('/'); // Redireciona para a página inicial
        } else {
            alert('Your cart is empty. Please add products before checking out.');
            navigate('/');
        }
        setLoading(false);
    };

    return (
        <>
            <Header />

            <Box className="checkout-page-container">
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4, mt: 2 }}>
                    <MuiLink underline="hover" color="inherit" component={RouterLink} to="/">
                        Home
                    </MuiLink>
                    <MuiLink underline="hover" color="inherit" component={RouterLink} to="/Cart">
                        Shopping Cart
                    </MuiLink>
                    <Typography color="text.primary">Checkout</Typography>
                </Breadcrumbs>

                <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
                    Checkout
                </Typography>

                <Grid container spacing={4} className="checkout-grid">
                    {/* Seção Esquerda: Endereço e Pagamento */}
                    <Grid item xs={12} md={8} className="checkout-form-section">
                        {/* --- Seção Select an Address --- */}
                        <Box className="checkout-section-box">
                            <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Select an address
                            </Typography>
                            <RadioGroup
                                aria-label="address"
                                name="address-selection"
                                value={selectedAddress}
                                onChange={(e) => setSelectedAddress(e.target.value)}
                                sx={{ mb: 2 }}
                            >
                                {addresses.map((addr) => (
                                    <Box key={addr.id} className="address-item-row">
                                        <FormControlLabel
                                            value={addr.id}
                                            control={<Radio />}
                                            label={<Typography variant="body1" className="address-text">{addr.fullAddress}</Typography>}
                                        />
                                        <Box className="address-actions">
                                            <IconButton size="small" aria-label="edit address">
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" aria-label="delete address">
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                ))}
                            </RadioGroup>
                            <MuiLink href="#" onClick={(e) => e.preventDefault()}
                                sx={{ display: 'flex', alignItems: 'center', color: '#2009EA', fontWeight: 'bold' }}>
                                <AddIcon sx={{ mr: 0.5 }} /> Add new address
                            </MuiLink>
                            <hr className="section-separator" />
                        </Box>

                        {/* --- Seção Payment --- */}
                        <Box className="checkout-section-box">
                            <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Payment
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                                All transactions are secure and encrypted.
                            </Typography>

                            <RadioGroup
                                aria-label="payment-method"
                                name="payment-method-selection"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                sx={{ mb: 2 }}
                            >
                                <FormControlLabel value="pix" control={<Radio />} label="PIX" />
                                <FormControlLabel value="credit_card" control={<Radio />} label="Credit/Debit card" />
                            </RadioGroup>

                            {paymentMethod === 'credit_card' && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Select the card:</Typography>
                                    <RadioGroup
                                        aria-label="card-selection"
                                        name="card-selection"
                                        value={selectedCard}
                                        onChange={(e) => setSelectedCard(e.target.value)}
                                        sx={{ mb: 2 }}
                                    >
                                        {cards.map((card) => (
                                            <Box key={card.id} className="card-item-row">
                                                <FormControlLabel
                                                    value={card.id}
                                                    control={<Radio />}
                                                    label={<Typography variant="body1" className="card-text">{card.display}</Typography>}
                                                />
                                                <IconButton size="small" aria-label="delete card">
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        ))}
                                    </RadioGroup>
                                    <MuiLink href="#" onClick={(e) => e.preventDefault()}
                                        sx={{ display: 'flex', alignItems: 'center', color: '#2009EA', fontWeight: 'bold' }}>
                                        <AddIcon sx={{ mr: 0.5 }} /> Add new card
                                    </MuiLink>
                                </Box>
                            )}
                            <hr className="section-separator" />
                        </Box>
                    </Grid>

                    {/* Seção de Resumo do Pedido (Direita) */}
                    <Grid item xs={12} md={4} className="checkout-summary-section">
                        <Box className="order-summary-box">
                            <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Purchase resume
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body1">Shipping</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    Fixed price
                                </Typography>
                            </Box>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'right', color: '#2009EA' }}>
                                ${shippingCost.toFixed(2)}
                            </Typography>
                            <hr className="summary-separator" />
                            {cartItems.map((item) => (
                                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                        {item.title} (x{item.quantity})
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </Typography>
                                </Box>
                            ))}
                            <hr className="summary-separator" />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                <Typography variant="body1">Subtotal:</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    ${subtotal.toFixed(2)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <Typography variant="body1">Shipping:</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    ${shippingCost.toFixed(2)}
                                </Typography>
                            </Box>
                            <hr className="summary-separator" />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 3 }}>
                                <Typography variant="h6">Total:</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2009EA' }}>
                                    ${total.toFixed(2)}
                                </Typography>
                            </Box>

                            <Button
                                variant="contained"
                                onClick={handlePlaceOrder}
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
                                }}
                                disabled={loading || cartItems.length === 0}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Finish purchase'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Footer />
        </>
    );
}

export default Checkout;