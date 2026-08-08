import { useState } from 'react';
import { useJobs, useReassignJob } from '../hooks/useJobs';
import { useWorkers } from '../hooks/useWorkers';
import DataTable from '../components/common/DataTable';
import SlideDrawer from '../components/common/SlideDrawer';
import { Briefcase, Clock, CheckCircle, AlertTriangle, User, DollarSign, MapPin } from 'lucide-react';
import adminApi from '../services/adminApi';

const STATUS_BADGE = {
    pending:     'bg-slate-100 text-slate-700 border border-slate-200',
    dispatched:  'bg-blue-100 text-blue-700 border border-blue-300',
    in_progress: 'bg-amber-100 text-amber-800 border border-amber-300',
    completed:   'bg-emerald-100 text-[#46a021] border border-emerald-300',
    cancelled:   'bg-slate-100 text-slate-500',
    disputed:    'bg-rose-100 text-rose-700 border border-rose-300',
};

const STATUSES   = ['', 'pending', 'dispatched', 'in_progress', 'completed', 'cancelled', 'disputed'];
const CATEGORIES = ['', 'Plumber', 'Electrician', 'Carpenter', 'Coconut Plucker', 'Painter', 'Mason', 'Cleaner'];

function ReassignModal({ open, onClose, jobId }) {
    const { data: workersData } = useWorkers({ verificationStatus: 'approved', status: 'online', limit: 50 });
    const { mutate: reassign, isPending } = useReassignJob();
    const [selectedWorkerId, setSelectedWorkerId] = useState('');
    const workers = workersData?.data || [];

    const handleReassign = () => {
        if (!selectedWorkerId) return;
        reassign({ id: jobId, workerId: selectedWorkerId, note: 'Manual reassignment by admin' }, {
            onSuccess: () => { onClose(); setSelectedWorkerId(''); },
        });
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                <h3 className="text-base font-black text-slate-900 mb-2">Reassign Job</h3>
                <p className="text-xs text-slate-500 font-medium mb-4">Select an online verified worker to dispatch for this job.</p>
                <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                    {workers.length === 0 && <p className="text-slate-400 text-xs text-center py-4 font-medium">No available online workers</p>}
                    {workers.map((w) => (
                        <button
                            key={w._id}
                            id={`reassign-worker-${w._id}`}
                            onClick={() => setSelectedWorkerId(w._id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-colors text-left
                                ${selectedWorkerId === w._id ? 'border-[#55b32b] bg-[#55b32b]/10' : 'border-slate-200 hover:border-slate-300 bg-slate-50'}`}
                        >
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#46a021] flex items-center justify-center font-bold"><User size={16} /></div>
                            <div>
                                <p className="text-xs font-bold text-slate-900">{w.firstName} {w.lastName}</p>
                                <p className="text-[11px] text-slate-500 font-medium">{w.primaryCategory} · ⭐ {(w.rating || 0).toFixed(1)}</p>
                            </div>
                        </button>
                    ))}
                </div>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition">Cancel</button>
                    <button
                        onClick={handleReassign}
                        disabled={!selectedWorkerId || isPending}
                        className="flex-1 py-2.5 rounded-xl text-xs font-extrabold bg-[#55b32b] hover:bg-[#46a021] text-white disabled:opacity-40 transition shadow-md shadow-[#55b32b]/25"
                    >
                        {isPending ? 'Assigning…' : 'Confirm Reassign'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminJobManagement() {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [catFilter, setCatFilter] = useState('');
    const [search, setSearch] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [reassignJobId, setReassignJobId] = useState(null);

    const { data, isLoading } = useJobs({ page, limit: 20, status: statusFilter, category: catFilter, search });
    const jobs = data?.data || [];
    const total = data?.total || 0;

    const handleExportCSV = async () => {
        try {
            const res = await adminApi.get('/jobs/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `hireme-jobs-${new Date().toISOString().slice(0, 10)}.csv`;
            a.click();
        } catch (err) {
            console.error('Export error', err);
        }
    };

    const columns = [
        {
            key: 'jobId',
            header: 'Job ID',
            render: (v, r) => (
                <button
                    onClick={() => setSelectedJob(r)}
                    className="text-[#46a021] font-extrabold hover:underline font-mono text-xs"
                >
                    {v || `JOB-${r._id?.slice(-4)}`}
                </button>
            ),
        },
        { key: 'category', header: 'Category', render: (v) => <span className="font-bold text-slate-800">{v}</span> },
        {
            key: 'customerName',
            header: 'Customer',
            render: (v, r) => (
                <div>
                    <p className="font-bold text-slate-900">{v || r.customerPhone || 'Walk-in'}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{r.customerPhone}</p>
                </div>
            ),
        },
        {
            key: 'workerId',
            header: 'Assigned Worker',
            render: (v) => (
                v ? (
                    <span className="font-bold text-indigo-600">{v.firstName} {v.lastName}</span>
                ) : (
                    <span className="text-slate-400 italic text-[11px]">Unassigned</span>
                )
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
            key: 'finalAmount',
            header: 'Amount',
            render: (v, r) => <span className="font-black text-slate-900">LKR {(v || r.quotedAmount || 0).toLocaleString()}</span>,
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
                    <button
                        onClick={() => setSelectedJob(r)}
                        className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                    >
                        View
                    </button>
                    {['pending', 'dispatched'].includes(r.status) && (
                        <button
                            onClick={() => setReassignJobId(r._id)}
                            className="px-2.5 py-1 text-[11px] font-bold bg-[#55b32b]/15 text-[#46a021] hover:bg-[#55b32b]/25 rounded-lg transition"
                        >
                            Reassign
                        </button>
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
                    <h1 className="text-2xl font-black text-slate-900">Job Dispatch Matrix</h1>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Manage and track all service allocations across Sri Lanka</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-md shadow-slate-200/50 flex flex-wrap gap-3 items-center">
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#55b32b]"
                >
                    <option value="">All Statuses</option>
                    {STATUSES.filter(Boolean).map((s) => (
                        <option key={s} value={s}>{s.toUpperCase()}</option>
                    ))}
                </select>

                <select
                    value={catFilter}
                    onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#55b32b]"
                >
                    <option value="">All Categories</option>
                    {CATEGORIES.filter(Boolean).map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <DataTable
                data={jobs}
                columns={columns}
                loading={isLoading}
                totalCount={total}
                page={page}
                pageSize={20}
                onPageChange={setPage}
                onSearch={(v) => { setSearch(v); setPage(1); }}
                searchPlaceholder="Search job ID, customer, category…"
                onExport={handleExportCSV}
                id="jobs-table"
            />

            {/* Timeline Drawer */}
            <SlideDrawer open={!!selectedJob} onClose={() => setSelectedJob(null)} title={`Job Details — ${selectedJob?.jobId || ''}`}>
                {selectedJob && (
                    <div className="space-y-5">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-500 uppercase">Status</span>
                                <span className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase ${STATUS_BADGE[selectedJob.status]}`}>{selectedJob.status}</span>
                            </div>
                            <h3 className="text-base font-black text-slate-900">{selectedJob.category} Service</h3>
                            <p className="text-xs text-slate-600 font-medium">{selectedJob.description || 'No job description provided'}</p>
                        </div>

                        {/* Location */}
                        <div className="space-y-1">
                            <span className="text-[11px] font-extrabold text-slate-400 uppercase">Service Location</span>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2">
                                <MapPin size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-800 font-bold">{selectedJob.address || 'Colombo'}</p>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="space-y-2">
                            <span className="text-[11px] font-extrabold text-slate-400 uppercase">Job Event Timeline</span>
                            <div className="space-y-2 pl-2 border-l-2 border-slate-200">
                                {(selectedJob.timeline || []).map((t, i) => (
                                    <div key={i} className="pl-3 relative space-y-0.5">
                                        <div className="w-2 h-2 rounded-full bg-[#55b32b] absolute -left-[13px] top-1.5" />
                                        <p className="text-xs font-bold text-slate-900 capitalize">{t.event}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{new Date(t.timestamp).toLocaleString()}</p>
                                    </div>
                                ))}
                                {(selectedJob.timeline || []).length === 0 && (
                                    <p className="text-xs text-slate-400 font-medium pl-3">No timeline events logged yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </SlideDrawer>

            <ReassignModal
                open={!!reassignJobId}
                onClose={() => setReassignJobId(null)}
                jobId={reassignJobId}
            />
        </div>
    );
}
