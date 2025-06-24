// frontend/src/pages/AdminOrderManagement.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, FormControl, InputLabel, Collapse } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';

function AdminOrderManagement() {
    const { isAuthenticatedAdmin, isAuthenticated, token, logout } = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrderId, setExpandedOrderId] = useState(null); // Para expandir/colapsar detalhes

    const [openDialog, setOpenDialog] = useState(false); // Para modal de edição
    const [currentEditingOrder, setCurrentEditingOrder] = useState(null); // Pedido sendo editado no modal
    // Estados do formulário de edição de pedido no modal
    const [editPaymentStatus, setEditPaymentStatus] = useState('');
    const [editIsDelivered, setEditIsDelivered] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            alert('You need to be logged in to access this page.');
            navigate('/Login');
            return;
        }
        if (!isAuthenticatedAdmin) {
            alert('You do not have administrative access.');
            navigate('/');
            return;
        }
        fetchAllOrders();
    }, [isAuthenticated, isAuthenticatedAdmin, navigate, token]);

    const fetchAllOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/api/orders/admin/orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) logout();
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || `Failed to fetch orders. Status: ${response.status}`);
            }
            const data = await response.json();
            setOrders(data);
        } catch (err) {
            console.error("Error fetching all orders:", err);
            setError('Failed to load orders: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleOrderDetails = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const formatAddress = (addressObj) => {
        if (!addressObj) return 'N/A';
        return `${addressObj.street || 'N/A'}, ${addressObj.city || 'N/A'} - ${addressObj.state || 'N/A'}, ${addressObj.zip_code || 'N/A'} (Tel: ${addressObj.phone || 'N/A'})`;
    };

    const formatDate = (dateString) => {
        try {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
            return new Date(dateString).toLocaleDateString('pt-BR', options);
        } catch (e) {
            return dateString;
        }
    };

    // <--- NOVAS FUNÇÕES PARA EDIÇÃO/DELEÇÃO DE PEDIDOS ---
    const handleOpenEditDialog = (order) => {
        setCurrentEditingOrder(order);
        setEditPaymentStatus(order.payment_status);
        setEditIsDelivered(order.isDelivered);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentEditingOrder(null);
    };

    const handleSaveOrder = async () => {
        if (!currentEditingOrder) return;
        setLoading(true);
        setError(null);
        try {
            const orderData = {
                payment_status: editPaymentStatus,
                isDelivered: editIsDelivered,
                deliveredAt: editIsDelivered ? (currentEditingOrder.deliveredAt || new Date().toISOString()) : null // Define data de entrega se for entregue
            };

            const response = await fetch(`http://localhost:5000/api/orders/${currentEditingOrder._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || `Failed to update order. Status: ${response.status}`);
            }

            alert('Order updated successfully!');
            handleCloseDialog();
            fetchAllOrders(); // Recarrega a lista
        } catch (err) {
            console.error("Error saving order:", err);
            setError('Failed to save order: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to delete this order?')) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || `Failed to delete order. Status: ${response.status}`);
            }
            alert('Order deleted successfully!');
            fetchAllOrders(); // Recarrega a lista
        } catch (err) {
            console.error("Error deleting order:", err);
            setError('Failed to delete order: ' + err.message);
        } finally {
            setLoading(false);
        }
    };
    // FIM DAS NOVAS FUNÇÕES


    if (loading && !orders.length) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Loading all orders...</Typography>
            </Box>
        );
    }
    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                <Typography color="error" variant="h6">{error}</Typography>
                <Button onClick={fetchAllOrders} sx={{ mt: 2 }}>Retry</Button>
            </Box>
        );
    }
    if (!isAuthenticatedAdmin && !loading) {
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
                    View All Orders
                </Typography>

                {orders.length === 0 ? (
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        No orders found in the system.
                    </Typography>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>User</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Total</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <React.Fragment key={order._id}>
                                        <TableRow onClick={() => handleToggleOrderDetails(order._id)} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}>
                                            <TableCell>{order._id.substring(0, 8)}...</TableCell>
                                            <TableCell>{order.user?.name || 'N/A'} ({order.user?.email || 'N/A'})</TableCell>
                                            <TableCell>{formatDate(order.createdAt)}</TableCell>
                                            <TableCell>${order.total_amount?.toFixed(2)}</TableCell>
                                            <TableCell sx={{ color: order.payment_status === 'completed' ? 'green' : 'red' }}>
                                                {order.payment_status?.toUpperCase()}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton onClick={(e) => { e.stopPropagation(); handleOpenEditDialog(order); }}> {/* <--- CHAMA handleOpenEditDialog */}
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order._id); }}> {/* <--- CHAMA handleDeleteOrder */}
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                        {/* Detalhes expandidos do pedido */}
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                <Collapse in={expandedOrderId === order._id} timeout="auto" unmountOnExit>
                                                    <Box sx={{ margin: 1, p: 2, border: '1px dashed #eee', borderRadius: '4px' }}>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Order Details:</Typography>
                                                        <Typography variant="body2"><strong>Payment:</strong> {order.payment_method}</Typography>
                                                        {order.payment_details && (
                                                            <Typography variant="body2">
                                                                <strong>Card:</strong> {order.payment_details.cardType} **** **** **** {order.payment_details.cardNumberLast4} (Exp: {order.payment_details.cardExpiry})
                                                            </Typography>
                                                        )}
                                                        <Typography variant="body2" sx={{ mt: 1 }}><strong>Shipping Address:</strong> {formatAddress(order.shipping_address)}</Typography>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>Items:</Typography>
                                                        {order.items.map(item => (
                                                            <Box key={item.product_id} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                                <img src={item.image || 'https://placehold.co/30x30/cccccc/333333?text=Img'} alt={item.name} style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '2px', marginRight: '8px' }} />
                                                                <Typography variant="body2">{item.name} (x{item.quantity}) - ${item.unit_price?.toFixed(2)}</Typography>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* --- MODAL DE EDIÇÃO DE PEDIDO --- */}
                <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                    <DialogTitle>Edit Order {currentEditingOrder?._id?.substring(0, 8)}...</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Payment Status</InputLabel>
                            <Select
                                value={editPaymentStatus}
                                label="Payment Status"
                                onChange={(e) => setEditPaymentStatus(e.target.value)}
                            >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="failed">Failed</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Delivery Status</InputLabel>
                            <Select
                                value={editIsDelivered ? 'delivered' : 'pending'}
                                label="Delivery Status"
                                onChange={(e) => setEditIsDelivered(e.target.value === 'delivered')}
                            >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="delivered">Delivered</MenuItem>
                            </Select>
                        </FormControl>
                        {editIsDelivered && (
                            <TextField 
                                label="Delivered At (ISO Date)" 
                                fullWidth 
                                value={currentEditingOrder?.deliveredAt || new Date().toISOString()} // Exibe data ou current
                                disabled // Geralmente não edita a data manualmente
                                sx={{ mt: 2 }}
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="secondary" sx={{ 
                            color: '#2009EA', 
                            borderColor: '#2009EA', 
                            '&:hover': {
                                backgroundColor: 'rgba(32, 9, 234, 0.04)',
                                borderColor: '#1a07bb',
                            }
                        }}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveOrder} color="primary" disabled={loading} sx={{
                            backgroundColor: '#2009EA',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#1a07bb',
                            }
                        }}>
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Footer />
        </>
    );
}

export default AdminOrderManagement;