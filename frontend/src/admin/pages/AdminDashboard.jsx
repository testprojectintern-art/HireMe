import { Users, Briefcase, ShieldCheck, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useAdminStats, useActivityLog } from '../hooks/useAdminStats';
import { useSocket } from '../context/SocketContext';
import StatCard from '../components/common/StatCard';
import { useNavigate } from 'react-router-dom';

const CATEGORY_COLORS = ['#55b32b', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'];

const STATUS_BADGES = {
    verification: 'bg-emerald-100 text-[#46a021] border border-emerald-300',
    job:          'bg-blue-100 text-blue-700 border border-blue-300',
    dispute:      'bg-rose-100 text-rose-700 border border-rose-300',
};

function ActivityFeed({ data = [], loading }) {
    if (loading) return (
        <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0" />
                    <div className="flex-1 space-y-1.5 pt-1">
                        <div className="h-3 bg-slate-100 rounded w-3/4" />
                        <div className="h-2.5 bg-slate-100/80 rounded w-1/3" />
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="space-y-2">
            {data.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${STATUS_BADGES[item.type] || 'bg-slate-100 text-slate-600'}`}>
                        {item.type}
                    </span>
                    <p className="text-xs text-slate-800 font-semibold flex-1 leading-relaxed">{item.text}</p>
                    <span className="text-[10px] font-bold text-slate-400 shrink-0">{new Date(item.timestamp).toLocaleTimeString()}</span>
                </div>
            ))}
            {data.length === 0 && <p className="text-slate-400 text-xs text-center py-6 font-medium">No recent activity</p>}
        </div>
    );
}

export default function AdminDashboard() {
    const { data, isLoading } = useAdminStats();
    const { data: activity, isLoading: actLoading } = useActivityLog(30);
    const { pendingCount, connected } = useSocket() || {};
    const navigate = useNavigate();

    const kpis = data?.kpis || {};
    const weeklyTrend = data?.weeklyJobsTrend || [];
    const categories = data?.workerCategories || [];

    const fmt = (n) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(0)}k` : String(n ?? 0));
    const fmtCurrency = (n) => `LKR ${fmt(n)}`;

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Page heading */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time overview of HireMe operations</p>
                </div>
                <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border font-extrabold
                    ${connected ? 'bg-emerald-50 border-emerald-300 text-[#46a021]' : 'bg-slate-100 border-slate-200 text-slate-500'}`}
                >
                    <span className={`w-2 h-2 rounded-full ${connected ? 'bg-[#55b32b] animate-pulse' : 'bg-slate-400'}`} />
                    {connected ? 'Live Sync' : 'Connecting…'}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard id="kpi-active-workers"   label="Active Workers"        value={kpis.activeWorkers}       icon={Users}       color="emerald" loading={isLoading} trendLabel="Online + Busy" />
                <StatCard id="kpi-ongoing-jobs"     label="Ongoing Jobs"          value={kpis.ongoingJobs}         icon={Briefcase}   color="cyan"    loading={isLoading} trendLabel="Dispatched + In Progress" />
                <StatCard id="kpi-pending-verify"   label="Pending Verifications" value={pendingCount ?? kpis.pendingVerifications} icon={ShieldCheck} color="amber" loading={isLoading} trendLabel="Requires Review" />
                <StatCard id="kpi-today-revenue"    label="Today's Commission"    value={fmtCurrency(kpis.todayRevenue)} icon={DollarSign} color="violet" loading={isLoading} trendLabel="Platform fees collected" />
            </div>

            {/* Secondary KPI row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard id="kpi-total-workers"  label="Total Workers"     value={kpis.totalWorkers}     icon={Users}       color="indigo"  loading={isLoading} />
                <StatCard id="kpi-total-jobs"     label="Total Jobs"        value={kpis.totalJobs}        icon={Briefcase}   color="emerald" loading={isLoading} />
                <StatCard id="kpi-open-disputes"  label="Open Disputes"     value={kpis.openDisputes}     icon={AlertTriangle} color="rose"  loading={isLoading} />
                <StatCard id="kpi-completed-today" label="Completed Today"  value={kpis.completedJobsToday} icon={CheckCircle} color="emerald" loading={isLoading} />
            </div>

            {/* Charts + Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Weekly Jobs Trend */}
                <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-md shadow-slate-200/50">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-900">Weekly Job Trend</h3>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">Jobs created in the last 7 days</p>
                        </div>
                        <TrendingUp size={16} className="text-[#55b32b]" />
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={weeklyTrend}>
                            <defs>
                                <linearGradient id="jobs-grad-light" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="#55b32b" stopOpacity={0.35} />
                                    <stop offset="95%" stopColor="#55b32b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(d) => d?.slice(5)} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} width={28} />
                            <Tooltip
                                contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 12, color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                cursor={{ stroke: '#55b32b', strokeWidth: 1 }}
                            />
                            <Area type="monotone" dataKey="count" stroke="#55b32b" strokeWidth={2.5} fill="url(#jobs-grad-light)" name="Jobs" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Worker Categories */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-md shadow-slate-200/50">
                    <h3 className="text-sm font-extrabold text-slate-900 mb-1">Workers by Category</h3>
                    <p className="text-xs text-slate-500 font-medium mb-4">Verified workers breakdown</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={categories} layout="vertical" barSize={10}>
                            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} />
                            <YAxis type="category" dataKey="category" tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }} width={90} />
                            <Tooltip
                                contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 12, color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Workers">
                                {categories.map((_, i) => (
                                    <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Quick Actions + Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-md shadow-slate-200/50">
                    <h3 className="text-sm font-extrabold text-slate-900 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        {[
                            { label: 'Review Pending Verifications', icon: ShieldCheck, color: 'amber',  to: '/admin/verifications', badge: pendingCount },
                            { label: 'View Live Job Map',            icon: Briefcase,   color: 'emerald', to: '/admin/live-map' },
                            { label: 'Manage Disputes',              icon: AlertTriangle, color: 'rose', to: '/admin/disputes' },
                            { label: 'View Analytics',               icon: TrendingUp,  color: 'indigo', to: '/admin/analytics' },
                        ].map(({ label, icon: Icon, color, to, badge }) => (
                            <button
                                key={to}
                                onClick={() => navigate(to)}
                                id={`quick-action-${to.split('/').pop()}`}
                                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left border border-slate-100 hover:border-slate-200 group"
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                                    ${color === 'amber' ? 'bg-amber-100 text-amber-600' :
                                      color === 'emerald' ? 'bg-emerald-100 text-[#46a021]' :
                                      color === 'rose' ? 'bg-rose-100 text-rose-600' :
                                      'bg-indigo-100 text-indigo-600'}`}
                                >
                                    <Icon size={16} />
                                </div>
                                <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 flex-1">{label}</span>
                                {badge > 0 && (
                                    <span className="bg-rose-500 text-white text-[10px] rounded-full px-2 py-0.5 font-extrabold shadow-xs">{badge}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Activity Log */}
                <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-md shadow-slate-200/50">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-900">Activity Stream</h3>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time system events</p>
                        </div>
                        <Clock size={14} className="text-slate-400" />
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                        <ActivityFeed data={activity || []} loading={actLoading} />
                    </div>
                </div>
            </div>
        </div>
    );
}
