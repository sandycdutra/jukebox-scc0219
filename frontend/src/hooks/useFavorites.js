// frontend/src/hooks/useFavorites.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';


// REMOVIDO: import allProductsData from '../mockdata/products'; // Esta linha deve ter sido removida em uma etapa anterior.
// Se ainda estiver lá, remova-a para evitar dependência de mockdata.

const FAVORITES_STORAGE_KEY = 'jukebox_favorites_local_cache'; // Manter para cache local, se quiser

export function useFavorites() {
    const { user, token, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(true);
    const [errorFavorites, setErrorFavorites] = useState(null);

    const fetchFavorites = useCallback(async () => {
        if (!isAuthenticated || !token || !user?._id) {
            setFavorites([]);
            setLoadingFavorites(false);
            return;
        }

        setLoadingFavorites(true);
        setErrorFavorites(null);
        try {
            const response = await fetch(`http://localhost:5000/api/users/me/favorites`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const detailedFavorites = await response.json();

            setFavorites(detailedFavorites);
        } catch (error) {
            console.error("Error fetching favorites:", error);
            setErrorFavorites('Failed to load favorites: ' + error.message);
            setFavorites([]);
        } finally {
            setLoadingFavorites(false);
        }
    }, [isAuthenticated, token, user?._id]);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    const addFavorite = useCallback(async (product) => {
        if (!isAuthenticated || !token || !user?._id) {
            alert('Please log in to add favorites.');
            navigate('/Login');
            return { success: false, message: 'Not authenticated' };
        }
        if (favorites.some(fav => String(fav.id) === String(product.id))) {
             return { success: true, message: 'Product already in favorites' };
        }

        try {
            const response = await fetch('http://localhost:5000/api/users/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId: product.id }) // <--- AJUSTADO: Removido userId
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to add favorite. Status: ${response.status}`);
            }
            const data = await response.json();
            await fetchFavorites();
            return { success: true, message: data.message };
        } catch (error) {
            console.error("Error adding favorite:", error);
            setErrorFavorites('Failed to add favorite: ' + error.message);
            return { success: false, message: error.message || 'Failed to add favorite.' };
        }
    }, [isAuthenticated, token, favorites, user?._id, fetchFavorites, navigate]);


    const removeFavorite = useCallback(async (productId) => {
        if (!isAuthenticated || !token || !user?._id) {
            alert('Please log in to remove favorites.');
            navigate('/Login');
            return { success: false, message: 'Not authenticated' };
        }

        try {
            const response = await fetch(`http://localhost:5000/api/users/favorites/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to remove favorite. Status: ${response.status}`);
            }
            const data = await response.json();
            await fetchFavorites();
            return { success: true, message: data.message };
        } catch (error) {
            console.error("Error removing favorite:", error);
            setErrorFavorites('Failed to remove favorite: ' + error.message);
            return { success: false, message: error.message || 'Failed to remove favorite.' };
        }
    }, [isAuthenticated, token, user?._id, fetchFavorites, navigate]);


    const isFavorite = useCallback((productId) => {
        return favorites.some(fav => String(fav.id) === String(productId));
    }, [favorites]);

    return { favorites, addFavorite, removeFavorite, isFavorite, loadingFavorites, errorFavorites };
}