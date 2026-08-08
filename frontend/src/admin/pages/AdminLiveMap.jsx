import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLiveWorkers } from '../hooks/useWorkers';
import { useLiveJobs } from '../hooks/useJobs';
import { useSocket } from '../context/SocketContext';
import SlideDrawer from '../components/common/SlideDrawer';
import { Phone, Star, MapPin, Briefcase, Wifi, User } from 'lucide-react';

// Fix Leaflet default icon issue in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const STATUS_COLOR = { online: '#10b981', busy: '#f59e0b', offline: '#64748b' };
const CATEGORY_COLOR = {
    'Plumber':       '#46a021',
    'Electrician':   '#3b82f6',
    'Carpenter':     '#8b5cf6',
    'Coconut Plucker': '#10b981',
    'Painter':       '#ef4444',
    'Mason':         '#06b6d4',
    'Cleaner':       '#ec4899',
    'Other':         '#64748b',
};

function createWorkerIcon(color = '#46a021', status = 'online') {
    const statusColor = STATUS_COLOR[status] || '#64748b';
    return L.divIcon({
        className: '',
        html: `
            <div style="position:relative;width:36px;height:36px;">
                <div style="
                    width:36px;height:36px;border-radius:50%;background:${color};
                    border:3px solid white;box-shadow:0 2px 12px rgba(0,0,0,0.25);
                    display:flex;align-items:center;justify-content:center;
                    font-size:16px;color:white;font-weight:bold;
                ">📍</div>
                <div style="
                    position:absolute;bottom:-2px;right:-2px;
                    width:12px;height:12px;border-radius:50%;
                    background:${statusColor};border:2px solid white;
                "></div>
            </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
    });
}

const CATEGORIES = ['All', 'Plumber', 'Electrician', 'Carpenter', 'Coconut Plucker', 'Painter', 'Mason', 'Cleaner'];
const STATUSES   = ['All', 'online', 'busy'];

// Sri Lanka center
const SRI_LANKA_CENTER = [7.8731, 80.7718];

export default function AdminLiveMap() {
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStatus,   setFilterStatus]   = useState('All');
    const [selectedWorker, setSelectedWorker] = useState(null);

    const { data: workersRes, isLoading } = useLiveWorkers();
    const { data: jobsRes }               = useLiveJobs();
    const { socket }                      = useSocket() || {};

    const [workers, setWorkers] = useState([]);
    const jobs = jobsRes?.data || [];

    useEffect(() => {
        if (workersRes?.data) setWorkers(workersRes.data);
    }, [workersRes]);

    useEffect(() => {
        if (!socket) return;
        const handleLocationUpdate = ({ workerId, coordinates }) => {
            setWorkers((prev) =>
                prev.map((w) =>
                    w._id === workerId ? { ...w, location: { ...w.location, coordinates } } : w
                )
            );
        };
        socket.on('worker:location_updated', handleLocationUpdate);
        return () => socket.off('worker:location_updated', handleLocationUpdate);
    }, [socket]);

    const filtered = workers.filter((w) => {
        if (filterCategory !== 'All' && w.primaryCategory !== filterCategory) return false;
        if (filterStatus   !== 'All' && w.status !== filterStatus) return false;
        return true;
    });

    const workerJob = (workerId) => jobs.find((j) => j.workerId?._id === workerId || j.workerId === workerId);

    return (
        <div className="space-y-4 h-[calc(100vh-110px)] flex flex-col animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Live GPS Dispatch Map</h1>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time worker locations and active field job tracking</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#55b32b] animate-ping" />
                    <span className="text-xs font-bold text-slate-700">GPS Live Broadcast</span>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 shrink-0 bg-white border border-slate-200/90 rounded-2xl p-2 shadow-md shadow-slate-200/50">
                <div className="flex items-center gap-1 flex-wrap">
                    {CATEGORIES.map((c) => (
                        <button
                            key={c}
                            id={`map-filter-category-${c.toLowerCase().replace(/\s+/g,'-')}`}
                            onClick={() => setFilterCategory(c)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap
                                ${filterCategory === c ? 'bg-[#55b32b] text-white shadow-md shadow-[#55b32b]/25' : 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100'}`}
                        >{c}</button>
                    ))}
                </div>
                <div className="flex items-center gap-1">
                    {STATUSES.map((s) => (
                        <button
                            key={s}
                            id={`map-filter-status-${s}`}
                            onClick={() => setFilterStatus(s)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize
                                ${filterStatus === s ? 'bg-[#55b32b] text-white shadow-md shadow-[#55b32b]/25' : 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100'}`}
                        >{s}</button>
                    ))}
                </div>
            </div>

            {/* Map Canvas */}
            <div className="flex-1 rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl shadow-slate-200/50 relative">
                {isLoading ? (
                    <div className="h-full flex items-center justify-center bg-slate-50">
                        <div className="text-center">
                            <div className="w-10 h-10 border-4 border-[#55b32b] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-slate-500 text-xs font-bold">Loading GPS map telemetry…</p>
                        </div>
                    </div>
                ) : (
                    <MapContainer
                        center={SRI_LANKA_CENTER}
                        zoom={8}
                        className="h-full w-full"
                        style={{ background: '#f8fafc' }}
                    >
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                        />
                        {filtered.map((worker) => {
                            const [lng, lat] = worker.location.coordinates;
                            const catColor = CATEGORY_COLOR[worker.primaryCategory] || '#46a021';
                            const activeJob = workerJob(worker._id);
                            return (
                                <Marker
                                    key={worker._id}
                                    position={[lat, lng]}
                                    icon={createWorkerIcon(catColor, worker.status)}
                                    eventHandlers={{ click: () => setSelectedWorker({ ...worker, activeJob }) }}
                                >
                                    <Popup>
                                        <div className="text-xs font-black text-slate-900">{worker.firstName} {worker.lastName}</div>
                                        <div className="text-[11px] text-[#46a021] font-bold">{worker.primaryCategory} · {worker.status}</div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 shrink-0 px-1">
                {Object.entries(STATUS_COLOR).map(([s, c]) => (
                    <div key={s} className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full shadow-sm" style={{ background: c }} />
                        <span className="text-xs font-bold text-slate-600 capitalize">{s}</span>
                    </div>
                ))}
            </div>

            {/* Worker slide drawer */}
            <SlideDrawer
                open={!!selectedWorker}
                onClose={() => setSelectedWorker(null)}
                title="Worker Live Telemetry"
            >
                {selectedWorker && <WorkerDetail worker={selectedWorker} />}
            </SlideDrawer>
        </div>
    );
}

function WorkerDetail({ worker }) {
    const statusColor = { online: 'text-[#46a021]', busy: 'text-amber-600', offline: 'text-slate-400' };
    return (
        <div className="space-y-5">
            {/* Profile */}
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#55b32b] flex items-center justify-center text-white shadow-lg shadow-[#55b32b]/25">
                    <User size={26} />
                </div>
                <div>
                    <h3 className="text-base font-black text-slate-900">{worker.firstName} {worker.lastName}</h3>
                    <p className="text-xs text-indigo-600 font-bold">{worker.primaryCategory}</p>
                    <span className={`text-xs font-extrabold capitalize ${statusColor[worker.status]}`}>{worker.status}</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <InfoBox icon={Phone}   label="Phone"  value={worker.phone} />
                <InfoBox icon={Star}    label="Rating" value={`${(worker.rating || 0).toFixed(1)} ★`} />
                <InfoBox icon={Briefcase} label="Total Jobs" value={worker.totalJobs || 0} />
                <InfoBox icon={MapPin}  label="Skills" value={(worker.skills || []).join(', ') || '—'} />
            </div>
            {worker.activeJob && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                    <p className="text-xs text-amber-800 font-extrabold mb-1">Active Job Dispatched</p>
                    <p className="text-xs text-slate-900 font-bold">{worker.activeJob.jobId} · {worker.activeJob.category}</p>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">Customer: {worker.activeJob.customerName}</p>
                </div>
            )}
        </div>
    );
}

function InfoBox({ icon: Icon, label, value }) {
    return (
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1.5 mb-1">
                <Icon size={14} className="text-[#46a021]" />
                <span className="text-[11px] font-bold text-slate-500">{label}</span>
            </div>
            <p className="text-xs text-slate-900 font-black">{value || '—'}</p>
        </div>
    );
}
