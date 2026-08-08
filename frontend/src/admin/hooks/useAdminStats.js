import { useQuery } from '@tanstack/react-query';
import adminApi from '../services/adminApi';

export const useAdminStats = () =>
    useQuery({
        queryKey: ['admin-stats'],
        queryFn:  () => adminApi.get('/admin/stats').then((r) => r.data.data),
        refetchInterval: 30_000, // auto-refresh every 30s
    });

export const useActivityLog = (limit = 20) =>
    useQuery({
        queryKey: ['admin-activity', limit],
        queryFn:  () => adminApi.get('/admin/activity-log', { params: { limit } }).then((r) => r.data.data),
        refetchInterval: 15_000,
    });
