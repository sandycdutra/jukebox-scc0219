import React, { useState } from 'react';
import { Box, Typography, Button, Breadcrumbs, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import MuiLink from '@mui/material/Link';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

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

    // A lista de categorias para a sidebar 
    const categoriesForSidebar = [
        'All', 'Classical', 'Country', 'Electronic', 'Hip Hop', 'Indie', 'POP', 'Rap', 'R&B', 'Rock'

    ];

    // Lógica de filtragem: filtra a lista 'favorites'
    const filteredFavorites = favorites.filter(product => {
        if (selectedCategory === 'all') {
            return true; // Se 'All' na sidebar, mostra todos os favoritos
        }

        const lowerCaseSelectedCategory = selectedCategory.toLowerCase();

        // Verifica se o produto corresponde à categoria selecionada (por tipo ou por gênero)
        return (product.type && product.type.toLowerCase() === lowerCaseSelectedCategory) ||
               (product.metadata?.genre && product.metadata.genre.toLowerCase() === lowerCaseSelectedCategory) ||
               (product.metadata?.subgenre && product.metadata.subgenre.toLowerCase() === lowerCaseSelectedCategory);
    });

    // Lógica de ordenação
    const sortedFavorites = [...filteredFavorites].sort((a, b) => {
        if (sortBy === 'title-asc') {
            return a.name.localeCompare(b.name); 
        }
        if (sortBy === 'title-desc') {
            return b.name.localeCompare(a.name); 
        }
        return 0;
    });

    return (
        <>
            <Header />

            <Box className="favorites-page-container">
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4, mt: 2 }}>
                    <MuiLink underline="hover" color="inherit" component={RouterLink} to="/">
                        Home
                    </MuiLink>
                    <Typography color="text.primary">Favourites</Typography>
                </Breadcrumbs>

                <Box className="favorites-main-content">
                    <Box className="favorites-sidebar">
                        <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>Categories</Typography> {/* Título para a sidebar */}
                        {categoriesForSidebar.map(category => ( // <--- Usa categoriesForSidebar
                            <MuiLink
                                key={category}
                                href="#"
                                onClick={(e) => { e.preventDefault(); setSelectedCategory(category.toLowerCase()); }}
                                className={`sidebar-link ${selectedCategory === category.toLowerCase() ? 'active' : ''}`}
                                sx={{ display: 'block', mb: 1 }}
                            >
                                {category}
                            </MuiLink>
                        ))}
                    </Box>

                    <Box className="favorites-grid-area">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                                <InputLabel>Order by:</InputLabel>
                                <Select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    label="Order by:"
                                >
                                    <MenuItem value="none">Nothing</MenuItem>
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
                                showRemoveButton={true} // Diz ao ProductGrid para mostrar o botão de remover
                                onRemoveItem={removeFavorite} // Passa a função para remover
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