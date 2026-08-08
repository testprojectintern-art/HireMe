import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            return () => window.removeEventListener('keydown', handleEsc);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizes = {
        sm:  'max-w-md',
        md:  'max-w-lg',
        lg:  'max-w-2xl',
        xl:  'max-w-4xl',
        '2xl': 'max-w-6xl',
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-[2px] animate-fade-in"
            onClick={onClose}
        >
            <div
                className={`glass-panel w-full ${sizes[size]} max-h-[92vh] sm:max-h-[90vh] flex flex-col
                    rounded-t-3xl sm:rounded-2xl shadow-2xl animate-slide-up`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Mobile drag handle */}
                <div className="flex justify-center pt-3 pb-1 sm:hidden">
                    <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-slate-700" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex-shrink-0">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate pr-3">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 flex-shrink-0"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">{children}</div>
            </div>
        </div>
    );
}