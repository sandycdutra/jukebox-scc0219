// frontend/src/components/ProductGrid.jsx
import Grid from '@mui/material/Grid';
// Certifique-se de que o ProductCard está preparado para um botão de remover opcional
import ProductCard from './ProductCard.jsx';
// Remover esta linha, pois os produtos virão via prop
// import products from '../mockdata/products.jsx'
import '../css/main.css';

// O ProductGrid agora aceita 'products' como uma prop
function ProductGrid({ products, showRemoveButton = false, onRemoveItem }) { // Adicione props para remoção
    // breakpoint values
    const gridBreakpoints = {
        mobile: 12,
        tablet: 6,
        laptop: 4,
        desktop: 3
    };

    return (
        // Use uma classe mais genérica para o container do grid, ou ajuste no CSS
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
                            // Passa a prop onRemove para o ProductCard se for para mostrar o botão
                            onRemove={showRemoveButton ? onRemoveItem : undefined}
                        />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default ProductGrid;