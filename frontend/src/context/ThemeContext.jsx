import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Initial theme from localStorage or default to 'dark'
    const [theme, setThemeState] = useState(() => {
        try {
            const savedTheme = localStorage.getItem('deepcheck_theme');
            if (savedTheme === 'light' || savedTheme === 'dark') {
                return savedTheme;
            }
        } catch (e) {
            console.error('Failed to read theme from localStorage', e);
        }
        return 'dark'; // Default theme
    });

    // Update DOM and localStorage whenever theme changes
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
            root.style.colorScheme = 'dark';
        } else {
            root.classList.remove('dark');
            root.classList.add('light');
            root.style.colorScheme = 'light';
        }

        try {
            localStorage.setItem('deepcheck_theme', theme);
        } catch (e) {
            console.error('Failed to save theme to localStorage', e);
        }
    }, [theme]);

    const isDark = theme === 'dark';

    const toggleTheme = () => {
        setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    const setTheme = (newTheme) => {
        if (newTheme === 'dark' || newTheme === 'light') {
            setThemeState(newTheme);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
