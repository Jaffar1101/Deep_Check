import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route wrapper that prevents unauthenticated users from accessing protected views.
 * If logged out, replaces browser history with /signin so the browser Back button
 * cannot navigate back into the account.
 */
export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace state={{ from: location.pathname + location.search }} />;
    }

    return children;
};

/**
 * Route wrapper for public auth pages (/signin, /signup).
 * If the user is already authenticated, redirects them directly to the dashboard
 * replacing history so back button behaves consistently.
 */
export const PublicOnlyRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};
