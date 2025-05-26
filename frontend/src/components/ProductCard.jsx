// frontend/src/components/ProductCard.jsx
import { Box, Typography, Button } from '@mui/material'; // Adicionado Button
import { Link } from 'react-router-dom';
import { Close as CloseIcon } from '@mui/icons-material'; // Importa o ícone de fechar
import '../css/main.css';
import '../css/product.css';

// Aceita uma nova prop 'onRemove' que será uma função
function ProductCard({ product, onRemove }) {
    const productDetailUrl = `/product/${product.id}`;

    return (
        <div style={{ position: 'relative' }}> {/* Wrapper para posicionar o botão de remover */}
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
            {/* Renderiza o botão de remover APENAS se a prop onRemove for fornecida */}
            {onRemove && (
                <Button
                    variant="contained" // Pode ser 'text' ou 'outlined' também
                    color="error" // Cor vermelha padrão do Material-UI
                    onClick={(e) => { // Previne o clique do link do card
                        e.preventDefault();
                        e.stopPropagation();
                        onRemove(product.id); // Chama a função onRemove com o ID do produto
                    }}
                    sx={{
                        position: 'absolute',
                        top: 5,
                        right: 5,
                        minWidth: 'unset', // Para um botão pequeno
                        padding: '4px',
                        borderRadius: '50%', // Faz o botão redondo
                        height: '30px',
                        width: '30px',
                        zIndex: 10, // Garante que fique por cima do card
                        opacity: 0.8,
                        '&:hover': { opacity: 1 }
                    }}
                >
                    <CloseIcon sx={{ fontSize: '1.2rem' }} /> {/* Ícone "X" */}
                </Button>
            )}
        </div>
    );
}
export default ProductCard;