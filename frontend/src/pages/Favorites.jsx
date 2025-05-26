// frontend/src/pages/Favorites.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Para o botão de voltar ou ir para Home

// Importe seu hook de favoritos e o ProductCard
import { useFavorites } from '../hooks/useFavorites';
import ProductCard from '../components/ProductCard'; // Para exibir os produtos favoritos

// Importe Header e Footer (assumindo que todas as páginas têm)
import Header from '../components/Header';
import Footer from '../components/Footer';

import '../css/main.css'; // Seus estilos globais
// Você pode criar um favorites.css se precisar de estilos específicos para esta página

function Favorites() {
    const { favorites, removeFavorite } = useFavorites(); // <--- Use o hook de favoritos
    const navigate = useNavigate();

    const handleRemoveClick = (productId) => {
        removeFavorite(productId);
    };

    return (
        <>
            <Header />

            <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
                <Typography variant="h4" component="h1" sx={{ mb: 4, textAlign: 'center' }}>
                    My Fav
                </Typography>

                {favorites.length === 0 ? (
                    <Box sx={{ textAlign: 'center', mt: 8 }}>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                            You don't have any favorite items yet.
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
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', // Reutiliza a lógica de grid
                        gap: '20px',
                        justifyContent: 'center'
                    }}>
                        {favorites.map((product) => (
                            <Box key={product.id} sx={{ position: 'relative' }}>
                                <ProductCard product={product} />
                                <Button
                                    variant="contained"
                                    color="error" // Cor vermelha para remoção
                                    onClick={(e) => { // Previne que o clique no botão ative o link do card
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleRemoveClick(product.id);
                                    }}
                                    sx={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                        minWidth: 'unset', // Para ficar pequeno
                                        padding: '4px',
                                        borderRadius: '50%', // Botão redondo
                                        height: '30px',
                                        width: '30px',
                                        zIndex: 10, // Para ficar por cima do card
                                        opacity: 0.8,
                                        '&:hover': { opacity: 1 }
                                    }}
                                >
                                    X
                                </Button>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>

            <Footer />
        </>
    );
}

export default Favorites;