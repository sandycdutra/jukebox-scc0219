// frontend/src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Grid,
    RadioGroup, FormControlLabel, Radio, IconButton, Collapse, // Adicionado Collapse
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
import { useAuth } from '../hooks/useAuth'; 

import Header from '../components/Header';
import Footer from '../components/Footer';

import '../css/main.css';
import '../css/checkout.css';

function Checkout() {
    const { cartItems, getCartSubtotal, clearCart, loadingCart, errorCart } = useCart();
    const { isAuthenticated, user, token, addAddress, deleteAddress, addPaymentMethod, deletePaymentMethod } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [purchaseCompleted, setPurchaseCompleted] = useState(false); 
    const [error, setError] = useState(''); // <-- Adicionado: Estado para mensagens de erro

    // Estados para Endereços
    const [selectedAddress, setSelectedAddress] = useState(''); // ID do endereço selecionado
    const [showNewAddressForm, setShowNewAddressForm] = useState(false); // Estado para mostrar/esconder form
    
    // ESTADOS PARA O FORMULÁRIO DE ADICIONAR NOVO ENDEREÇO
    const [newAddressStreet, setNewAddressStreet] = useState('');
    const [newAddressCity, setNewAddressCity] = useState('');
    const [newAddressState, setNewAddressState] = useState('');
    const [newAddressZipCode, setNewAddressZipCode] = useState('');
    const [newAddressPhone, setNewAddressPhone] = useState('');

    // Estados para PAGAMENTO
    const [paymentMethod, setPaymentMethod] = useState('credit_card'); // Default
    const [selectedCard, setSelectedCard] = useState(''); // ID do cartão selecionado
    const [showNewCardForm, setShowNewCardForm] = useState(false);

    // ESTADOS PARA O FORMULÁRIO DE ADICIONAR NOVO CARTÃO
    const [newCardName, setNewCardName] = useState('');
    const [newCardNumber, setNewCardNumber] = useState('');
    const [newCardExpiry, setNewCardExpiry] = useState('');
    const [newCardCvv, setNewCardCvv] = useState('');

    const subtotal = getCartSubtotal();
    const shippingCost = subtotal > 0 ? 15.00 : 0;
    const total = subtotal + shippingCost;

    console.log("[Checkout] Rendered. cartItems length:", cartItems.length, "loadingCart:", loadingCart, "errorCart:", errorCart, "purchaseCompleted:", purchaseCompleted);

    useEffect(() => {
        if (!isAuthenticated) {
            console.log("[Checkout:useEffect] Not authenticated, redirecting to Login.");
            // alert('You need to be logged in to access checkout.');
            navigate('/Login');
            return;
        }

        // <--- AQUI: Inicializa selectedAddress com base nos user.addresses
        // Se o usuário tem endereços e nenhum está selecionado, selecione o primeiro como padrão
        if (user?.addresses && user.addresses.length > 0 && !selectedAddress) {
            setSelectedAddress(user.addresses[0].id);
        }
        // Inicializa selectedCard com base nos user.payment_methods (se for cartão)
        if (user?.payment_methods && user.payment_methods.length > 0 && !selectedCard && paymentMethod === 'credit_card') {
            setSelectedCard(user.payment_methods[0].id);
        }


        if (!loadingCart && cartItems.length === 0 && !purchaseCompleted) { 
            console.log("[Checkout:useEffect] Cart is empty after loading (and no purchase completed), redirecting to Cart.");
            // alert('Your cart is empty! Please add products before checking out.');
            navigate('/Cart');
            return;
        }

    }, [cartItems, navigate, isAuthenticated, loadingCart, purchaseCompleted, user, selectedAddress, selectedCard, paymentMethod]);


    const validateForm = () => {
        let errors = {};
        const userHasAddresses = user?.addresses && user.addresses.length > 0;
        const userHasCards = user?.payment_methods && user.payment_methods.length > 0;

        // Validação de endereço
        if (showNewAddressForm) { // Se o formulário de novo endereço está visível, valida ele
            if (!newAddressStreet) errors.newAddressStreet = 'Street is required';
            if (!newAddressCity) errors.newAddressCity = 'City is required';
            if (!newAddressState) errors.newAddressState = 'State is required';
            if (!newAddressZipCode) errors.newAddressZipCode = 'ZIP Code is required';
            // Campos obrigatórios do novo endereço
            // if (!newAddressStreet || !newAddressCity || !newAddressState || !newAddressZipCode) {
            //     errors.newAddressForm = "All new address fields are required.";
            // }
        } else { // Se usando endereços salvos
            if (!userHasAddresses) { 
                errors.addressSelection = "Please add a new address or ensure your account has saved addresses.";
            } else if (!selectedAddress) {
                errors.addressSelection = "Please select a delivery address.";
            }
        }

        // Validação de pagamento
        if (paymentMethod === 'credit_card') {
            if (showNewCardForm) { // Se está adicionando novo cartão
                if (!newCardName) errors.newCardName = 'Name on Card is required';
                if (!newCardNumber || !/^\d{16}$/.test(newCardNumber)) errors.newCardNumber = 'Card Number is invalid (16 digits)';
                if (!newCardExpiry || !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(newCardExpiry)) errors.newCardExpiry = 'Expiry Date is invalid (MM/YY)';
                if (!newCardCvv || !/^\d{3,4}$/.test(newCardCvv)) errors.newCardCvv = 'CVV is invalid (3 or 4 digits)';
            } else { // Se usando cartões salvos
                if (!userHasCards) {
                    errors.cardSelection = "Please add a new card or ensure your account has saved cards.";
                } else if (!selectedCard) {
                    errors.cardSelection = "Please select a card.";
                }
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // <--- FUNÇÃO PARA ADICIONAR NOVO ENDEREÇO ---
    const handleAddAddress = async () => {
        // Validações básicas antes de chamar a API
        if (!newAddressStreet || !newAddressCity || !newAddressState || !newAddressZipCode) {
            alert('Please fill in all required address fields.');
            return;
        }
        setLoading(true);
        setError(''); // Limpa erros anteriores
        try {
            const newAddrData = {
                street: newAddressStreet,
                city: newAddressCity,
                state: newAddressState,
                zip_code: newAddressZipCode,
                phone: newAddressPhone || user?.phone || '' // Usa o telefone fornecido ou do perfil do usuário
            };
            const result = await addAddress(newAddrData); // Chama a função do useAuth para adicionar o endereço
            if (result.success) {
                alert('Address added successfully!');
                setShowNewAddressForm(false); // Esconde o formulário
                // Limpa os campos do formulário
                setNewAddressStreet('');
                setNewAddressCity('');
                setNewAddressState('');
                setNewAddressZipCode('');
                setNewAddressPhone('');
                // Opcional: seleciona o novo endereço como padrão, se for o primeiro
                if (user?.addresses.length === 0 && result.address?.id) {
                    setSelectedAddress(result.address.id);
                }
            } else {
                setError(result.message || 'Failed to add address.');
            }
        } catch (err) {
            console.error("Error adding new address:", err);
            setError('Server error adding address.');
        } finally {
            setLoading(false);
        }
    };

    // <--- FUNÇÃO PARA DELETAR ENDEREÇO ---
    const handleDeleteAddress = async (addressId) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return; 
        setLoading(true);
        setError(''); // Limpa erros anteriores
        try {
            const result = await deleteAddress(addressId); // Chama a função do useAuth
            if (result.success) {
                alert('Address deleted successfully!');
                // Se o endereço selecionado foi o deletado, limpa a seleção
                if (selectedAddress === addressId) {
                    setSelectedAddress('');
                }
            } else {
                setError(result.message || 'Failed to delete address.');
            }
        } catch (err) {
            console.error("Error deleting address:", err);
            setError('Server error deleting address.');
        } finally {
            setLoading(false);
        }
    };

    // <--- FUNÇÃO PARA ADICIONAR NOVO CARTÃO ---
    const handleAddPaymentMethod = async () => {
        // Validações básicas do formulário de cartão
        if (!newCardName || !newCardNumber || !newCardExpiry || !newCardCvv) {
            alert('Please fill in all new card details.');
            return;
        }
        if (!/^\d{16}$/.test(newCardNumber)) {
            alert('Card number must be 16 digits.');
            return;
        }
        if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(newCardExpiry)) {
            alert('Expiration date must be in MM/YY format (e.g., 12/25).');
            return;
        }
        if (!/^\d{3,4}$/.test(newCardCvv)) {
            alert('CVV must be 3 or 4 digits.');
            return;
        }

        setLoading(true);
        setError(''); // Limpa erros anteriores
        try {
            const newMethodData = {
                cardType: 'Credit/Debit', // Pode ser dinâmico no futuro
                cardNumberLast4: newCardNumber.slice(-4), // Apenas os últimos 4 dígitos
                cardName: newCardName,
                cardExpiry: newCardExpiry,
                // CVV não é armazenado no DB, mas é necessário para processamento
            };
            const result = await addPaymentMethod(newMethodData);
            if (result.success) {
                alert('Card added successfully!');
                setShowNewCardForm(false); // Esconde o formulário
                // Limpa os campos do formulário
                setNewCardName('');
                setNewCardNumber('');
                setNewCardExpiry('');
                setNewCardCvv('');
                // Opcional: seleciona o novo cartão como padrão, se for o primeiro
                if (user?.payment_methods.length === 0 && result.paymentMethod?.id) {
                    setSelectedCard(result.paymentMethod.id);
                }
            } else {
                setError(result.message || 'Failed to add card.');
            }
        } catch (err) {
            console.error("Error adding new card:", err);
            setError('Server error adding card.');
        } finally {
            setLoading(false);
        }
    };

    // <--- FUNÇÃO PARA DELETAR CARTÃO ---
    const handleDeletePaymentMethod = async (cardId) => {
        if (!window.confirm('Are you sure you want to delete this card?')) return; 
        setLoading(true);
        setError(''); // Limpa erros anteriores
        try {
            const result = await deletePaymentMethod(cardId); // Chama a função do useAuth
            if (result.success) {
                alert('Card deleted successfully!');
                // Se o cartão selecionado foi o deletado, limpa a seleção
                if (selectedCard === cardId) {
                    setSelectedCard('');
                }
            } else {
                setError(result.message || 'Failed to delete card.');
            }
        } catch (err) {
            console.error("Error deleting card:", err);
            setError('Server error deleting card.');
        } finally {
            setLoading(false);
        }
    };


    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('Please fill in all required fields correctly.');
            return;
        }

        setLoading(true);
        setError(''); // Limpa erros anteriores

        try {
            if (cartItems.length === 0) {
                alert('Your cart is empty. Please add products before finalizing the order.');
                navigate('/Cart');
                return;
            }

            // --- Gerenciamento de Endereço de Entrega ---
            let deliveryAddressForOrder = null;
            // Se o usuário não tem endereços salvos, mas preencheu o formulário de novo endereço
            if ((!user?.addresses || user.addresses.length === 0) && showNewAddressForm) {
                deliveryAddressForOrder = {
                    // id: `new-${Date.now()}`, // Gerar um ID temporário (no real, seria do DB) - O backend deve gerar o ID?
                    street: newAddressStreet,
                    city: newAddressCity,
                    state: newAddressState,
                    zip_code: newAddressZipCode,
                    phone: newAddressPhone || user?.phone || ''
                };
                // Aqui você pode chamar addAddress para salvar esse novo endereço no perfil do user antes de criar o pedido
                const addAddrResult = await addAddress(deliveryAddressForOrder);
                if (!addAddrResult.success) {
                    alert(`Failed to save new address before order: ${addAddrResult.message}`);
                    setLoading(false);
                    return;
                }
                deliveryAddressForOrder = addAddrResult.address; // Usa o endereço que foi salvo (com ID real)
            } else if (selectedAddress && user?.addresses) { // Se um endereço existente foi selecionado
                deliveryAddressForOrder = user.addresses.find(addr => addr.id === selectedAddress);
            } else { // Se não tem nenhum endereço e não preencheu o formulário (erro de validação)
                alert('No delivery address found or selected.');
                setLoading(false);
                return;
            }
            if (!deliveryAddressForOrder) { // Checagem de segurança final
                alert('Invalid delivery address selected/provided.');
                setLoading(false);
                return;
            }


            const stockUpdatePromises = cartItems.map(async (item) => {
                const newStockQuantity = (item.stock_quantity || 0) - item.quantity;
                const newSoldQuantity = (item.sold_quantity || 0) + item.quantity;

                const response = await fetch(`http://localhost:5000/api/products/${item.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
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

            await Promise.all(stockUpdatePromises);

            const orderItems = cartItems.map(item => ({
                product_id: item.id,
                name: item.name,
                image: item.image, // Acessar item.image (singular)
                artist: item.metadata?.artist || 'N/A', // Acessar item.metadata?.artist
                quantity: item.quantity,
                unit_price: item.price,
            }));

            let paymentDetailsForOrder = null;
            if (paymentMethod === 'credit_card') {
                if (showNewCardForm) {
                    paymentDetailsForOrder = {
                        cardType: 'Credit/Debit',
                        cardNumberLast4: newCardNumber.slice(-4),
                        cardName: newCardName,
                        cardExpiry: newCardExpiry,
                    };
                } else if (selectedCard && user?.payment_methods) {
                    paymentDetailsForOrder = user.payment_methods.find(card => card.id === selectedCard);
                }
                if (!paymentDetailsForOrder) {
                    alert('No payment card found or selected.');
                    setLoading(false);
                    return;
                }
            }


            const orderResponse = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: orderItems,
                    shipping_address: {
                        street: deliveryAddressForOrder.street,
                        city: deliveryAddressForOrder.city,
                        state: deliveryAddressForOrder.state,
                        zip_code: deliveryAddressForOrder.zip_code,
                        phone: deliveryAddressForOrder.phone || user.phone || ''
                    },
                    payment_method: paymentMethod,
                    payment_details: paymentDetailsForOrder, // <--- ADICIONADO AQUI
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
                selectedAddress: deliveryAddressForOrder,
                paymentMethod: paymentMethod,
                paymentDetails: paymentDetailsForOrder, // Logar também
            });
            await clearCart(); 
            setPurchaseCompleted(true);
            alert('Order placed successfully! You will receive a confirmation email shortly.');
            navigate('/my-account');

        } catch (error) {
            console.error("Error placing order:", error);
            alert(`An error occurred while placing your order: ${error.message}. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

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
                            {/* Exibir endereços existentes */}
                            {user?.addresses && user.addresses.length > 0 ? (
                                <RadioGroup
                                    aria-label="address"
                                    name="address-selection"
                                    value={selectedAddress}
                                    onChange={(e) => setSelectedAddress(e.target.value)}
                                    sx={{ mb: 2 }}
                                >
                                    {user.addresses.map((addr) => (
                                        <Box key={addr.id} className="address-item-row">
                                            <FormControlLabel
                                                value={addr.id}
                                                control={<Radio />}
                                                label={<Typography variant="body1" className="address-text">{`${addr.street}, ${addr.city} - ${addr.state}, ${addr.zip_code}`}</Typography>}
                                            />
                                            <Box className="address-actions">
                                                <IconButton size="small" aria-label="edit address">
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" aria-label="delete address" onClick={() => handleDeleteAddress(addr.id)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    ))}
                                </RadioGroup>
                            ) : (
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                    You have no saved addresses. Please add a new one.
                                </Typography>
                            )}
                            
                            {/* Botão para mostrar/esconder o formulário de novo endereço */}
                            <MuiLink href="#" onClick={(e) => { e.preventDefault(); setShowNewAddressForm(!showNewAddressForm); }}
                                sx={{ display: 'flex', alignItems: 'center', color: '#2009EA', fontWeight: 'bold' }}>
                                <AddIcon sx={{ mr: 0.5 }} /> {showNewAddressForm ? 'Cancel Add Address' : 'Add new address'}
                            </MuiLink>

                            {/* Formulário para Adicionar Novo Endereço */}
                            <Collapse in={showNewAddressForm} timeout="auto" unmountOnExit>
                                <Box sx={{ mt: 3, p: 2, border: '1px solid #eee', borderRadius: '8px' }}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>New Address Details</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label="Street" variant="outlined" fullWidth value={newAddressStreet} onChange={(e) => setNewAddressStreet(e.target.value)} required error={!!formErrors.newAddressStreet} helperText={formErrors.newAddressStreet} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label="City" variant="outlined" fullWidth value={newAddressCity} onChange={(e) => setNewAddressCity(e.target.value)} required error={!!formErrors.newAddressCity} helperText={formErrors.newAddressCity} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label="State/Province" variant="outlined" fullWidth value={newAddressState} onChange={(e) => setNewAddressState(e.target.value)} required error={!!formErrors.newAddressState} helperText={formErrors.newAddressState} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label="ZIP / Postal Code" variant="outlined" fullWidth value={newAddressZipCode} onChange={(e) => setNewAddressZipCode(e.target.value)} required error={!!formErrors.newAddressZipCode} helperText={formErrors.newAddressZipCode} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField label="Phone Number" type="tel" variant="outlined" fullWidth value={newAddressPhone} onChange={(e) => setNewAddressPhone(e.target.value)} sx={{ mb: 2 }} />
                                        </Grid>
                                    </Grid>
                                    <Button
                                        variant="contained"
                                        onClick={handleAddAddress}
                                        sx={{ mt: 2, backgroundColor: '#2009EA', color: '#fff', '&:hover': { backgroundColor: '#1a07bb' } }}
                                        disabled={loading}
                                    >
                                        Add Address
                                    </Button>
                                </Box>
                            </Collapse>
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
                                    {/* <--- AQUI: AGORA USA user.payment_methods para cartões */}
                                    {user?.payment_methods && user.payment_methods.length > 0 ? (
                                        <RadioGroup
                                            aria-label="card-selection"
                                            name="card-selection"
                                            value={selectedCard}
                                            onChange={(e) => setSelectedCard(e.target.value)}
                                            sx={{ mb: 2 }}
                                        >
                                            {user.payment_methods.map((card) => (
                                                <Box key={card.id} className="card-item-row">
                                                    <FormControlLabel
                                                        value={card.id}
                                                        control={<Radio />}
                                                        label={<Typography variant="body1" className="card-text">{`${card.cardType} **** **** **** ${card.cardNumberLast4}`}</Typography>}
                                                    />
                                                    <IconButton size="small" aria-label="delete card" onClick={() => handleDeletePaymentMethod(card.id)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                        </RadioGroup>
                                    ) : (
                                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                            You have no saved cards. Please add a new one.
                                        </Typography>
                                    )}
                                    
                                    {/* Botão para mostrar/esconder o formulário de novo cartão */}
                                    <MuiLink href="#" onClick={(e) => { e.preventDefault(); setShowNewCardForm(!showNewCardForm); }}
                                        sx={{ display: 'flex', alignItems: 'center', color: '#2009EA', fontWeight: 'bold' }}>
                                        <AddIcon sx={{ mr: 0.5 }} /> {showNewCardForm ? 'Cancel Add Card' : 'Add new card'}
                                    </MuiLink>

                                    {/* Formulário para Adicionar Novo Cartão */}
                                    <Collapse in={showNewCardForm} timeout="auto" unmountOnExit>
                                        <Box sx={{ mt: 3, p: 2, border: '1px solid #eee', borderRadius: '8px' }}>
                                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>New Card Details</Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <TextField label="Name on Card" variant="outlined" fullWidth value={newCardName} onChange={(e) => setNewCardName(e.target.value)} required error={!!formErrors.newCardName} helperText={formErrors.newCardName} />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField label="Card Number" type="tel" variant="outlined" fullWidth value={newCardNumber} onChange={(e) => setNewCardNumber(e.target.value)} required error={!!formErrors.newCardNumber} helperText={formErrors.newCardNumber} inputProps={{ maxLength: 16 }} />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField label="Expiration Date (MM/YY)" variant="outlined" fullWidth value={newCardExpiry} onChange={(e) => setNewCardExpiry(e.target.value)} required error={!!formErrors.newCardExpiry} helperText={formErrors.newCardExpiry} inputProps={{ maxLength: 5 }} />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField label="CVV" type="tel" variant="outlined" fullWidth value={newCardCvv} onChange={(e) => setNewCardCvv(e.target.value)} required error={!!formErrors.newCardCvv} helperText={formErrors.newCardCvv} inputProps={{ maxLength: 4 }} />
                                                </Grid>
                                            </Grid>
                                            <Button
                                                variant="contained"
                                                onClick={handleAddPaymentMethod}
                                                sx={{ mt: 2, backgroundColor: '#2009EA', color: '#fff', '&:hover': { backgroundColor: '#1a07bb' } }}
                                                disabled={loading}
                                            >
                                                Add Card
                                            </Button>
                                        </Box>
                                    </Collapse>
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
                                    <img src={item.image || 'https://placehold.co/40x40/cccccc/333333?text=Img'} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', marginRight: '10px' }} />
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                                            {item.name} (x{item.quantity})
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {item.metadata?.artist}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
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