import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({
    label,
    value,
    icon: Icon,
    color = 'emerald',
    trend,
    trendLabel,
    loading = false,
    id,
}) {
    const colors = {
        indigo: {
            icon: 'bg-indigo-50 text-indigo-600 border border-indigo-200',
            shadow: 'shadow-indigo-500/10',
        },
        emerald: {
            icon: 'bg-emerald-50 text-[#46a021] border border-emerald-200',
            shadow: 'shadow-emerald-500/10',
        },
        amber: {
            icon: 'bg-amber-50 text-amber-600 border border-amber-200',
            shadow: 'shadow-amber-500/10',
        },
        rose: {
            icon: 'bg-rose-50 text-rose-600 border border-rose-200',
            shadow: 'shadow-rose-500/10',
        },
        violet: {
            icon: 'bg-purple-50 text-purple-600 border border-purple-200',
            shadow: 'shadow-purple-500/10',
        },
        cyan: {
            icon: 'bg-cyan-50 text-cyan-600 border border-cyan-200',
            shadow: 'shadow-cyan-500/10',
        },
    };
    const c = colors[color] || colors.emerald;

    const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
    const trendColor = trend > 0 ? 'text-[#46a021]' : trend < 0 ? 'text-rose-600' : 'text-slate-400';

    return (
        <div
            id={id}
            className="relative bg-white border border-slate-200/90 rounded-2xl p-5 overflow-hidden
                       shadow-md shadow-slate-200/50 hover:shadow-xl hover:border-slate-300 transition-all duration-200 group"
        >
            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">{label}</p>
                    {loading ? (
                        <div className="mt-2 h-8 w-20 bg-slate-100 rounded animate-pulse" />
                    ) : (
                        <p className="mt-1 text-3xl font-black text-slate-900 tabular-nums">{value ?? '—'}</p>
                    )}
                    {trendLabel && !loading && (
                        <div className={`mt-2 flex items-center gap-1 text-xs font-bold ${trendColor}`}>
                            <TrendIcon size={13} />
                            <span>{trendLabel}</span>
                        </div>
                    )}
                </div>
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs shrink-0 ${c.icon}`}>
                    <Icon size={20} />
                </div>
            </div>
        </div>
    );
}
