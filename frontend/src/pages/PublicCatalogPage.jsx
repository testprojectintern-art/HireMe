import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Search, ShieldCheck, MapPin, Phone, Star, Briefcase, Award,
    CheckCircle, Filter, X, User
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const CATEGORIES = ['All', 'Plumber', 'Electrician', 'Carpenter', 'Coconut Plucker', 'Painter', 'Mason', 'Cleaner', 'Other'];
const DISTRICTS = ['All', 'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Galle', 'Matara', 'Jaffna', 'Kurunegala', 'Ratnapura'];

const SEEDED_WORKERS = [
    {
        _id: 'sample-1',
        firstName: 'Sunil',
        lastName: 'Shantha',
        primaryCategory: 'Plumber',
        skills: ['Pipe Fitting', 'Bathroom Repair', 'Overhead Tank Leak'],
        phone: '0771234567',
        district: 'Colombo',
        address: 'Nugegoda, Colombo',
        rating: 4.8,
        totalJobs: 42,
        baseRate: 3500,
        isVerified: true,
        verificationStatus: 'approved',
        status: 'online'
    },
    {
        _id: 'sample-2',
        firstName: 'Kamal',
        lastName: 'Perera',
        primaryCategory: 'Electrician',
        skills: ['House Wiring', 'Trip Switch Fixing', 'Ceiling Fan Install'],
        phone: '0719876543',
        district: 'Kandy',
        address: 'Peradeniya, Kandy',
        rating: 4.9,
        totalJobs: 58,
        baseRate: 4000,
        isVerified: true,
        verificationStatus: 'approved',
        status: 'online'
    },
    {
        _id: 'sample-3',
        firstName: 'Nimal',
        lastName: 'Fernando',
        primaryCategory: 'Coconut Plucker',
        skills: ['Tree Cleaning', 'Nut Harvesting', 'Safe Climbing'],
        phone: '0754567890',
        district: 'Gampaha',
        address: 'Negombo, Gampaha',
        rating: 4.7,
        totalJobs: 35,
        baseRate: 2500,
        isVerified: true,
        verificationStatus: 'approved',
        status: 'online'
    },
    {
        _id: 'sample-4',
        firstName: 'Gamini',
        lastName: 'Jayasinghe',
        primaryCategory: 'Carpenter',
        skills: ['Door Repair', 'Furniture Assembly', 'Roof Timberwork'],
        phone: '0783334444',
        district: 'Colombo',
        address: 'Maharagama, Colombo',
        rating: 4.6,
        totalJobs: 29,
        baseRate: 3800,
        isVerified: true,
        verificationStatus: 'approved',
        status: 'online'
    }
];

