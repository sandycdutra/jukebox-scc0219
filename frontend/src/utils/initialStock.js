// frontend/src/utils/initialStock.js
import products from '../mockdata/products';

export const getInitialProductStock = () => {
    const initialStock = {};
    products.forEach(product => {
        initialStock[product.id] = 5; 
    });
    return initialStock;
};