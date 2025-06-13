// frontend/src/components/ProductCard.jsx
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Close as CloseIcon } from '@mui/icons-material';
import '../css/main.css';
import '../css/product.css';

function ProductCard({ product, onRemove }) {
    const productDetailUrl = `/product/${product.id}`; // O ID vem do backend

    return (
        <div style={{ position: 'relative' }}>
            <Link to={productDetailUrl} className="product-card-link">
                <div className="product-button">
                    {/* IMAGEM: Usa a primeira URL do array 'images' que vem do backend.
                        Se o array 'images' não existir ou estiver vazio, usa um placeholder. */}
                    <img
                        src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/250x250/cccccc/333333?text=No+Image'}
                        alt={product.name} /* Usa product.name para o alt text */
                    ></img>
                    <div className="product-info">
                        <p className="product-type">{product.type}</p>
                        {/* TÍTULO: Usa product.name, que é o campo do backend */}
                        <h3 className="product-title">{product.name}</h3>
                        {/* ARTISTA: Usa product.metadata?.artist para acessar o artista via metadata */}
                        <p className="product-artist">{product.metadata?.artist}</p>
                        {/* PREÇO: Usa product.price diretamente (se o JSON está OK, este deve ser o problema) */}
                        <p className="product-price">${product.price.toFixed(2)}</p>
                    </div>
                </div>
            </Link>
            {onRemove && (
                <Button
                    variant="contained"
                    color="error"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemove(product.id);
                    }}
                    sx={{
                        position: 'absolute',
                        top: 5,
                        right: 5,
                        minWidth: 'unset',
                        padding: '4px',
                        borderRadius: '50%',
                        height: '30px',
                        width: '30px',
                        zIndex: 10,
                        opacity: 0.8,
                        '&:hover': { opacity: 1 }
                    }}
                >
                    <CloseIcon sx={{ fontSize: '1.2rem' }} />
                </Button>
            )}
        </div>
    );
}
export default ProductCard;