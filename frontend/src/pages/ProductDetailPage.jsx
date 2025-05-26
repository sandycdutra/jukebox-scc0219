// frontend/src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Select, MenuItem, Breadcrumbs, Link, CircularProgress } from '@mui/material';
import { FavoriteBorderOutlined as FavoriteIcon, Favorite as FilledFavoriteIcon } from '@mui/icons-material'; // <--- Importe o ícone de coração preenchido também

// Importe seu hook de favoritos
import { useFavorites } from '../hooks/useFavorites'; // <--- Importe o hook

// Importe seus componentes Header e Footer
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard'; // Para a seção de recomendações

import products from '../mockdata/products';
import '../css/main.css';
import '../css/productdetail.css';

function ProductDetailPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites(); // <--- Use o hook de favoritos

    const [product, setProduct] = useState(null);
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [mainImage, setMainImage] = useState('');

    const productIsFavorite = product ? isFavorite(product.id) : false; // <--- Verifique se o produto atual é favorito

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

            const filteredRecommendations = products.filter(
                p => p.type === foundProduct.type && p.id !== foundProduct.id
            );
            const shuffledRecommendations = filteredRecommendations.sort(() => 0.5 - Math.random());
            setRecommendedProducts(shuffledRecommendations.slice(0, 6));
        } else {
            console.error('Produto não encontrado:', productId);
        }
    }, [productId]);

    const handleQuantityChange = (event) => {
        setSelectedQuantity(event.target.value);
    };

    const handleAddToCart = () => {
        console.log(`Adicionado ${selectedQuantity} de ${product.title} ao carrinho.`);
        // Lógica real de adição ao carrinho aqui
    };

    const handleFavoriteToggle = () => { // <--- Função para alternar favorito
        if (product) {
            if (productIsFavorite) {
                removeFavorite(product.id);
                console.log(`Produto ${product.title} removido dos favoritos.`);
            } else {
                addFavorite(product);
                console.log(`Produto ${product.title} adicionado aos favoritos.`);
            }
            navigate('/Favorites'); // Navega para a página de favoritos após a ação
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

    return (
        <>
            <Header />

            <Box className="product-detail-page-container">
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4, mt: 2 }}>
                    <Link underline="hover" color="inherit" href="/">
                        Home
                    </Link>
                    <Link underline="hover" color="inherit" href={`/${product.type}`}>
                        {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                    </Link>
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

                        <Box className="product-actions">
                            <Select
                                value={selectedQuantity}
                                onChange={handleQuantityChange}
                                sx={{ minWidth: 80, mr: 2, borderRadius: '8px' }}
                                inputProps={{ 'aria-label': 'Select quantity' }}
                            >
                                {[1, 2, 3, 4, 5].map((qty) => (
                                    <MenuItem key={qty} value={qty}>{`Qtd ${qty}`}</MenuItem>
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
                            >
                                ADD TO CART
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleFavoriteToggle} // <--- Altera para a nova função de alternância
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
                                {/* Renderiza o ícone de coração preenchido ou vazio com base no estado */}
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
                            <Link href={`/${product.type}`} underline="hover" sx={{ color: '#000', fontWeight: 'bold' }}>See all</Link>
                        </Box>
                        <Box className="recommended-products-grid">
                        {recommendedProducts.slice(0, 4).map(recProduct => (
                            <ProductCard key={recProduct.id} product={recProduct} />
                        ))}
                        </Box>
                    </Box>
                )}
            </Box>

            <Footer />
        </>
    );
}

export default ProductDetailPage;