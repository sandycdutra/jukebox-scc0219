// frontend/src/hooks/useCart.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

const GUEST_CART_STORAGE_KEY = 'jukebox_guest_cart';

export function useCart() {
    const { user, token, isAuthenticated, logout } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loadingCart, setLoadingCart] = useState(true);
    const [errorCart, setErrorCart] = useState(null);

    const fetchCart = useCallback(async () => {
        setLoadingCart(true);
        setErrorCart(null);
        try {
            let fetchedItems = [];
            if (isAuthenticated && token) {
                console.log("[useCart:fetchCart] Authenticated. Fetching cart from backend...");
                const response = await fetch('http://localhost:5000/api/cart', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("[useCart:fetchCart] Backend response status (GET /api/cart):", response.status);
                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        logout();
                        alert("Your session has expired. Please log in again.");
                    }
                    const errorData = await response.json().catch(() => ({ message: 'Unknown error (JSON parse failed)' }));
                    throw new Error(errorData.message || `Failed to fetch cart. Status: ${response.status}`);
                }
                const data = await response.json();
                console.log("[useCart:fetchCart] Raw cart data from backend (GET /api/cart):", data);
                fetchedItems = data.items; // AQUI PEGA OS ITENS DO OBJETO CARRINHO
                localStorage.removeItem(GUEST_CART_STORAGE_KEY); 
            } else {
                console.log("[useCart:fetchCart] Guest. Fetching cart from localStorage...");
                const storedGuestCart = localStorage.getItem(GUEST_CART_STORAGE_KEY);
                fetchedItems = storedGuestCart ? JSON.parse(storedGuestCart) : [];
            }
            setCartItems(fetchedItems);
            console.log("[useCart:fetchCart] cartItems state updated to:", fetchedItems);

        } catch (error) {
            console.error("[useCart:fetchCart] Error during cart fetch:", error);
            setErrorCart('Failed to load cart: ' + error.message);
            setCartItems([]);
        } finally {
            setLoadingCart(false);
        }
    }, [isAuthenticated, token, logout, setCartItems]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    useEffect(() => {
        if (!isAuthenticated) {
            try {
                localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(cartItems));
                console.log("[useCart:localStorage] Guest cart saved:", cartItems);
            } catch (error) {
                console.error("[useCart:localStorage] Error saving guest cart to localStorage:", error);
            }
        }
    }, [cartItems, isAuthenticated]);

    const addToCart = useCallback(async (product, quantityToAdd) => {
        console.log(`\n--- [addToCart] Call for Product ID: ${product.id} ---`);
        setLoadingCart(true);
        setErrorCart(null);
        try {
            let updatedCartResponse; // Variável para a resposta da API
            if (isAuthenticated && token) {
                console.log("[useCart:addToCart] Authenticated. Calling POST /api/cart/add backend API...");
                const response = await fetch('http://localhost:5000/api/cart/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ product: product, quantity: quantityToAdd })
                });
                console.log("[useCart:addToCart] Backend response status (POST /api/cart/add):", response.status);
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'Unknown error (JSON parse failed)' }));
                    throw new Error(errorData.message || `Failed to add item to cart. Status: ${response.status}`);
                }
                updatedCartResponse = await response.json(); // Pega a resposta completa do carrinho
                console.log("[useCart:addToCart] Raw cart data from backend (POST /api/cart/add):", updatedCartResponse);
                setCartItems(updatedCartResponse.items); // <--- ATUALIZA COM OS ITENS DA RESPOSTA
                console.log("[useCart:addToCart] Cart state updated from backend:", updatedCartResponse.items);
            } else {
                console.log("[useCart:addToCart] Guest user. Updating localStorage cart...");
                setCartItems(prevItems => {
                    const existingItemIndex = prevItems.findIndex(item => String(item.id) === String(product.id));
                    const currentCartQuantity = existingItemIndex > -1 ? prevItems[existingItemIndex].quantity : 0;
                    const requestedTotalQuantity = currentCartQuantity + quantityToAdd;

                    const currentProductStock = product.stock_quantity || 0;
                    if (currentProductStock === 0 || requestedTotalQuantity > currentProductStock) {
                        alert(`Not enough stock for "${product.name}". Available: ${currentProductStock - currentCartQuantity}.`);
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
                setLoadingCart(false);
                return;
            }
        } catch (error) {
            console.error("[useCart:addToCart] Error adding to cart:", error);
            setErrorCart('Failed to add to cart: ' + error.message);
        } finally {
            setLoadingCart(false);
        }
    }, [isAuthenticated, token, user, setCartItems]);

    /**
     * Remove um item do carrinho (via Backend ou localStorage).
     */
    const removeFromCart = useCallback(async (productId) => {
        setLoadingCart(true);
        setErrorCart(null);
        try {
            let updatedCart = {};
            if (isAuthenticated && token) {
                // Se autenticado, chama API do backend
                const response = await fetch(`http://localhost:5000/api/cart/remove/${productId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'Unknown error (JSON parse failed)' }));
                    throw new Error(errorData.message || `Failed to remove item. Status: ${response.status}`);
                }
                updatedCart = await response.json();
            } else {
                // Se não autenticado, remove do localStorage (guest cart)
                setCartItems(prevItems => prevItems.filter(item => String(item.id) !== String(productId)));
                setLoadingCart(false);
                return;
            }
            setCartItems(updatedCart.items);
        } catch (error) {
            console.error("Error removing from cart:", error);
            setErrorCart('Failed to remove from cart: ' + error.message);
        } finally {
            setLoadingCart(false);
        }
    }, [isAuthenticated, token, setCartItems]);

    /**
     * Atualiza a quantidade de um item no carrinho (via Backend ou localStorage).
     */
    const updateQuantity = useCallback(async (productId, newQuantity) => {
        setLoadingCart(true);
        setErrorCart(null);
        try {
            let updatedCart = {};
            if (isAuthenticated && token) {
                // Se autenticado, chama API do backend
                const response = await fetch('http://localhost:5000/api/cart/update-quantity', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ productId, quantity: newQuantity })
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'Unknown error (JSON parse failed)' }));
                    throw new Error(errorData.message || `Failed to update quantity. Status: ${response.status}`);
                }
                updatedCart = await response.json();
            } else {
                // Se não autenticado, atualiza no localStorage (guest cart)
                setCartItems(prevItems => prevItems.map(item => {
                    if (String(item.id) === String(productId)) {
                        const currentProductStock = item.stock_quantity || 0;
                        if (newQuantity <= 0) return { ...item, quantity: 0 };
                        if (newQuantity > currentProductStock) {
                            alert(`Not enough stock for "${item.name}". Available: ${currentProductStock}.`);
                            return { ...item, quantity: item.quantity };
                        }
                        return { ...item, quantity: newQuantity };
                    }
                    return item;
                }).filter(item => item.quantity > 0));
                setLoadingCart(false);
                return;
            }
            setCartItems(updatedCart.items);
        } catch (error) {
            console.error("Error updating quantity:", error);
            setErrorCart('Failed to update quantity: ' + error.message);
        } finally {
            setLoadingCart(false);
        }
    }, [isAuthenticated, token, setCartItems]);


    const getCartSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getTotalItemsInCart = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    /**
     * Limpa o carrinho do usuário logado (via Backend) ou o carrinho de convidado (localStorage).
     */
    const clearCart = useCallback(async () => {
        setLoadingCart(true);
        setErrorCart(null);
        try {
            if (isAuthenticated && token) {
                // Se autenticado, chama API do backend para limpar o carrinho
                const response = await fetch('http://localhost:5000/api/cart/clear', {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'Unknown error (JSON parse failed)' }));
                    throw new Error(errorData.message || `Failed to clear cart. Status: ${response.status}`);
                }
            } else {
                // Se não autenticado, limpa o carrinho de convidado do localStorage
                localStorage.removeItem(GUEST_CART_STORAGE_KEY);
            }
            setCartItems([]); // Limpa o estado local do carrinho
        } catch (error) {
            console.error("Error clearing cart:", error);
            setErrorCart('Failed to clear cart: ' + error.message);
        } finally {
            setLoadingCart(false);
        }
    }, [isAuthenticated, token, setCartItems]);

    /**
     * Migra o carrinho de convidado (localStorage) para o carrinho do usuário no backend
     * após um login bem-sucedido.
     */
    const migrateGuestCartToUser = useCallback(async () => {
        const storedGuestCart = localStorage.getItem(GUEST_CART_STORAGE_KEY);
        if (storedGuestCart && isAuthenticated && token) {
            const guestItems = JSON.parse(storedGuestCart);
            if (guestItems.length > 0) {
                setLoadingCart(true);
                setErrorCart(null);
                try {
                    // Para cada item no carrinho de convidado, adicione-o ao carrinho do usuário no backend
                    // A API addToCart já lida com adicionar/atualizar
                    const addPromises = guestItems.map(item =>
                        fetch('http://localhost:5000/api/cart/add', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            // Envia o item completo (que já tem stock_quantity, sold_quantity)
                            body: JSON.stringify({ product: item, quantity: item.quantity })
                        })
                    );
                    const responses = await Promise.all(addPromises);
                    // Verifica se todas as requisições foram bem-sucedidas
                    for (const res of responses) {
                        if (!res.ok) {
                            const errorData = await res.json().catch(() => ({ message: 'Unknown error (JSON parse failed)' }));
                            throw new Error(errorData.message || `Failed to migrate cart item. Status: ${res.status}`);
                        }
                    }
                    localStorage.removeItem(GUEST_CART_STORAGE_KEY);
                    await fetchCart(); // Recarrega o carrinho do backend para o estado local
                } catch (error) {
                    console.error("Error migrating guest cart:", error);
                    setErrorCart('Failed to migrate guest cart: ' + error.message);
                } finally {
                    setLoadingCart(false);
                }
            }
        }
    }, [isAuthenticated, token, fetchCart]);

    return {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartSubtotal,
        getTotalItemsInCart,
        loadingCart,
        errorCart,
        clearCart,
        migrateGuestCartToUser,
        setCartItems // <--- ESSENCIAL: Retornando setCartItems
    };
}