import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Worker from '../models/Worker.js';

/**
 * Initialise Socket.io event listeners.
 * Called once from server.js after io is created.
 */
export function initSocketManager(io) {
    // ── Auth Middleware ────────────────────────────────────────────────────
    io.use(async (socket, next) => {
        try {
            const token =
                socket.handshake.auth?.token ||
                socket.handshake.headers?.authorization?.split(' ')[1];

            if (!token) return next(new Error('No token provided'));

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            if (!user || !user.isActive) return next(new Error('Unauthorized'));

            socket.user = user;
            next();
        } catch {
            next(new Error('Invalid token'));
        }
    });

    // ── Connection Handler ─────────────────────────────────────────────────
    io.on('connection', (socket) => {
        const userId = socket.user?._id?.toString();
        const role   = socket.user?.role;

        console.log(`🔌 Socket connected: ${userId} (${role})`);

        // ── Admin joins admin room ─────────────────────────────────────────
        if (role === 'admin') {
            socket.join('admin_room');
            console.log(`👑 Admin ${userId} joined admin_room`);
        }

        // ── Worker location update (from mobile worker app) ────────────────
        // Payload: { workerId, lat, lng, status }
        socket.on('worker_location_update', async (data) => {
            try {
                const { workerId, lat, lng, status } = data;
                if (!workerId || lat === undefined || lng === undefined) return;

                // Update DB
                await Worker.findByIdAndUpdate(workerId, {
                    location: { type: 'Point', coordinates: [lng, lat] },
                    lastLocationUpdate: new Date(),
                    ...(status && { status }),
                });

                // Broadcast to all admins in real-time
                io.to('admin_room').emit('worker_location_update', {
                    workerId,
                    lat,
                    lng,
                    status,
                    timestamp: new Date().toISOString(),
                });
            } catch (err) {
                console.error('worker_location_update error:', err.message);
            }
        });

        // ── New verification request (from worker app onboarding) ──────────
        socket.on('verification_request', (data) => {
            io.to('admin_room').emit('new_verification_request', {
                workerId: data.workerId,
                workerName: data.workerName,
                timestamp: new Date().toISOString(),
            });
        });

        // ── Job status change (from worker app) ────────────────────────────
        socket.on('job_status_update', (data) => {
            io.to('admin_room').emit('job_update', {
                jobId: data.jobId,
                status: data.status,
                workerId: data.workerId,
                timestamp: new Date().toISOString(),
            });
        });

        // ── Disconnect ────────────────────────────────────────────────────
        socket.on('disconnect', () => {
            console.log(`🔌 Socket disconnected: ${userId}`);
        });
    });

    console.log('✓ Socket.io manager initialised');
    return io;
}
