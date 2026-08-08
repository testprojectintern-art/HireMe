import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ShieldCheck, Zap, Users, MapPin, Wifi } from 'lucide-react';

import { authApi } from '../features/auth/authApi';
import { loginSchema } from '../features/auth/authSchemas';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import HireMeLogo, { HireMeIcon } from '../components/common/HireMeLogo';

// Floating particles for left panel
function Particles() {
    const particles = Array.from({ length: 18 }, (_, i) => ({
        id: i,
        size: Math.random() * 3 + 1.5,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 8,
        duration: Math.random() * 6 + 6,
        opacity: Math.random() * 0.4 + 0.15,
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map(p => (
                <div
                    key={p.id}
                    className="absolute rounded-full animate-float"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        background: `rgba(85,179,43,${p.opacity})`,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`,
                        boxShadow: `0 0 ${p.size * 2.5}px rgba(85,179,43,${p.opacity * 0.8})`,
                    }}
                />
            ))}
        </div>
    );
}

// Animated grid lines
function GridLines() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.07]"
            style={{
                backgroundImage: `linear-gradient(rgba(85,179,43,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(85,179,43,0.5) 1px, transparent 1px)`,
                backgroundSize: '60px 60px',
            }}
        />
    );
}

export default function LoginPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const requestedPortal = searchParams.get('portal') || 'main';
    const { login, isAuthenticated } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (response) => {
            const { token, ...user } = response.data;

            const isPrivileged = ['admin', 'owner'].includes(user.role);
            const hasAccess = user.allowedPortals && user.allowedPortals.includes(requestedPortal);

            if (!isPrivileged && !hasAccess && user.role !== 'admin') {
                toast.error(`Access Denied: You do not have permissions to access the admin portal.`);
                return;
            }

            const userWithActivePortal = { ...user, activePortal: requestedPortal };
            login(userWithActivePortal, token);
            toast.success(`Welcome back, ${user.firstName || 'Admin'}!`);

            if (user.role === 'admin' || user.role === 'owner') {
                navigate('/admin');
            } else {
                navigate('/admin');
            }
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
        },
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/admin', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    if (isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center space-y-3">
                    <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto"
                        style={{ borderColor: '#55b32b', borderTopColor: 'transparent' }} />
                    <p className="text-sm text-slate-500 font-medium">Loading HireMe portal…</p>
                </div>
            </div>
        );
    }

    const onSubmit = (data) => {
        loginMutation.mutate(data);
    };

    return (
        <div className="min-h-screen flex bg-slate-50 font-sans">

            {/* ── Left Side Cover Panel ── */}
            <div className="hidden lg:flex lg:w-7/12 xl:w-8/12 relative overflow-hidden flex-col"
                style={{ background: 'linear-gradient(135deg, #060a10 0%, #0a1220 50%, #081408 100%)' }}>

                {/* Grid lines */}
                <GridLines />

                {/* Floating particles */}
                <Particles />

                {/* Big green ambient orb */}
                <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full pointer-events-none animate-orb-drift"
                    style={{ background: 'radial-gradient(circle, rgba(85,179,43,0.12) 0%, rgba(85,179,43,0.03) 45%, transparent 70%)' }} />
                <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 65%)', animationDelay: '-6s' }} />

                {/* Content Overlay */}
                <div className="relative z-10 flex flex-col justify-between w-full h-full p-12 text-white">
                    {/* Header Logo */}
                    <div>
                        <HireMeLogo variant="dark" size="large" />
                        <span className="block text-[10px] tracking-[0.28em] uppercase font-extrabold mt-1.5"
                            style={{ color: '#55b32b' }}>
                            Skilled Field Workers Sri Lanka
                        </span>
                    </div>

                    {/* Middle Features */}
                    <div className="max-w-xl space-y-7">
                        <div className="space-y-4">
                            {/* Badge */}
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-black uppercase tracking-wider"
                                style={{
                                    background: 'rgba(85,179,43,0.12)',
                                    borderColor: 'rgba(85,179,43,0.35)',
                                    color: '#55b32b',
                                }}>
                                <ShieldCheck size={15} /> Admin Operations Portal
                            </span>

                            <h2 className="text-3xl font-black tracking-tight leading-tight text-white">
                                <div>"හරියටම, වේලාවට,</div>
                                <div className="pt-1 flex flex-wrap items-center gap-x-2">
                                    <span style={{ color: '#55b32b' }}>Skilled Worker</span>
                                    <span className="text-white">කෙනෙක්</span>
                                </div>
                                <div className="pt-1 text-white">හොයාගන්න"</div>
                            </h2>

                            <p className="text-slate-300 text-sm leading-relaxed font-medium max-w-md">
                                Manage worker dispatch, real-time GPS tracking, NIC identity verifications,
                                job allocations, and dispute resolutions under a single unified admin dashboard.
                            </p>
                        </div>

                        {/* Stats board (glass card) */}
                        <div className="p-6 rounded-3xl border backdrop-blur-sm space-y-5"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                borderColor: 'rgba(85,179,43,0.2)',
                                boxShadow: '0 0 40px rgba(85,179,43,0.06), inset 0 1px 0 rgba(255,255,255,0.06)',
                            }}>
                            <div className="flex items-center gap-2" style={{ color: '#55b32b' }}>
                                <div className="w-1.5 h-1.5 rounded-full animate-blink-dot" style={{ background: '#55b32b' }} />
                                <span className="text-xs font-black uppercase tracking-widest">System Live Snapshot</span>
                            </div>
                            <div className="grid grid-cols-2 gap-6 text-left">
                                <div className="space-y-1">
                                    <span className="block text-3xl font-black text-white">100%</span>
                                    <span className="text-[11px] text-slate-400 uppercase font-extrabold tracking-wider">NIC Verified Workers</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="block text-3xl font-black" style={{ color: '#55b32b' }}>24/7</span>
                                    <span className="text-[11px] text-slate-400 uppercase font-extrabold tracking-wider">Real-time GPS Dispatch</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5">
                                        <Wifi size={14} style={{ color: '#55b32b' }} />
                                        <span className="block text-xl font-black text-white">Live</span>
                                    </div>
                                    <span className="text-[11px] text-slate-400 uppercase font-extrabold tracking-wider">Job Tracking</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="block text-3xl font-black text-white">SL</span>
                                    <span className="text-[11px] text-slate-400 uppercase font-extrabold tracking-wider">All Districts</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Motto */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                        <ShieldCheck size={15} style={{ color: '#55b32b' }} />
                        <span>HIREME FIELD WORKER DISPATCH & MANAGEMENT PLATFORM</span>
                    </div>
                </div>
            </div>

            {/* ── Right Side Login Form ── */}
            <div className="w-full lg:w-5/12 xl:w-4/12 flex flex-col justify-between bg-white relative border-l border-slate-200"
                style={{ boxShadow: '-8px 0 40px rgba(0,0,0,0.06)' }}>

                {/* Subtle green ambient */}
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(85,179,43,0.04) 0%, transparent 65%)' }} />

                {/* Header */}
                <div className="flex justify-between items-center p-8 md:px-12 md:pt-10">
                    <HireMeLogo variant="light" size="small" />
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:border-hireme-300 hover:text-hireme-700 transition-all flex items-center gap-1.5"
                    >
                        ← Public Website
                    </button>
                </div>

                {/* Form Main Container */}
                <div className="flex-1 flex items-center justify-center px-8 md:px-12">
                    <div className="w-full max-w-sm space-y-8 animate-slide-up">
                        <div className="space-y-2">
                            {/* Animated accent line */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-[3px] rounded-full" style={{ background: 'linear-gradient(90deg, #55b32b, #41a020)' }} />
                                <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#55b32b' }}>
                                    Secure Access
                                </span>
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-slate-900">
                                Sign In
                            </h1>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                Enter your credentials to access the HireMe Admin Control Portal.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="space-y-1">
                                <Input
                                    label="Email Address"
                                    type="email"
                                    placeholder="admin@hireme.lk"
                                    required
                                    error={errors.email?.message}
                                    {...register('email')}
                                />
                            </div>

                            <div className="space-y-1 relative">
                                <Input
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    required
                                    error={errors.password?.message}
                                    {...register('password')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-[38px] text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={loginMutation.isPending}
                                className="w-full py-3.5 rounded-xl font-extrabold text-white transition-all duration-200 flex items-center justify-center gap-2 shimmer-btn active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
                                style={{
                                    background: 'linear-gradient(135deg, #55b32b 0%, #41a020 100%)',
                                    boxShadow: '0 4px 20px rgba(85,179,43,0.35)',
                                }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(85,179,43,0.50)'}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(85,179,43,0.35)'}
                            >
                                {loginMutation.isPending ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                        </svg>
                                        Authenticating…
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck size={17} />
                                        Secure Sign In
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="text-center">
                            <a href="#" className="text-xs font-bold transition-colors hover:opacity-80" style={{ color: '#55b32b' }}>
                                Forgot your password? Contact system administrator.
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="text-center text-xs text-slate-400 font-medium p-8 md:px-12 md:pb-10">
                    <p>© 2026 HireMe Platform Sri Lanka. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}