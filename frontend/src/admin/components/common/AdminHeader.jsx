import { useState } from 'react';
import { Bell, Search, PanelLeft, Globe, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { useSocket } from '../../context/SocketContext';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminHeader({ onToggleSidebar, collapsed }) {
    const { user, logout } = useAuthStore();
    const { notifications, connected } = useSocket() || {};
    const [showNotifs, setShowNotifs] = useState(false);
    const navigate = useNavigate();

    const unreadCount = (notifications || []).length;

    return (
        <header className="h-14 bg-white border-b border-slate-200/90 shadow-xs flex items-center px-4 gap-3 shrink-0 sticky top-0 z-30">
            {/* Visit Public Website / Home Page Button */}
            <Link
                to="/"
                id="visit-public-site-btn"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#55b32b]/15 text-slate-700 hover:text-[#46a021] text-xs font-bold transition border border-slate-200"
            >
                <Globe size={14} className="text-[#46a021]" />
                <span className="hidden sm:inline">Visit Public Website</span>
                <span className="sm:hidden">Home</span>
            </Link>

            {/* Page title slot spacer */}
            <div className="flex-1" />

            {/* Search bar */}
            <div className="hidden md:flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-1.5 w-60 border border-slate-200">
                <Search size={14} className="text-slate-400" />
                <input
                    placeholder="Search admin portal…"
                    id="admin-header-search"
                    className="bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none w-full"
                />
            </div>

            {/* Socket status pill */}
            <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold border
                ${connected
                    ? 'border-emerald-300 bg-emerald-50 text-[#46a021]'
                    : 'border-slate-200 bg-slate-100 text-slate-400'
                }`}
            >
                <span className={`w-2 h-2 rounded-full ${connected ? 'bg-[#55b32b] animate-pulse' : 'bg-slate-400'}`} />
                {connected ? 'Live Sync' : 'Offline'}
            </div>

            {/* Notifications */}
            <div className="relative">
                <button
                    onClick={() => setShowNotifs((v) => !v)}
                    id="admin-notifications-btn"
                    className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                    )}
                </button>
                {showNotifs && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <span className="text-xs font-extrabold text-slate-900">Notifications</span>
                            <span className="text-[11px] text-slate-500 font-bold">{unreadCount} new</span>
                        </div>
                        <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                            {(notifications || []).length === 0 ? (
                                <p className="text-center text-slate-400 text-xs py-6 font-medium">No notifications</p>
                            ) : (
                                (notifications || []).map((n) => (
                                    <div key={n.id} className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors">
                                        <p className="text-xs text-slate-700 font-semibold">{n.text}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{new Date(n.id).toLocaleTimeString()}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* User avatar */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#55b32b] flex items-center justify-center text-white text-xs font-black shadow-md shadow-[#55b32b]/20">
                    {user?.firstName?.[0] || 'A'}
                </div>
                <span className="hidden md:block text-xs text-slate-800 font-bold">{user?.firstName || 'Admin'}</span>
            </div>
        </header>
    );
}
