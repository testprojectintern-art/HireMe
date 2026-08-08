import { io } from 'socket.io-client';

let socketInstance = null;

const getSocketURL = () => {
    if (import.meta.env.VITE_SOCKET_URL) return import.meta.env.VITE_SOCKET_URL;
    const { hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5005';
    }
    return 'https://hireme-dp4x.onrender.com';
};

export const getSocket = () => socketInstance;

export const connectSocket = (token) => {
    if (socketInstance?.connected) return socketInstance;

    socketInstance = io(getSocketURL(), {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
        console.log('✓ Socket connected:', socketInstance.id);
    });

    socketInstance.on('disconnect', (reason) => {
        console.warn('Socket disconnected:', reason);
    });

    socketInstance.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
    });

    return socketInstance;
};

export const disconnectSocket = () => {
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
    }
};
