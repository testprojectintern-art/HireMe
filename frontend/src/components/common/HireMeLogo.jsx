import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

export default function HireMeLogo({ size = 'medium', variant = 'light', showIcon = true }) {
    const { settings } = useSettings() || {};
    const isDarkBg = variant === 'dark';

    const textSize = {
        small: 'text-xl',
        medium: 'text-2xl',
        large: 'text-4xl',
    }[size] || 'text-2xl';

    const iconSize = {
        small: 32,
        medium: 38,
        large: 48,
    }[size] || 38;

    // Render custom uploaded logo image + HireMe Brand Name
    if (settings?.logo) {
        return (
            <Link to="/" className="inline-flex items-center gap-2.5 group select-none">
                <img
                    src={settings.logo}
                    alt={settings.companyName || 'HireMe'}
                    style={{ width: iconSize, height: iconSize }}
                    className="object-contain shrink-0 rounded-xl transition-transform group-hover:scale-105 shadow-sm"
                />
                <div className="flex items-center font-black tracking-tight leading-none">
                    <span className={`${isDarkBg ? 'text-white' : 'text-slate-900'} ${textSize} font-black`}>
                        Hire
                    </span>
                    <span className={`text-[#55b32b] ${textSize} font-black ml-0.5`}>
                        Me
                    </span>
                </div>
            </Link>
        );
    }

    // Default Brand Logo: H Badge Icon + HireMe Brand Name
    return (
        <Link to="/" className="inline-flex items-center gap-2.5 group select-none">
            {showIcon && (
                <div
                    style={{ width: iconSize, height: iconSize }}
                    className="rounded-xl bg-[#55b32b] flex items-center justify-center text-white font-black shadow-md shadow-[#55b32b]/30 shrink-0 text-sm tracking-tighter"
                >
                    H
                </div>
            )}
            <div className="flex items-center font-black tracking-tight leading-none">
                <span className={`${isDarkBg ? 'text-white' : 'text-slate-900'} ${textSize} font-black`}>
                    Hire
                </span>
                <span className={`text-[#55b32b] ${textSize} font-black ml-0.5`}>
                    Me
                </span>
            </div>
        </Link>
    );
}

// Standalone Brand Icon (used when only the compact icon badge is needed)
export function HireMeIcon({ size = 36 }) {
    const { settings } = useSettings() || {};

    if (settings?.logo) {
        return (
            <img
                src={settings.logo}
                alt="Logo"
                style={{ width: size, height: size }}
                className="object-contain shrink-0 rounded-xl"
            />
        );
    }

    return (
        <div
            style={{ width: size, height: size }}
            className="rounded-xl bg-[#55b32b] flex items-center justify-center text-white font-black shadow-md shadow-[#55b32b]/30 shrink-0 text-sm tracking-tighter"
        >
            H
        </div>
    );
}
