import { ShieldCheck, Target, Heart, Award, Users, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PublicAboutPage() {
    return (
        <div className="max-w-4xl mx-auto py-10 px-4 space-y-12 animate-in fade-in duration-300">
            {/* Header */}
            <div className="text-center space-y-3">
                <span className="px-3.5 py-1.5 bg-[#55b32b]/10 border border-[#55b32b]/25 text-[#46a021] text-xs font-bold rounded-full uppercase tracking-wider">
                    About HireMe Platform
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
                    Digitalizing Sri Lanka's Informal Labor Market
                </h1>
                <p className="text-slate-600 text-base max-w-2xl mx-auto leading-relaxed font-medium">
                    Connecting skilled Sri Lankan field service workers directly with households and businesses through technology, trust, and transparency.
                </p>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-white border border-slate-200/90 rounded-3xl space-y-3 shadow-xl shadow-slate-200/50">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
                        <Target size={24} />
                    </div>
                    <h2 className="text-xl font-black text-slate-900">Our Mission</h2>
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">
                        To empower informal skilled workers (Plumbers, Electricians, Carpenters, Masons) in Sri Lanka with steady income, digital identity, and dignity of labor, while providing households with instant, safe, and reliable service dispatch.
                    </p>
                </div>

                <div className="p-8 bg-white border border-slate-200/90 rounded-3xl space-y-3 shadow-xl shadow-slate-200/50">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#46a021] flex items-center justify-center">
                        <ShieldCheck size={24} />
                    </div>
                    <h2 className="text-xl font-black text-slate-900">Our Vision</h2>
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">
                        To build the most trusted and transparent skilled labor ecosystem in South Asia, where every worker is NIC-verified and every household can hire help with complete peace of mind.
                    </p>
                </div>
            </div>

            {/* Core Values */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-8 space-y-6 shadow-xl shadow-slate-200/50">
                <h3 className="text-xl font-black text-slate-900 text-center">Trust, Safety & Quality Assurance</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-2 text-center p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                        <CheckCircle className="text-[#46a021] mx-auto" size={32} />
                        <h4 className="text-sm font-bold text-slate-900">Manual Admin Verification</h4>
                        <p className="text-xs text-slate-600 font-medium">NIC front and back document checks before any worker is listed.</p>
                    </div>
                    <div className="space-y-2 text-center p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                        <Award className="text-amber-500 mx-auto" size={32} />
                        <h4 className="text-sm font-bold text-slate-900">Transparent Daily Rates</h4>
                        <p className="text-xs text-slate-600 font-medium">No hidden middleman markups. Workers set fair expectations.</p>
                    </div>
                    <div className="space-y-2 text-center p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                        <Users className="text-indigo-600 mx-auto" size={32} />
                        <h4 className="text-sm font-bold text-slate-900">Community Ratings</h4>
                        <p className="text-xs text-slate-600 font-medium">Customer feedback and star ratings ensure ongoing service quality.</p>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="text-center p-8 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border border-emerald-200 rounded-3xl space-y-4 shadow-lg">
                <h3 className="text-2xl font-black text-slate-900">Are You a Skilled Service Provider?</h3>
                <p className="text-slate-600 text-sm max-w-lg mx-auto font-medium">
                    Join thousands of Sri Lankan workers earning daily. Register on web or mobile app today!
                </p>
                <Link
                    to="/register-worker"
                    className="inline-block px-8 py-3 bg-[#55b32b] hover:bg-[#46a021] text-white font-extrabold text-sm rounded-xl transition shadow-lg shadow-[#55b32b]/30"
                >
                    Register as a Worker Now
                </Link>
            </div>
        </div>
    );
}
