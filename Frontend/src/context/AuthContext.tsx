import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { useApp } from './AppContext';

// @ts-ignore
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // @ts-ignore
    const { setUser: setAppUser } = useApp();

    useEffect(() => {
        checkAuth();
    }, []);

    // @ts-ignore
    const checkAuth = async () => {
        try {
            const response = await authService.checkAuth();
            setUser(response.user);
            setAppUser(response.user);
        } catch (error) {
            setUser(null);
            setAppUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        const response = await authService.login(username, password);
        setUser(response.user);
        setAppUser(response.user);
        return response;
    };

    // @ts-ignore
    const logout = async () => {
        await authService.logout();
        setUser(null);
        setAppUser(null);
    };

    const value = {
        user,
        loading,
        login,
        logout,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};