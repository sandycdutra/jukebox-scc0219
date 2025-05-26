// frontend/src/pages/Favorites.jsx
import React, { useState } from 'react';
import { Box, Typography, Button, Breadcrumbs, Select, MenuItem, FormControl, InputLabel } from '@mui/material'; // Importe Breadcrumbs do MUI
import MuiLink from '@mui/material/Link'; // <--- Importe Link do MUI com outro nome para evitar conflito
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // <--- Importe Link do React Router como RouterLink

import { useFavorites } from '../hooks/useFavorites';
import ProductGrid from '../components/ProductGrid';

import Header from '../components/Header';
import Footer from '../components/Footer';

import '../css/main.css';
import '../css/favorites.css';

function Favorites() {
    const { favorites, removeFavorite } = useFavorites();
    const navigate = useNavigate();

    const [sortBy, setSortBy] = useState('none');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        'All', 'CD', 'Vinyl', 'Accessories', 'Classical', 'Country',
        'Electronic', 'Hip Hop', 'Indie', 'Pop', 'Rap', 'R&B', 'Rock'
    ];

    const filteredFavorites = favorites.filter(product => {
        if (selectedCategory === 'all') {
            return true;
        }
        return product.type.toLowerCase() === selectedCategory.toLowerCase();
    });

    const sortedFavorites = [...filteredFavorites].sort((a, b) => {
        if (sortBy === 'title-asc') {
            return a.title.localeCompare(b.title);
        }
        if (sortBy === 'title-desc') {
            return b.title.localeCompare(a.title);
        }
        return 0;
    });

    return (
        <>
            <Header />

            <Box className="favorites-page-container">
                {/* Breadcrumbs - CORREÇÃO AQUI */}
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4, mt: 2 }}>
                    {/* O componente Link do MUI pode usar o RouterLink como seu componente subjacente */}
                    <MuiLink underline="hover" color="inherit" component={RouterLink} to="/">
                        Home
                    </MuiLink>
                    {/* O último item do Breadcrumbs geralmente é Typography e não um link */}
                    <Typography color="text.primary">Favourites</Typography>
                </Breadcrumbs>

                <Box className="favorites-main-content">
                    {/* Sidebar de Categorias */}
                    <Box className="favorites-sidebar">
                        <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>Favourites</Typography>
                        {categories.map(category => (
                            <MuiLink // Use MuiLink aqui também para consistência
                                key={category}
                                href="#" // Ou use component={RouterLink} to={`/categories/${category.toLowerCase()}`}
                                onClick={(e) => { e.preventDefault(); setSelectedCategory(category.toLowerCase()); }}
                                className={`sidebar-link ${selectedCategory === category.toLowerCase() ? 'active' : ''}`}
                                sx={{ display: 'block', mb: 1 }}
                            >
                                {category}
                            </MuiLink>
                        ))}
                    </Box>

                    {/* Conteúdo Principal (Ordenação + Produtos) */}
                    <Box className="favorites-grid-area">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                                <InputLabel>Ordenar por:</InputLabel>
                                <Select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    label="Ordenar por:"
                                >
                                    <MenuItem value="none">Nenhum</MenuItem>
                                    <MenuItem value="title-asc">A - Z</MenuItem>
                                    <MenuItem value="title-desc">Z - A</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {sortedFavorites.length === 0 ? (
                            <Box sx={{ textAlign: 'center', mt: 8 }}>
                                <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                                    {selectedCategory === 'all'
                                        ? "You don't have any favorite items yet."
                                        : `No ${selectedCategory} favorites found.`
                                    }
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
                            <ProductGrid
                                products={sortedFavorites}
                                showRemoveButton={true}
                                onRemoveItem={removeFavorite}
                            />
                        )}
                    </Box>
                </Box>
            </Box>

            <Footer />
        </>
    );
}

export default Favorites;