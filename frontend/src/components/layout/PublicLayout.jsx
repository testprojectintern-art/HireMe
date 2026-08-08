import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    ShieldCheck, MapPin, Phone, Mail, Clock, ChevronRight, Menu, X,
    Sparkles, ArrowRight, Heart, Award, CheckCircle2, Zap, Search,
    Briefcase, UserCheck, Shield, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HireMeLogo, { HireMeIcon } from '../common/HireMeLogo';

export default function PublicLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setShowHeader(false);
                setIsCategoryOpen(false);
            } else {
                setShowHeader(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/catalog', label: 'Find Workers' },
        { path: '/about', label: 'About Platform' },
        { path: '/contact', label: 'Contact Us' },
    ];

    const QUICK_CATEGORIES = [
        { name: 'Plumber', desc: 'Pipe repair, leak fix & DB fit', icon: '🔧' },
        { name: 'Electrician', desc: 'Wiring, breakers & solar fit', icon: '⚡' },
        { name: 'Carpenter', desc: 'Roofing, furniture & doors', icon: '🪚' },
        { name: 'Coconut Plucker', desc: 'Safety-harness tree plucking', icon: '🌴' },
        { name: 'Mason', desc: 'Concrete, tiles & plastering', icon: '🧱' },
        { name: 'Painter', desc: 'Interior & exterior painting', icon: '🎨' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-[#55b32b] selection:text-white">
            {/* Top Premium Announcement & Emergency Bar */}
            <div className="bg-slate-900 text-white text-[11px] font-bold py-2 px-4 border-b border-slate-800/80">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#55b32b] animate-ping" />
                        <span className="text-slate-200">
                            Sri Lanka's #1 Verified Field Worker Network
                        </span>
                        <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-[#55b32b]/20 text-[#55b32b] text-[10px] uppercase font-black">
                            1,200+ Active Workers
                        </span>
                    </div>

                    <div className="hidden sm:flex items-center gap-5 text-slate-300">
                        <a href="tel:+94112345678" className="hover:text-[#55b32b] transition flex items-center gap-1">
                            <Phone size={12} className="text-[#55b32b]" />
                            <span>Hotline: +94 11 234 5678</span>
                        </a>
                        <span className="text-slate-700">•</span>
                        <div className="flex items-center gap-1 text-slate-300">
                            <Zap size={12} className="text-amber-400" />
                            <span>24/7 Real-time GPS Telemetry</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Ultra-Professional Glassmorphic Header */}
            <header className={`sticky top-0 z-50 backdrop-blur-xl bg-white/95 border-b border-slate-200/90 shadow-md shadow-slate-200/40 transition-all duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

                    {/* Left: Brand Logo & Tagline */}
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <HireMeLogo variant="light" size="medium" />
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1 hidden sm:block">
                                Skilled Field Workers Sri Lanka
                            </span>
                        </div>
                    </div>

                    {/* Center: Modern Navigation Tabs & Services Menu */}
                    <nav className="hidden lg:flex items-center space-x-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 ${
                                    location.pathname === link.path
                                        ? 'bg-[#55b32b] text-white shadow-md shadow-[#55b32b]/25'
                                        : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Quick Services Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                                    isCategoryOpen ? 'bg-slate-200 text-slate-900' : 'text-slate-700 hover:bg-white/80'
                                }`}
                            >
                                <span>Services</span>
                                <ChevronDown size={14} className={`transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Services Mega Dropdown Panel */}
                            {isCategoryOpen && (
                                <div className="absolute top-full left-0 mt-3 w-80 bg-white border border-slate-200 rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in duration-150">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 px-2">
                                        Select Skilled Service
                                    </div>
                                    <div className="grid grid-cols-1 gap-1">
                                        {QUICK_CATEGORIES.map((cat) => (
                                            <button
                                                key={cat.name}
                                                onClick={() => {
                                                    navigate(`/catalog?category=${encodeURIComponent(cat.name)}`);
                                                    setIsCategoryOpen(false);
                                                }}
                                                className="w-full text-left p-2.5 rounded-2xl hover:bg-emerald-50/80 border border-transparent hover:border-emerald-200 transition group flex items-center gap-3"
                                            >
                                                <span className="text-xl p-2 bg-slate-100 group-hover:bg-white rounded-xl shadow-xs shrink-0">{cat.icon}</span>
                                                <div>
                                                    <p className="text-xs font-black text-slate-900 group-hover:text-[#46a021]">{cat.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-medium">{cat.desc}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="pt-3 border-t border-slate-100 mt-2">
                                        <Link
                                            to="/catalog"
                                            onClick={() => setIsCategoryOpen(false)}
                                            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold rounded-xl flex items-center justify-center gap-1 transition"
                                        >
                                            <span>View All Services</span>
                                            <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Right: High-Impact Action Buttons */}
                    <div className="flex items-center space-x-2.5">
                        <Link
                            to="/catalog"
                            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-[#55b32b] hover:bg-[#46a021] text-white font-extrabold text-xs rounded-xl shadow-lg shadow-[#55b32b]/25 hover:shadow-xl hover:shadow-[#55b32b]/35 hover:-translate-y-0.5 transition duration-200"
                        >
                            <Search size={15} />
                            <span>Find Workers</span>
                        </Link>

                        <Link
                            to="/register-worker"
                            className="hidden md:flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl border border-slate-200/90 transition"
                        >
                            <UserCheck size={15} className="text-[#55b32b]" />
                            <span>Join as Worker</span>
                        </Link>

                        <Link
                            to="/admin"
                            className="px-3.5 py-2.5 bg-[#55b32b]/10 hover:bg-[#55b32b]/20 text-[#46a021] font-extrabold text-xs rounded-xl border border-[#55b32b]/30 transition"
                        >
                            Admin Portal
                        </Link>

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2.5 lg:hidden rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-b border-slate-200 z-40 overflow-hidden shadow-2xl"
                    >
                        <div className="px-6 py-5 space-y-4">
                            <div className="space-y-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`block text-xs font-black uppercase tracking-wider py-2.5 px-3 rounded-xl border ${
                                            location.pathname === link.path ? 'bg-[#55b32b] text-white border-[#55b32b]' : 'text-slate-700 border-slate-100 hover:bg-slate-50'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            <div className="pt-2 border-t border-slate-100 space-y-2">
                                <Link
                                    to="/catalog"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block text-xs font-extrabold text-center py-3 bg-[#55b32b] text-white rounded-xl shadow-md"
                                >
                                    🔍 Find Skilled Workers Near You
                                </Link>
                                <Link
                                    to="/register-worker"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block text-xs font-extrabold text-center py-3 bg-slate-100 text-slate-900 rounded-xl border border-slate-200"
                                >
                                    👷 Become a Service Provider
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Page Content Outlet */}
            <main className="flex-grow w-full relative bg-slate-50">
                <Outlet />
            </main>

            {/* PREMIUM ULTRA-ATTRACTIVE FOOTER */}
            <footer className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden pt-16 pb-8 border-t border-slate-800">
                {/* Background Ambient Glow Effects */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#55b32b]/10 rounded-full blur-[140px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-12">

                    {/* Pre-Footer Action Banner */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/30 p-8 sm:p-10 shadow-2xl shadow-emerald-900/20">
                        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#55b32b]/20 rounded-full blur-3xl" />
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
                            <div className="space-y-2 text-center lg:text-left">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#55b32b]/15 border border-[#55b32b]/30 text-[#55b32b] text-xs font-black uppercase tracking-wider">
                                    <ShieldCheck size={14} /> Instant On-Demand Dispatch
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                    Need a Skilled Field Worker Urgently?
                                </h3>
                                <p className="text-slate-300 text-xs sm:text-sm max-w-xl font-medium">
                                    Book verified Plumbers, Electricians, Carpenters, Masons, and Coconut Pluckers across your district with real-time GPS tracking.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                                <Link
                                    to="/catalog"
                                    className="px-6 py-3 bg-[#55b32b] hover:bg-[#46a021] text-white font-extrabold text-xs rounded-xl shadow-lg shadow-[#55b32b]/30 hover:shadow-xl hover:scale-105 transition duration-200 flex items-center gap-2"
                                >
                                    <MapPin size={16} />
                                    <span>Find Workers Near You</span>
                                </Link>
                                <Link
                                    to="/register-worker"
                                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs rounded-xl border border-slate-700 hover:border-slate-600 transition flex items-center gap-2"
                                >
                                    <span>Join as Worker</span>
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Main 4-Column Footer Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {/* Column 1: Brand Info */}
                        <div className="space-y-4">
                            <HireMeLogo variant="dark" size="small" />
                            <p className="text-slate-400 text-xs leading-relaxed font-medium">
                                Sri Lanka's premier digital platform connecting households and businesses with 100% NIC and skill-verified field service professionals.
                            </p>

                            <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
                                <div className="flex items-center gap-2 text-[#55b32b] text-xs font-black">
                                    <ShieldCheck size={16} />
                                    <span>100% NIC & Skill Verified</span>
                                </div>
                                <p className="text-[11px] text-slate-400 font-medium leading-normal">
                                    Every service provider undergoes background screening & physical document inspection.
                                </p>
                            </div>
                        </div>

                        {/* Column 2: Popular Categories */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-black text-white uppercase tracking-widest border-b border-slate-800 pb-2">
                                Popular Services
                            </h4>
                            <ul className="space-y-2 text-xs font-medium text-slate-400">
                                {['Plumbing & Pipe Leak Repair', 'Electrical Wiring & DB Box Repair', 'Carpentry & Roofing Services', 'Coconut Plucking & Tree Cutting', 'Masonry & Concrete Works', 'Wall Painting & Renovation', 'Deep House Cleaning'].map((cat) => (
                                    <li key={cat}>
                                        <Link to="/catalog" className="hover:text-[#55b32b] transition flex items-center gap-1.5 group">
                                            <ChevronRight size={12} className="text-slate-600 group-hover:text-[#55b32b] transition" />
                                            <span>{cat}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 3: Office Hubs & Coverage */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-black text-white uppercase tracking-widest border-b border-slate-800 pb-2">
                                Office Hubs & Coverage
                            </h4>
                            <div className="space-y-3 text-xs text-slate-400">
                                <div className="flex items-start gap-2.5">
                                    <MapPin size={16} className="text-[#55b32b] shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-white">Colombo Central Hub</p>
                                        <p className="text-slate-400 text-[11px]">Galle Road, Colombo 03</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <MapPin size={16} className="text-[#55b32b] shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-white">Kandy Regional Hub</p>
                                        <p className="text-slate-400 text-[11px]">Peradeniya Road, Kandy</p>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <span className="text-[11px] font-bold text-slate-400 block mb-1.5">Islandwide District Coverage:</span>
                                    <div className="flex flex-wrap gap-1">
                                        {['Colombo', 'Gampaha', 'Kandy', 'Galle', 'Kurunegala', 'Kalutara', 'Matara', 'Jaffna'].map((d) => (
                                            <span key={d} className="px-2 py-0.5 bg-slate-800/80 border border-slate-700/60 rounded text-[10px] text-slate-300 font-bold">
                                                {d}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Column 4: 24/7 Hotline */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-black text-white uppercase tracking-widest border-b border-slate-800 pb-2">
                                24/7 Emergency Hotline
                            </h4>
                            <div className="space-y-3">
                                <a
                                    href="tel:+94112345678"
                                    className="p-4 rounded-2xl bg-gradient-to-r from-[#55b32b]/20 to-emerald-500/10 border border-[#55b32b]/40 flex items-center gap-3 group hover:border-[#55b32b] transition duration-200"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-[#55b32b] text-white flex items-center justify-center font-bold shadow-md shadow-[#55b32b]/30 shrink-0">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Dispatch Hotline</span>
                                        <span className="text-base font-black text-white group-hover:text-[#55b32b] transition">+94 11 234 5678</span>
                                    </div>
                                </a>

                                <div className="space-y-2 text-xs text-slate-400 font-medium">
                                    <div className="flex items-center gap-2">
                                        <Mail size={14} className="text-[#55b32b]" />
                                        <span>support@hireme.lk</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Clock size={14} className="text-amber-500" />
                                        <span>24 Hours · 365 Days Service</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Copyright Bar */}
                    <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <span>© 2026 HireMe Platform Sri Lanka. All Rights Reserved.</span>
                        </div>

                        <div className="flex flex-wrap justify-center gap-5 text-slate-400 font-bold">
                            <Link to="/" className="hover:text-[#55b32b] transition">Home</Link>
                            <Link to="/catalog" className="hover:text-[#55b32b] transition">Find Workers</Link>
                            <Link to="/register-worker" className="hover:text-[#55b32b] transition">Join as Worker</Link>
                            <Link to="/about" className="hover:text-[#55b32b] transition">About Us</Link>
                            <Link to="/contact" className="hover:text-[#55b32b] transition">Contact</Link>
                            <Link to="/admin" className="hover:text-[#55b32b] transition">Admin Portal</Link>
                        </div>
                    </div>

                </div>
            </footer>
        </div>
    );
}
