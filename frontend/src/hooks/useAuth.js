// frontend/src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';

const USER_STORAGE_KEY = 'jukebox_logged_in_user';

export function useAuth() {
    // user será null se não houver usuário logado, ou o objeto do usuário
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem(USER_STORAGE_KEY);
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Erro ao carregar usuário do localStorage:", error);
            return null;
        }
    });

    // Salva o usuário no localStorage sempre que o estado 'user' mudar
    useEffect(() => {
        try {
            if (user) {
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
            } else {
                localStorage.removeItem(USER_STORAGE_KEY); // Remove se o usuário deslogar
            }
        } catch (error) {
            console.error("Erro ao salvar usuário no localStorage:", error);
        }
    }, [user]);

    // Função de login simulada
    const login = useCallback((userData) => {
        setUser(userData);
        console.log("Usuário logado:", userData);
    }, []);

    // Função de logout
    const logout = useCallback(() => {
        setUser(null);
        console.log("Usuário deslogado.");
    }, []);

    const isAuthenticated = !!user; // Booleano: true se houver um usuário logado

    return { user, isAuthenticated, login, logout };
}