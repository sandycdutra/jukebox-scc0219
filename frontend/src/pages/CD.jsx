import React, { useState } from 'react';
import { Box, Typography, Button, Breadcrumbs, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import MuiLink from '@mui/material/Link';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductGrid from '../components/ProductGrid';

import allProducts from '../mockdata/products';

import '../css/main.css';
import '../css/categorypage.css';

function CD () {
    const navigate = useNavigate();

    const [sortBy, setSortBy] = useState('none');
    // Filtro padrão: 'all'
    const [selectedGenreFilter, setSelectedGenreFilter] = useState('all');

    // Gêneros da Sidebar
    const genreCategoriesForSidebar = [
        'All genres', 'Classical', 'Country', 'Electronic', 'Hip Hop', 'Indie', 'POP', 'Rap', 'R&B', 'Rock'
    ];

    const baseProductsForPage = allProducts.filter(product => product.type.toLowerCase() === 'cd');

    // Filtro
    const filteredByGenre = baseProductsForPage.filter(product => {
        if (selectedGenreFilter === 'all') {
            return true; // Se 'All' na sidebar, mostra todos os CDs
        }
        const lowerCaseSelectedGenre = selectedGenreFilter.toLowerCase();
        return (product.genre && product.genre.toLowerCase() === lowerCaseSelectedGenre) ||
               (product.subgenre && product.subgenre.toLowerCase() === lowerCaseSelectedGenre);
    });

    // Ordenação
    const sortedProducts = [...filteredByGenre].sort((a, b) => {
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

            <Box className="category-page-container">

                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4, mt: 2 }}>
                    <MuiLink underline="hover" color="inherit" component={RouterLink} to="/">
                        Home
                    </MuiLink>
                    <Typography color="text.primary">CD</Typography>
                </Breadcrumbs>

                <Box className="category-layout">
                    <Box className="category-sidebar">
                        <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>Genres</Typography> 
                        {genreCategoriesForSidebar.map(genre => (
                            <MuiLink
                                key={genre}
                                href="#"
                                onClick={(e) => { e.preventDefault(); setSelectedGenreFilter(genre.toLowerCase()); }}
                                className={`sidebar-link ${selectedGenreFilter === genre.toLowerCase() ? 'active' : ''}`}
                                sx={{ display: 'block', mb: 1 }}
                            >
                                {genre}
                            </MuiLink>
                        ))}
                    </Box>

                    <Box className="category-content">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                                <InputLabel>Order by:</InputLabel>
                                <Select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    label="Ordenar por:"
                                >
                                    <MenuItem value="none">Nothing</MenuItem>
                                    <MenuItem value="title-asc">A - Z</MenuItem>
                                    <MenuItem value="title-desc">Z - A</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {sortedProducts.length === 0 ? (
                            <Box sx={{ textAlign: 'center', mt: 8 }}>
                                <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                                    No CDs found for this genre.
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
                            <ProductGrid products={sortedProducts} />
                        )}
                    </Box>
                </Box>
            </Box>

            <Footer />
        </>
    );
}

export default CD;