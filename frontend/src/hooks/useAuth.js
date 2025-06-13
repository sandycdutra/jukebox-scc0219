// frontend/src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';

const USER_STORAGE_KEY = 'jukebox_logged_in_user';
const TOKEN_STORAGE_KEY = 'jukebox_auth_token'; // Novo: para armazenar o token JWT

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


    // Função de login real
    const login = useCallback(async (email, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (response.ok) {
                setUser({ // Salva dados do usuário 
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    cep: data.cep,
                    favorite_products: data.favorite_products,
                    role: data.role
                });
                setToken(data.token); // Salva o token JWT
                console.log("Login bem-sucedido:", data);
                return { success: true, user: data };
            } else {
                console.error("Login falhou:", data.message);
                return { success: false, message: data.message || 'Login failed' };
            }
        } catch (error) {
            console.error("Erro de rede/servidor no login:", error);
            return { success: false, message: 'Server error during login' };
        }
    }, []);

    // Função de registro 
    const register = useCallback(async (userData) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await response.json();

            if (response.ok) {
                // Ao registrar, o backend já retorna o token e usuário logado
                setUser({
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    cep: data.cep,
                    favorite_products: data.favorite_products,
                    role: data.role
                });
                setToken(data.token);
                console.log("Registro bem-sucedido:", data);
                return { success: true, user: data };
            } else {
                console.error("Registro falhou:", data.message);
                return { success: false, message: data.message || 'Registration failed' };
            }
        } catch (error) {
            console.error("Erro de rede/servidor no registro:", error);
            return { success: false, message: 'Server error during registration' };
        }
    }, []);

    // Função de logout
    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        console.log("Usuário deslogado.");
    }, []);

    const isAuthenticated = !!user && !!token; // Considera autenticado se houver user E token

    return { user, isAuthenticated, token, login, register, logout }; // Expor token também
}