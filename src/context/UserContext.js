import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    // Check for JWT in cookies when the app loads
    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            fetch('../api/auth/me')  // API route to validate token
                .then(res => res.json())
                .then(data => setUser(data.user))
                .catch(() => setUser(null));
        }
    }, []);

    const login = async (credentials) => {
        const res = await fetch('../api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        const data = await res.json();
        if (res.ok) setUser(data.user);
        return data;
    };

    const logout = async () => {
        await fetch('../api/logout', { method: 'POST' });
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}

// Custom hook for easy access
export function useUser() {
    return useContext(UserContext);
}
