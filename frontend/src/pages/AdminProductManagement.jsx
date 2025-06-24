// frontend/src/pages/AdminProductManagement.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';

function AdminProductManagement() {
    const { isAuthenticatedAdmin, isAuthenticated, token, logout } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false); // Para modal de adicionar/editar
    const [currentProduct, setCurrentProduct] = useState(null); // Produto sendo editado/adicionado
    const [dialogType, setDialogType] = useState('add'); // 'add' ou 'edit'
    const [dialogErrors, setDialogErrors] = useState({}); // Erros do formulário do modal

    // Estados do formulário de produto (para o modal)
    const [prodId, setProdId] = useState('');
    const [sku, setSku] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('vinyl'); // Default para tipo
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');
    const [soldQuantity, setSoldQuantity] = useState('');
    const [images, setImages] = useState(''); // String de URLs separadas por vírgula
    const [artist, setArtist] = useState('');
    const [releaseYear, setReleaseYear] = useState('');
    const [genre, setGenre] = useState('');
    const [subgenre, setSubgenre] = useState('');
    const [condition, setCondition] = useState('new');

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
        fetchProducts();
    }, [isAuthenticated, isAuthenticatedAdmin, navigate, token]); // Inclui token nas dependências

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/api/products', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) logout();
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError('Failed to load products: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddDialog = () => {
        setDialogType('add');
        setCurrentProduct(null);
        // Limpa todos os campos do formulário para adicionar
        setProdId(''); setSku(''); setName(''); setType('vinyl'); setPrice(''); setDescription('');
        setStockQuantity(''); setSoldQuantity(''); setImages(''); setArtist(''); setReleaseYear('');
        setGenre(''); setSubgenre(''); setCondition('new');
        setDialogErrors({});
        setOpenDialog(true);
    };

    const handleOpenEditDialog = (product) => {
        setDialogType('edit');
        setCurrentProduct(product);
        // Preenche os campos do formulário com os dados do produto para edição
        setProdId(product.id); setSku(product.sku); setName(product.name); setType(product.type); setPrice(product.price);
        setDescription(product.description); setStockQuantity(product.stock_quantity); setSoldQuantity(product.sold_quantity);
        setImages(product.images ? product.images.join(', ') : ''); // Converte array para string
        setArtist(product.metadata?.artist || product.artist || ''); // Pega do metadata ou do campo direto
        setReleaseYear(product.metadata?.release_year || '');
        setGenre(product.metadata?.genre || product.genre || '');
        setSubgenre(product.metadata?.subgenre || '');
        setCondition(product.metadata?.condition || 'new');
        setDialogErrors({});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentProduct(null);
        setDialogErrors({});
    };

    const validateProductForm = () => {
        let errors = {};
        if (dialogType === 'add' && !prodId) errors.prodId = 'ID is required.';
        if (!sku) errors.sku = 'SKU is required.';
        if (!name) errors.name = 'Name is required.';
        if (!type) errors.type = 'Type is required.';
        if (!price || isNaN(price)) errors.price = 'Price is required and must be a number.';
        if (!description) errors.description = 'Description is required.';
        if (!stockQuantity || isNaN(stockQuantity)) errors.stockQuantity = 'Stock is required and must be a number.';
        if (!artist) errors.artist = 'Artist is required.';
        if (!genre) errors.genre = 'Genre is required.';
        if (!images) errors.images = 'At least one image URL is required.';

        setDialogErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSaveProduct = async () => {
        if (!validateProductForm()) {
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const productData = {
                id: prodId, sku, name, type, price: parseFloat(price), description,
                stock_quantity: parseInt(stockQuantity, 10), sold_quantity: parseInt(soldQuantity || 0, 10),
                images: images.split(',').map(url => url.trim()).filter(url => url), // Converte string para array
                artist, genre, // Campos diretos
                metadata: { artist, release_year: parseInt(releaseYear, 10) || null, genre, subgenre, condition }
            };

            const method = dialogType === 'add' ? 'POST' : 'PUT';
            const url = dialogType === 'add' ? 'http://localhost:5000/api/products' : `http://localhost:5000/api/products/${currentProduct.id}`;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error (JSON parse failed)' }));
                throw new Error(errorData.message || `Failed to ${dialogType} product. Status: ${response.status}`);
            }

            alert(`Product ${dialogType === 'add' ? 'added' : 'updated'} successfully!`);
            handleCloseDialog();
            fetchProducts(); // Recarrega a lista de produtos
        } catch (err) {
            console.error(`Error saving product (${dialogType}):`, err);
            setError(`Failed to ${dialogType} product: ` + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error (JSON parse failed)' }));
                throw new Error(errorData.message || `Failed to delete product. Status: ${response.status}`);
            }
            alert('Product deleted successfully!');
            fetchProducts(); // Recarrega a lista
        } catch (err) {
            console.error("Error deleting product:", err);
            setError('Failed to delete product: ' + err.message);
        } finally {
            setLoading(false);
        }
    };


    if (loading && !products.length) { // Apenas mostra loading na carga inicial
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Loading products...</Typography>
            </Box>
        );
    }
    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                <Typography color="error" variant="h6">{error}</Typography>
                <Button onClick={fetchProducts} sx={{ mt: 2 }}>Retry</Button>
            </Box>
        );
    }
    if (!isAuthenticatedAdmin && !loading) { // Acesso negado depois de carregar
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
                    Manage Products
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddDialog} sx={{ mb: 3 }}>
                    Add New Product
                </Button>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>SKU</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Stock</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>{product.id}</TableCell>
                                    <TableCell>{product.sku}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.type}</TableCell>
                                    <TableCell>${product.price?.toFixed(2)}</TableCell>
                                    <TableCell>{product.stock_quantity}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleOpenEditDialog(product)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteProduct(product.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
                    <DialogTitle>{dialogType === 'add' ? 'Add New Product' : 'Edit Product'}</DialogTitle>
                    <DialogContent>
                        {loading ? <CircularProgress sx={{ display: 'block', margin: '20px auto' }} /> : (
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Product ID" fullWidth value={prodId} onChange={(e) => setProdId(e.target.value)} disabled={dialogType === 'edit'} error={!!dialogErrors.prodId} helperText={dialogErrors.prodId} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="SKU" fullWidth value={sku} onChange={(e) => setSku(e.target.value)} error={!!dialogErrors.sku} helperText={dialogErrors.sku} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} error={!!dialogErrors.name} helperText={dialogErrors.name} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Type (vinyl, cd, accessory)" fullWidth value={type} onChange={(e) => setType(e.target.value)} error={!!dialogErrors.type} helperText={dialogErrors.type} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Price" type="number" fullWidth value={price} onChange={(e) => setPrice(e.target.value)} error={!!dialogErrors.price} helperText={dialogErrors.price} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Description" fullWidth multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} error={!!dialogErrors.description} helperText={dialogErrors.description} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Stock Quantity" type="number" fullWidth value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} error={!!dialogErrors.stockQuantity} helperText={dialogErrors.stockQuantity} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Sold Quantity" type="number" fullWidth value={soldQuantity} onChange={(e) => setSoldQuantity(e.target.value)} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Image URLs (comma separated)" fullWidth value={images} onChange={(e) => setImages(e.target.value)} error={!!dialogErrors.images} helperText={dialogErrors.images} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Artist" fullWidth value={artist} onChange={(e) => setArtist(e.target.value)} error={!!dialogErrors.artist} helperText={dialogErrors.artist} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Release Year" type="number" fullWidth value={releaseYear} onChange={(e) => setReleaseYear(e.target.value)} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Genre" fullWidth value={genre} onChange={(e) => setGenre(e.target.value)} error={!!dialogErrors.genre} helperText={dialogErrors.genre} />
                                </Grid>

                            </Grid>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}
                            sx={{ 
                                color: '#2009EA', 
                                borderColor: '#2009EA', 
                                '&:hover': {
                                    backgroundColor: 'rgba(32, 9, 234, 0.04)',
                                    borderColor: '#1a07bb',
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSaveProduct} 
                            variant="contained" 
                            sx={{
                                backgroundColor: '#2009EA',
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: '#1a07bb',
                                }
                            }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : (dialogType === 'add' ? 'Add Product' : 'Save Changes')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Footer />
        </>
    );
}

export default AdminProductManagement;