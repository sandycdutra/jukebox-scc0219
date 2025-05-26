// frontend/src/pages/Vinyl.jsx
import React, { useState } from 'react';
// Componentes Material-UI
import { Box, Typography, Button, Breadcrumbs, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
// Link do Material-UI (renomeado para evitar conflito com Link do React Router)
import MuiLink from '@mui/material/Link';
// Link do React Router (renomeado para evitar conflito com Link do Material-UI)
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// Componentes da sua aplicação
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductGrid from '../components/ProductGrid';
// O Sidebar que você tinha (se ele for um componente genérico de menu)
// import Sidebar from '../components/Sidebar'; // Não usaremos mais o Sidebar genérico aqui, a lista é construída localmente

// Dados
import allProducts from '../mockdata/products'; // Importa a lista COMPLETA de produtos

// Estilos
import '../css/main.css';
import '../css/categorypage.css'; // Reutiliza o CSS para o layout da página de categoria

function Vinyl () {
    const navigate = useNavigate();

    const [sortBy, setSortBy] = useState('none');
    // O filtro padrão da sidebar é 'all' para ver todos os gêneros de Vinyl
    const [selectedGenreFilter, setSelectedGenreFilter] = useState('all');

    // LISTA DE GÊNEROS PARA A SIDEBAR (IGUAL AO CD.JSX)
    // Inclua todos os gêneros e subgêneros únicos que você tem no seu mockdata.
    const genreCategoriesForSidebar = [
        'All', 'Pop', 'R&B', 'Hip Hop', 'Classical', 'Reggaeton', 'Rock', 'Electronic', 'Indie', 'Country', 'Dance-pop', 'Synth-pop', 'Trap', 'Pop-rock', 'Latin Pop'
        // Adicione outros gêneros que você tiver
    ];


    // PASSO 1: Filtrar os produtos BASE da página. Para Vinyl.jsx, são APENAS os Vinis.
    const baseProductsForPage = allProducts.filter(product => product.type.toLowerCase() === 'vinyl'); // <--- AQUI ESTÁ A ÚNICA MUDANÇA SIGNIFICATIVA

    // PASSO 2: Aplicar o filtro de GÊNERO da sidebar sobre os Vinis.
    const filteredByGenre = baseProductsForPage.filter(product => {
        if (selectedGenreFilter === 'all') {
            return true; // Se 'All' na sidebar, mostre todos os Vinis
        }

        const lowerCaseSelectedGenre = selectedGenreFilter.toLowerCase();
        return (product.genre && product.genre.toLowerCase() === lowerCaseSelectedGenre) ||
               (product.subgenre && product.subgenre.toLowerCase() === lowerCaseSelectedGenre);
    });

    // Lógica de ordenação (aplica-se aos produtos já filtrados por tipo e gênero)
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
                {/* Breadcrumbs */}
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4, mt: 2 }}>
                    <MuiLink underline="hover" color="inherit" component={RouterLink} to="/">
                        Home
                    </MuiLink>
                    <Typography color="text.primary">Vinyl</Typography> {/* Nome da categoria atual */}
                </Breadcrumbs>

                <Box className="category-layout">
                    {/* Sidebar de Gêneros */}
                    <Box className="category-sidebar">
                        <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>Genres</Typography> {/* Título "Genres" na sidebar */}
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

                    {/* Conteúdo Principal (Ordenação + Produtos) */}
                    <Box className="category-content">
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

                        {sortedProducts.length === 0 ? (
                            <Box sx={{ textAlign: 'center', mt: 8 }}>
                                <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                                    No Vinyls found for this genre.
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

export default Vinyl;