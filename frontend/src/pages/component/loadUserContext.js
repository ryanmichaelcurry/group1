import { useState, useEffect } from 'react';

function getSessionStorageOrDefault(key) {
    
    const stored = sessionStorage.getItem(key);
    if (!stored) {
        return [{
            user_id: 0,
            first: "null",
            last: "null",
            status: "buyer"
        }];
    }
    return JSON.parse(stored);
}

export function useSessionStorage(key) {
    const [value, setValue] = useState(
        getSessionStorageOrDefault(key)
    );

    useEffect(() => {
        sessionStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}