import { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
    LayoutDashboard, Map, ShieldCheck, Briefcase,
    MessageSquareWarning, BarChart3, Users, LogOut,
    ChevronLeft, ChevronRight, Settings, Globe
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { useSocket } from '../../context/SocketContext';
import HireMeLogo, { HireMeIcon } from '../../../components/common/HireMeLogo';

const NAV_ITEMS = [
    { to: '/admin',               icon: LayoutDashboard,        label: 'Dashboard',      exact: true },
    { to: '/admin/live-map',      icon: Map,                    label: 'Live Map'        },
    { to: '/admin/verifications', icon: ShieldCheck,            label: 'Verifications',  badge: 'pending' },
    { to: '/admin/jobs',          icon: Briefcase,              label: 'Jobs'            },
    { to: '/admin/disputes',      icon: MessageSquareWarning,   label: 'Disputes'        },
    { to: '/admin/analytics',     icon: BarChart3,              label: 'Analytics'       },
    { to: '/admin/customers',     icon: Users,                  label: 'Customers'       },
    { to: '/admin/settings',      icon: Settings,               label: 'Settings'        },
];

export default function AdminSidebar({ collapsed, onToggle, onCloseMobile }) {
    const { logout } = useAuthStore();
    const { pendingCount, connected } = useSocket() || {};
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside
            className={`
                flex flex-col h-full bg-white border-r border-slate-200 shadow-xl shadow-slate-200/50
                transition-all duration-300 ease-in-out shrink-0
                ${collapsed ? 'w-16' : 'w-60'}
            `}
        >
            {/* Logo Header */}
            <div className="flex items-center gap-3 px-3.5 py-4 border-b border-slate-100 relative">
                {collapsed ? (
                    <HireMeIcon size={32} />
                ) : (
                    <div className="overflow-hidden">
                        <HireMeLogo variant="light" size="small" />
                        <p className="text-[#55b32b] text-[10px] font-extrabold tracking-wider uppercase mt-0.5">Admin Control</p>
                    </div>
                )}

                {/* Sidebar Collapse Toggle Button */}
                <button
                    onClick={onToggle}
                    className={`ml-auto p-1.5 rounded-xl border transition-all shadow-xs
                        ${collapsed ? 'bg-[#55b32b] text-white border-[#55b32b] hover:bg-[#46a021]' : 'bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'}`}
                    id="admin-sidebar-toggle"
                    title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            {/* Connection indicator */}
            {!collapsed && (
                <div className="px-4 py-2 flex items-center gap-2 border-b border-slate-50 bg-slate-50/50">
                    <span className={`w-2 h-2 rounded-full ${connected ? 'bg-[#55b32b] animate-pulse' : 'bg-slate-400'}`} />
                    <span className="text-xs font-bold text-slate-500">{connected ? 'Live Connected' : 'Offline'}</span>
                </div>
            )}

            {/* Navigation List */}
            <nav className="flex-1 py-4 space-y-1.5 px-2.5 overflow-y-auto">
                {NAV_ITEMS.map(({ to, icon: Icon, label, badge, exact }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={exact}
                        onClick={() => onCloseMobile?.()}
                        title={collapsed ? label : undefined}
                        id={`admin-nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 group relative
                            ${isActive
                                ? 'bg-[#55b32b]/15 text-[#46a021] shadow-sm font-black border border-[#55b32b]/25'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`
                        }
                    >
                        <Icon size={18} className="shrink-0" />
                        {!collapsed && (
                            <span className="flex-1 whitespace-nowrap overflow-hidden tracking-wide">{label}</span>
                        )}
                        {!collapsed && badge === 'pending' && pendingCount > 0 && (
                            <span className="ml-auto bg-rose-500 text-white text-[11px] rounded-full w-5 h-5 flex items-center justify-center font-extrabold shadow-sm">
                                {pendingCount > 99 ? '99+' : pendingCount}
                            </span>
                        )}
                        {collapsed && badge === 'pending' && pendingCount > 0 && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="p-2.5 border-t border-slate-100 space-y-1">
                {/* Visit Public Site */}
                <Link
                    to="/"
                    title={collapsed ? "Public Home Page" : undefined}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-[#46a021] hover:bg-[#55b32b]/10 transition-all duration-150"
                >
                    <Globe size={18} className="shrink-0 text-[#46a021]" />
                    {!collapsed && <span>Public Website</span>}
                </Link>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    id="admin-logout-btn"
                    title={collapsed ? "Logout" : undefined}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all duration-150"
                >
                    <LogOut size={18} className="shrink-0" />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
}
