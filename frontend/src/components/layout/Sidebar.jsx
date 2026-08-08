import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useFilterStore } from '../../store/filterStore';
import api from '../../api/axios';
import {
    LayoutDashboard, BarChart3, Package, ShoppingCart, Users, Settings,
    FolderTree, Award, UserCircle, Tags, Warehouse, Boxes, Truck,
    ShoppingBag, FileText, Receipt, Wallet, Workflow, Factory, ShieldCheck,
    RotateCcw, Wrench, AlertTriangle, FileMinus, X, Users as UsersIcon, Building2, Clock, Calendar as CalendarIcon, Plane, Calculator, DollarSign,
    Landmark, FileCheck, PackageCheck, ArrowRightLeft, ChevronDown, ChevronRight, Plus, PanelLeftClose, Search
} from 'lucide-react';

// Role hierarchy constants
const ADMIN_MANAGER = ['admin', 'manager'];
const ADMIN_MANAGER_ACCOUNTANT = ['admin', 'manager', 'accountant'];
const ADMIN_MANAGER_CASHIER = ['admin', 'manager', 'cashier'];
const ADMIN_MANAGER_ACCOUNTANT_CASHIER = ['admin', 'manager', 'accountant', 'cashier'];
const ADMIN_MANAGER_EMPLOYEE = ['admin', 'manager', 'employee'];
const ALL_ROLES = ['admin', 'manager', 'accountant', 'cashier', 'employee'];

