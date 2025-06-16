// frontend/src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
// import { v4 as uuidv4 } from 'uuid'; 

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


    const login = useCallback(async (email, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (response.ok) {
                // Ao fazer login, a resposta do backend deve ter os arrays de endereços e pagamentos
                setUser({ 
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    addresses: data.addresses || [], // Garante que é um array, mesmo se vazio
                    payment_methods: data.payment_methods || [], // Garante que é um array, mesmo se vazio
                    phone: data.phone || '', 
                    favorite_products: data.favorite_products,
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
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    addresses: data.addresses || [], // Garante que é um array, mesmo se vazio
                    payment_methods: data.payment_methods || [], // Garante que é um array, mesmo se vazio
                    phone: data.phone || '',
                    favorite_products: data.favorite_products,
                    role: data.role
                });
                setToken(data.token);
                return { success: true, user: data };
            } else {
                return { success: false, message: data.message || 'Registration failed' };
            }
        } catch (error) {
            console.error("Server error during registration:", error); // Melhor log
            return { success: false, message: 'Server error during registration' };
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
    }, []);

    const isAuthenticated = !!user && !!token;

    // --- FUNÇÕES PARA GERENCIAR ENDEREÇOS ---
    const addAddress = useCallback(async (newAddressData) => {
        if (!isAuthenticated || !token) return { success: false, message: 'Not authenticated' };
        try {
            // Chame o endpoint específico para adicionar endereço
            const response = await fetch('http://localhost:5000/api/users/profile/address', {
                method: 'PUT', // PUT para adicionar a um array no perfil
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newAddressData) // Envia os dados do endereço
            });
            const data = await response.json();

            if (response.ok) {
                // O backend deve retornar o objeto de usuário ATUALIZADO
                setUser(prevUser => ({ 
                    ...prevUser, 
                    addresses: data.user.addresses // Atualiza com o array de endereços que vem do backend
                }));
                return { success: true, message: data.message, address: data.address }; // Retorna o endereço com o ID gerado pelo backend
            } else {
                return { success: false, message: data.message || 'Failed to add address.' };
            }
        } catch (error) {
            console.error("Error adding address:", error);
            return { success: false, message: 'Server error adding address.' };
        }
    }, [isAuthenticated, token, setUser]); // user removido das dependências para evitar loop, pois data.user já está atualizando

    const deleteAddress = useCallback(async (addressId) => {
        if (!isAuthenticated || !token) return { success: false, message: 'Not authenticated' };
        try {
            // Chame o endpoint específico para deletar endereço
            const response = await fetch(`http://localhost:5000/api/users/profile/address/${addressId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                // O backend deve retornar o objeto de usuário ATUALIZADO
                setUser(prevUser => ({ 
                    ...prevUser, 
                    addresses: data.user.addresses // Atualiza com o array de endereços que vem do backend
                }));
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message || 'Failed to delete address.' };
            }
        } catch (error) {
            console.error("Error deleting address:", error);
            return { success: false, message: 'Server error deleting address.' };
        }
    }, [isAuthenticated, token, setUser]);

    // --- FUNÇÕES PARA GERENCIAR MÉTODOS DE PAGAMENTO ---
    const addPaymentMethod = useCallback(async (newMethodData) => {
        if (!isAuthenticated || !token) return { success: false, message: 'Not authenticated' };
        try {
            // Chame o endpoint específico para adicionar método de pagamento
            const response = await fetch('http://localhost:5000/api/users/profile/payment', {
                method: 'PUT', // PUT para adicionar a um array no perfil
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newMethodData)
            });
            const data = await response.json();

            if (response.ok) {
                // O backend deve retornar o objeto de usuário ATUALIZADO
                setUser(prevUser => ({ 
                    ...prevUser, 
                    payment_methods: data.user.payment_methods // Atualiza com o array de métodos que vem do backend
                }));
                return { success: true, message: data.message, paymentMethod: data.paymentMethod }; // Retorna o método com o ID gerado pelo backend
            } else {
                return { success: false, message: data.message || 'Failed to add payment method.' };
            }
        } catch (error) {
            console.error("Error adding payment method:", error);
            return { success: false, message: 'Server error adding payment method.' };
        }
    }, [isAuthenticated, token, setUser]);

    const deletePaymentMethod = useCallback(async (methodId) => {
        if (!isAuthenticated || !token) return { success: false, message: 'Not authenticated' };
        try {
            // Chame o endpoint específico para deletar método de pagamento
            const response = await fetch(`http://localhost:5000/api/users/profile/payment/${methodId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                // O backend deve retornar o objeto de usuário ATUALIZADO
                setUser(prevUser => ({ 
                    ...prevUser, 
                    payment_methods: data.user.payment_methods // Atualiza com o array de métodos que vem do backend
                }));
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message || 'Failed to delete payment method.' };
            }
        } catch (error) {
            console.error("Error deleting payment method:", error);
            return { success: false, message: 'Server error deleting payment method.' };
        }
    }, [isAuthenticated, token, setUser]);


    return { user, isAuthenticated, token, login, register, logout, addAddress, deleteAddress, addPaymentMethod, deletePaymentMethod };
}