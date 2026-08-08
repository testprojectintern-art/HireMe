import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Phone, MapPin, Briefcase, Award, FileText, Upload,
    CheckCircle, Clock, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const SRI_LANKA_DISTRICTS = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Moneragala', 'Ratnapura', 'Kegalle'
];

const SKILL_CATEGORIES = [
    { id: 'Plumber', label: 'Plumber (නල කාර්මික)', icon: '🔧' },
    { id: 'Electrician', label: 'Electrician (විදුලි කාර්මික)', icon: '⚡' },
    { id: 'Carpenter', label: 'Carpenter (වඩු කාර්මික)', icon: '🪚' },
    { id: 'Coconut Plucker', label: 'Coconut Plucker (පොල් කැඩීම)', icon: '🌴' },
    { id: 'Painter', label: 'Painter (තීන්ත ආලේපක)', icon: '🎨' },
    { id: 'Mason', label: 'Mason (මේසන් කාර්මික)', icon: '🧱' },
    { id: 'Cleaner', label: 'Cleaner / Housekeeper', icon: '🧹' },
    { id: 'Other', label: 'Other Skilled Services', icon: '🛠️' }
];

export default function WorkerRegisterWizard() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        // Step 1: Personal
        fullName: '',
        phone: '',
        emergencyPhone: '',
        address: '',
        district: 'Colombo',

        // Step 2: Skill
        primaryCategory: 'Plumber',
        skills: 'Pipe fitting, Leak repair',
        experienceYears: '3',
        baseRate: '3500',

        // Step 3: Identity & Docs
        nicNumber: '',
        nicFrontUrl: '',
        nicBackUrl: '',
        certificateUrl: ''
    });

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSimulatedUpload = (field, label) => {
        const sampleUrl = prompt(`Enter ${label} Image/Document URL (or leave default for demo sample):`,
            field === 'nicFrontUrl'
                ? 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80'
                : 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80'
        );

        if (sampleUrl) {
            updateField(field, sampleUrl);
            toast.success(`${label} uploaded successfully!`);
        }
    };

    const handleNext = () => {
        if (step === 1) {
            if (!formData.fullName.trim() || !formData.phone.trim()) {
                toast.error('Please enter your full name and mobile phone number.');
                return;
            }
        }
        if (step === 2) {
            if (!formData.primaryCategory) {
                toast.error('Please select your primary skill category.');
                return;
            }
        }
        setStep((s) => Math.min(s + 1, 3));
    };

    const handlePrev = () => {
        setStep((s) => Math.max(s - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.nicNumber.trim()) {
            toast.error('National Identity Card (NIC) number is required for verification.');
            return;
        }

        setIsSubmitting(true);
        try {
            let apiBase = import.meta.env.VITE_API_URL;
            if (!apiBase) {
                const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
                apiBase = (hostname === 'localhost' || hostname === '127.0.0.1')
                    ? 'http://localhost:5005/api'
                    : 'https://hireme-dp4x.onrender.com/api';
            }
            const certificates = formData.certificateUrl
                ? [{ title: 'Vocational Certificate', url: formData.certificateUrl }]
                : [];

            const res = await axios.post(`${apiBase}/public/register-worker`, {
                ...formData,
                certificates
            });

            if (res.data?.success) {
                setIsSubmitted(true);
                toast.success('Registration submitted for Admin Review!');
            } else {
                toast.error(res.data?.message || 'Submission failed');
            }
        } catch (err) {
            console.error('Worker registration error:', err);
            toast.error(err.response?.data?.message || 'Failed to submit registration. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-xl w-full text-center shadow-2xl space-y-6">
                    <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto text-amber-500">
                        <Clock size={40} className="animate-pulse" />
                    </div>

                    <div className="space-y-2">
                        <span className="inline-block px-3.5 py-1 bg-amber-100 border border-amber-300 text-amber-700 text-xs font-bold rounded-full uppercase tracking-wider">
                            Status: PENDING_APPROVAL
                        </span>
                        <h2 className="text-2xl font-black text-slate-900">Registration Submitted Successfully!</h2>
                        <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto font-medium">
                            Your profile is currently under review by the HireMe Admin Verification Team.
                            Once your NIC and skill documents are verified, you will receive an SMS confirmation.
                        </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2">
                        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                            <ShieldCheck size={16} className="text-[#55b32b]" />
                            Next Steps:
                        </div>
                        <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside pl-1 font-medium">
                            <li>Admin checks NIC front & back document clarity</li>
                            <li>Matchmaking profile becomes ACTIVE upon approval</li>
                            <li>SMS notification sent to <strong>{formData.phone}</strong></li>
                        </ul>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 bg-[#55b32b] hover:bg-[#46a021] text-white font-extrabold text-sm rounded-xl transition shadow-lg shadow-[#55b32b]/30"
                        >
                            Return to Home
                        </button>
                        <button
                            onClick={() => { setIsSubmitted(false); setStep(1); }}
                            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition"
                        >
                            Submit Another Application
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <span className="px-3.5 py-1.5 bg-[#55b32b]/10 border border-[#55b32b]/25 text-[#46a021] text-xs font-bold rounded-full uppercase tracking-wider">
                    Worker Onboarding Portal
                </span>
                <h1 className="text-3xl font-black text-slate-900">Join HireMe as a Service Provider</h1>
                <p className="text-slate-600 text-sm font-medium">
                    Earn daily by providing skilled services to verified customers across Sri Lanka
                </p>
            </div>

            {/* Stepper Progress Bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-lg">
                {[
                    { number: 1, title: 'Personal Details', icon: User },
                    { number: 2, title: 'Skill & Rates', icon: Briefcase },
                    { number: 3, title: 'NIC Verification', icon: ShieldCheck }
                ].map(({ number, title, icon: Icon }) => (
                    <div key={number} className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm transition-all
                            ${step === number
                                ? 'bg-[#55b32b] text-white shadow-lg shadow-[#55b32b]/40 ring-2 ring-[#55b32b]/30'
                                : step > number
                                ? 'bg-emerald-100 text-[#46a021] border border-emerald-300'
                                : 'bg-slate-100 text-slate-400'}`}
                        >
                            {step > number ? <CheckCircle size={18} /> : number}
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Step {number}</p>
                            <p className={`text-xs font-bold ${step === number ? 'text-slate-900' : 'text-slate-500'}`}>{title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Form Canvas */}
            <form onSubmit={handleSubmit} className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl shadow-slate-200/50">
                {/* STEP 1: Personal Details */}
                {step === 1 && (
                    <div className="space-y-5 animate-in fade-in duration-200">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                            <User className="text-[#55b32b]" size={20} />
                            Step 1: Personal Information
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name (සම්පූර්ණ නම) *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => updateField('fullName', e.target.value)}
                                    placeholder="e.g., Suneth Perera"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#55b32b]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone Number (දුරකථන අංකය) *</label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => updateField('phone', e.target.value)}
                                    placeholder="e.g., 0771234567"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#55b32b]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Contact Number</label>
                                <input
                                    type="tel"
                                    value={formData.emergencyPhone}
                                    onChange={(e) => updateField('emergencyPhone', e.target.value)}
                                    placeholder="e.g., 0719876543"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#55b32b]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">District / City (දිස්ත්‍රික්කය) *</label>
                                <select
                                    value={formData.district}
                                    onChange={(e) => updateField('district', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#55b32b]"
                                >
                                    {SRI_LANKA_DISTRICTS.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-xs font-bold text-slate-700 mb-1">Home Address (ලිපිනය)</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => updateField('address', e.target.value)}
                                    placeholder="No. 12, Main Street, Kandy"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#55b32b]"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: Skill & Base Rates */}
                {step === 2 && (
                    <div className="space-y-5 animate-in fade-in duration-200">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                            <Briefcase className="text-[#55b32b]" size={20} />
                            Step 2: Service & Skill Selection
                        </h2>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-2">Primary Service Category *</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {SKILL_CATEGORIES.map((cat) => (
                                    <button
                                        type="button"
                                        key={cat.id}
                                        onClick={() => updateField('primaryCategory', cat.id)}
                                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                                            formData.primaryCategory === cat.id
                                                ? 'bg-[#55b32b]/15 border-[#55b32b] text-slate-900 ring-2 ring-[#55b32b]/20 font-bold'
                                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                                        }`}
                                    >
                                        <span className="text-2xl mb-1">{cat.icon}</span>
                                        <span className="text-xs font-bold leading-tight">{cat.id}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Experience Years</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="50"
                                    value={formData.experienceYears}
                                    onChange={(e) => updateField('experienceYears', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#55b32b]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Expected Daily Base Rate (LKR)</label>
                                <input
                                    type="number"
                                    step="100"
                                    value={formData.baseRate}
                                    onChange={(e) => updateField('baseRate', e.target.value)}
                                    placeholder="e.g. 3500"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#55b32b]"
                                />
                            </div>

                            <div className="sm:col-span-3">
                                <label className="block text-xs font-bold text-slate-700 mb-1">Specific Skills / Specialities (Comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.skills}
                                    onChange={(e) => updateField('skills', e.target.value)}
                                    placeholder="e.g. Leak fixing, Wiring, Roofing, Tile laying"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#55b32b]"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: Identity & Document Upload */}
                {step === 3 && (
                    <div className="space-y-5 animate-in fade-in duration-200">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                            <ShieldCheck className="text-[#55b32b]" size={20} />
                            Step 3: NIC Identity & Verification Documents
                        </h2>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">National Identity Card (NIC) Number *</label>
                            <input
                                type="text"
                                required
                                value={formData.nicNumber}
                                onChange={(e) => updateField('nicNumber', e.target.value)}
                                placeholder="e.g., 199212345678 or 921234567V"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#55b32b] font-mono"
                            />
                        </div>

                        {/* NIC File Attachments */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* NIC Front */}
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-800">NIC Front Image (ඉදිරිපස)</span>
                                    {formData.nicFrontUrl && <span className="text-xs text-[#46a021] font-bold flex items-center gap-1"><CheckCircle size={12} /> Uploaded</span>}
                                </div>
                                {formData.nicFrontUrl ? (
                                    <img src={formData.nicFrontUrl} alt="NIC Front" className="h-32 w-full object-cover rounded-xl border border-slate-200" />
                                ) : (
                                    <div className="h-32 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-2 text-center bg-white">
                                        <Upload className="text-slate-400 mb-1" size={24} />
                                        <p className="text-xs text-slate-500 font-medium">Attach clear NIC Front Photo</p>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleSimulatedUpload('nicFrontUrl', 'NIC Front')}
                                    className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition"
                                >
                                    {formData.nicFrontUrl ? 'Change NIC Front Image' : 'Upload NIC Front Photo'}
                                </button>
                            </div>

                            {/* NIC Back */}
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-800">NIC Back Image (පසුපස)</span>
                                    {formData.nicBackUrl && <span className="text-xs text-[#46a021] font-bold flex items-center gap-1"><CheckCircle size={12} /> Uploaded</span>}
                                </div>
                                {formData.nicBackUrl ? (
                                    <img src={formData.nicBackUrl} alt="NIC Back" className="h-32 w-full object-cover rounded-xl border border-slate-200" />
                                ) : (
                                    <div className="h-32 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-2 text-center bg-white">
                                        <Upload className="text-slate-400 mb-1" size={24} />
                                        <p className="text-xs text-slate-500 font-medium">Attach clear NIC Back Photo</p>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleSimulatedUpload('nicBackUrl', 'NIC Back')}
                                    className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition"
                                >
                                    {formData.nicBackUrl ? 'Change NIC Back Image' : 'Upload NIC Back Photo'}
                                </button>
                            </div>
                        </div>

                        {/* Vocational Certificate Optional */}
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                            <label className="block text-xs font-bold text-slate-700">Vocational Certificate / NVQ (Optional)</label>
                            <button
                                type="button"
                                onClick={() => handleSimulatedUpload('certificateUrl', 'Vocational Certificate')}
                                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition border border-slate-300"
                            >
                                {formData.certificateUrl ? 'Certificate Uploaded ✓' : '+ Attach NVQ / Skilled Certificate'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Form Controls */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    {step > 1 ? (
                        <button
                            type="button"
                            onClick={handlePrev}
                            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                    ) : <div />}

                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="flex items-center gap-1.5 px-6 py-2.5 bg-[#55b32b] hover:bg-[#46a021] text-white text-sm font-extrabold rounded-xl transition shadow-lg shadow-[#55b32b]/25"
                        >
                            Next Step <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl transition shadow-lg shadow-emerald-600/30 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Submitting Application…' : 'Submit Application'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
