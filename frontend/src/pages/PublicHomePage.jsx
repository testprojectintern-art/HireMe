import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Search, ShieldCheck, Zap, Users, CheckCircle, MapPin,
    Phone, Star, Clock, ArrowRight, Award, Briefcase, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
    { id: 'Plumber', title: 'Plumbing & Pipe Repair', icon: '🔧', desc: 'Leak repair, pipe fitting, bathroom & sink maintenance', bg: 'bg-blue-50 text-blue-600 border-blue-200' },
    { id: 'Electrician', title: 'Electrical & Wiring', icon: '⚡', desc: 'Short circuits, main board wiring, appliance setup', bg: 'bg-amber-50 text-amber-600 border-amber-200' },
    { id: 'Carpenter', title: 'Carpentry & Woodwork', icon: '🪚', desc: 'Door/window fixing, roof repair, custom furniture', bg: 'bg-orange-50 text-orange-600 border-orange-200' },
    { id: 'Coconut Plucker', title: 'Coconut Plucking', icon: '🌴', desc: 'Professional coconut tree cleaning & harvesting', bg: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { id: 'Painter', title: 'House Painting', icon: '🎨', desc: 'Interior/exterior wall painting & waterproofing', bg: 'bg-rose-50 text-rose-600 border-rose-200' },
    { id: 'Mason', title: 'Masonry & Concrete', icon: '🧱', desc: 'Wall construction, tile laying, foundation work', bg: 'bg-slate-100 text-slate-700 border-slate-300' },
    { id: 'Cleaner', title: 'Cleaning & Housekeeping', icon: '🧹', desc: 'Deep home cleaning, garden maintenance, debris clearing', bg: 'bg-purple-50 text-purple-600 border-purple-200' },
    { id: 'Other', title: 'Household Repair', icon: '🛠️', desc: 'General handymen for all quick home repairs', bg: 'bg-indigo-50 text-indigo-600 border-indigo-200' }
];

const SRI_LANKA_DISTRICTS = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kurunegala', 'Ratnapura'
];

