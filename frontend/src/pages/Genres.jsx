import React, { useState, useEffect } from 'react'; 
import { Box, Typography, Button, Breadcrumbs, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material'; 
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import MuiLink from '@mui/material/Link';

import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductGrid from '../components/ProductGrid';

 
import '../css/main.css';
import '../css/categorypage.css'; // Reutiliza o CSS para o layout da página de categoria

function Genres () {
    const navigate = useNavigate();

    const [sortBy, setSortBy] = useState('none');
    const [selectedGenreFilter, setSelectedGenreFilter] = useState('all'); // Filtro padrão: 'all'

    const [allProducts, setAllProducts] = useState([]); // Estado para todos os produtos obtidos do backend
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [error, setError] = useState(null); // Estado para erros na requisição

    // Fetch todos os produtos do backend ao carregar a página
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true); // Inicia o estado de carregamento
                const response = await fetch('http://localhost:5000/api/products'); 
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setAllProducts(data); // Define os produtos vindo do backend
                setError(null); // Limpa qualquer erro anterior
            } catch (err) {
                console.error("Error fetching products for Genres page:", err); // Log mais específico
                setError("Failed to load products. Please try again later."); // Mensagem de erro para o usuário
            } finally {
                setLoading(false); // Finaliza o estado de carregamento
            }
        };
        fetchProducts();
    }, []); // Dependência vazia: executa uma vez ao montar o componente


    const genreCategoriesForSidebar = [
        'All', 'Classical', 'Country', 'Electronic', 'Hip Hop', 'Indie', 'POP', 'Rap', 'R&B', 'Rock'
    ];

    // Produtos BASE para a página. Para Genres, são TODOS os produtos.
    const baseProductsForPage = allProducts;

    // Aplicar o filtro de GÊNERO da sidebar sobre os produtos base.
    const filteredByGenre = baseProductsForPage.filter(product => {
        if (selectedGenreFilter === 'all') {
            return true; // Se 'All' na sidebar, mostra todos os produtos base
        }
        const lowerCaseSelectedGenre = selectedGenreFilter.toLowerCase();
        // Verifica se o genre OU subgenre do produto corresponde ao filtro da sidebar
        return (product.metadata?.genre && product.metadata.genre.toLowerCase() === lowerCaseSelectedGenre) ||
               (product.metadata?.subgenre && product.metadata.subgenre.toLowerCase() === lowerCaseSelectedGenre);
    });

    // Lógica de ordenação
    const sortedProducts = [...filteredByGenre].sort((a, b) => {
        if (sortBy === 'title-asc') {
            return a.name.localeCompare(b.name); 
        }
        if (sortBy === 'title-desc') {
            return b.name.localeCompare(a.name); 
        }
        return 0;
    });

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Loading genres...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                <Typography color="error" variant="h6">{error}</Typography>
                <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>Retry</Button>
            </Box>
        );
    }

    return (
        <>
            <Header />

            <Box className="category-page-container">
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4, mt: 2 }}>
                    <MuiLink underline="hover" color="inherit" component={RouterLink} to="/">
                        Home
                    </MuiLink>
                    <Typography color="text.primary">Genres</Typography>
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
                                    label="Order by:"
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
                                    No products found for this genre. {/* <--- Mensagem mais genérica */}
                                </Typography>
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: '#2009EA', '&:hover': { backgroundColor: '#1a07bb' } }}
                                    onClick={() => navigate('/')}
                                >
                                    Go to home page {/* <--- Texto do botão atualizado */}
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

export default Genres;