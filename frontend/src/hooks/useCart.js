// frontend/src/hooks/useCart.js
import { useState, useEffect, useCallback } from 'react';

const CART_STORAGE_KEY = 'jukebox_cart';

export function useCart() {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const storedCartItems = localStorage.getItem(CART_STORAGE_KEY);
            return storedCartItems ? JSON.parse(storedCartItems) : [];
        } catch (error) {
            console.error(error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        } catch (error) {
            console.error("Error saving cart items to localStorage:", error);
        }
    }, [cartItems]);

    // O estoque agora é lido diretamente do product.stock_quantity que vem do backend
    // Não precisamos de getStock ou updateProductStock aqui, eles foram removidos para o backend.

    const addToCart = useCallback((product, quantityToAdd) => {
        setCartItems((prevItems) => {
            console.log(`\n--- [addToCart] Call for Product ID: ${product.id} ---`);
            const existingItemIndex = prevItems.findIndex(item => item.id === product.id);

            // AQUI: currentStockFromSystem agora vem diretamente do objeto 'product' que é passado
            // Certifique-se de que o 'product' que você passa para addToCart SEMPRE tem stock_quantity
            const currentStockFromSystem = product.stock_quantity || 0;
            const currentCartQuantity = existingItemIndex > -1 ? prevItems[existingItemIndex].quantity : 0;
            const requestedTotalQuantity = currentCartQuantity + quantityToAdd;

            console.log(`   Qty in Cart: ${currentCartQuantity}`);
            console.log(`   Qty to Add: ${quantityToAdd}`);
            console.log(`   Current Stock (System): ${currentStockFromSystem}`);
            console.log(`   Total Qty Requested: ${requestedTotalQuantity}`);

            if (currentStockFromSystem === 0) {
                alert(`Sorry, product "${product.name}" is out of stock!`);
                console.log(`   [addToCart] VALIDATION: Product out of stock.`);
                return prevItems;
            }

            if (quantityToAdd <= 0) {
                alert("The quantity to add must be greater than zero.");
                console.log(`   [addToCart] VALIDATION: Qty to add <= 0.`);
                return prevItems;
            }

            if (requestedTotalQuantity > currentStockFromSystem) {
                alert(`There is not enough stock to add ${quantityToAdd} units of "${product.name}". Available stock: ${currentStockFromSystem - currentCartQuantity}`);
                console.log(`   [addToCart] VALIDATION FAILED: Total Qty Requested (${requestedTotalQuantity}) > Current Physical Stock (${currentStockFromSystem}).`);
                return prevItems;
            }
            console.log(`   [addToCart] VALIDATION SUCCESSFUL: Total Qty Requested (${requestedTotalQuantity}) <= Current Physical Stock (${currentStockFromSystem}).`);

            if (existingItemIndex > -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity = requestedTotalQuantity;
                // Ao atualizar um item existente no carrinho, garantir que a versão no carrinho
                // tenha as propriedades stock_quantity e sold_quantity do produto recém-passado (se atualizadas)
                updatedItems[existingItemIndex].stock_quantity = product.stock_quantity;
                updatedItems[existingItemIndex].sold_quantity = product.sold_quantity;
                return updatedItems;
            } else {
                // Ao adicionar um novo item, adicione o produto completo para que ele tenha stock_quantity e sold_quantity
                return [...prevItems, { ...product, quantity: quantityToAdd }];
            }
        });
    }, [setCartItems]); // getStock não é mais dependência.

    const removeFromCart = useCallback((productId) => {
        setCartItems((prevItems) => {
            return prevItems.filter(item => item.id !== productId);
        });
    }, [setCartItems]);

    const updateQuantity = useCallback((productId, newQuantity) => {
        setCartItems((prevItems) => {
            console.log(`\n--- [updateQuantity] Call for Product ID: ${productId} ---`);
            const updatedItems = prevItems.map(item => {
                if (item.id === productId) {
                    const oldQuantity = item.quantity;
                    // AQUI: currentStockFromSystem vem do item que já está no carrinho
                    const currentStockFromSystem = item.stock_quantity || 0;

                    console.log(`   Old Qty: ${oldQuantity}`);
                    console.log(`   New Qty (requested): ${newQuantity}`);
                    console.log(`   Current Stock (System): ${currentStockFromSystem}`);
                    
                    if (newQuantity <= 0) {
                        console.log(`   [updateQuantity] VALIDATION: New Qty <= 0. Removing item.`);
                        return { ...item, quantity: 0 };
                    }
                    
                    if (newQuantity > currentStockFromSystem) {
                        alert(`There is not enough stock for ${newQuantity} units. Available stock: ${currentStockFromSystem}.`);
                        console.log(`   [updateQuantity] VALIDATION FAILED: New Qty (${newQuantity}) > Current Physical Stock (${currentStockFromSystem}).`);
                        return { ...item, quantity: oldQuantity };
                    }
                    console.log(`   [updateQuantity] VALIDATION SUCCESSFUL: New Qty (${newQuantity}) <= Current Physical Stock (${currentStockFromSystem}).`);
                    
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }).filter(item => item.quantity > 0);

            return updatedItems;
        });
    }, [setCartItems]);

    const getCartSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getTotalItemsInCart = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartSubtotal,
        getTotalItemsInCart,
        setCartItems
    };
}