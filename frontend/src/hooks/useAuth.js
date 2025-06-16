// frontend/src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
// import { v4 as uuidv4 } from 'uuid'; // Mantenha se ainda usar em outro lugar

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

    // Efeitos para persistir user e token no localStorage
    useEffect(() => {
        try {
            if (user) {
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
            } else {
                localStorage.removeItem(USER_STORAGE_KEY);
            }
        } catch (error) {
            console.error("Erro ao salvar usuário no localStorage:", error);
        }
    }, [user]);

    useEffect(() => {
        try {
            if (token) {
                localStorage.setItem(TOKEN_STORAGE_KEY, token);
            } else {
                localStorage.removeItem(TOKEN_STORAGE_KEY);
            }
        } catch (error) {
            console.error("Erro ao salvar token no localStorage:", error);
        }
    }, [token]);

    // NOVO e CRÍTICO: Função para atualizar diretamente o objeto 'user' no contexto
    // Todas as funções da API que retornam o usuário atualizado devem chamar isso.
    const updateUserContext = useCallback((updatedUserData) => {
        setUser(updatedUserData);
    }, []); // Não há dependências, pois só manipula o setUser

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
                // Ao fazer login, o backend deve retornar o user completo
                updateUserContext({ // Use updateUserContext para definir o user
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    addresses: data.addresses || [],
                    payment_methods: data.payment_methods || [],
                    phone: data.phone || '',
                    favorite_products: data.favorite_products || [],
                    role: data.role
                });
                setToken(data.token);
                return { success: true, user: data };
            } else {
                return { success: false, message: data.message || 'Login failed' };
            }
        } catch (error) {
            console.error("Server error during login:", error);
            return { success: false, message: 'Server error during login' };
        }
    }, [updateUserContext]); // Adicione updateUserContext às dependências

    // Função para registro
    const register = useCallback(async (userData) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await response.json();

            if (response.ok) {
                updateUserContext({ // Use updateUserContext para definir o user
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    addresses: data.addresses || [],
                    payment_methods: data.payment_methods || [],
                    phone: data.phone || '',
                    favorite_products: data.favorite_products || [],
                    role: data.role
                });
                setToken(data.token);
                return { success: true, user: data };
            } else {
                return { success: false, message: data.message || 'Registration failed' };
            }
        } catch (error) {
            console.error("Server error during registration:", error);
            return { success: false, message: 'Server error during registration' };
        }
    }, [updateUserContext]); // Adicione updateUserContext às dependências

    // Função para logout
    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
    }, []);

    const isAuthenticated = !!user && !!token;

    // --- NOVO: Função para gerenciar dados gerais do perfil ---
    const updateUserProfile = useCallback(async (profileData) => {
        if (!isAuthenticated || !token) return { success: false, message: 'Não autenticado' };
        try {
            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });
            const data = await response.json();

            if (response.ok) {
                // O backend (userController.js) deve retornar 'user: { ... }'
                updateUserContext(data.user); // <-- CRÍTICO: Atualiza o user no contexto com o user COMPLETO do backend
                return { success: true, message: data.message, user: data.user };
            } else {
                return { success: false, message: data.message || 'Falha ao atualizar perfil.' };
            }
        } catch (error) {
            console.error("Erro ao atualizar perfil em useAuth:", error);
            return { success: false, message: 'Erro do servidor ao atualizar perfil.' };
        }
    }, [isAuthenticated, token, updateUserContext]); // Adicione updateUserContext às dependências

    // --- Funções para gerenciar endereços ---
    const addAddress = useCallback(async (newAddressData) => {
        if (!isAuthenticated || !token) return { success: false, message: 'Não autenticado' };
        try {
            const response = await fetch('http://localhost:5000/api/users/profile/address', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newAddressData)
            });
            const data = await response.json();

            if (response.ok) {
                // O backend retorna 'user: { ... }'
                updateUserContext(data.user); // <-- CRÍTICO: Atualiza o user no contexto
                return { success: true, message: data.message, address: data.address };
            } else {
                return { success: false, message: data.message || 'Falha ao adicionar endereço.' };
            }
        } catch (error) {
            console.error("Erro ao adicionar endereço:", error);
            return { success: false, message: 'Erro do servidor ao adicionar endereço.' };
        }
    }, [isAuthenticated, token, updateUserContext]); // Adicione updateUserContext às dependências

    const deleteAddress = useCallback(async (addressId) => {
        if (!isAuthenticated || !token) return { success: false, message: 'Não autenticado' };
        try {
            const response = await fetch(`http://localhost:5000/api/users/profile/address/${addressId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                // O backend retorna 'user: { ... }'
                updateUserContext(data.user); // <-- CRÍTICO: Atualiza o user no contexto
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message || 'Falha ao deletar endereço.' };
            }
        } catch (error) {
            console.error("Erro ao deletar endereço:", error);
            return { success: false, message: 'Erro do servidor ao deletar endereço.' };
        }
    }, [isAuthenticated, token, updateUserContext]); // Adicione updateUserContext às dependências

    // --- Funções para gerenciar métodos de pagamento ---
    const addPaymentMethod = useCallback(async (newMethodData) => {
        if (!isAuthenticated || !token) return { success: false, message: 'Não autenticado' };
        try {
            const response = await fetch('http://localhost:5000/api/users/profile/payment', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newMethodData)
            });
            const data = await response.json();

            if (response.ok) {
                updateUserContext(data.user); // <-- CRÍTICO: Atualiza o user no contexto
                return { success: true, message: data.message, paymentMethod: data.paymentMethod };
            } else {
                return { success: false, message: data.message || 'Falha ao adicionar método de pagamento.' };
            }
        } catch (error) {
            console.error("Erro ao adicionar método de pagamento:", error);
            return { success: false, message: 'Erro do servidor ao adicionar método de pagamento.' };
        }
    }, [isAuthenticated, token, updateUserContext]); // Adicione updateUserContext às dependências

    const deletePaymentMethod = useCallback(async (methodId) => {
        if (!isAuthenticated || !token) return { success: false, message: 'Não autenticado' };
        try {
            const response = await fetch(`http://localhost:5000/api/users/profile/payment/${methodId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                updateUserContext(data.user); // <-- CRÍTICO: Atualiza o user no contexto
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message || 'Falha ao deletar método de pagamento.' };
            }
        } catch (error) {
            console.error("Erro ao deletar método de pagamento:", error);
            return { success: false, message: 'Erro do servidor ao deletar método de pagamento.' };
        }
    }, [isAuthenticated, token, updateUserContext]); // Adicione updateUserContext às dependências

    // --- Funções de favoritos (certifique-se de que também chamam updateUserContext) ---
    // Exemplo:
    const addFavoriteProduct = useCallback(async (productId) => {
        if (!isAuthenticated || !token) return { success: false, message: 'Não autenticado' };
        try {
            const response = await fetch('http://localhost:5000/api/users/favorites', { // ou /api/users/favorites/add, dependendo da sua rota
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId })
            });
            const data = await response.json();
            if (response.ok) {
                // O backend deve retornar o user completo aqui também, ou pelo menos o array de favoritos
                // Se o backend retorna user.favorites, atualize assim:
                updateUserContext({ ...user, favorite_products: data.favorites });
                // Se o backend retorna data.user completo, use: updateUserContext(data.user);
                return { success: true, message: data.message, favorites: data.favorites };
            } else {
                return { success: false, message: data.message || 'Falha ao adicionar favorito.' };
            }
        } catch (error) {
            console.error("Erro ao adicionar favorito:", error);
            return { success: false, message: 'Erro do servidor ao adicionar favorito.' };
        }
    }, [isAuthenticated, token, user, updateUserContext]); 

    const removeFavoriteProduct = useCallback(async (productId) => {
        if (!isAuthenticated || !token) return { success: false, message: 'Não autenticado' };
        try {
            const response = await fetch(`http://localhost:5000/api/users/favorites/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                // O backend deve retornar o user completo aqui também, ou pelo menos o array de favoritos
                updateUserContext({ ...user, favorite_products: data.favorites });
                return { success: true, message: data.message, favorites: data.favorites };
            } else {
                return { success: false, message: data.message || 'Falha ao remover favorito.' };
            }
        } catch (error) {
            console.error("Erro ao remover favorito:", error);
            return { success: false, message: 'Erro do servidor ao remover favorito.' };
        }
    }, [isAuthenticated, token, user, updateUserContext]); 

    const getUserFavorites = useCallback(async () => {
        if (!isAuthenticated || !token) return [];
        try {
            const response = await fetch('http://localhost:5000/api/users/me/favorites', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
                throw new Error(errorData.message);
            }
            const data = await response.json();
            // Esta função GET apenas puxa dados, não modifica o perfil, então não precisa de updateUserContext
            return data; 
        } catch (error) {
            console.error("Erro ao obter favoritos:", error);
            return [];
        }
    }, [isAuthenticated, token]);


    return {
        user,
        isAuthenticated,
        token,
        login,
        register,
        logout,
        updateUserContext,     // Exportado
        updateUserProfile,     // Exportado
        addAddress,            // Exportado
        deleteAddress,         // Exportado
        addPaymentMethod,      // Exportado
        deletePaymentMethod,   // Exportado
        addFavoriteProduct,    // Exportado
        removeFavoriteProduct, // Exportado
        getUserFavorites,      // Exportado
    };
}