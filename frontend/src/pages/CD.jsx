// frontend/src/pages/CD.jsx
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

// Dados
import allProducts from '../mockdata/products'; // Importa a lista COMPLETA de produtos

// Estilos
import '../css/main.css';
import '../css/categorypage.css';

function CD () {
    const navigate = useNavigate();

    const [sortBy, setSortBy] = useState('none');
    // O filtro padrão da sidebar é 'all' para ver todos os gêneros de CDs
    const [selectedGenreFilter, setSelectedGenreFilter] = useState('all');

    // LISTA DE GÊNEROS PARA A SIDEBAR
    // Você pode gerar isso dinamicamente a partir dos seus produtos se preferir
    const genreCategoriesForSidebar = [
        'All', 'Pop', 'R&B', 'Hip Hop', 'Classical', 'Reggaeton', 'Rock', 'Electronic', 'Indie', 'Country', 'Dance-pop', 'Synth-pop', 'Trap', 'Pop-rock', 'Latin Pop'
        // Adicione todos os gêneros e subgêneros únicos que você tem no seu mockdata,
        // ou crie uma lista mais genérica de gêneros principais aqui.
        // É importante que os nomes aqui correspondam aos valores em product.genre ou product.subgenre
    ];


    // PASSO 1: Filtrar os produtos BASE da página. Para CD.jsx, são APENAS os CDs.
    const baseProductsForPage = allProducts.filter(product => product.type.toLowerCase() === 'cd');

    // PASSO 2: Aplicar o filtro de GÊNERO da sidebar sobre os CDs.
    const filteredByGenre = baseProductsForPage.filter(product => {
        if (selectedGenreFilter === 'all') {
            return true; // Se 'All' na sidebar, mostre todos os CDs
        }

        // Verifica se o gênero OU subgênero do produto corresponde ao filtro da sidebar
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
                    <Typography color="text.primary">CD</Typography>
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