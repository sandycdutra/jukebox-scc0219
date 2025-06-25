// frontend/src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// <--- CORRIGIDO AQUI: Usar import para uuidv4
import { v4 as uuidv4 } from 'uuid'; 


const USER_STORAGE_KEY = 'jukebox_logged_in_user';
const TOKEN_STORAGE_KEY = 'jukebox_auth_token';

export function useAuth() {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem(USER_STORAGE_KEY);
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Erro ao carregar usuário do localStorage:", error);
            return null;
        }
    });

    const [token, setToken] = useState(() => {
        try {
            return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
        } catch (error) {
            console.error("Erro ao carregar token do localStorage:", error);
            return null;
        }
    });

    const navigate = useNavigate();

    // Efeitos para persistir user e token no localStorage
    useEffect(() => {
        try { if (user) { localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user)); } else { localStorage.removeItem(USER_STORAGE_KEY); } } catch (error) { console.error("Erro ao salvar usuário no localStorage:", error); }
    }, [user]);

    useEffect(() => {
        try { if (token) { localStorage.setItem(TOKEN_STORAGE_KEY, token); } else { localStorage.removeItem(TOKEN_STORAGE_KEY); } } catch (error) { console.error("Erro ao salvar token do localStorage:", error); }
    }, [token]);


    const updateUserContext = useCallback((updatedUserData) => {
        setUser(updatedUserData);
    }, []);

    // Função para login
    const login = useCallback(async (email, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (response.ok) {
                setUser({
                    _id: data._id, name: data.name, email: data.email,
                    phone: data.phone, addresses: data.addresses || [], payment_methods: data.payment_methods || [],
                    favorite_products: data.favorite_products, role: data.role
                });
                setToken(data.token);
                return { success: true, user: data };
            } else { throw new Error(data.message || 'Login failed'); }
        } catch (error) { throw new Error(error.message || 'Server error during login'); }
    }, []);

    const register = useCallback(async (userData) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await response.json();

            if (response.ok) {
                setUser({
                    _id: data._id, name: data.name, email: data.email,
                    phone: data.phone, addresses: data.addresses || [], payment_methods: data.payment_methods || [],
                    favorite_products: data.favorite_products, role: data.role
                });
                setToken(data.token);
                return { success: true, user: data };
            } else { throw new Error(data.message || 'Registration failed'); }
        } catch (error) { throw new Error(error.message || 'Server error during registration'); }
    }, []);

    // Função para logout
    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
    }, []);

    const isAuthenticated = !!user && !!token;
    const isAuthenticatedAdmin = isAuthenticated && user?.role === 'admin';

    // --- FUNÇÃO PRINCIPAL PARA ATUALIZAR PERFIL ---
    const updateUserProfile = useCallback(async (profileUpdateData) => {
        console.log("[useAuth:updateUserProfile] Called with data:", profileUpdateData);
        if (!isAuthenticated || !token) {
            console.error("[useAuth:updateUserProfile] Not authenticated. Cannot update profile.");
            throw new Error('Not authenticated to update profile.');
        }
        try {
            const response = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileUpdateData)
            });
            console.log("[useAuth:updateUserProfile] Backend response status:", response.status);
            const data = await response.json().catch(() => ({ message: 'Unknown error (JSON parse failed)' }));

            if (response.ok) {
                console.log("[useAuth:updateUserProfile] Profile update successful. Data:", data);
                setUser({
                    _id: data._id, name: data.name, email: data.email, phone: data.phone,
                    addresses: data.addresses || [], payment_methods: data.payment_methods || [],
                    favorite_products: data.favorite_products, role: data.role
                });
                setToken(data.token);
                return { success: true, user: data };
            } else {
                console.error("[useAuth:updateUserProfile] Backend reported error:", data.message);
                throw new Error(data.message || 'Failed to update profile.');
            }
        } catch (error) {
            console.error("[useAuth:updateUserProfile] Error during fetch or JSON parse:", error);
            throw new Error(error.message || 'Network error or invalid response from server.');
        }
    }, [isAuthenticated, token, setUser, setToken, user]);


    // --- Gerenciamento de Endereços (Chama updateUserProfile com o array completo) ---
    const addAddress = useCallback(async (newAddressData) => {
        if (!isAuthenticated || !token) { throw new Error('Not authenticated to add address'); }
        // Constrói o array COMPLETO de endereços para enviar ao updateUserProfile
        const addressesToUpdate = [...(user.addresses || []), { ...newAddressData, id: uuidv4() }]; // Novo ID para o endereço
        try {
            const result = await updateUserProfile({ ...user, addresses: addressesToUpdate }); // Envia user completo com novo array
            if (result.success) {
                // Se bem-sucedido, o setUser em updateUserProfile já atualizou o contexto
                // Retorna o endereço recém-adicionado (que já tem o ID gerado aqui ou no backend)
                const addedAddress = addressesToUpdate.find(addr => addr.street === newAddressData.street && addr.zip_code === newAddressData.zip_code);
                return { success: true, message: 'Address added', address: addedAddress };
            } else {
                throw new Error(result.message || 'Failed to add address.');
            }
        } catch (error) { throw error; }
    }, [isAuthenticated, token, user, updateUserProfile]);

    const deleteAddress = useCallback(async (addressId) => {
        if (!isAuthenticated || !token) { throw new Error('Not authenticated to delete address'); }
        const updatedAddresses = (user.addresses || []).filter(addr => addr.id !== addressId);
        try {
            const result = await updateUserProfile({ ...user, addresses: updatedAddresses }); // Envia user completo com array filtrado
            if (result.success) {
                return { success: true, message: 'Address deleted', user: result.user };
            } else {
                throw new Error(result.message || 'Failed to delete address.');
            }
        } catch (error) { throw error; }
    }, [isAuthenticated, token, user, updateUserProfile]);


    // --- Gerenciamento de Métodos de Pagamento (Chama updateUserProfile com o array completo) ---
    const addPaymentMethod = useCallback(async (newMethodData) => {
        if (!isAuthenticated || !token) { throw new Error('Not authenticated to add payment method'); }
        const paymentMethodsToUpdate = [...(user.payment_methods || []), { ...newMethodData, id: uuidv4() }]; // Novo ID para o método
        try {
            const result = await updateUserProfile({ ...user, payment_methods: paymentMethodsToUpdate });
            if (result.success) {
                // Retorna o método de pagamento recém-adicionado
                const addedMethod = paymentMethodsToUpdate.find(method => method.cardNumberLast4 === newMethodData.cardNumberLast4 && method.cardExpiry === newMethodData.cardExpiry);
                return { success: true, message: 'Payment method added', paymentMethod: addedMethod };
            } else {
                throw new Error(result.message || 'Failed to add payment method.');
            }
        } catch (error) { throw error; }
    }, [isAuthenticated, token, user, updateUserProfile]);

    const deletePaymentMethod = useCallback(async (methodId) => {
        if (!isAuthenticated || !token) { throw new Error('Not authenticated to delete payment method'); }
        const updatedPaymentMethods = (user.payment_methods || []).filter(method => method.id !== methodId);
        try {
            const result = await updateUserProfile({ ...user, payment_methods: updatedPaymentMethods });
            if (result.success) {
                return { success: true, message: 'Payment method deleted', user: result.user };
            } else {
                throw new Error(result.message || 'Failed to delete payment method.');
            }
        } catch (error) { throw error; }
    }, [isAuthenticated, token, user, updateUserProfile]);

    // --- Funções de favoritos (Já ajustadas para chamar rotas /api/auth/favorites ou /api/auth/me/favorites) ---
    const addFavoriteProduct = useCallback(async (product) => {
        if (!isAuthenticated || !token) { alert('Please log in to add favorites.'); navigate('/Login'); return { success: false, message: 'Not authenticated' }; }
        if (user.favorite_products.some(fav => String(fav) === String(product.id))) { return { success: true, message: 'Product already in favorites' }; } // Fix: fav.id to fav (it's an ID string)
        try {
            const response = await fetch('http://localhost:5000/api/auth/favorites', {
                method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ productId: product.id })
            });
            const data = await response.json();

            if (response.ok) {
                setUser(data.user); // Update user context with new favorites array
                return { success: true, message: data.message, favorites: data.favorites };
            } else { throw new Error(data.message || 'Failed to add favorite.'); }
        } catch (error) { return { success: false, message: error.message || 'Server error adding favorite.' }; }
    }, [isAuthenticated, token, user, setUser, navigate]);

    const removeFavoriteProduct = useCallback(async (productId) => {
        if (!isAuthenticated || !token) { alert('Please log in to remove favorites.'); navigate('/Login'); return { success: false, message: 'Not authenticated' }; }
        try {
            const response = await fetch(`http://localhost:5000/api/auth/favorites/${productId}`, {
                method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setUser(data.user); // Update user context with new favorites array
                return { success: true, message: data.message, favorites: data.favorites };
            } else { throw new Error(data.message || 'Failed to remove favorite.'); }
        } catch (error) { return { success: false, message: error.message || 'Server error removing favorite.' }; }
    }, [isAuthenticated, token, user, setUser, navigate]);

    const getUserFavorites = useCallback(async () => {
        if (!isAuthenticated || !token) return [];
        try {
            const response = await fetch('http://localhost:5000/api/auth/me/favorites', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
                throw new Error(errorData.message);
            }
            const data = await response.json();
            return data.favorites; // Retorna o array de produtos favoritos completos
        }
        catch (error) {
            console.error("Erro ao obter favoritos:", error);
            return [];
        }
    }, [isAuthenticated, token]);


    return {
        user, isAuthenticated, isAuthenticatedAdmin, token, login, register, logout,
        updateUserContext, updateUserProfile, addAddress, deleteAddress, addPaymentMethod, deletePaymentMethod,
        addFavoriteProduct, removeFavoriteProduct, getUserFavorites,
    };
}