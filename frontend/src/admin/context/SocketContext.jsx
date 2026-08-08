import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../../store/authStore';
import { connectSocket, disconnectSocket, getSocket } from '../services/socketService';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
    const { token, isAuthenticated, user } = useAuthStore();
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    // Live data state updated from socket events
    const [liveWorkers, setLiveWorkers] = useState({});    // { workerId: { lat, lng, status } }
    const [liveJobs, setLiveJobs] = useState([]);           // recent live job updates
    const [pendingCount, setPendingCount] = useState(0);    // pending verifications counter
    const [notifications, setNotifications] = useState([]); // in-app notification stream

    const addNotification = useCallback((notif) => {
        setNotifications((prev) => [{ ...notif, id: Date.now() }, ...prev].slice(0, 50));
    }, []);

    useEffect(() => {
        if (!isAuthenticated || !token || user?.role !== 'admin') return;

        const sock = connectSocket(token);
        setSocket(sock);

        sock.on('connect',    () => setConnected(true));
        sock.on('disconnect', () => setConnected(false));

        // Real-time worker GPS update
        sock.on('worker_location_update', (data) => {
            setLiveWorkers((prev) => ({
                ...prev,
                [data.workerId]: { lat: data.lat, lng: data.lng, status: data.status, ts: data.timestamp },
            }));
        });

        // Job status change
        sock.on('job_update', (data) => {
            setLiveJobs((prev) => [data, ...prev].slice(0, 100));
            addNotification({ type: 'job', text: `Job updated: ${data.status}`, jobId: data.jobId });
        });

        // New verification request
        sock.on('new_verification_request', (data) => {
            setPendingCount((c) => c + 1);
            addNotification({ type: 'verification', text: `New verification: ${data.workerName}`, workerId: data.workerId });
        });

        // Admin-triggered verification update (approve/reject)
        sock.on('verification_update', (data) => {
            addNotification({
                type: 'verification',
                text: `Worker ${data.status}: ${data.workerName}`,
                workerId: data.workerId,
            });
        });

        return () => {
            disconnectSocket();
            setSocket(null);
            setConnected(false);
        };
    }, [isAuthenticated, token, user?.role, addNotification]);

    return (
        <SocketContext.Provider value={{
            socket,
            connected,
            liveWorkers,
            liveJobs,
            pendingCount,
            notifications,
            setPendingCount,
        }}>
            {children}
        </SocketContext.Provider>
    );
}

export const useSocket = () => useContext(SocketContext);
