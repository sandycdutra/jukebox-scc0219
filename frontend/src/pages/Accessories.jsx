// frontend/src/pages/Accessories.jsx
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
import '../css/categorypage.css'; // Reutiliza o CSS para o layout da página de categoria

function Accessories () {
    const navigate = useNavigate();

    const [sortBy, setSortBy] = useState('none');
    // O filtro padrão da sidebar é 'all' para ver todos os acessórios
    const [selectedGenreFilter, setSelectedGenreFilter] = useState('all');

    // LISTA DE GÊNEROS/TIPOS PARA A SIDEBAR (Ajuste conforme seus acessórios)
    // Aqui, para acessórios, você pode ter sub-tipos como "Headphones", "Cables", "Cleaning Kits", etc.
    // Certifique-se de que esses valores estejam no campo 'genre' ou 'subgenre' dos seus acessórios no mockdata.
    const accessoryCategoriesForSidebar = [
        'All', // Para ver todos os acessórios
        // Exemplos de subcategorias para acessórios:
        // 'Headphones', 'Cables', 'Cases', 'Cleaning Kits', 'Merchandise'
        // Adicione as categorias reais de acessórios que você tem
        // Para o seu mockdata atual, talvez não haja "gêneros" para acessórios,
        // então esta lista pode ser mais simples ou você pode preencher o campo 'genre'
        // para acessórios com tipos como 'audio', 'protection', 'cleaning', etc.
        'Audio', 'Protection', 'Cleaning' // Exemplo de 'gêneros' para acessórios
    ];


    // PASSO 1: Filtrar os produtos BASE da página. Para Accessories.jsx, são APENAS os acessórios.
    const baseProductsForPage = allProducts.filter(product => product.type.toLowerCase() === 'accessory'); // <--- AQUI ESTÁ O FILTRO BASE

    // PASSO 2: Aplicar o filtro da sidebar sobre os acessórios.
    const filteredByGenre = baseProductsForPage.filter(product => {
        if (selectedGenreFilter === 'all') {
            return true; // Se 'All' na sidebar, mostre todos os acessórios
        }

        const lowerCaseSelectedFilter = selectedGenreFilter.toLowerCase();
        // Verifica se o 'type', 'genre' ou 'subgenre' do acessório corresponde ao filtro da sidebar.
        // Se acessórios não têm 'genre' ou 'subgenre' no seu mockdata, pode ser que você precise
        // adicionar um campo 'accessory_type' ou 'category' para eles.
        return (product.type && product.type.toLowerCase() === lowerCaseSelectedFilter) ||
               (product.genre && product.genre.toLowerCase() === lowerCaseSelectedFilter) ||
               (product.subgenre && product.subgenre.toLowerCase() === lowerCaseSelectedFilter);
    });

    // Lógica de ordenação (aplica-se aos produtos já filtrados)
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
                    <Typography color="text.primary">Accessories</Typography> {/* Nome da categoria atual */}
                </Breadcrumbs>

                <Box className="category-layout">
                    {/* Sidebar de Filtros para Acessórios */}
                    <Box className="category-sidebar">
                        <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>Categories</Typography> {/* Título da sidebar */}
                        {accessoryCategoriesForSidebar.map(category => (
                            <MuiLink
                                key={category}
                                href="#"
                                onClick={(e) => { e.preventDefault(); setSelectedGenreFilter(category.toLowerCase()); }}
                                className={`sidebar-link ${selectedGenreFilter === category.toLowerCase() ? 'active' : ''}`}
                                sx={{ display: 'block', mb: 1 }}
                            >
                                {category}
                            </MuiLink>
                        ))}
                    </Box>

                    {/* Conteúdo Principal (Ordenação + Produtos) */}
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
                                    No Accessories found in this category.
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

export default Accessories;