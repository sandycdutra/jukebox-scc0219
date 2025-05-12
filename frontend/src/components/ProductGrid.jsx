import Grid from '@mui/material/Grid';
import ProductCard from './ProductCard.jsx';
import products from '../mockdata/products.jsx'
import '../css/main.css'

function ProductGrid() {

    // breakpoint values
    const gridBreakpoints = {
        mobile: 12,
        tablet: 6,
        laptop: 4,
        desktop: 3
    };

    return (
        <div className="main-grid">
            <Grid container spacing={2} sx={{ 
                padding: 0,
                maxWidth: 'none',
                justifyContent: 'space-between', //the albuns adjust to the width
                margin: '0 auto',
                alignItems: 'stretch'
            }}>
                {products.map((product) => (
                    <Grid key={product.id} {...gridBreakpoints} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default ProductGrid;