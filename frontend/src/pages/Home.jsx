// frontend/src/pages/Home.jsx
import React from 'react'; // Importe React
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import allProducts from '../mockdata/products';
import { Box, Button } from '@mui/material'; // <--- Importe Button do MUI para o botão de reset

// Importe o useCart para acessar resetAllStock
import { useCart } from '../hooks/useCart'; // <--- ADICIONE ESTA LINHA

function Home() {
    const { resetAllStock } = useCart(); // <--- Obtenha a função resetAllStock do hook

    return (
        <>
            <Header/>

            <h1 className="h1">WHAT'S NEW!</h1>
            <Carousel/>

            <h1 className="h1">check our products</h1>
            {/* Passe a lista de produtos para o ProductGrid como uma prop */}
            <Box sx={{ padding: { xs: '20px', md: '20px 160px' } }}>
                <ProductGrid products={allProducts}/>
            </Box>

            {/* BOTÃO PARA RESETAR O ESTOQUE SIMULADO (Apenas para desenvolvimento/teste) */}
            <Box sx={{ textAlign: 'center', mt: 5, mb: 5 }}>
                <Button
                    variant="outlined"
                    onClick={resetAllStock} // <--- Chama a função para resetar o estoque
                    sx={{
                        borderColor: 'orange',
                        color: 'orange',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 165, 0, 0.1)',
                            borderColor: 'darkorange',
                            color: 'darkorange'
                        }
                    }}
                >
                    Reset Stock to 5 Units (ADMIN)
                </Button>
            </Box>

            <Footer/>
        </>
    );
}

export default Home;