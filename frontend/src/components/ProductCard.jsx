import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom'; // <--- Importe o Link
import '../css/main.css';
import '../css/product.css';

function ProductCard({ product }) {
    // Define a URL para a página de detalhes do produto usando o ID do produto
    const productDetailUrl = `/product/${product.id}`;

    return (
        // Envolve o conteúdo do ProductCard com o componente Link
        // O `Link` recebe a prop `to` para onde ele deve navegar.
        // A classe `product-card-link` será usada para estilizar o link e remover o sublinhado padrão.
        <Link to={productDetailUrl} className="product-card-link">
            <div className="product-button"> {/* Mantenha o div com a classe product-button para seus estilos */}
                <img src={product.image} alt={product.title}></img>
                <div className="product-info">
                    <p className="product-type">{product.type}</p>
                    <h3 className="product-title">{product.title}</h3>
                    <p className="product-artist">{product.artist}</p>
                    <p className="product-price">${product.price.toFixed(2)}</p>
                </div>
            </div>
        </Link>
    );
}
export default ProductCard;