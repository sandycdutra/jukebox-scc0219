// frontend/src/hooks/useFavorites.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth'; 
import { useNavigate } from 'react-router-dom';

const FAVORITES_STORAGE_KEY = 'jukebox_favorites_local_cache'; 

export function useFavorites() {
    // Pegue as funções de favoritos do useAuth (que agora estão atualizando o contexto do user)
    const { user, token, isAuthenticated, getUserFavorites, addFavoriteProduct, removeFavoriteProduct } = useAuth(); 
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
            // getUserFavorites do useAuth agora retorna diretamente o array de produtos detalhados
            const detailedFavorites = await getUserFavorites(); 
            setFavorites(detailedFavorites); 
        } catch (err) {
            console.error("Error fetching favorites:", err);
            setErrorFavorites('Failed to load favorites: ' + err.message);
            setFavorites([]); 
        } finally {
            setLoadingFavorites(false);
        }
    }, [isAuthenticated, token, user?._id, getUserFavorites]); // Adicione getUserFavorites às dependências

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    // O parâmetro 'product' aqui deve ser o objeto completo do produto que você quer favoritar
    const handleAddFavorite = useCallback(async (product) => { 
        if (!isAuthenticated || !token || !user?._id) {
            alert('Please log in to add favorites.');
            navigate('/Login');
            return { success: false, message: 'Not authenticated' };
        }
        // Verifica se o produto já está nos favoritos locais (para evitar chamada desnecessária à API)
        if (favorites.some(fav => String(fav.id) === String(product.id))) {
             return { success: true, message: 'Product already in favorites' };
        }

        try {
            // Chama a função do useAuth para adicionar favorito (envia apenas o ID)
            const result = await addFavoriteProduct(product.id); 
            
            if (result.success) {
                await fetchFavorites(); // Re-busca para garantir os detalhes completos
                return { success: true, message: result.message };
            }
            return { success: false, message: result.message || 'Falha ao adicionar favorito.' };
        } catch (error) {
            console.error("Error adding favorite:", error);
            setErrorFavorites('Failed to add favorite: ' + error.message);
            return { success: false, message: error.message || 'Failed to add favorite.' };
        }
    }, [isAuthenticated, token, user, favorites, fetchFavorites, navigate, addFavoriteProduct]);


    const handleRemoveFavorite = useCallback(async (productId) => { // Recebe apenas o ID do produto a remover
        if (!isAuthenticated || !token || !user?._id) {
            alert('Please log in to remove favorites.');
            navigate('/Login');
            return { success: false, message: 'Not authenticated' };
        }
        // Verifica se o produto está nos favoritos locais antes de tentar remover
        if (!favorites.some(fav => String(fav.id) === String(productId))) {
            return { success: true, message: 'Product not in favorites' };
        }

        try {
            // Chama a função do useAuth para remover favorito
            const result = await removeFavoriteProduct(productId); 

            if (result.success) {
                await fetchFavorites(); // Re-busca para garantir a atualização
                return { success: true, message: result.message };
            }
            return { success: false, message: result.message || 'Falha ao remover favorito.' };
        } catch (error) {
            console.error("Error removing favorite:", error);
            setErrorFavorites('Failed to remove favorite: ' + error.message);
            return { success: false, message: error.message || 'Failed to remove favorite.' };
        }
    }, [isAuthenticated, token, user, favorites, fetchFavorites, navigate, removeFavoriteProduct]);


    const isFavorite = useCallback((productId) => {
        // Verifica se o ID do produto está na lista de favoritos (que são objetos de produto completos)
        return favorites.some(fav => String(fav.id) === String(productId));
    }, [favorites]);

    return {
        favorites,
        addFavorite: handleAddFavorite,
        removeFavorite: handleRemoveFavorite,
        isFavorite,
        loadingFavorites,
        errorFavorites
    };
}