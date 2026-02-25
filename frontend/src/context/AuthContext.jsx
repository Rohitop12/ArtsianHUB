import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('artisanhub_token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('artisanhub_user');
        const storedToken = localStorage.getItem('artisanhub_token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    const login = async (email, password, role) => {
        const { data } = await api.post('/auth/login', { email, password, role });
        setUser(data);
        setToken(data.token);
        localStorage.setItem('artisanhub_user', JSON.stringify(data));
        localStorage.setItem('artisanhub_token', data.token);
        return data;
    };

    const register = async (name, email, password, role) => {
        const { data } = await api.post('/auth/register', { name, email, password, role });
        setUser(data);
        setToken(data.token);
        localStorage.setItem('artisanhub_user', JSON.stringify(data));
        localStorage.setItem('artisanhub_token', data.token);
        return data;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('artisanhub_user');
        localStorage.removeItem('artisanhub_token');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export default AuthContext;
