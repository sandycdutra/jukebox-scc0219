// frontend/src/hooks/useCart.js
import { useState, useEffect, useCallback } from 'react';
import { getInitialProductStock } from '../utils/initialStock';

const CART_STORAGE_KEY = 'jukebox_cart';
const STOCK_STORAGE_KEY = 'jukebox_product_stock';

export function useCart() {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const storedCartItems = localStorage.getItem(CART_STORAGE_KEY);
            return storedCartItems ? JSON.parse(storedCartItems) : [];
        } catch (error) {
            console.error("Erro ao carregar itens do carrinho do localStorage:", error);
            return [];
        }
    });

    const [mockStock, setMockStock] = useState(() => {
        try {
            const storedStock = localStorage.getItem(STOCK_STORAGE_KEY);
            const parsedStock = storedStock ? JSON.parse(storedStock) : null;

            if (parsedStock && typeof parsedStock === 'object' && !Array.isArray(parsedStock)) {
                return parsedStock;
            }
            console.log("Inicializando/Resetando estoque no localStorage para valores iniciais.");
            return getInitialProductStock();
        } catch (error) {
            console.error("Erro ao carregar ou inicializar estoque do localStorage, usando valores padrão:", error);
            return getInitialProductStock();
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        } catch (error) {
            console.error("Erro ao salvar itens do carrinho no localStorage:", error);
        }
    }, [cartItems]);

    useEffect(() => {
        try {
            localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(mockStock));
        } catch (error) {
            console.error("Erro ao salvar estoque no localStorage:", error);
        }
    }, [mockStock]);

    const getStock = useCallback((productId) => {
        return mockStock[productId] || 0;
    }, [mockStock]);

    const updateProductStock = useCallback((productId, newStock) => {
        setMockStock(prevStock => ({
            ...prevStock,
            [productId]: newStock
        }));
        console.log(`Estoque de produto ${productId} atualizado para: ${newStock}`);
    }, []); // updateProductStock não depende de nada externo que mude a cada render, apenas de setMockStock que é estável.


    // MEMOIZE addToCart com useCallback
    const addToCart = useCallback((product, quantityToAdd) => {
        setCartItems((prevItems) => { // setCartItems é uma função estável fornecida pelo React
            const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
            // Chama getStock aqui. Como getStock é memoizado com mockStock, não haverá loop.
            const currentStock = getStock(product.id);
            const currentCartQuantity = existingItemIndex > -1 ? prevItems[existingItemIndex].quantity : 0;
            const requestedTotalQuantity = currentCartQuantity + quantityToAdd;

            if (currentStock === 0) {
                alert(`Desculpe, o produto "${product.title}" está esgotado!`);
                return prevItems;
            }

            if (quantityToAdd <= 0) {
                alert("A quantidade a adicionar deve ser maior que zero.");
                return prevItems;
            }

            if (requestedTotalQuantity > currentStock) {
                alert(`Não há estoque suficiente para adicionar ${quantityToAdd} unidades de "${product.title}". Estoque disponível: ${currentStock - currentCartQuantity}`);
                return prevItems;
            }

            if (existingItemIndex > -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity = requestedTotalQuantity;
                return updatedItems;
            } else {
                return [...prevItems, { ...product, quantity: quantityToAdd }];
            }
        });
    }, [getStock, setCartItems]); // <--- DEPENDÊNCIAS CORRETAS: getStock e setCartItems (setCartItems é estável)

    // MEMOIZE removeFromCart com useCallback
    const removeFromCart = useCallback((productId) => {
        setCartItems((prevItems) => {
            const itemToRemove = prevItems.find(item => item.id === productId);
            if (itemToRemove) {
                // Ao remover do carrinho, devolve o estoque
                updateProductStock(productId, getStock(productId) + itemToRemove.quantity);
            }
            return prevItems.filter(item => item.id !== productId); // Use item.id para filtrar
        });
    }, [updateProductStock, getStock, setCartItems]); // <--- DEPENDÊNCIAS CORRETAS: updateProductStock, getStock, setCartItems

    // MEMOIZE updateQuantity com useCallback
    const updateQuantity = useCallback((productId, newQuantity) => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems.map(item => {
                if (item.id === productId) {
                    const oldQuantity = item.quantity;
                    const stockAvailable = getStock(productId) + oldQuantity;
                    
                    if (newQuantity <= 0) {
                        return { ...item, quantity: 0 };
                    }
                    
                    if (newQuantity > stockAvailable) {
                        alert(`Não há estoque suficiente para ${newQuantity} unidades. Estoque disponível: ${stockAvailable}.`);
                        return { ...item, quantity: oldQuantity };
                    }
                    
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }).filter(item => item.quantity > 0);

            return updatedItems;
        });
    }, [getStock, setCartItems]); // <--- DEPENDÊNCIAS CORRETAS: getStock, setCartItems

    const getCartSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getTotalItemsInCart = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const resetAllStock = useCallback(() => {
        setMockStock(getInitialProductStock());
        alert('Estoque simulado resetado para valores iniciais!');
        console.log('Estoque resetado:', getInitialProductStock());
    }, []); 

    return {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartSubtotal,
        getTotalItemsInCart,
        getStock,
        updateProductStock,
        resetAllStock,
        setCartItems
    };
}