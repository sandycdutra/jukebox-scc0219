// frontend/src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Box, Typography, Button, Select, MenuItem, Breadcrumbs, CircularProgress,
    IconButton, TextField
} from '@mui/material';
import MuiLink from '@mui/material/Link';
import { FavoriteBorderOutlined as FavoriteIcon, Favorite as FilledFavoriteIcon } from '@mui/icons-material';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { useFavorites } from '../hooks/useFavorites';
import { useCart } from '../hooks/useCart';

import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

import '../css/main.css';
import '../css/productdetail.css';

function ProductDetailPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [mainImage, setMainImage] = useState('');
    const [loading, setLoading] = useState(false);
    const productIsFavorite = product ? isFavorite(product.id) : false;

    const MAX_QTY_PER_ORDER = 5; 

    useEffect(() => {
        const fetchProductAndRecommendations = async () => {
            setProduct(null);
            setLoading(true);
            try {
                const productResponse = await fetch(`http://localhost:5000/api/products/${productId}`);
                if (!productResponse.ok) {
                    throw new Error(`HTTP error! status: ${productResponse.status}`);
                }
                const productData = await productResponse.json();
                setProduct(productData);
                
                if (productData.images && productData.images.length > 0) {
                    setMainImage(productData.images[0]);
                } else {
                    setMainImage('https://placehold.co/600x400/cccccc/333333?text=No+Image');
                }

                const allProductsResponse = await fetch('http://localhost:5000/api/products');
                if (!allProductsResponse.ok) {
                    throw new Error(`HTTP error! status: ${allProductsResponse.status}`);
                }
                const allProductsData = await allProductsResponse.json();

                const filteredRecommendations = allProductsData.filter(
                    p => p.type === productData.type && p.id !== productData.id
                );
                const shuffledRecommendations = filteredRecommendations.sort(() => 0.5 - Math.random());
                setRecommendedProducts(shuffledRecommendations.slice(0, 6));

            } catch (error) {
                console.error("Error fetching product or recommendations:", error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProductAndRecommendations();
    }, [productId]); 

    const currentAvailableStock = product ? product.stock_quantity : 0; // Isso vem do backend

    const handleIncreaseQuantity = () => {
        if (selectedQuantity < currentAvailableStock && selectedQuantity < MAX_QTY_PER_ORDER) {
            setSelectedQuantity(prevQty => prevQty + 1);
        } else if (selectedQuantity >= MAX_QTY_PER_ORDER && currentAvailableStock > MAX_QTY_PER_ORDER) {
            setSelectedQuantity(prevQty => prevQty + 1);
        }
    };

    const handleDecreaseQuantity = () => {
        if (selectedQuantity > 1) {
            setSelectedQuantity(prevQty => prevQty - 1);
        }
    };

    const handleAddToCart = async () => {
        if (product) {
            if (selectedQuantity === 0 && currentAvailableStock > 0) {
                setSelectedQuantity(1);
                alert("Please select a quantity greater than zero.");
                return;
            }
            if (selectedQuantity > currentAvailableStock) {
                alert(`You cannot add more than ${currentAvailableStock} units.`);
                return;
            }
            
            setLoading(true);
            addToCart(product, selectedQuantity); // product já tem stock_quantity e sold_quantity
            console.log(`Added ${selectedQuantity} of ${product.name} to cart.`);
            await new Promise(resolve => setTimeout(resolve, 500));
            setLoading(false);
            navigate('/Cart');
        }
    };

    const handleFavoriteToggle = () => {
        if (product) {
            if (productIsFavorite) {
                removeFavorite(product.id);
                console.log(`Product ${product.name} removed from favorites.`);
            } else {
                addFavorite(product);
                console.log(`Product ${product.name} added to favorites.`);
            }
            navigate('/Favorites');
        }
    };

    const handleThumbnailClick = (imageSrc) => {
        setMainImage(imageSrc);
    };

    if (loading || !product) { 
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Loading product...</Typography>
            </Box>
        );
    }
    
    const quantityOptions = [];
    const maxSelectable = Math.min(currentAvailableStock, MAX_QTY_PER_ORDER);
    for (let i = 1; i <= maxSelectable; i++) {
        quantityOptions.push(i);
    }
    if (currentAvailableStock === 0) {
        quantityOptions.push(0);
    }


    return (
        <>
            <Header />

            <Box className="product-detail-page-container">
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4, mt: 2 }}>
                    <MuiLink underline="hover" color="inherit" component={RouterLink} to="/">
                        Home
                    </MuiLink>
                    <MuiLink underline="hover" color="inherit" component={RouterLink} to={`/${product.type}`}>
                        {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                    </MuiLink>
                    {/* <--- CORRIGIDO AQUI: Usa product.name para o título no Breadcrumbs */}
                    <Typography color="text.primary">{product.name}</Typography>
                </Breadcrumbs>

                <Box className="product-main-content">
                    <Box className="product-image-gallery">
                        <Box className="product-thumbnails">
                            {product.images && product.images.map((imgSrc, index) => (
                                <img
                                    key={index}
                                    src={imgSrc}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={`thumbnail-image ${mainImage === imgSrc ? 'active' : ''}`}
                                    onClick={() => handleThumbnailClick(imgSrc)}
                                />
                            ))}
                        </Box>
                        <Box className="product-main-image-container">
                            {/* <--- CORRIGIDO AQUI: Usa product.name para o alt text da imagem principal */}
                            <img src={mainImage} alt={product.name} className="product-main-image" />
                        </Box>
                    </Box>

                    <Box className="product-info-section">
                        <Typography variant="overline" className="product-type-detail">{product.type.charAt(0).toUpperCase() + product.type.slice(1)}</Typography>
                        {/* <--- CORRIGIDO AQUI: Usa product.name para o título principal */}
                        <Typography variant="h4" component="h1" className="product-title-detail">{product.name}</Typography>
                        {/* <--- CORRIGIDO AQUI: Usa product.metadata?.artist para o artista */}
                        <Typography variant="h6" className="product-artist-detail">{product.metadata?.artist}</Typography>
                        <Typography variant="h5" className="product-price-detail">${product.price.toFixed(2)}</Typography>

                        {/* Exibir o Estoque Disponível */}
                        <Typography variant="body2" sx={{ mt: 1, color: currentAvailableStock > 0 ? 'text.secondary' : 'error.main', fontWeight: 'bold' }}>
                            Available Stock: {currentAvailableStock}
                        </Typography>
                        {currentAvailableStock === 0 && (
                            <Typography variant="body2" sx={{ color: 'error.main', mt: 0.5 }}>
                                Sold Out
                            </Typography>
                        )}

                        <Box className="product-actions">
                            {/* NOVO CONTROLE DE QUANTIDADE: BOTÕES + e - */}
                            <Box className="quantity-control">
                                <IconButton
                                    onClick={handleDecreaseQuantity}
                                    disabled={selectedQuantity <= 1 || currentAvailableStock === 0}
                                    size="small"
                                    sx={{ border: '1px solid #ccc', borderRadius: '4px' }}
                                >
                                    <RemoveIcon />
                                </IconButton>
                                <TextField
                                    value={selectedQuantity}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value, 10);
                                        if (isNaN(value) || value < 1) {
                                            setSelectedQuantity(1); // Garante mínimo de 1
                                        } else if (value > currentAvailableStock) {
                                            setSelectedQuantity(currentAvailableStock); // Não excede estoque
                                        } else if (value > MAX_QTY_PER_ORDER) { // <--- Usa MAX_QTY_PER_ORDER
                                            setSelectedQuantity(MAX_QTY_PER_ORDER);
                                        } else {
                                            setSelectedQuantity(value);
                                        }
                                    }}
                                    inputProps={{
                                        min: 1,
                                        max: Math.min(currentAvailableStock, MAX_QTY_PER_ORDER), // <--- Usa MAX_QTY_PER_ORDER
                                        style: { textAlign: 'center' }
                                    }}
                                    sx={{ width: '60px', mx: 1 }}
                                    size="small"
                                    disabled={currentAvailableStock === 0}
                                />
                                <IconButton
                                    onClick={handleIncreaseQuantity}
                                    disabled={selectedQuantity >= currentAvailableStock || selectedQuantity >= MAX_QTY_PER_ORDER || currentAvailableStock === 0} // <--- Usa MAX_QTY_PER_ORDER
                                    size="small"
                                    sx={{ border: '1px solid #ccc', borderRadius: '4px' }}
                                >
                                    <AddIcon />
                                </IconButton>
                            </Box>

                            <Button
                                variant="contained"
                                onClick={handleAddToCart}
                                sx={{
                                    backgroundColor: '#2009EA',
                                    color: '#fff',
                                    '&:hover': { backgroundColor: '#1a07bb' },
                                    borderRadius: '8px',
                                    padding: '10px 20px',
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                }}
                                disabled={loading || currentAvailableStock === 0 || selectedQuantity === 0}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'ADD TO CART'}
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleFavoriteToggle}
                                sx={{
                                    ml: 1,
                                    borderRadius: '8px',
                                    borderColor: '#000',
                                    color: '#000',
                                    '&:hover': { borderColor: '#333', color: '#333' },
                                    minWidth: '40px',
                                    padding: '8px',
                                }}
                            >
                                {productIsFavorite ? <FilledFavoriteIcon sx={{ color: '#2009EA' }} /> : <FavoriteIcon />}
                            </Button>
                        </Box>
                    </Box>
                </Box>

                <Box className="product-information-section">
                    <Typography variant="h6" component="h2" sx={{ mb: 2 }}>Product information</Typography>
                    <Typography variant="body1" className="product-description">
                        {product.description}
                    </Typography>
                </Box>

                {recommendedProducts.length > 0 && (
                    <Box className="recommended-products-section" sx={{ mt: 6, mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" component="h2">Don't miss other products</Typography>
                            <MuiLink component={RouterLink} to={`/${product.type}`} underline="hover" sx={{ color: '#000', fontWeight: 'bold' }}>See all</MuiLink>
                        </Box>
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={20}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true }}
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                                768: {
                                    slidesPerView: 3,
                                    spaceBetween: 30,
                                },
                                1024: {
                                    slidesPerView: 4,
                                    spaceBetween: 40,
                                },
                                1200: {
                                    slidesPerView: 6,
                                    spaceBetween: 20,
                                },
                            }}
                            className="recommended-products-swiper"
                        >
                            {recommendedProducts.map((recProduct) => (
                                <SwiperSlide key={recProduct.id}>
                                    <ProductCard product={recProduct} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </Box>
                )}
            </Box>

            <Footer />
        </>
    );
}

export default ProductDetailPage;