// ── Menu structure ──────────────────────────────────────────────────
const menuItems = [
    {
        label: 'Dashboard',
        id: 'dashboard',
        icon: LayoutDashboard,
        path: '/dashboard',
        allowedRoles: ALL_ROLES,
    },
    {
        label: 'People',
        id: 'people',
        icon: UsersIcon,
        allowedRoles: ADMIN_MANAGER_ACCOUNTANT_CASHIER,
        children: [
            { label: 'Customers', path: '/customers', allowedRoles: ADMIN_MANAGER_ACCOUNTANT_CASHIER },
            { label: 'Bulk SMS Campaign', path: '/customers/bulk-sms', allowedRoles: ADMIN_MANAGER_ACCOUNTANT },
            { label: 'Suppliers', path: '/suppliers', allowedRoles: ADMIN_MANAGER_ACCOUNTANT },
            { label: 'Staff / Users', path: '/users', allowedRoles: ADMIN_MANAGER },
            { label: 'Customer Groups', path: '/customer-groups', allowedRoles: ADMIN_MANAGER },
        ],
    },
    {
        label: 'Sales',
        id: 'sales',
        icon: ShoppingCart,
        allowedRoles: ADMIN_MANAGER_ACCOUNTANT_CASHIER,
        children: [
            { label: 'POS Terminal', path: '/pos', allowedRoles: ADMIN_MANAGER_CASHIER },
            { label: 'POS Registers', path: '/pos-sessions', allowedRoles: ADMIN_MANAGER_CASHIER },
            { label: 'Online Deliveries', path: '/online-orders/list', allowedRoles: ADMIN_MANAGER_ACCOUNTANT_CASHIER },
            { label: 'Sales Orders', path: '/sales-orders', allowedRoles: ADMIN_MANAGER_ACCOUNTANT_CASHIER },
            { label: 'Wholesale Prices', path: '/wholesale-prices', allowedRoles: ADMIN_MANAGER },
            { label: 'Invoices', path: '/invoices', allowedRoles: ADMIN_MANAGER_ACCOUNTANT_CASHIER },
            { label: 'Payments Received', path: '/payments', allowedRoles: ADMIN_MANAGER_ACCOUNTANT_CASHIER },
            { label: 'Installments', path: '/installments', allowedRoles: ADMIN_MANAGER_ACCOUNTANT_CASHIER },
            { label: 'Warranty Claims', path: '/warranty-claims', allowedRoles: ALL_ROLES },
            { label: 'Warranty Registry', path: '/warranty-registry', allowedRoles: ALL_ROLES },
        ],
    },
    {
        label: 'Inventory',
        id: 'inventory',
        icon: Package,
        allowedRoles: ALL_ROLES,
        children: [
            { label: 'Products', path: '/products', allowedRoles: ADMIN_MANAGER },
            { label: 'Barcode Generator', path: '/products/barcodes', allowedRoles: ADMIN_MANAGER },
            { label: 'Categories', path: '/categories', allowedRoles: ADMIN_MANAGER },
            { label: 'Brands', path: '/brands', allowedRoles: ADMIN_MANAGER },
            { label: 'Stock Levels', path: '/stock', allowedRoles: ALL_ROLES },
            { label: 'Warehouses', path: '/warehouses', allowedRoles: ADMIN_MANAGER },
            { label: 'Stock Transfers', path: '/stock/transfer', allowedRoles: ADMIN_MANAGER },
            { label: 'Stock Adjustment', path: '/stock/adjustment', allowedRoles: ADMIN_MANAGER },
            { label: 'Damages Register', path: '/damages', allowedRoles: ADMIN_MANAGER_EMPLOYEE },
        ],
    },
    {
        label: 'Procurement',
        id: 'procurement',
        icon: ShoppingBag,
        allowedRoles: ADMIN_MANAGER_ACCOUNTANT,
        children: [
            { label: 'Purchase Orders', path: '/purchase-orders', allowedRoles: ADMIN_MANAGER_ACCOUNTANT },
            { label: 'Goods Received (GRN)', path: '/grns', allowedRoles: ADMIN_MANAGER_ACCOUNTANT },
            { label: 'Supplier Returns', path: '/supplier-returns', allowedRoles: ADMIN_MANAGER_ACCOUNTANT },
            { label: 'Purchase Bills', path: '/bills', allowedRoles: ADMIN_MANAGER_ACCOUNTANT },
        ],
    },
    {
        label: 'Finance',
        id: 'finance',
        icon: Landmark,
        allowedRoles: ADMIN_MANAGER_ACCOUNTANT,
        children: [
            { label: 'Bank Accounts', path: '/bank-accounts', allowedRoles: ADMIN_MANAGER_ACCOUNTANT },
            { label: 'Expenses', path: '/expenses', allowedRoles: ADMIN_MANAGER_ACCOUNTANT },
            { label: 'Petty Cash Ledger', path: '/finance/petty-cash', allowedRoles: ADMIN_MANAGER_ACCOUNTANT },
            { label: 'Fund Transfers', path: '/fund-transfers', allowedRoles: ADMIN_MANAGER_ACCOUNTANT },
            { label: 'Bank Deposits (Tally)', path: '/bank-deposits', allowedRoles: ADMIN_MANAGER_ACCOUNTANT },
            { label: 'Cheque Registry', path: '/cheques', allowedRoles: ADMIN_MANAGER_ACCOUNTANT },
            { label: 'Credit Notes', path: '/credit-notes', allowedRoles: ADMIN_MANAGER_ACCOUNTANT },
        ],
    },
    {
        label: 'Manufacturing',
        id: 'production',
        icon: Factory,
        allowedRoles: ADMIN_MANAGER_EMPLOYEE,
        children: [
            { label: 'BOMs (Recipes)', path: '/boms', allowedRoles: ADMIN_MANAGER_EMPLOYEE },
            { label: 'Production Orders', path: '/production-orders', allowedRoles: ADMIN_MANAGER_EMPLOYEE },
        ],
    },
    {
        label: 'HR & Payroll',
        id: 'hr',
        icon: Building2,
        allowedRoles: ALL_ROLES,
        children: [
            { label: 'Employees', path: '/employees', allowedRoles: ADMIN_MANAGER_ACCOUNTANT },
            { label: 'Salary Structures', path: '/salary-structures', allowedRoles: ADMIN_MANAGER_ACCOUNTANT },
            { label: 'Attendance', path: '/attendance', allowedRoles: ALL_ROLES },
            { label: 'Leave Requests', path: '/leaves', allowedRoles: ALL_ROLES },
            { label: 'Payroll Management', path: '/payroll', allowedRoles: ADMIN_MANAGER_ACCOUNTANT },
        ],
    },
    {
        label: 'Analytics',
        id: 'analytics',
        icon: BarChart3,
        allowedRoles: ADMIN_MANAGER_ACCOUNTANT,
        children: [
            { label: 'Reports Dashboard', path: '/reports', allowedRoles: ADMIN_MANAGER_ACCOUNTANT },
            { label: 'Targets & Progress', path: '/targets-progress', allowedRoles: ADMIN_MANAGER_ACCOUNTANT },
            { label: 'AI Business Analyst', path: '/ai-predictions', allowedRoles: ADMIN_MANAGER_ACCOUNTANT },
        ],
    },
    {
        label: 'Settings',
        id: 'settings',
        icon: Settings,
        path: '/settings',
        allowedRoles: ADMIN_MANAGER,
    },
];

