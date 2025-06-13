// frontend/src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Grid,
    RadioGroup, FormControlLabel, Radio, IconButton,
    Breadcrumbs
} from '@mui/material';
import MuiLink from '@mui/material/Link';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// Ícones
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// Importe os hooks de carrinho e autenticação
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth'; // Para obter o token de autenticação

import Header from '../components/Header';
import Footer from '../components/Footer';

import '../css/main.css';
import '../css/checkout.css';

function Checkout() {
    const { cartItems, getCartSubtotal, setCartItems } = useCart();
    const { isAuthenticated, user, token } = useAuth(); // <--- Obtenha o user e o token
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // --- Estados para Endereços e Pagamento Simulados (para o Checkout) ---
    // Em um sistema real, você buscaria os endereços/cartões do usuário do backend
    const [selectedAddress, setSelectedAddress] = useState('addr1');
    const [addresses, setAddresses] = useState([
        { id: 'addr1', fullAddress: 'Rua Principal, 123, Bairro Central, Cidade, SP, 12345-678', street: 'Rua Principal', city: 'Cidade', state: 'SP', zip_code: '12345-678' }, // Adicionado detalhes para o Order Model
        { id: 'addr2', fullAddress: 'Avenida Secundária, 456, Bairro Longe, Cidade, SP, 98765-432', street: 'Avenida Secundária', city: 'Cidade', state: 'SP', zip_code: '98765-432' },
    ]);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [selectedCard, setSelectedCard] = useState('card1');
    const [cards, setCards] = useState([
        { id: 'card1', display: 'Mastercard XXXX-XXXX-XXXX-1234' },
        { id: 'card2', display: 'Visa XXXX-XXXX-XXXX-5678' },
    ]);
    // Estados para os campos do formulário de entrega (se for adicionar novo endereço)
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    // Estados para os campos do formulário de pagamento (se for adicionar novo cartão)
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');


    const subtotal = getCartSubtotal();
    const shippingCost = subtotal > 0 ? 15.00 : 0;
    const total = subtotal + shippingCost;

    useEffect(() => {
        if (!isAuthenticated) {
            alert('You need to be logged in to access checkout.');
            navigate('/Login');
            return;
        }
        if (cartItems.length === 0) {
            alert('Your cart is empty! Please add products before checking out.');
            navigate('/Cart');
            return;
        }
    }, [cartItems, navigate, isAuthenticated]);


    const validateForm = () => {
        let errors = {};
        if (addresses.length === 0 && !firstName) errors.firstName = 'First Name is required';
        if (addresses.length > 0 && !selectedAddress) errors.addressSelection = 'Please select a delivery address.';

        if (paymentMethod === 'credit_card') {
            if (cards.length === 0 && !cardName) errors.cardName = 'Name on card is required';
            if (cards.length > 0 && !selectedCard) errors.cardSelection = 'Please select a card.';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('Please fill in all required fields correctly.');
            return;
        }

        setLoading(true);

        try {
            if (subtotal === 0) {
                 alert('Your cart is empty. Please add products before finalizing the order.');
                 navigate('/');
                 return;
            }

            // --- LÓGICA DE DIMINUIÇÃO DE ESTOQUE NO BACKEND ---
            const stockUpdatePromises = cartItems.map(async (item) => {
                const newStockQuantity = (item.stock_quantity || 0) - item.quantity;
                const newSoldQuantity = (item.sold_quantity || 0) + item.quantity;

                const response = await fetch(`http://localhost:5000/api/products/${item.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Envia o token para proteger a rota PUT de produto
                    },
                    body: JSON.stringify({
                        stock_quantity: newStockQuantity,
                        sold_quantity: newSoldQuantity
                    })
                });
                if (!response.ok) {
                    throw new Error(`Failed to update stock for product ${item.name}. Status: ${response.status}`);
                }
                return response.json();
            });

            await Promise.all(stockUpdatePromises); // Espera todas as atualizações de estoque

            // --- LÓGICA DE CRIAÇÃO DO PEDIDO NO BACKEND ---
            // Prepara os dados do pedido
            const orderItems = cartItems.map(item => ({
                product_id: item.id,
                name: item.name,
                image: item.images && item.images.length > 0 ? item.images[0] : '', // Primeira imagem do produto
                quantity: item.quantity,
                unit_price: item.price,
            }));

            // Em um app real, o selectedAddress seria o ID do endereço do usuário
            // Por enquanto, vamos usar o objeto do endereço selecionado (mockado)
            const selectedDeliveryAddress = addresses.find(addr => addr.id === selectedAddress);

            const orderResponse = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Envia o token do usuário logado
                },
                body: JSON.stringify({
                    items: orderItems,
                    shipping_address: selectedDeliveryAddress, // Objeto de endereço
                    payment_method: paymentMethod,
                    total_amount: total,
                })
            });

            if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                throw new Error(errorData.message || `Failed to create order. Status: ${orderResponse.status}`);
            }

            const orderData = await orderResponse.json();
            console.log('Order created successfully:', orderData);


            console.log('Order finalized:', {
                items: cartItems,
                subtotal: subtotal,
                shipping: shippingCost,
                total: total,
                selectedAddress: selectedDeliveryAddress,
                paymentMethod: paymentMethod,
            });
            alert('Order placed successfully! You will receive a confirmation email shortly.');
            setCartItems([]); // Limpa o carrinho após o pedido
            navigate('/my-account'); // Redireciona para a página da conta para ver o histórico
        } catch (error) {
            console.error("Error placing order:", error);
            alert(`An error occurred while placing your order: ${error.message}. Please try again.`);
        } finally {
            setLoading(false);
        }
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
                    {/* Seção de Informações de Entrega e Pagamento (Esquerda) */}
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
                                        {item.name} (x{item.quantity}) {/* Usar item.name */}
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