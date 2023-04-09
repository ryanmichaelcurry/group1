import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState({
        user_id: 0,
        first: 'John',
        last: 'Doe',
        status: 'buyer',
    });

    const login = (userId, First, Last, Status) => {
        setUser({ user_id: userId, first: First, last: Last, status: Status });
    };

    const logout = () => {
        setUser({ user_id: 0, first: 'John', last: 'Doe', status: 'buyer' });
    };

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        if (savedUser) {
            setUser(savedUser);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
