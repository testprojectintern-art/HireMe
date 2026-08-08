import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(() => {
        const cachedLogo = typeof window !== 'undefined' ? localStorage.getItem('hireme_company_logo') : null;
        const cachedName = typeof window !== 'undefined' ? localStorage.getItem('hireme_company_name') : null;
        return {
            companyName: cachedName || 'HireMe',
            logo: cachedLogo || null,
            address: '',
            phone: '',
            email: '',
        };
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchSettings = useCallback(async () => {
        try {
            let apiBase = import.meta.env.VITE_API_URL;
            if (!apiBase) {
                const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
                apiBase = (hostname === 'localhost' || hostname === '127.0.0.1')
                    ? 'http://localhost:5005/api'
                    : 'https://hireme-dp4x.onrender.com/api';
            }
            const res = await axios.get(`${apiBase}/public/settings`);
            if (res.data?.success && res.data.data) {
                const s = res.data.data;
                if (s.logo) {
                    localStorage.setItem('hireme_company_logo', s.logo);
                }
                if (s.companyName) {
                    localStorage.setItem('hireme_company_name', s.companyName);
                }
                setSettings((prev) => ({
                    ...prev,
                    ...s,
                    companyName: s.companyName || 'HireMe',
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

    // Immediately update context & localStorage with new settings
    const updateSettingsInContext = useCallback((newSettings) => {
        if (newSettings.logo !== undefined) {
            if (newSettings.logo) {
                localStorage.setItem('hireme_company_logo', newSettings.logo);
            } else {
                localStorage.removeItem('hireme_company_logo');
            }
        }
        if (newSettings.companyName) {
            localStorage.setItem('hireme_company_name', newSettings.companyName);
        }
        setSettings((prev) => ({ ...prev, ...newSettings }));
    }, []);

    // Re-fetch from server
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
