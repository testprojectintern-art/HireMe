import { useState } from 'react';
import { useDisputes, useResolveDispute, useSuspendFromDispute } from '../hooks/useDisputes';
import DataTable from '../components/common/DataTable';
import SlideDrawer from '../components/common/SlideDrawer';
import { AlertTriangle, ShieldOff, CheckCircle, Star, MessageSquare } from 'lucide-react';

const PRIORITY_BADGE = {
    low:      'bg-slate-100 text-slate-700 border border-slate-200',
    medium:   'bg-blue-100 text-blue-700 border border-blue-300',
    high:     'bg-amber-100 text-amber-800 border border-amber-300',
    critical: 'bg-rose-100 text-rose-700 border border-rose-300',
};
const STATUS_BADGE = {
    open:         'bg-rose-100 text-rose-700 border border-rose-300',
    investigating:'bg-amber-100 text-amber-800 border border-amber-300',
    resolved:     'bg-emerald-100 text-[#46a021] border border-emerald-300',
    dismissed:    'bg-slate-100 text-slate-500',
};

function ResolveModal({ open, onClose, dispute }) {
    const [resolution, setResolution] = useState('');
    const [suspendWorker, setSuspendWorker] = useState(false);
    const [suspendCustomer, setSuspendCustomer] = useState(false);
    const { mutate: resolve, isPending: resolving } = useResolveDispute();
    const { mutate: suspend, isPending: suspending } = useSuspendFromDispute();

    if (!open || !dispute) return null;

    const handleSubmit = () => {
        if (!resolution.trim()) return;
        resolve({ id: dispute._id, resolution: resolution.trim(), status: 'resolved' }, {
            onSuccess: () => {
                if (suspendWorker || suspendCustomer) {
                    suspend({ id: dispute._id, suspendWorker, suspendCustomer, reason: resolution.trim() });
                }
                onClose();
                setResolution('');
                setSuspendWorker(false);
                setSuspendCustomer(false);
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <CheckCircle size={20} className="text-[#46a021]" />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-slate-900">Resolve Dispute</h3>
                        <p className="text-xs text-slate-500 font-medium">Issue resolution & optional account suspension</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Resolution Summary *</label>
                        <textarea
                            value={resolution}
                            onChange={(e) => setResolution(e.target.value)}
                            rows={3}
                            placeholder="Describe how the dispute was resolved…"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none focus:border-[#55b32b] resize-none"
                        />
                    </div>

                    <div className="space-y-2 border-t border-slate-100 pt-3">
                        <p className="text-xs font-bold text-slate-700">Punitive Actions (Optional)</p>
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={suspendWorker}
                                onChange={(e) => setSuspendWorker(e.target.checked)}
                                className="rounded text-[#55b32b] focus:ring-[#55b32b]"
                            />
                            <span>Suspend Worker Account</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={suspendCustomer}
                                onChange={(e) => setSuspendCustomer(e.target.checked)}
                                className="rounded text-[#55b32b] focus:ring-[#55b32b]"
                            />
                            <span>Suspend Customer Account</span>
                        </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition">Cancel</button>
                        <button
                            onClick={handleSubmit}
                            disabled={!resolution.trim() || resolving || suspending}
                            className="flex-1 py-2.5 rounded-xl text-xs font-extrabold bg-[#55b32b] hover:bg-[#46a021] text-white disabled:opacity-40 transition shadow-md shadow-[#55b32b]/25"
                        >
                            {resolving ? 'Resolving…' : 'Submit Resolution'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminDisputes() {
    const [page, setPage] = useState(1);
    const [priority, setPriority] = useState('');
    const [status, setStatus] = useState('');
    const [selected, setSelected] = useState(null);
    const [resolveDispute, setResolveDispute] = useState(null);

    const { data, isLoading } = useDisputes({ page, limit: 20, priority, status });
    const disputes = data?.data || [];
    const total = data?.total || 0;

    const columns = [
        {
            key: '_id',
            header: 'Dispute ID',
            render: (v) => <span className="font-mono text-xs font-bold text-slate-800">#{v?.slice(-6)}</span>,
        },
        {
            key: 'priority',
            header: 'Priority',
            render: (v) => (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${PRIORITY_BADGE[v] || 'bg-slate-100 text-slate-600'}`}>
                    {v}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (v) => (
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${STATUS_BADGE[v] || 'bg-slate-100 text-slate-600'}`}>
                    {v}
                </span>
            ),
        },
        {
            key: 'reason',
            header: 'Reason',
            render: (v) => <span className="font-bold text-slate-900 truncate max-w-xs block">{v || 'Service Dispute'}</span>,
        },
        {
            key: 'raisedByRole',
            header: 'Raised By',
            render: (v) => <span className="text-xs font-bold capitalize text-indigo-600">{v || 'customer'}</span>,
        },
        {
            key: 'createdAt',
            header: 'Date',
            render: (v) => <span className="text-slate-500 font-medium">{new Date(v).toLocaleDateString()}</span>,
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (_, r) => (
                <div className="flex gap-2">
                    <button onClick={() => setSelected(r)} className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition">View</button>
                    {r.status !== 'resolved' && (
                        <button onClick={() => setResolveDispute(r)} className="px-2.5 py-1 text-[11px] font-bold bg-[#55b32b]/15 text-[#46a021] hover:bg-[#55b32b]/25 rounded-lg transition">Resolve</button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Dispute Resolution Center</h1>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Manage customer-worker conflicts and issue punitive actions</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-md shadow-slate-200/50 flex flex-wrap gap-3 items-center">
                <select
                    value={priority}
                    onChange={(e) => { setPriority(e.target.value); setPage(1); }}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#55b32b]"
                >
                    <option value="">All Priorities</option>
                    {['low', 'medium', 'high', 'critical'].map((p) => (
                        <option key={p} value={p}>{p.toUpperCase()}</option>
                    ))}
                </select>

                <select
                    value={status}
                    onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#55b32b]"
                >
                    <option value="">All Statuses</option>
                    {['open', 'investigating', 'resolved', 'dismissed'].map((s) => (
                        <option key={s} value={s}>{s.toUpperCase()}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <DataTable
                data={disputes}
                columns={columns}
                loading={isLoading}
                totalCount={total}
                page={page}
                pageSize={20}
                onPageChange={setPage}
                id="disputes-table"
            />

            {/* Detail Drawer */}
            <SlideDrawer open={!!selected} onClose={() => setSelected(null)} title={`Dispute #${selected?._id?.slice(-6)}`}>
                {selected && (
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase ${STATUS_BADGE[selected.status]}`}>{selected.status}</span>
                                <span className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase ${PRIORITY_BADGE[selected.priority]}`}>{selected.priority}</span>
                            </div>
                            <h3 className="text-base font-black text-slate-900">{selected.reason}</h3>
                            <p className="text-xs text-slate-600 font-medium">{selected.description || 'No detailed description provided'}</p>
                        </div>

                        {selected.resolution && (
                            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                                <span className="text-xs font-extrabold text-[#46a021] uppercase">Resolution Logged</span>
                                <p className="text-xs text-slate-800 font-medium">{selected.resolution}</p>
                            </div>
                        )}
                    </div>
                )}
            </SlideDrawer>

            <ResolveModal
                open={!!resolveDispute}
                onClose={() => setResolveDispute(null)}
                dispute={resolveDispute}
            />
        </div>
    );
}
