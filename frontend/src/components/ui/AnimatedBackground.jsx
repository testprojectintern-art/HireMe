import React from 'react';

export default function AnimatedBackground() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0" aria-hidden="true">
            {/* HireMe Green Ambient Orb — Top Left */}
            <div
                className="absolute -top-32 -left-32 w-[560px] h-[560px] rounded-full animate-orb-drift"
                style={{
                    background: 'radial-gradient(circle, rgba(85,179,43,0.10) 0%, rgba(85,179,43,0.03) 45%, transparent 70%)',
                    animationDelay: '0s',
                }}
            />

            {/* Teal / Emerald Orb — Bottom Right */}
            <div
                className="absolute -bottom-40 -right-40 w-[640px] h-[640px] rounded-full animate-orb-drift"
                style={{
                    background: 'radial-gradient(circle, rgba(20,184,166,0.08) 0%, rgba(20,184,166,0.02) 45%, transparent 70%)',
                    animationDelay: '-7s',
                }}
            />

            {/* Indigo Accent Orb — Top Right */}
            <div
                className="absolute -top-16 right-1/4 w-[420px] h-[420px] rounded-full animate-orb-drift"
                style={{
                    background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 65%)',
                    animationDelay: '-12s',
                    animationDuration: '22s',
                }}
            />

            {/* Soft overlay breathing layer */}
            <div
                className="absolute inset-0 animate-pulse-gradient"
                style={{
                    background: 'radial-gradient(ellipse at 70% 20%, rgba(85,179,43,0.04) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(20,184,166,0.04) 0%, transparent 55%)',
                }}
            />
        </div>
    );
}
