import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, Menu, Sun, Moon, Bell, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../features/auth/authApi';
import api from '../../api/axios';

export default function Header({ onToggleSidebar }) {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [isDark, setIsDark] = useState(() => {
        return document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
    });
    const [pendingCount, setPendingCount] = useState(0);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const notifRef = useRef(null);
    const userMenuRef = useRef(null);

    useEffect(() => {
        const fetchPendingOrders = async () => {
            if (!user) return;
            try {
                const res = await api.get('/sales-orders?status=pending_approval', {
                    headers: { 'x-portal-context': 'online_orders' }
                });
                if (res.data?.success) {
                    const data = res.data.data;
                    setPendingOrders(data);
                    setPendingCount(data.length);
                }
            } catch (err) {
                console.error('Failed to fetch pending online orders', err);
            }
        };

        fetchPendingOrders();
        const interval = setInterval(fetchPendingOrders, 30000);
        return () => clearInterval(interval);
    }, [user]);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = async () => {
        try {
            await authApi.logout();
        } catch (err) {
            // Even if backend fails, log out locally
        }
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const roleLabel = {
        admin: 'Administrator',
        manager: 'Manager',
        accountant: 'Accountant',
        sales_manager: 'Sales Manager',
        sales_rep: 'Sales Rep',
        warehouse_staff: 'Warehouse Staff',
        production_staff: 'Production Staff',
        staff: 'Staff',
    }[user?.role] || 'User';

    const portalLabel = user?.activePortal === 'owner_dashboard'
        ? 'Executive Dashboard'
        : user?.activePortal === 'online_orders'
        ? 'Online Orders POS'
        : 'Main POS & ERP';

    return (
        <header
            className="h-16 flex items-center justify-between px-4 md:px-6 flex-shrink-0 border-b relative z-20"
            style={{
                background: 'rgba(255,255,255,0.88)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderBottomColor: 'rgba(226,232,240,0.7)',
            }}
        >
            {/* Left side */}
            <div className="flex items-center gap-3">
                {/* Hamburger toggle */}
                <button
                    onClick={onToggleSidebar}
                    className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-200 transition-all active:scale-95"
                    aria-label="Toggle sidebar"
                >
                    <Menu size={20} />
                </button>

                {/* Portal label */}
                <div className="hidden md:block">
                    <p className="text-[9px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none mb-0.5">
                        Workspace
                    </p>
                    <button
                        onClick={() => navigate('/portal-select')}
                        className="text-sm font-bold flex items-center gap-1.5 transition-colors"
                        style={{ color: '#55b32b' }}
                        title="Switch Portal"
                    >
                        {portalLabel}
                        <span className="text-[9px] font-semibold text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                            switch
                        </span>
                    </button>
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">

                {/* Notifications Bell */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2.5 rounded-xl text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all active:scale-95"
                        aria-label="Notifications"
                        title="Online Orders Notifications"
                    >
                        <Bell size={19} className={pendingCount > 0 ? 'text-amber-500' : ''} />
                        {pendingCount > 0 && (
                            <span
                                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse"
                                style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)' }}
                            >
                                {pendingCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 rounded-2xl shadow-xl z-50 p-4 text-left animate-slide-up border"
                            style={{
                                background: 'rgba(255,255,255,0.95)',
                                backdropFilter: 'blur(16px)',
                                borderColor: 'rgba(226,232,240,0.8)',
                            }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Pending Online Orders</h3>
                                {pendingCount > 0 && (
                                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full text-white"
                                        style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)' }}>
                                        {pendingCount} new
                                    </span>
                                )}
                            </div>
                            {pendingOrders.length === 0 ? (
                                <div className="text-center py-6">
                                    <Bell size={28} className="mx-auto text-gray-200 dark:text-slate-700 mb-2" />
                                    <p className="text-xs text-gray-400">No pending online orders.</p>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                                    {pendingOrders.map(o => (
                                        <div
                                            key={o._id}
                                            onClick={() => { setShowNotifications(false); navigate(`/sales-orders/${o._id}`); }}
                                            className="p-3 border border-gray-100 dark:border-slate-800 hover:bg-hireme-50/50 dark:hover:bg-hireme-950/20 rounded-xl cursor-pointer transition-colors"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold" style={{ color: '#55b32b' }}>{o.orderNumber}</span>
                                                <span className="text-gray-400 font-mono text-[10px]">{new Date(o.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="text-sm text-gray-700 dark:text-gray-300 font-semibold mt-0.5">
                                                {o.customerSnapshot?.name || 'Customer'}
                                            </div>
                                            <div className="text-[10px] text-amber-500 font-bold mt-0.5">
                                                Total: LKR {o.grandTotal?.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-800 text-center">
                                <button
                                    onClick={() => { setShowNotifications(false); navigate('/online-orders/list'); }}
                                    className="text-xs font-bold uppercase tracking-wider transition-colors hover:opacity-80"
                                    style={{ color: '#55b32b' }}
                                >
                                    View All Online Deliveries →
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Theme toggle button */}
                <button
                    onClick={() => setIsDark(!isDark)}
                    className="p-2.5 rounded-xl text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all active:scale-95"
                    aria-label="Toggle Theme"
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {isDark
                        ? <Sun size={18} className="text-amber-400" />
                        : <Moon size={18} className="text-indigo-500" />
                    }
                </button>

                {/* User chip */}
                <div className="relative" ref={userMenuRef}>
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all active:scale-95 border border-gray-200 dark:border-slate-700/60"
                    >
                        {/* Avatar */}
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm"
                            style={{ background: 'linear-gradient(135deg, #55b32b 0%, #41a020 100%)' }}
                        >
                            {user?.fullName?.[0]?.toUpperCase() || <UserIcon size={14} />}
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-xs font-bold text-gray-900 dark:text-white leading-none">{user?.fullName}</p>
                            <p className="text-[10px] text-gray-400 dark:text-slate-500 font-semibold uppercase tracking-tight mt-0.5">{roleLabel}</p>
                        </div>
                        <ChevronDown size={13} className={`text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {/* User dropdown menu */}
                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-52 rounded-2xl shadow-xl z-50 overflow-hidden border animate-slide-up"
                            style={{
                                background: 'rgba(255,255,255,0.97)',
                                backdropFilter: 'blur(16px)',
                                borderColor: 'rgba(226,232,240,0.8)',
                            }}
                        >
                            {/* User info header */}
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800">
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.fullName}</p>
                                <p className="text-xs text-gray-400 dark:text-slate-500 truncate mt-0.5">{user?.email}</p>
                            </div>
                            {/* Actions */}
                            <div className="py-1.5">
                                <button
                                    onClick={() => { setShowUserMenu(false); navigate('/profile'); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-hireme-50 dark:hover:bg-hireme-950/30 hover:text-hireme-700 dark:hover:text-hireme-400 transition-colors font-medium"
                                >
                                    <UserIcon size={15} />
                                    <span>My Profile</span>
                                </button>
                                <button
                                    onClick={() => { setShowUserMenu(false); handleLogout(); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors font-medium"
                                >
                                    <LogOut size={15} />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}