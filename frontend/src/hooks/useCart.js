// frontend/src/hooks/useCart.js
import { useState, useEffect } from 'react';

const CART_STORAGE_KEY = 'jukebox_cart';

export function useCart() {
    // Inicializa o estado do carrinho com os dados do localStorage ou um array vazio
    const [cartItems, setCartItems] = useState(() => {
        try {
            const storedCartItems = localStorage.getItem(CART_STORAGE_KEY);
            return storedCartItems ? JSON.parse(storedCartItems) : [];
        } catch (error) {
            console.error("Erro ao carregar itens do carrinho do localStorage:", error);
            return [];
        }
    });

    // Salva os itens do carrinho no localStorage sempre que o estado 'cartItems' mudar
    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        } catch (error) {
            console.error("Erro ao salvar itens do carrinho no localStorage:", error);
        }
    }, [cartItems]);

    // Adiciona um produto ao carrinho ou atualiza sua quantidade
    const addToCart = (product, quantity) => {
        setCartItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex(item => item.id === product.id);

            if (existingItemIndex > -1) {
                // Se o item já existe, atualiza a quantidade
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += quantity;
                return updatedItems;
            } else {
                // Se o item não existe, adiciona-o com a quantidade inicial
                return [...prevItems, { ...product, quantity }];
            }
        });
    };

    // Remove um item do carrinho
    const removeFromCart = (productId) => {
        setCartItems((prevItems) =>
            prevItems.filter(item => item.id !== productId)
        );
    };

    // Atualiza a quantidade de um item específico no carrinho
    const updateQuantity = (productId, newQuantity) => {
        setCartItems((prevItems) =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            ).filter(item => item.quantity > 0) // Remove item se a quantidade for 0
        );
    };

    // Calcula o subtotal do carrinho
    const getCartSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Calcula a quantidade total de itens diferentes no carrinho
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
        setCartItems // Opcional: para limpar o carrinho, por exemplo
    };
}