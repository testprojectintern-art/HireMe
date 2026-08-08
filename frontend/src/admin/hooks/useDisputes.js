import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApi from '../services/adminApi';
import toast from 'react-hot-toast';

export const useDisputes = (params = {}) =>
    useQuery({
        queryKey: ['admin-disputes', params],
        queryFn:  () => adminApi.get('/admin/disputes', { params }).then((r) => r.data),
    });

export const useDisputeById = (id) =>
    useQuery({
        queryKey: ['admin-dispute', id],
        queryFn:  () => adminApi.get(`/admin/disputes/${id}`).then((r) => r.data.data),
        enabled:  !!id,
    });

export const useResolveDispute = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, resolution, status }) =>
            adminApi.patch(`/admin/disputes/${id}/resolve`, { resolution, status }).then((r) => r.data),
        onSuccess: () => {
            toast.success('Dispute resolved');
            qc.invalidateQueries({ queryKey: ['admin-disputes'] });
            qc.invalidateQueries({ queryKey: ['admin-stats'] });
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
    });
};

export const useSuspendFromDispute = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, suspendWorker, suspendCustomer, reason }) =>
            adminApi.patch(`/admin/disputes/${id}/suspend`, { suspendWorker, suspendCustomer, reason }).then((r) => r.data),
        onSuccess: () => {
            toast.success('Suspension applied');
            qc.invalidateQueries({ queryKey: ['admin-disputes'] });
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
    });
};
