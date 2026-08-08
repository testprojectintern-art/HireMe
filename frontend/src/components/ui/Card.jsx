export default function Card({ children, className = '', glow = false, ...props }) {
    return (
        <div
            className={`glass-panel rounded-2xl transition-all duration-300 hover:shadow-card-hover hover:-translate-y-[1px] ${glow ? 'card-glow' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}