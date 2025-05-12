import { Button, Box, Typography } from '@mui/material';
import '../css/main.css'
import '../css/product.css'

function ProductCard({ product }) {
    return (
        <button className="product-button">
            <img src={product.image} alt={product.title}></img>
            <div className="product-info">
                <p className="product-type">{product.type}</p>
                <h3 className="product-title">{product.title}</h3>
                <p className="product-artist">{product.artist}</p>
                <p className="product-price">${product.price.toFixed(2)}</p>
            </div>
        </button>
    );
}
export default ProductCard;