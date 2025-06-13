import Footer from '../components/Footer';
import React, { useState, useEffect } from 'react';
import Carousel from '../components/Carousel';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import { Box, Button, CircularProgress, Typography } from '@mui/material'; 

function Home() {
    const [allProducts, setAllProducts] = useState([]); // Estado para os produtos
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [error, setError] = useState(null); // Estado para erros
    // useEffect para buscar todos os produtos do BACKEND ao montar o componente
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
                console.error("Error fetching products:", err);
                setError("Failed to load products. Please try again later."); // Mensagem de erro para o usuário
            } finally {
                setLoading(false); // Finaliza o estado de carregamento
            }
        };

        fetchProducts();
    }, []); // Dependência vazia: executa uma vez ao montar o componente

    // Exibe um spinner de carregamento enquanto os produtos são buscados
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Loading products...</Typography>
            </Box>
        );
    }

    // Exibe uma mensagem de erro se a busca falhar
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
            <Header/>

            <h1 className="h1">WHAT'S NEW!</h1>
            <Carousel/>

            <h1 className="h1">check our products</h1>
            <Box sx={{ padding: { xs: '20px', md: '20px 160px' } }}>
                <ProductGrid products={allProducts}/>
            </Box>

            <Footer/>
        </>
    );
}

export default Home;