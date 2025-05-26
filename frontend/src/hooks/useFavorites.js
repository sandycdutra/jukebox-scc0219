// frontend/src/hooks/useFavorites.js
import { useState, useEffect } from 'react';

const FAVORITES_STORAGE_KEY = 'jukebox_favorites';

export function useFavorites() {
    // Inicializa o estado com os favoritos do localStorage ou um array vazio
    const [favorites, setFavorites] = useState(() => {
        try {
            const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
            return storedFavorites ? JSON.parse(storedFavorites) : [];
        } catch (error) {
            console.error("Erro ao carregar favoritos do localStorage:", error);
            return [];
        }
    });

    // Efeito para salvar os favoritos no localStorage sempre que o estado 'favorites' mudar
    useEffect(() => {
        try {
            localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
        } catch (error) {
            console.error("Erro ao salvar favoritos no localStorage:", error);
        }
    }, [favorites]); // Dependência: executa quando 'favorites' muda

    // Função para adicionar um produto aos favoritos
    const addFavorite = (product) => {
        setFavorites((prevFavorites) => {
            // Garante que o produto não seja adicionado duas vezes
            if (!prevFavorites.some(fav => fav.id === product.id)) {
                return [...prevFavorites, product];
            }
            return prevFavorites;
        });
    };

    // Função para remover um produto dos favoritos
    const removeFavorite = (productId) => {
        setFavorites((prevFavorites) =>
            prevFavorites.filter(fav => fav.id !== productId)
        );
    };

    // Função para verificar se um produto está nos favoritos
    const isFavorite = (productId) => {
        return favorites.some(fav => fav.id === productId);
    };

    return { favorites, addFavorite, removeFavorite, isFavorite };
}