import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import allProducts from '../mockdata/products';
import { Box, Button } from '@mui/material';

import { useCart } from '../hooks/useCart';

function Home() {
    const { resetAllStock } = useCart();

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