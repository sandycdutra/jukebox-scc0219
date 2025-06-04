import Grid from '@mui/material/Grid';
import ProductCard from './ProductCard.jsx';
import '../css/main.css';

function ProductGrid({ products, showRemoveButton = false, onRemoveItem }) { 
    const gridBreakpoints = {
        mobile: 12,
        tablet: 6,
        laptop: 4,
        desktop: 3
    };

    return (
        <div className="products-grid-container">
            <Grid container spacing={2} sx={{
                padding: 0,
                maxWidth: 'none',
                justifyContent: 'space-between',
                margin: '0 auto',
                alignItems: 'stretch'
            }}>
                {products.map((product) => (
                    <Grid key={product.id} {...gridBreakpoints} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <ProductCard
                            product={product}
                            onRemove={showRemoveButton ? onRemoveItem : undefined}
                        />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default ProductGrid;