export default function Button({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    onClick,
    className = '',
    ...props
}) {
    const baseStyles = [
        'inline-flex items-center justify-center font-semibold rounded-xl',
        'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-[0.97]',
        'shimmer-btn',
    ].join(' ');

    const variants = {
        primary: [
            'bg-gradient-to-br from-hireme-500 to-hireme-600 text-white',
            'hover:from-hireme-400 hover:to-hireme-500',
            'shadow-md hover:shadow-glow-green',
            'focus:ring-hireme-500',
        ].join(' '),
        secondary: [
            'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200',
            'hover:bg-gray-200 dark:hover:bg-slate-700',
            'focus:ring-gray-400',
        ].join(' '),
        danger: [
            'bg-gradient-to-br from-red-500 to-red-600 text-white',
            'hover:from-red-400 hover:to-red-500',
            'shadow-md hover:shadow-lg hover:shadow-red-500/30',
            'focus:ring-red-500',
        ].join(' '),
        outline: [
            'border-2 border-hireme-500 text-hireme-600 dark:text-hireme-400 bg-transparent',
            'hover:bg-hireme-50 dark:hover:bg-hireme-950/40',
            'focus:ring-hireme-500',
        ].join(' '),
        ghost: [
            'text-gray-700 dark:text-gray-300',
            'hover:bg-gray-100 dark:hover:bg-slate-800',
        ].join(' '),
        warning: [
            'bg-gradient-to-br from-amber-500 to-orange-500 text-white',
            'hover:from-amber-400 hover:to-orange-400',
            'shadow-md hover:shadow-lg hover:shadow-amber-500/30',
            'focus:ring-amber-500',
        ].join(' '),
    };

    const sizes = {
        xs: 'px-2.5 py-1 text-xs gap-1',
        sm: 'px-3.5 py-1.5 text-sm gap-1.5',
        md: 'px-4.5 py-2 text-sm gap-2',
        lg: 'px-6 py-3 text-base gap-2',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
            {...props}
        >
            {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
            ) : null}
            {children}
        </button>
    );
}