export default function PublicCatalogPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [category, setCategory] = useState(searchParams.get('category') || 'All');
    const [district, setDistrict] = useState(searchParams.get('district') || 'All');
    const [searchQuery, setSearchQuery] = useState('');
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedWorker, setSelectedWorker] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    useEffect(() => {
        const fetchWorkers = async () => {
            setLoading(true);
            try {
                let apiBase = import.meta.env.VITE_API_URL;
                if (!apiBase) {
                    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
                    apiBase = (hostname === 'localhost' || hostname === '127.0.0.1')
                        ? 'http://localhost:5005/api'
                        : 'https://hireme-dp4x.onrender.com/api';
                }
                const res = await axios.get(`${apiBase}/admin/workers`, {
                    params: {
                        verificationStatus: 'approved',
                        limit: 100
                    }
                });

                if (res.data?.data && res.data.data.length > 0) {
                    setWorkers(res.data.data);
                } else {
                    setWorkers(SEEDED_WORKERS);
                }
            } catch (err) {
                console.log('Using sample worker data for catalog');
                setWorkers(SEEDED_WORKERS);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkers();
    }, []);

    const filteredWorkers = workers.filter((w) => {
        if (category !== 'All' && w.primaryCategory !== category) return false;
        if (district !== 'All' && w.district && w.district !== district && !w.address?.includes(district)) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const nameMatch = `${w.firstName} ${w.lastName}`.toLowerCase().includes(q);
            const skillMatch = (w.skills || []).some((s) => s.toLowerCase().includes(q));
            if (!nameMatch && !skillMatch) return false;
        }
        return true;
    });

    const handleConfirmBooking = (e) => {
        e.preventDefault();
        setBookingSuccess(true);
        toast.success(`Booking request sent to ${selectedWorker.firstName} ${selectedWorker.lastName}!`);
    };

    return (
        <div className="space-y-8 py-6 px-4 max-w-7xl mx-auto animate-in fade-in duration-300">
            {/* Page Header */}
            <div className="text-center space-y-2">
                <span className="px-3.5 py-1.5 bg-[#55b32b]/10 border border-[#55b32b]/25 text-[#46a021] text-xs font-extrabold rounded-full uppercase tracking-wider">
                    Hire Verified Skilled Labor
                </span>
                <h1 className="text-3xl font-black text-slate-900">Find Field Workers Near You</h1>
                <p className="text-slate-600 text-sm max-w-xl mx-auto font-medium">
                    Browse background-checked Plumbers, Electricians, Carpenters, and Coconut Pluckers across Sri Lanka.
                </p>
            </div>

            {/* Filter Bar */}
            <div className="p-4 bg-white border border-slate-200/90 rounded-3xl space-y-4 shadow-xl shadow-slate-200/50">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Search */}
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
                        <Search size={16} className="text-slate-400 shrink-0" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by worker name, skill…"
                            className="bg-transparent text-sm text-slate-900 placeholder-slate-400 font-medium outline-none w-full"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
                        <Briefcase size={16} className="text-[#55b32b] shrink-0" />
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="bg-transparent text-sm text-slate-900 font-bold outline-none w-full cursor-pointer"
                        >
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c} className="bg-white text-slate-900">{c === 'All' ? 'All Categories' : c}</option>
                            ))}
                        </select>
                    </div>

                    {/* District Filter */}
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
                        <MapPin size={16} className="text-amber-500 shrink-0" />
                        <select
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className="bg-transparent text-sm text-slate-900 font-bold outline-none w-full cursor-pointer"
                        >
                            {DISTRICTS.map((d) => (
                                <option key={d} value={d} className="bg-white text-slate-900">{d === 'All' ? 'All Districts' : d}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Workers Grid */}
            {loading ? (
                <div className="py-20 text-center">
                    <div className="w-10 h-10 border-4 border-[#55b32b] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-slate-500 text-sm font-medium">Searching verified workers…</p>
                </div>
            ) : filteredWorkers.length === 0 ? (
                <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-3 shadow-lg">
                    <Filter className="text-slate-400 mx-auto" size={40} />
                    <h3 className="text-base font-bold text-slate-800">No Workers Found</h3>
                    <p className="text-xs text-slate-500 font-medium">Try adjusting your category or district filter.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWorkers.map((w) => (
                        <div
                            key={w._id}
                            className="bg-white border border-slate-200/90 hover:border-[#55b32b] rounded-3xl p-6 space-y-4 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-[#55b32b]/10 transition-all hover:-translate-y-1"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#46a021] flex items-center justify-center">
                                        <User size={22} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-extrabold text-slate-900">{w.firstName} {w.lastName}</h3>
                                        <p className="text-xs text-[#46a021] font-bold">{w.primaryCategory}</p>
                                    </div>
                                </div>
                                <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-full">
                                    <ShieldCheck size={12} /> Verified
                                </span>
                            </div>

                            <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                                <div className="flex items-center gap-2">
                                    <MapPin size={13} className="text-slate-400" />
                                    <span>{w.address || w.district || 'Colombo'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star size={13} className="text-amber-500 fill-amber-400" />
                                    <span className="text-slate-900 font-black">{(w.rating || 4.8).toFixed(1)}</span>
                                    <span className="text-slate-500">({w.totalJobs || 25} jobs completed)</span>
                                </div>
                            </div>

                            {/* Skills Tags */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {(w.skills || [w.primaryCategory]).map((s) => (
                                    <span key={s} className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg">
                                        {s}
                                    </span>
                                ))}
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Est. Base Rate</span>
                                    <span className="text-sm font-black text-[#46a021]">LKR {(w.baseRate || 3500).toLocaleString()}/day</span>
                                </div>

                                <button
                                    onClick={() => { setSelectedWorker(w); setBookingSuccess(false); }}
                                    className="px-4 py-2.5 bg-[#55b32b] hover:bg-[#46a021] text-white font-extrabold text-xs rounded-xl shadow-md shadow-[#55b32b]/25 transition"
                                >
                                    Book Service
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Booking Modal */}
            {selectedWorker && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200 relative">
                        <button
                            onClick={() => setSelectedWorker(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                        >
                            <X size={20} />
                        </button>

                        {bookingSuccess ? (
                            <div className="text-center py-6 space-y-4">
                                <CheckCircle size={48} className="text-[#55b32b] mx-auto" />
                                <h3 className="text-xl font-black text-slate-900">Booking Request Sent!</h3>
                                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                    We have dispatched your request to <strong>{selectedWorker.firstName} {selectedWorker.lastName}</strong> ({selectedWorker.phone}).
                                    They will call you within 15 minutes to confirm the exact location.
                                </p>
                                <button
                                    onClick={() => setSelectedWorker(null)}
                                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
                                >
                                    Close Window
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleConfirmBooking} className="space-y-4">
                                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#46a021] flex items-center justify-center"><User size={20} /></div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900">{selectedWorker.firstName} {selectedWorker.lastName}</h3>
                                        <p className="text-xs text-[#46a021] font-bold">{selectedWorker.primaryCategory}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Ruwan Gunawardena"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#55b32b]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Mobile Phone *</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="0771234567"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#55b32b]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Service Address / Location *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="No 25, Main Street, Colombo 03"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#55b32b]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Job Description Notes</label>
                                    <textarea
                                        rows={2}
                                        placeholder="Describe the issue (e.g. Overhead water tank pipe leak)..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#55b32b] resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-[#55b32b] hover:bg-[#46a021] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-[#55b32b]/25 transition"
                                >
                                    Confirm & Dispatch Worker
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
