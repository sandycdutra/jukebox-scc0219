import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Close as CloseIcon } from '@mui/icons-material';
import '../css/main.css';
import '../css/product.css';

function ProductCard({ product, onRemove }) {
    const productDetailUrl = `/product/${product.id}`;

    return (
        <div style={{ position: 'relative' }}>
            <Link to={productDetailUrl} className="product-card-link">
                <div className="product-button">
                    <img src={product.image} alt={product.title}></img>
                    <div className="product-info">
                        <p className="product-type">{product.type}</p>
                        <h3 className="product-title">{product.title}</h3>
                        <p className="product-artist">{product.artist}</p>
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