export default function PublicHomePage() {
    const navigate = useNavigate();
    const [searchCategory, setSearchCategory] = useState('Plumber');
    const [searchDistrict, setSearchDistrict] = useState('Colombo');

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/catalog?category=${encodeURIComponent(searchCategory)}&district=${encodeURIComponent(searchDistrict)}`);
    };

    return (
        <div className="space-y-16 py-6 max-w-7xl mx-auto px-4">
            {/* HERO LANDING BANNER - LIGHT MODE */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-emerald-50/40 to-slate-100 border border-slate-200/80 p-8 sm:p-14 shadow-xl shadow-emerald-500/5">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#55b32b]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-3xl space-y-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#55b32b]/10 border border-[#55b32b]/25 text-[#46a021] text-xs font-bold uppercase tracking-wider">
                        <ShieldCheck size={16} />
                        100% NIC & Skill Verified Workers
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-[1.6] tracking-tight space-y-2">
                        <div>"හරියටම, වේලාවට, ලඟ ඉන්න</div>
                        <div className="pt-1.5 flex flex-wrap items-center gap-x-2">
                            <span className="text-[#55b32b]">Skilled Worker</span>
                            <span className="text-slate-900">කෙනෙක්</span>
                        </div>
                        <div className="pt-1.5 text-slate-900">
                            හොයාගන්න"
                        </div>
                    </h1>

                    <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed max-w-2xl">
                        Find trusted Plumbers, Electricians, Carpenters, Coconut Pluckers, and Masons in your district. Direct booking with real-time GPS tracking.
                    </p>

                    {/* Quick Search Form */}
                    <form onSubmit={handleSearch} className="p-3 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row gap-3 shadow-2xl shadow-slate-200/80">
                        <div className="flex-1 flex items-center gap-2 bg-slate-50 rounded-xl px-3.5 py-2.5 border border-slate-200">
                            <Briefcase size={16} className="text-[#55b32b] shrink-0" />
                            <select
                                value={searchCategory}
                                onChange={(e) => setSearchCategory(e.target.value)}
                                className="bg-transparent text-sm text-slate-800 font-bold outline-none w-full cursor-pointer"
                            >
                                {CATEGORIES.map((c) => (
                                    <option key={c.id} value={c.id} className="bg-white text-slate-900">{c.icon} {c.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1 flex items-center gap-2 bg-slate-50 rounded-xl px-3.5 py-2.5 border border-slate-200">
                            <MapPin size={16} className="text-amber-500 shrink-0" />
                            <select
                                value={searchDistrict}
                                onChange={(e) => setSearchDistrict(e.target.value)}
                                className="bg-transparent text-sm text-slate-800 font-bold outline-none w-full cursor-pointer"
                            >
                                {SRI_LANKA_DISTRICTS.map((d) => (
                                    <option key={d} value={d} className="bg-white text-slate-900">📍 {d} District</option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="px-7 py-3.5 bg-[#55b32b] hover:bg-[#46a021] text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#55b32b]/30 hover:shadow-xl hover:shadow-[#55b32b]/40 hover:-translate-y-0.5"
                        >
                            <Search size={16} />
                            Search Workers
                        </button>
                    </form>

                    {/* Quick CTA Links */}
                    <div className="pt-2 flex flex-wrap gap-4 items-center">
                        <Link
                            to="/register-worker"
                            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-slate-900/20 flex items-center gap-2"
                        >
                            <Users size={16} className="text-[#55b32b]" />
                            Become a Worker / Join as Service Provider
                        </Link>
                        <Link
                            to="/catalog"
                            className="text-xs text-slate-600 hover:text-[#55b32b] flex items-center gap-1 font-bold underline underline-offset-4"
                        >
                            View All Service Workers <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* SERVICE CATEGORY GRID */}
            <section className="space-y-6">
                <div className="text-center space-y-2">
                    <span className="text-xs font-extrabold text-[#55b32b] uppercase tracking-widest">Our Skilled Categories</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Popular On-Demand Services</h2>
                    <p className="text-slate-500 text-sm max-w-xl mx-auto font-medium">Select a category to view available background-verified workers near you</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {CATEGORIES.map((cat) => (
                        <div
                            key={cat.id}
                            onClick={() => navigate(`/catalog?category=${encodeURIComponent(cat.id)}`)}
                            className="group bg-white border border-slate-200/80 hover:border-[#55b32b] rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-[#55b32b]/15"
                        >
                            <div className="space-y-3">
                                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl shadow-sm ${cat.bg}`}>
                                    {cat.icon}
                                </div>
                                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#55b32b] transition-colors">{cat.title}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">{cat.desc}</p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#55b32b] font-extrabold">
                                <span>Find Workers</span>
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 space-y-8 shadow-xl shadow-slate-200/60">
                <div className="text-center space-y-2">
                    <span className="text-xs font-extrabold text-[#55b32b] uppercase tracking-widest">Simple & Fast Process</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">How HireMe Works</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="space-y-3 p-5 bg-slate-50/80 rounded-2xl border border-slate-100">
                        <div className="w-14 h-14 rounded-2xl bg-[#55b32b]/10 border border-[#55b32b]/30 text-[#46a021] flex items-center justify-center text-xl font-black mx-auto">1</div>
                        <h3 className="text-base font-bold text-slate-900">Select Service & Location</h3>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">Choose your required service (Plumber, Electrician, etc.) and your district.</p>
                    </div>

                    <div className="space-y-3 p-5 bg-slate-50/80 rounded-2xl border border-slate-100">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center text-xl font-black mx-auto">2</div>
                        <h3 className="text-base font-bold text-slate-900">Get Matched with Verified Worker</h3>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">View worker NIC verification badges, customer ratings, and daily rates.</p>
                    </div>

                    <div className="space-y-3 p-5 bg-slate-50/80 rounded-2xl border border-slate-100">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 flex items-center justify-center text-xl font-black mx-auto">3</div>
                        <h3 className="text-base font-bold text-slate-900">Job Done & Fair Payment</h3>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">Worker arrives at your doorstep. Pay directly upon satisfactory completion.</p>
                    </div>
                </div>
            </section>

            {/* TRUST & SAFETY HIGHLIGHTS */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 bg-white border border-slate-200 rounded-2xl flex items-start gap-4 shadow-lg shadow-slate-200/40">
                    <ShieldCheck className="text-[#55b32b] shrink-0" size={30} />
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">NIC & Document Verified</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">Every worker profile is manually verified by HireMe Admin Team before activation.</p>
                    </div>
                </div>

                <div className="p-6 bg-white border border-slate-200 rounded-2xl flex items-start gap-4 shadow-lg shadow-slate-200/40">
                    <Award className="text-amber-500 shrink-0" size={30} />
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">Fair Base Rates</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">Transparent daily/hourly base rates with zero hidden commission markups.</p>
                    </div>
                </div>

                <div className="p-6 bg-white border border-slate-200 rounded-2xl flex items-start gap-4 shadow-lg shadow-slate-200/40">
                    <Clock className="text-blue-600 shrink-0" size={30} />
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">24/7 Emergency Dispatch</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">Quick response for urgent plumbing leaks, electrical shorts, and household emergencies.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
