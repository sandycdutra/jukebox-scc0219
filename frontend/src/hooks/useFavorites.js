// frontend/src/hooks/useFavorites.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // Para gerar IDs temporários no frontend, se necessário

const USER_STORAGE_KEY = 'jukebox_logged_in_user';
const TOKEN_STORAGE_KEY = 'jukebox_auth_token';

// Chave para carrinho de convidado (se o useCart ainda usar)
const GUEST_CART_STORAGE_KEY = 'jukebox_guest_cart';


export function useFavorites() {
    // <--- OBTEM isAuthenticatedAdmin do useAuth
    const { user, token, isAuthenticated, isAuthenticatedAdmin, logout } = useAuth(); 
    const navigate = useNavigate(); // Obtenha navigate aqui para usar em callbacks

    const [favorites, setFavorites] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(true);
    const [errorFavorites, setErrorFavorites] = useState(null);

    // Função para buscar os favoritos do backend
    const fetchFavorites = useCallback(async () => {
        setLoadingFavorites(true);
        setErrorFavorites(null);
        try {
            // Se não autenticado ou se for admin, não busca favoritos (admin não tem favoritos de cliente)
            if (!isAuthenticated || !token || !user?._id || isAuthenticatedAdmin) {
                setFavorites([]);
                setLoadingFavorites(false);
                return;
            }

            const response = await fetch('http://localhost:5000/api/auth/me/favorites', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    logout();
                    alert("Your session has expired. Please log in again.");
                }
                const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
                throw new Error(errorData.message);
            }
            const data = await response.json();
            setFavorites(data.favorites); // A API retorna data.favorites
        } catch (error) {
            console.error("Erro ao obter favoritos:", error);
            setErrorFavorites('Falha ao carregar favoritos: ' + error.message);
            setFavorites([]);
        } finally {
            setLoadingFavorites(false);
        }
    }, [isAuthenticated, isAuthenticatedAdmin, token, user, logout]); // Adicionado isAuthenticatedAdmin e logout

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    // Função para adicionar um produto aos favoritos via Backend
    const addFavorite = useCallback(async (product) => {
        // <--- BLOQUEIO PARA ADMINISTRADORES AQUI ---
        if (isAuthenticatedAdmin) {
            alert('Administrators cannot add items to favorites.');
            return { success: false, message: 'Admin cannot favorite items' };
        }

        if (!isAuthenticated || !token || !user?._id) {
            alert('Please log in to add favorites.');
            navigate('/Login');
            return { success: false, message: 'Not authenticated' };
        }
        if (favorites.some(fav => String(fav.id) === String(product.id))) {
             return { success: true, message: 'Product already in favorites' };
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/favorites', {
                method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ productId: product.id })
            });
            const data = await response.json();
            if (response.ok) {
                // A API authController.js já atualiza o user no backend e retorna o user atualizado.
                // O useAuth.js (updateUserProfile) lida com a atualização do contexto do user.
                await fetchFavorites(); // Re-busca os favoritos para atualizar a lista
                return { success: true, message: data.message, favorites: data.favorites };
            } else { throw new Error(data.message || 'Failed to add favorite.'); }
        } catch (error) { return { success: false, message: error.message || 'Server error adding favorite.' }; }
    }, [isAuthenticated, isAuthenticatedAdmin, token, user, favorites, fetchFavorites, navigate]); // Adicionado isAuthenticatedAdmin

    // Função para remover um produto dos favoritos via Backend
    const removeFavorite = useCallback(async (productId) => {
        // <--- BLOQUEIO PARA ADMINISTRADORES AQUI ---
        if (isAuthenticatedAdmin) {
            alert('Administrators cannot remove items from favorites.');
            return { success: false, message: 'Admin cannot unfavorite items' };
        }

        if (!isAuthenticated || !token || !user?._id) {
            alert('Please log in to remove favorites.');
            navigate('/Login');
            return { success: false, message: 'Not authenticated' };
        }
        try {
            const response = await fetch(`http://localhost:5000/api/auth/favorites/${productId}`, {
                method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                await fetchFavorites(); // Re-busca os favoritos para atualizar a lista
                return { success: true, message: data.message, favorites: data.favorites };
            } else { throw new Error(data.message || 'Failed to remove favorite.'); }
        } catch (error) { return { success: false, message: error.message || 'Server error removing favorite.' }; }
    }, [isAuthenticated, isAuthenticatedAdmin, token, user, fetchFavorites, navigate]);

    // Função para verificar se um produto está nos favoritos (localmente)
    const isFavorite = useCallback((productId) => {
        return favorites.some(fav => String(fav.id) === String(productId));
    }, [favorites]);


    return {
        favorites, addFavorite, removeFavorite, isFavorite, loadingFavorites, errorFavorites
    };
}