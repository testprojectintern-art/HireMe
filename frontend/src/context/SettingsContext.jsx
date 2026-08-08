import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState({
        companyName: 'HireMe',
        logo: null,
        address: '',
        phone: '',
        email: '',
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchSettings = useCallback(async () => {
        try {
            const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';
            const res = await axios.get(`${apiBase}/public/settings`);
            if (res.data?.success && res.data.data) {
                setSettings((prev) => ({
                    ...prev,
                    ...res.data.data,
                    companyName: res.data.data.companyName || 'HireMe',
                }));
            }
        } catch (err) {
            console.warn('Using default settings context fallback', err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    // Dynamically update browser tab favicon if custom company logo exists!
    useEffect(() => {
        if (settings?.logo) {
            let link = document.querySelector("link[rel*='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = settings.logo;
        }
    }, [settings?.logo]);

    // Immediately update context with new settings (called after successful save)
    const updateSettingsInContext = useCallback((newSettings) => {
        setSettings((prev) => ({ ...prev, ...newSettings }));
    }, []);

    // Re-fetch from server (called after save to confirm persisted data)
    const refreshSettings = useCallback(async () => {
        await fetchSettings();
    }, [fetchSettings]);

    return (
        <SettingsContext.Provider value={{ settings, isLoading, refreshSettings, updateSettingsInContext }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => useContext(SettingsContext) || {};
