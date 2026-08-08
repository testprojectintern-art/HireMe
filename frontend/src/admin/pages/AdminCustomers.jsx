import { useState } from 'react';
import { useWorkers, useSuspendWorker } from '../hooks/useWorkers';
import DataTable from '../components/common/DataTable';
import SlideDrawer from '../components/common/SlideDrawer';
import { Star, Phone, Award, ShieldCheck, ShieldOff, User } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_BADGE = {
    online:  'bg-emerald-100 text-[#46a021] border border-emerald-300',
    busy:    'bg-amber-100 text-amber-800 border border-amber-300',
    offline: 'bg-slate-100 text-slate-500',
};
const VERIFY_BADGE = {
    approved: 'bg-emerald-100 text-[#46a021]',
    pending:  'bg-amber-100 text-amber-800',
    rejected: 'bg-rose-100 text-rose-700',
};

export default function AdminCustomers() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [verificationStatus, setVerificationStatus] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selected, setSelected] = useState(null);
    const { mutate: suspend, isPending } = useSuspendWorker();

    const { data, isLoading } = useWorkers({ page, limit: 20, search, verificationStatus, status: statusFilter });
    const workers = data?.data || [];
    const total   = data?.pagination?.total || 0;

    const handleToggleSuspend = (worker) => {
        const action = worker.isSuspended ? 'unsuspend' : 'suspend';
        suspend({ id: worker._id, suspend: !worker.isSuspended, reason: 'Admin action' }, {
            onSuccess: () => {
                toast.success(`Worker ${action}ed`);
                setSelected((prev) => prev ? { ...prev, isSuspended: !prev.isSuspended } : null);
            },
        });
    };

    const columns = [
        {
            key: 'firstName',
            header: 'Worker Name',
            render: (v, r) => (
                <button
                    onClick={() => setSelected(r)}
                    className="font-extrabold text-slate-900 hover:text-[#55b32b] text-xs text-left"
                >
                    {v} {r.lastName}
                </button>
            ),
        },
        { key: 'primaryCategory', header: 'Category', render: (v) => <span className="font-bold text-indigo-600 text-xs">{v}</span> },
        { key: 'phone', header: 'Phone', render: (v) => <span className="text-slate-600 font-mono text-xs font-bold">{v}</span> },
        { key: 'district', header: 'District', render: (v, r) => <span className="text-slate-700 font-bold text-xs">{v || r.address || 'Colombo'}</span> },
        {
            key: 'rating',
            header: 'Rating',
            render: (v) => (
                <div className="flex items-center gap-1 font-black text-amber-600 text-xs">
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                    <span>{(v || 0).toFixed(1)}</span>
                </div>
            ),
        },
        {
            key: 'verificationStatus',
            header: 'Verified',
            render: (v) => (
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${VERIFY_BADGE[v] || 'bg-slate-100 text-slate-600'}`}>
                    {v}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (v, r) => (
                r.isSuspended ? (
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 uppercase">Suspended</span>
                ) : (
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${STATUS_BADGE[v] || 'bg-slate-100 text-slate-600'}`}>
                        {v}
                    </span>
                )
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (_, r) => (
                <div className="flex gap-2">
                    <button onClick={() => setSelected(r)} className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition">View</button>
                    <button
                        onClick={() => handleToggleSuspend(r)}
                        disabled={isPending}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${r.isSuspended ? 'bg-emerald-100 text-[#46a021]' : 'bg-rose-100 text-rose-700'}`}
                    >
                        {r.isSuspended ? 'Unsuspend' : 'Suspend'}
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Worker Directory & Profiles</h1>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Manage registered field service providers across Sri Lanka</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-md shadow-slate-200/50 flex flex-wrap gap-3 items-center">
                <select
                    value={verificationStatus}
                    onChange={(e) => { setVerificationStatus(e.target.value); setPage(1); }}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#55b32b]"
                >
                    <option value="">All Verification States</option>
                    <option value="approved">APPROVED</option>
                    <option value="pending">PENDING</option>
                    <option value="rejected">REJECTED</option>
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#55b32b]"
                >
                    <option value="">All Availability</option>
                    <option value="online">ONLINE</option>
                    <option value="busy">BUSY</option>
                    <option value="offline">OFFLINE</option>
                </select>
            </div>

            {/* Table */}
            <DataTable
                data={workers}
                columns={columns}
                loading={isLoading}
                totalCount={total}
                page={page}
                pageSize={20}
                onPageChange={setPage}
                onSearch={(v) => { setSearch(v); setPage(1); }}
                searchPlaceholder="Search by name, phone, district, skill…"
                id="workers-directory-table"
            />

            {/* Worker Detail Drawer */}
            <SlideDrawer open={!!selected} onClose={() => setSelected(null)} title="Worker Profile">
                {selected && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-[#46a021] flex items-center justify-center font-bold shrink-0">
                                {selected.profilePhotoUrl
                                    ? <img src={selected.profilePhotoUrl} className="w-full h-full object-cover rounded-2xl" alt="" />
                                    : <User size={28} />}
                            </div>
                            <div>
                                <h3 className="text-base font-black text-slate-900">{selected.firstName} {selected.lastName}</h3>
                                <p className="text-xs text-indigo-600 font-bold">{selected.primaryCategory}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${STATUS_BADGE[selected.status]}`}>{selected.status}</span>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${VERIFY_BADGE[selected.verificationStatus]}`}>{selected.verificationStatus}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                            <p className="font-bold text-slate-800">Phone: <span className="font-normal font-mono text-slate-600">{selected.phone}</span></p>
                            <p className="font-bold text-slate-800">District: <span className="font-normal text-slate-600">{selected.address || selected.district || 'Colombo'}</span></p>
                            <p className="font-bold text-slate-800">Completed Jobs: <span className="font-normal text-slate-600">{selected.totalJobs || 0}</span></p>
                            <p className="font-bold text-slate-800">Average Rating: <span className="font-normal text-amber-600">⭐ {(selected.rating || 0).toFixed(1)}</span></p>
                        </div>
                    </div>
                )}
            </SlideDrawer>
        </div>
    );
}
