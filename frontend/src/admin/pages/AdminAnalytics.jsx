import { useAdminStats } from '../hooks/useAdminStats';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { TrendingUp, Users, Briefcase, DollarSign } from 'lucide-react';

const COLORS = ['#55b32b', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

function SectionCard({ title, subtitle, children }) {
    return (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-md shadow-slate-200/50">
            <div className="mb-4">
                <h3 className="text-sm font-black text-slate-900">{title}</h3>
                {subtitle && <p className="text-xs text-slate-500 font-medium mt-0.5">{subtitle}</p>}
            </div>
            {children}
        </div>
    );
}

export default function AdminAnalytics() {
    const { data, isLoading } = useAdminStats();

    const weeklyTrend    = data?.weeklyJobsTrend    || [];
    const categories     = data?.workerCategories   || [];
    const kpis           = data?.kpis               || {};

    const revenueTrend = weeklyTrend.map((d) => ({
        ...d,
        revenue: d.revenue ?? 0,
    }));

    const jobStatusMock = [
        { name: 'Completed',  value: Math.max(kpis.completedJobsToday || 0, 5) },
        { name: 'In Progress',value: kpis.ongoingJobs || 2 },
        { name: 'Pending',    value: 3 },
        { name: 'Cancelled',  value: 1 },
    ];

    if (isLoading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-[#55b32b] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div>
                <h1 className="text-2xl font-black text-slate-900">System Performance Analytics</h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time metrics, revenue trends, and category breakdowns across Sri Lanka</p>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Job Volume Trend */}
                <SectionCard title="Weekly Job Dispatch Volume" subtitle="Number of jobs allocated over the last 7 days">
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#55b32b" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#55b32b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }} />
                            <Area type="monotone" dataKey="jobs" stroke="#55b32b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorJobs)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </SectionCard>

                {/* 2. Worker Category Distribution */}
                <SectionCard title="Worker Skills Distribution" subtitle="Active field service providers by skill category">
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={categories} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="_id" stroke="#94a3b8" fontSize={10} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }} />
                            <Bar dataKey="count" fill="#55b32b" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </SectionCard>

                {/* 3. Job Status Breakdown */}
                <SectionCard title="Job Status Breakdown" subtitle="Distribution of job statuses today">
                    <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                            <Pie data={jobStatusMock} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={{ fontSize: 11, fontWeight: 'bold', fill: '#1e293b' }}>
                                {jobStatusMock.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px' }} />
                            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </SectionCard>

                {/* 4. Weekly Revenue Trend */}
                <SectionCard title="Estimated Revenue Trend" subtitle="LKR revenue generated over the last 7 days">
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }} />
                            <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </SectionCard>
            </div>
        </div>
    );
}