// Role badge gradient color map
const roleGradients = {
    admin:     'from-hireme-500 to-hireme-600',
    manager:   'from-blue-500 to-blue-600',
    accountant:'from-purple-500 to-purple-600',
    cashier:   'from-amber-500 to-orange-500',
    employee:  'from-slate-500 to-slate-600',
};

export default function Sidebar({ userRole, isOpen, onClose }) {
    const sidebarRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [expandedItems, setExpandedItems] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const { selectedMonth, selectedYear, setMonth, setYear } = useFilterStore();
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        const fetchPendingOrders = async () => {
            try {
                const res = await api.get('/sales-orders?status=pending_approval', {
                    headers: { 'x-portal-context': 'online_orders' }
                });
                if (res.data?.success) {
                    setPendingCount(res.data.data.length);
                }
            } catch (err) {
                // Non-blocking
            }
        };

        fetchPendingOrders();
        const interval = setInterval(fetchPendingOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const toggleExpand = (id) => {
        setExpandedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const isChildActive = (item) => {
        return item.children?.some(child => location.pathname === child.path);
    };

    // Auto-expand active parent
    useEffect(() => {
        const initialExpanded = {};
        menuItems.forEach(item => {
            if (isChildActive(item)) {
                initialExpanded[item.id] = true;
            }
        });
        setExpandedItems(prev => ({ ...prev, ...initialExpanded }));
    }, [location.pathname]);

    const canAccess = (item) => !item.allowedRoles || item.allowedRoles.includes(userRole);

    const visibleItems = menuItems
        .filter(item => canAccess(item))
        .map(item => {
            if (item.children) {
                return {
                    ...item,
                    children: item.children.filter(child => canAccess(child))
                };
            }
            return item;
        })
        .filter(item => !item.children || item.children.length > 0);

    const filteredVisibleItems = visibleItems.map(item => {
        if (!searchQuery.trim()) return item;

        const matchesParent = item.label.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (item.children) {
            const matchingChildren = item.children.filter(child =>
                child.label.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (matchesParent || matchingChildren.length > 0) {
                return {
                    ...item,
                    children: matchesParent ? item.children : matchingChildren
                };
            }
            return null;
        }

        return matchesParent ? item : null;
    }).filter(Boolean);

    const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
    const newMenuRef = useRef(null);

    // Close new menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (newMenuRef.current && !newMenuRef.current.contains(event.target)) {
                setIsNewMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const newActions = [
        { label: 'New Invoice', path: '/invoices/new', icon: Receipt },
        { label: 'New Sales Order', path: '/sales-orders/new', icon: ShoppingCart },
        { label: 'New GRN', path: '/grns', icon: PackageCheck },
        { label: 'New Customer', path: '/customers', icon: UsersIcon },
    ];

    const roleGrad = roleGradients[userRole] || roleGradients.employee;
    const roleInitial = userRole?.[0]?.toUpperCase() || 'U';

    return (
        <>
            {/* Backdrop overlay (mobile) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-[3px] z-30 lg:hidden animate-fade-in"
                    onClick={onClose}
                />
            )}

            {/* Sidebar panel */}
            <aside
                ref={sidebarRef}
                className={`h-screen flex flex-col z-40 transition-all duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
                    fixed lg:relative inset-y-0 left-0`}
                style={{
                    width: isOpen ? '280px' : '0px',
                    minWidth: isOpen ? '280px' : '0px',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    flexShrink: 0,
                    // Light: clean white with very subtle green tint at top
                    background: 'linear-gradient(180deg, #ffffff 0%, #fafffe 100%)',
                    borderRight: '1px solid rgba(226,232,240,0.8)',
                    boxShadow: '4px 0 24px rgba(0,0,0,0.04)',
                }}
            >
                <div className="w-[280px] flex flex-col h-full dark:bg-transparent"
                    style={{
                        // Dark: deep slate gradient
                        background: 'inherit',
                    }}
                >
                    {/* ── Logo / Brand ── */}
                    <div className="p-5 pb-4 flex items-center justify-between flex-shrink-0 relative">
                        {/* Subtle green glow behind logo in dark */}
                        <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none dark:block hidden"
                            style={{ background: 'radial-gradient(ellipse at top left, rgba(85,179,43,0.08) 0%, transparent 70%)' }}
                        />
                        <div className="flex items-center gap-3 relative z-10">
                            {/* Logo mark */}
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                                style={{ background: 'linear-gradient(135deg, #55b32b 0%, #41a020 100%)' }}
                            >
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" fill="rgba(255,255,255,0.15)" />
                                    <path d="M12 7v10M7 9.5l5 2.5 5-2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="font-extrabold text-gray-900 dark:text-white text-[15px] tracking-tight leading-none">
                                    HireMe
                                </h2>
                                <p className="text-[10px] font-semibold tracking-widest uppercase mt-0.5"
                                   style={{ color: '#55b32b' }}>
                                    Admin Portal
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="relative z-10 p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-200 transition-all"
                        >
                            <PanelLeftClose size={17} />
                        </button>
                    </div>

                    {/* ── Quick Action ── */}
                    <div className="px-4 mb-3 relative" ref={newMenuRef}>
                        <button
                            onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
                            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shimmer-btn group ${
                                isNewMenuOpen
                                    ? 'text-white shadow-glow-green'
                                    : 'bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/60 text-gray-700 dark:text-gray-300 hover:border-hireme-300 dark:hover:border-hireme-700'
                            }`}
                            style={isNewMenuOpen ? { background: 'linear-gradient(135deg, #55b32b 0%, #41a020 100%)' } : {}}
                        >
                            <div className="flex items-center gap-2.5">
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${isNewMenuOpen ? 'bg-white/20' : 'bg-hireme-50 dark:bg-hireme-950/40'}`}>
                                    <Plus size={14} className={isNewMenuOpen ? 'text-white' : 'text-hireme-600 dark:text-hireme-400'} />
                                </div>
                                <span>Quick Create</span>
                            </div>
                            <ChevronDown size={14} className={`transition-transform duration-200 ${isNewMenuOpen ? 'rotate-180 text-white/70' : 'text-gray-400'}`} />
                        </button>

                        {isNewMenuOpen && (
                            <div className="absolute top-full left-4 right-4 mt-1.5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-xl z-50 py-1.5 animate-slide-up overflow-hidden">
                                {newActions.map((action, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            navigate(action.path);
                                            setIsNewMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-hireme-50 dark:hover:bg-hireme-950/30 hover:text-hireme-700 dark:hover:text-hireme-400 transition-colors"
                                    >
                                        <action.icon size={15} />
                                        <span className="font-medium">{action.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Search Bar ── */}
                    <div className="px-4 mb-3 flex-shrink-0">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search menu…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/60 focus:border-hireme-400 dark:focus:border-hireme-600 focus:ring-2 focus:ring-hireme-400/20 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none transition-all"
                            />
                            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                        </div>
                    </div>

                    {/* ── Global Date Filter ── */}
                    <div className="px-4 mb-3 flex-shrink-0 space-y-2 border-b border-gray-100 dark:border-slate-800/60 pb-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                            <CalendarIcon size={11} />
                            <span>Period Filter</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <select
                                value={selectedYear}
                                onChange={(e) => {
                                    setYear(e.target.value);
                                    queryClient.invalidateQueries();
                                }}
                                className="w-full text-[11px] font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-hireme-400/30 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-750 transition-colors"
                            >
                                <option value="all">All Years</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                                <option value="2027">2027</option>
                            </select>
                            <select
                                value={selectedMonth}
                                onChange={(e) => {
                                    setMonth(e.target.value);
                                    queryClient.invalidateQueries();
                                }}
                                disabled={selectedYear === 'all'}
                                className="w-full text-[11px] font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-hireme-400/30 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-750 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="all">All Months</option>
                                {['January','February','March','April','May','June','July','August','September','October','November','December'].map((m,i) => (
                                    <option key={i} value={i+1}>{m}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* ── Scrollable nav ── */}
                    <nav className="flex-1 overflow-y-auto py-2 px-3 custom-scrollbar space-y-0.5">
                        {filteredVisibleItems.map((item) => {
                            const Icon = item.icon;
                            const isExpanded = searchQuery.trim() ? true : expandedItems[item.id];
                            const isActive = location.pathname === item.path || isChildActive(item);
                            const hasChildren = item.children && item.children.length > 0;

                            return (
                                <div key={item.id} className="space-y-0.5">
                                    {hasChildren ? (
                                        <button
                                            onClick={() => toggleExpand(item.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                                                isActive
                                                    ? 'text-hireme-700 dark:text-hireme-400 font-semibold'
                                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                            }`}
                                            style={isActive ? {
                                                background: 'linear-gradient(135deg, rgba(85,179,43,0.12) 0%, rgba(85,179,43,0.06) 100%)',
                                            } : {}}
                                            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(0,0,0,0.035)'; }}
                                            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = ''; }}
                                        >
                                            {isActive && (
                                                <div
                                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                                                    style={{ background: 'linear-gradient(180deg, #55b32b, #41a020)' }}
                                                />
                                            )}
                                            <Icon
                                                size={17}
                                                className={`flex-shrink-0 transition-colors ${isActive ? 'text-hireme-600 dark:text-hireme-400' : 'text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300'}`}
                                            />
                                            <span className="truncate flex-1 text-left">{item.label}</span>
                                            <div className="ml-auto">
                                                {isExpanded
                                                    ? <ChevronDown size={13} className="text-gray-400 dark:text-slate-600" />
                                                    : <ChevronRight size={13} className="text-gray-400 dark:text-slate-600" />
                                                }
                                            </div>
                                        </button>
                                    ) : (
                                        <NavLink
                                            to={item.path}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                                                location.pathname === item.path
                                                    ? 'text-hireme-700 dark:text-hireme-400 font-semibold'
                                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                            }`}
                                            style={({ isActive }) => isActive ? {
                                                background: 'linear-gradient(135deg, rgba(85,179,43,0.12) 0%, rgba(85,179,43,0.06) 100%)',
                                            } : {}}
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    {isActive && (
                                                        <div
                                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                                                            style={{ background: 'linear-gradient(180deg, #55b32b, #41a020)' }}
                                                        />
                                                    )}
                                                    <Icon
                                                        size={17}
                                                        className={`flex-shrink-0 transition-colors ${isActive ? 'text-hireme-600 dark:text-hireme-400' : 'text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300'}`}
                                                    />
                                                    <span className="truncate">{item.label}</span>
                                                </>
                                            )}
                                        </NavLink>
                                    )}

                                    {hasChildren && isExpanded && (
                                        <div className="ml-8 space-y-0.5 pl-3 border-l-2 border-gray-100 dark:border-slate-800/80">
                                            {item.children.map((child) => {
                                                const isOnlineDeliveries = child.path === '/online-orders/list';
                                                return (
                                                    <NavLink
                                                        key={child.path}
                                                        to={child.path}
                                                        className={({ isActive }) =>
                                                            `flex justify-between items-center px-3 py-2 text-[13px] font-medium rounded-lg transition-all duration-150 ${
                                                                isActive
                                                                    ? 'text-hireme-700 dark:text-hireme-400 font-semibold'
                                                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-50/80 dark:hover:bg-slate-800/50'
                                                            }`
                                                        }
                                                    >
                                                        <span>{child.label}</span>
                                                        {isOnlineDeliveries && pendingCount > 0 && (
                                                            <span className="px-1.5 py-0.5 rounded-full text-white text-[9px] font-bold animate-blink-dot"
                                                                style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)' }}>
                                                                {pendingCount}
                                                            </span>
                                                        )}
                                                    </NavLink>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* ── User Profile / Footer ── */}
                    <div className="p-4 border-t border-gray-100 dark:border-slate-800/60 flex-shrink-0">
                        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                            onClick={() => navigate('/profile')}>
                            {/* Avatar with gradient ring */}
                            <div className="relative flex-shrink-0">
                                <div
                                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
                                    style={{ background: 'linear-gradient(135deg, #55b32b 0%, #41a020 100%)' }}
                                >
                                    {roleInitial}
                                </div>
                                {/* Online dot */}
                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-white dark:border-slate-900 rounded-full animate-blink-dot" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate capitalize leading-none">{userRole}</p>
                                <p className="text-[10px] text-gray-400 dark:text-slate-500 truncate mt-0.5 font-medium">Main Branch · Online</p>
                            </div>
                            <ChevronRight size={14} className="text-gray-300 dark:text-slate-600 group-hover:text-hireme-500 dark:group-hover:text-hireme-500 transition-colors flex-shrink-0" />
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}