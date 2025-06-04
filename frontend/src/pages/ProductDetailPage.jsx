// frontend/src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Select, MenuItem, Breadcrumbs, CircularProgress } from '@mui/material';
import MuiLink from '@mui/material/Link';
import { FavoriteBorderOutlined as FavoriteIcon, Favorite as FilledFavoriteIcon } from '@mui/icons-material';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { useFavorites } from '../hooks/useFavorites';
import { useCart } from '../hooks/useCart'; // <--- Importe o hook de carrinho

import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

import products from '../mockdata/products';
import '../css/main.css';
import '../css/productdetail.css';

function ProductDetailPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const { addToCart, getStock } = useCart(); // <--- OBTENHA addToCart E getStock

    const [product, setProduct] = useState(null);
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [mainImage, setMainImage] = useState('');
    const [availableStock, setAvailableStock] = useState(0); // <--- Novo estado para o estoque visível
    const [loading, setLoading] = useState(false);
    const productIsFavorite = product ? isFavorite(product.id) : false;

    useEffect(() => {
        const idAsNumber = parseInt(productId, 10);
        const foundProduct = products.find(p => p.id === idAsNumber);

        if (foundProduct) {
            setProduct(foundProduct);
            if (foundProduct.images && foundProduct.images.length > 0) {
                setMainImage(foundProduct.images[0]);
            } else {
                setMainImage(foundProduct.image || 'https://placehold.co/600x400/cccccc/333333?text=No+Image');
            }
            // Atualiza o estoque
            setAvailableStock(getStock(foundProduct.id));

            const filteredRecommendations = products.filter(
                p => p.type === foundProduct.type && p.id !== foundProduct.id
            );
            const shuffledRecommendations = filteredRecommendations.sort(() => 0.5 - Math.random());
            setRecommendedProducts(shuffledRecommendations.slice(0, 6));
        } else {
            console.error('Produto não encontrado:', productId);
        }
    }, [productId, getStock]);

    const handleQuantityChange = (event) => {
        const newQty = event.target.value;
        if (newQty > availableStock) {
            alert(`Você não pode adicionar mais de ${availableStock} unidades.`);
            setSelectedQuantity(availableStock); // Volta para o estoque máximo disponível
        } else {
            setSelectedQuantity(newQty);
        }
    };

    const handleAddToCart = async () => {
         if (product) {
            setLoading(true); 
            await new Promise(resolve => setTimeout(resolve, 500)); 
            addToCart(product, selectedQuantity);
            console.log(`Adicionado ${selectedQuantity} de ${product.title} ao carrinho.`);
            setLoading(false); 
            navigate('/Cart');
        }
    };

    const handleFavoriteToggle = () => {
        if (product) {
            if (productIsFavorite) {
                removeFavorite(product.id);
                console.log(`Produto ${product.title} removido dos favoritos.`);
            } else {
                addFavorite(product);
                console.log(`Produto ${product.title} adicionado aos favoritos.`);
            }
            navigate('/Favorites');
        }
    };

    const handleThumbnailClick = (imageSrc) => {
        setMainImage(imageSrc);
    };

    if (!product) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Carregando produto...</Typography>
            </Box>
        );
    }

    // Array de opções de quantidade até o estoque disponível
    const quantityOptions = [];
    for (let i = 1; i <= availableStock && i <= 5; i++) { // Max de 5 opções no dropdown ou até o estoque
        quantityOptions.push(i);
    }
    // Se não houver estoque
    if (availableStock === 0 && quantityOptions.length === 0) {
        quantityOptions.push(0); // Para o dropdown não ficar vazio
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
                    <Typography color="text.primary">{product.title}</Typography>
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
                            <img src={mainImage} alt={product.title} className="product-main-image" />
                        </Box>
                    </Box>

                    <Box className="product-info-section">
                        <Typography variant="overline" className="product-type-detail">{product.type.charAt(0).toUpperCase() + product.type.slice(1)}</Typography>
                        <Typography variant="h4" component="h1" className="product-title-detail">{product.title}</Typography>
                        <Typography variant="h6" className="product-artist-detail">{product.artist}</Typography>
                        <Typography variant="h5" className="product-price-detail">${product.price.toFixed(2)}</Typography>

                        <Typography variant="body2" sx={{ mt: 1, color: availableStock > 0 ? 'text.secondary' : 'error.main', fontWeight: 'bold' }}>
                            Available Stock: {availableStock}
                        </Typography>
                        {availableStock === 0 && (
                            <Typography variant="body2" sx={{ color: 'error.main', mt: 0.5 }}>
                                Sold Out
                            </Typography>
                        )}

                        <Box className="product-actions">
                            <Select
                                value={selectedQuantity}
                                onChange={handleQuantityChange}
                                sx={{ minWidth: 80, mr: 2, borderRadius: '8px' }}
                                inputProps={{ 'aria-label': 'Select quantity' }}
                                disabled={availableStock === 0} // Desabilita seletor se estoque for 0
                            >
                                {quantityOptions.map((qty) => (
                                    <MenuItem key={qty} value={qty}>{`${qty}`}</MenuItem>
                                ))}
                            </Select>
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
                                    fontWeight: 'bold'
                                }}
                                disabled={loading || availableStock === 0} // Desabilita botão se esgotado ou carregando
                            >
                                ADD TO CART
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