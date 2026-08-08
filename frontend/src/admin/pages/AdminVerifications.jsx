import { useState } from 'react';
import { CheckCircle, XCircle, Clock, FileText, Phone, User, Award, ChevronRight } from 'lucide-react';
import { usePendingWorkers, useVerifyWorker } from '../hooks/useWorkers';
import { useSocket } from '../context/SocketContext';

function DocumentViewer({ url, title }) {
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);
    if (!url) return (
        <div className="h-64 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
            <p className="text-slate-400 text-xs font-semibold">No document uploaded</p>
        </div>
    );
    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-100 bg-slate-50">
                <span className="text-xs font-bold text-slate-700">{title}</span>
                <div className="flex gap-1">
                    <button onClick={() => setZoom((z) => Math.min(z + 0.25, 3))} className="px-2 py-0.5 text-xs bg-slate-200 text-slate-700 font-bold rounded hover:bg-slate-300 transition" id={`zoom-in-${title}`}>+</button>
                    <button onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))} className="px-2 py-0.5 text-xs bg-slate-200 text-slate-700 font-bold rounded hover:bg-slate-300 transition" id={`zoom-out-${title}`}>−</button>
                    <button onClick={() => setRotation((r) => (r + 90) % 360)} className="px-2 py-0.5 text-xs bg-slate-200 text-slate-700 font-bold rounded hover:bg-slate-300 transition" id={`rotate-${title}`}>↻</button>
                </div>
            </div>
            <div className="overflow-auto max-h-72 flex items-center justify-center p-4 bg-slate-50">
                <img
                    src={url}
                    alt={title}
                    style={{ transform: `rotate(${rotation}deg) scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.2s ease' }}
                    className="max-w-full object-contain shadow-md rounded-lg"
                />
            </div>
        </div>
    );
}

function RejectModal({ open, onClose, onConfirm, loading }) {
    const [reason, setReason] = useState('');
    const QUICK_REASONS = ['Blurry NIC image', 'Invalid certificate', 'Expired document', 'Photo mismatch', 'Incomplete information'];
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                <h3 className="text-base font-black text-slate-900 mb-1">Rejection Reason</h3>
                <p className="text-xs text-slate-500 font-medium mb-4">Please select or provide a reason to trigger SMS notification to the worker.</p>
                <div className="flex flex-wrap gap-2 mb-3">
                    {QUICK_REASONS.map((r) => (
                        <button key={r} onClick={() => setReason(r)} id={`quick-reason-${r.replace(/\s+/g,'-').toLowerCase()}`}
                            className={`text-xs px-3 py-1 rounded-full border font-bold transition-colors
                                ${reason === r ? 'bg-rose-100 border-rose-300 text-rose-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                        >{r}</button>
                    ))}
                </div>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    id="reject-reason-textarea"
                    placeholder="Or type a custom reason…"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none focus:border-rose-500 transition-colors resize-none"
                />
                <div className="flex gap-3 mt-4">
                    <button onClick={onClose} id="reject-modal-cancel" className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition">Cancel</button>
                    <button
                        id="reject-modal-confirm"
                        onClick={() => { if (reason.trim()) { onConfirm(reason.trim()); onClose(); setReason(''); } }}
                        disabled={!reason.trim() || loading}
                        className="flex-1 py-2.5 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-40 transition shadow-md shadow-rose-600/20"
                    >
                        {loading ? 'Rejecting…' : 'Confirm Reject'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminVerifications() {
    const { data, isLoading } = usePendingWorkers();
    const { mutate: verify, isPending } = useVerifyWorker();
    const { setPendingCount } = useSocket() || {};

    const workers = data?.data || [];
    const [selected, setSelected] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);

    const handleApprove = () => {
        if (!selected) return;
        verify({ id: selected._id, action: 'approve' }, {
            onSuccess: () => {
                setPendingCount?.((c) => Math.max(0, c - 1));
                setSelected(null);
            },
        });
    };

    const handleReject = (reason) => {
        if (!selected) return;
        verify({ id: selected._id, action: 'reject', reason }, {
            onSuccess: () => {
                setPendingCount?.((c) => Math.max(0, c - 1));
                setSelected(null);
            },
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Worker Verifications</h1>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Review pending NIC & document submissions</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Unverified Queue:</span>
                    <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs font-black px-2.5 py-0.5 rounded-full">{workers.length}</span>
                </div>
            </div>

            {/* Main Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                {/* Pending List Panel */}
                <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-md shadow-slate-200/50 space-y-3">
                    <h2 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider px-1">Pending Queue</h2>
                    <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                        {isLoading ? (
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
                            ))
                        ) : workers.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <CheckCircle size={36} className="mx-auto mb-2 text-[#46a021]" />
                                <p className="text-xs font-bold text-slate-700">All caught up!</p>
                                <p className="text-[11px] text-slate-400 font-medium">No pending verification requests</p>
                            </div>
                        ) : (
                            workers.map((w) => (
                                <button
                                    key={w._id}
                                    id={`worker-pending-item-${w._id}`}
                                    onClick={() => setSelected(w)}
                                    className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition-all
                                        ${selected?._id === w._id ? 'bg-[#55b32b]/10 border-[#55b32b]' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#46a021] flex items-center justify-center font-bold shrink-0">
                                        {w.profilePhotoUrl ? <img src={w.profilePhotoUrl} className="w-full h-full object-cover rounded-full" alt="" /> : <User size={18} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-extrabold text-slate-900 truncate">{w.firstName} {w.lastName}</p>
                                        <p className="text-[11px] text-indigo-600 font-bold truncate">{w.primaryCategory} · {w.phone}</p>
                                    </div>
                                    <ChevronRight size={14} className="text-slate-400 shrink-0" />
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Detail Panel */}
                <div className="lg:col-span-3">
                    {!selected ? (
                        <div className="h-96 flex flex-col items-center justify-center bg-white border border-slate-200/90 rounded-2xl border-dashed text-slate-400 p-8 shadow-sm">
                            <User size={48} className="text-slate-300 mb-3" />
                            <p className="text-slate-700 font-bold text-sm">Select a worker from the queue</p>
                            <p className="text-xs text-slate-400 font-medium mt-1">Review NIC documents and approve or reject access</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Profile Header Card */}
                            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-md shadow-slate-200/50">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-[#46a021] flex items-center justify-center text-xl font-bold">
                                            {selected.profilePhotoUrl
                                                ? <img src={selected.profilePhotoUrl} className="w-full h-full object-cover rounded-2xl" alt="" />
                                                : <User size={28} />}
                                        </div>
                                        <div>
                                            <h2 className="text-base font-black text-slate-900">{selected.firstName} {selected.lastName}</h2>
                                            <p className="text-xs text-indigo-600 font-bold">{selected.primaryCategory}</p>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">📞 {selected.phone} · 📍 {selected.address || selected.district || 'Colombo'}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1 rounded-full font-bold">Pending Review</span>
                                </div>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                                    {(selected.skills || [selected.primaryCategory]).map((s) => (
                                        <span key={s} className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg">{s}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Documents Canvas */}
                            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-md shadow-slate-200/50 space-y-4">
                                <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Identity Document Inspection Canvas</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <DocumentViewer url={selected.nicFrontUrl} title="NIC Front (ඉදිරිපස)" />
                                    <DocumentViewer url={selected.nicBackUrl} title="NIC Back (පසුපස)" />
                                </div>
                            </div>

                            {/* Action Controllers */}
                            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-md shadow-slate-200/50 flex gap-4">
                                <button
                                    id="approve-worker-btn"
                                    onClick={handleApprove}
                                    disabled={isPending}
                                    className="flex-1 py-3 bg-[#55b32b] hover:bg-[#46a021] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-[#55b32b]/25 transition flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={18} /> Approve & Grant Access
                                </button>
                                <button
                                    id="reject-worker-btn"
                                    onClick={() => setShowRejectModal(true)}
                                    disabled={isPending}
                                    className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-rose-600/20 transition flex items-center justify-center gap-2"
                                >
                                    <XCircle size={18} /> Reject Profile
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <RejectModal
                open={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                onConfirm={handleReject}
                loading={isPending}
            />
        </div>
    );
}
