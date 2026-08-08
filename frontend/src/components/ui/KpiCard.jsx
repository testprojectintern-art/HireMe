import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from './Card';

export default function KpiCard({
    label, value, icon: Icon, iconColor = 'text-hireme-600', iconBg = 'bg-hireme-50',
    trend = null, subtext = null, onClick = null, accentColor = null, accentClass = null,
    gradientFrom = '#55b32b', gradientTo = '#41a020',
}) {
    const hasTrend = trend !== null && trend !== undefined;
    const trendUp = hasTrend && trend >= 0;

    const defaultAccentStyle = accentClass
        ? {}
        : { background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})` };

    return (
        <Card
            className={`p-5 relative overflow-hidden group ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            {/* Subtle gradient background wash */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at top right, ${gradientFrom}0a 0%, transparent 65%)` }}
            />

            <div className="flex items-start justify-between relative z-10">
                <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                        {label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white leading-tight truncate">
                        {value}
                    </p>

                    <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                        {hasTrend && (
                            <div className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 ${trendUp ? 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'}`}>
                                {trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                {Math.abs(trend)}%
                            </div>
                        )}
                        {subtext && (
                            <p className="text-xs text-gray-400 dark:text-slate-500 font-medium">{subtext}</p>
                        )}
                    </div>
                </div>

                {Icon && (
                    <div
                        className={`${iconBg} ${iconColor} w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ml-3 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}
                    >
                        <Icon size={22} />
                    </div>
                )}
            </div>

            {/* Full-width gradient accent bar at bottom */}
            <div
                className={`absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-500 ease-out ${accentClass ?? ''}`}
                style={defaultAccentStyle}
            />

            {/* Static partial accent bar (always visible) */}
            <div
                className={`absolute bottom-0 left-0 h-[3px] w-[40%] opacity-70 ${accentClass ?? ''}`}
                style={accentClass ? {} : defaultAccentStyle}
            />
        </Card>
    );
}