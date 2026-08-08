import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function SlideDrawer({ open, onClose, title, children, width = 'max-w-md' }) {
    useEffect(() => {
        if (!open) return;
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, onClose]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity duration-300
                    ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                id="slide-drawer-backdrop"
            />
            {/* Drawer */}
            <div
                className={`fixed inset-y-0 right-0 z-50 flex flex-col bg-white border-l border-slate-200
                    shadow-2xl transition-transform duration-300 ease-in-out w-full ${width}
                    ${open ? 'translate-x-0' : 'translate-x-full'}`}
                id="slide-drawer-panel"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0 bg-slate-50/50">
                    <h2 className="text-base font-black text-slate-900">{title}</h2>
                    <button
                        onClick={onClose}
                        id="slide-drawer-close"
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5 text-slate-800">
                    {children}
                </div>
            </div>
        </>
    );
}
