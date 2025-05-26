// frontend/src/pages/Home.jsx
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import allProducts from '../mockdata/products';
import { Box } from '@mui/material'; // <--- Importe Box para usar

function Home() {
    return (
        <>
            <Header/>

            <h1 className="h1">WHAT'S NEW!</h1>
            <Carousel/>

            <h1 className="h1">check our products</h1>
            {/* Aplique o padding aqui para controlar o espaçamento da grid da Home */}
            <Box sx={{ padding: { xs: '20px', md: '20px 160px' } }}> {/* Exemplo de padding responsivo */}
                <ProductGrid products={allProducts}/>
            </Box>

            <Footer/>
        </>
    );
}

export default Home;