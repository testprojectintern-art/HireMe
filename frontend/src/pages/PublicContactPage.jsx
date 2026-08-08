import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PublicContactPage() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        serviceInquiry: 'Plumbing',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.phone || !form.message) {
            toast.error('Please fill in your name, phone number, and message.');
            return;
        }
        setSubmitted(true);
        toast.success('Your message has been sent to HireMe Customer Care!');
    };

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 space-y-10 animate-in fade-in duration-300">
            {/* Page Title */}
            <div className="text-center space-y-2">
                <span className="px-3.5 py-1.5 bg-[#55b32b]/10 border border-[#55b32b]/25 text-[#46a021] text-xs font-extrabold rounded-full uppercase tracking-wider">
                    Customer & Worker Support
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Contact HireMe Sri Lanka</h1>
                <p className="text-slate-600 text-sm max-w-xl mx-auto font-medium">
                    Have a question about worker dispatch, account verification, or platform support? Get in touch with our 24/7 team.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Contact Information & Hubs */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-5 shadow-xl shadow-slate-200/50">
                        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                            <MessageSquare className="text-[#55b32b]" size={20} />
                            Support Contact Info
                        </h3>

                        <div className="space-y-4 text-sm">
                            <div className="flex items-start gap-3">
                                <div className="p-2.5 bg-emerald-50 text-[#46a021] border border-emerald-200 rounded-xl shrink-0 mt-0.5">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold">24/7 Hotline</p>
                                    <p className="text-slate-900 font-extrabold">+94 11 234 5678</p>
                                    <p className="text-xs text-slate-500 font-medium">+94 77 123 4567 (WhatsApp Support)</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl shrink-0 mt-0.5">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold">Email Inquiries</p>
                                    <p className="text-slate-900 font-extrabold">support@hireme.lk</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl shrink-0 mt-0.5">
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold">Support Hours</p>
                                    <p className="text-slate-800 font-bold">Mon - Sun: 24 Hours Emergency Service</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Regional Hubs */}
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-xl shadow-slate-200/50">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Regional Hubs</h4>
                        <div className="space-y-3 text-xs">
                            <div className="flex items-start gap-2.5">
                                <MapPin size={16} className="text-[#55b32b] shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-extrabold text-slate-900">Colombo Central Hub</p>
                                    <p className="text-slate-500 font-medium">No. 42, Galle Road, Colombo 03, Sri Lanka</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <MapPin size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-extrabold text-slate-900">Kandy Regional Hub</p>
                                    <p className="text-slate-500 font-medium">No. 12, Peradeniya Road, Kandy, Sri Lanka</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="lg:col-span-3">
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl shadow-slate-200/50">
                        <h3 className="text-lg font-black text-slate-900">Send Us a Message</h3>

                        {submitted ? (
                            <div className="p-8 text-center space-y-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                                <CheckCircle className="text-[#55b32b] mx-auto" size={48} />
                                <h4 className="text-xl font-extrabold text-slate-900">Thank You!</h4>
                                <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
                                    Your message has been received by our support team. We will call or SMS you back within 30 minutes.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="e.g. Kasun Silva"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#55b32b] font-medium"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                                        <input
                                            type="tel"
                                            required
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            placeholder="0771234567"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#55b32b] font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            placeholder="kasun@gmail.com"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#55b32b] font-medium"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Service Category Inquiry</label>
                                    <select
                                        value={form.serviceInquiry}
                                        onChange={(e) => setForm({ ...form, serviceInquiry: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#55b32b] font-medium cursor-pointer"
                                    >
                                        <option value="Plumbing">Plumbing</option>
                                        <option value="Electrical">Electrical</option>
                                        <option value="Carpentry">Carpentry</option>
                                        <option value="Coconut Plucking">Coconut Plucking</option>
                                        <option value="Masonry">Masonry</option>
                                        <option value="Worker Registration Inquiry">Worker Registration Inquiry</option>
                                        <option value="Other Support">Other Support</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Message *</label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        placeholder="Describe your inquiry or requested service in detail…"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#55b32b] resize-none font-medium"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3.5 bg-[#55b32b] hover:bg-[#46a021] text-white font-extrabold text-sm rounded-xl transition shadow-lg shadow-[#55b32b]/30 flex items-center justify-center gap-2"
                                >
                                    <Send size={16} /> Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
