import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('deepcheck_user');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error('Failed to parse saved user', e);
            return null;
        }
    });

    // Listen to storage events across tabs
    useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === 'deepcheck_user') {
                try {
                    setUser(e.newValue ? JSON.parse(e.newValue) : null);
                } catch {
                    setUser(null);
                }
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const login = (email, password, name) => {
        const formattedName = name?.trim() || email.split('@')[0] || 'Analyst';
        const userData = {
            email: email.trim(),
            name: formattedName,
            role: 'Verified Researcher',
            joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            avatarInitial: formattedName.charAt(0).toUpperCase()
        };
        localStorage.setItem('deepcheck_user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const loginWithGoogle = () => {
        const userData = {
            email: 'analyst@google.com',
            name: 'Alex Rivera',
            role: 'Lead Fact Checker',
            joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            avatarInitial: 'A'
        };
        localStorage.setItem('deepcheck_user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('deepcheck_user');
        setUser(null);
    };

    const updateUser = (updatedFields) => {
        setUser((prev) => {
            const next = { ...prev, ...updatedFields };
            localStorage.setItem('deepcheck_user', JSON.stringify(next));
            return next;
        });
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            loginWithGoogle,
            logout,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
