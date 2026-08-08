import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApi from '../services/adminApi';
import toast from 'react-hot-toast';

export const useWorkers = (params = {}) =>
    useQuery({
        queryKey: ['admin-workers', params],
        queryFn:  () => adminApi.get('/admin/workers', { params }).then((r) => r.data),
    });

export const usePendingWorkers = () =>
    useQuery({
        queryKey: ['admin-workers-pending'],
        queryFn:  () => adminApi.get('/admin/workers/pending').then((r) => r.data),
        refetchInterval: 20_000,
    });

export const useLiveWorkers = () =>
    useQuery({
        queryKey: ['admin-workers-live'],
        queryFn:  () => adminApi.get('/admin/workers/live').then((r) => r.data.data),
        refetchInterval: 10_000,
    });

export const useWorkerById = (id) =>
    useQuery({
        queryKey: ['admin-worker', id],
        queryFn:  () => adminApi.get(`/admin/workers/${id}`).then((r) => r.data.data),
        enabled:  !!id,
    });

export const useVerifyWorker = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, action, reason }) =>
            adminApi.patch(`/admin/workers/${id}/verify`, { action, reason }).then((r) => r.data),
        onSuccess: (_, vars) => {
            toast.success(`Worker ${vars.action === 'approve' ? 'approved ✓' : 'rejected ✗'}`);
            qc.invalidateQueries({ queryKey: ['admin-workers-pending'] });
            qc.invalidateQueries({ queryKey: ['admin-workers'] });
            qc.invalidateQueries({ queryKey: ['admin-stats'] });
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
    });
};

export const useSuspendWorker = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, suspend, reason }) =>
            adminApi.patch(`/admin/workers/${id}/suspend`, { suspend, reason }).then((r) => r.data),
        onSuccess: () => {
            toast.success('Account status updated');
            qc.invalidateQueries({ queryKey: ['admin-workers'] });
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
    });
};
