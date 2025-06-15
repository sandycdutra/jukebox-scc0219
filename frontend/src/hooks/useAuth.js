// frontend/src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';

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
                setUser({ // Salva dados do usuário (sem o token, token é separado)
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    // NOVO:
                    addresses: data.addresses || [],
                    payment_methods: data.payment_methods || [],
                    phone: data.phone || '', // Garante que phone venha ou seja vazio
                    favorite_products: data.favorite_products,
                    role: data.role
                });
                setToken(data.token);
                return { success: true, user: data };
            } else {
                return { success: false, message: data.message || 'Login failed' };
            }
        } catch (error) {
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
                    // NOVO:
                    addresses: data.addresses || [],
                    payment_methods: data.payment_methods || [],
                    phone: data.phone || '', // Garante que phone venha ou seja vazio
                    favorite_products: data.favorite_products,
                    role: data.role
                });
                setToken(data.token);
                return { success: true, user: data };
            } else {
                return { success: false, message: data.message || 'Registration failed' };
            }
        } catch (error) {
            return { success: false, message: 'Server error during registration' };
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
    }, []);

    const isAuthenticated = !!user && !!token;

    // --- NOVAS FUNÇÕES PARA GERENCIAR ENDEREÇOS E MÉTODOS DE PAGAMENTO VIA API ---

    const addAddress = useCallback(async (newAddressData) => {
        if (!isAuthenticated || !token) return { success: false, message: 'Not authenticated' };
        try {
            const response = await fetch('http://localhost:5000/api/auth/profile', { // Atualiza o perfil inteiro
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ addresses: [...(user.addresses || []), { ...newAddressData, id: uuidv4() }] }) // Adiciona ID
            });
            const data = await response.json();
            if (response.ok) {
                setUser(prevUser => ({ ...prevUser, addresses: data.addresses }));
                // Opcional: setToken(data.token); se o token é atualizado no PUT profile
                return { success: true, user: data };
            } else {
                return { success: false, message: data.message || 'Failed to add address.' };
            }
        } catch (error) {
            return { success: false, message: 'Server error adding address.' };
        }
    }, [isAuthenticated, token, user, setUser]);

    const deleteAddress = useCallback(async (addressId) => {
        if (!isAuthenticated || !token) return { success: false, message: 'Not authenticated' };
        try {
            const updatedAddresses = user.addresses.filter(addr => addr.id !== addressId);
            const response = await fetch('http://localhost:5000/api/auth/profile', { // Atualiza o perfil inteiro
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ addresses: updatedAddresses })
            });
            const data = await response.json();
            if (response.ok) {
                setUser(prevUser => ({ ...prevUser, addresses: data.addresses }));
                return { success: true, user: data };
            } else {
                return { success: false, message: data.message || 'Failed to delete address.' };
            }
        } catch (error) {
            return { success: false, message: 'Server error deleting address.' };
        }
    }, [isAuthenticated, token, user, setUser]);

    const addPaymentMethod = useCallback(async (newMethodData) => {
        if (!isAuthenticated || !token) return { success: false, message: 'Not authenticated' };
        try {
            const response = await fetch('http://localhost:5000/api/auth/payment-methods', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newMethodData)
            });
            const data = await response.json();
            if (response.ok) {
                setUser(prevUser => ({ ...prevUser, payment_methods: data.userPaymentMethods }));
                return { success: true, paymentMethod: data.paymentMethod };
            } else {
                return { success: false, message: data.message || 'Failed to add payment method.' };
            }
        } catch (error) {
            return { success: false, message: 'Server error adding payment method.' };
        }
    }, [isAuthenticated, token, user, setUser]);

    const deletePaymentMethod = useCallback(async (methodId) => {
        if (!isAuthenticated || !token) return { success: false, message: 'Not authenticated' };
        try {
            const response = await fetch(`http://localhost:5000/api/auth/payment-methods/${methodId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setUser(prevUser => ({ ...prevUser, payment_methods: data.userPaymentMethods }));
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message || 'Failed to delete payment method.' };
            }
        } catch (error) {
            return { success: false, message: 'Server error deleting payment method.' };
        }
    }, [isAuthenticated, token, user, setUser]);


    return { user, isAuthenticated, token, login, register, logout, addAddress, deleteAddress, addPaymentMethod, deletePaymentMethod };
}