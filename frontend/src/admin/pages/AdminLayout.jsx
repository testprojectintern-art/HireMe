import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/common/AdminSidebar';
import AdminHeader from '../components/common/AdminHeader';

export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleSidebar = () => {
        // Toggle mobile if on small screens, or toggle collapse state on desktop
        if (window.innerWidth < 1024) {
            setMobileOpen((o) => !o);
        } else {
            setCollapsed((c) => !c);
        }
    };

    return (
        <div className="h-screen flex bg-slate-50 overflow-hidden font-sans">
            {/* Mobile backdrop overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed lg:relative inset-y-0 left-0 z-50
                transition-all duration-300 ease-in-out
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                h-full shrink-0
            `}>
                <AdminSidebar
                    collapsed={collapsed}
                    onToggle={() => setCollapsed((c) => !c)}
                    onCloseMobile={() => setMobileOpen(false)}
                />
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <AdminHeader
                    onToggleSidebar={toggleSidebar}
                    collapsed={collapsed}
                />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
