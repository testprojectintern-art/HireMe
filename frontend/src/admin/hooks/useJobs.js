import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApi from '../services/adminApi';
import toast from 'react-hot-toast';

export const useJobs = (params = {}) =>
    useQuery({
        queryKey: ['admin-jobs', params],
        queryFn:  () => adminApi.get('/admin/jobs', { params }).then((r) => r.data),
    });

export const useLiveJobs = () =>
    useQuery({
        queryKey: ['admin-jobs-live'],
        queryFn:  () => adminApi.get('/admin/jobs/live').then((r) => r.data.data),
        refetchInterval: 10_000,
    });

export const useJobById = (id) =>
    useQuery({
        queryKey: ['admin-job', id],
        queryFn:  () => adminApi.get(`/admin/jobs/${id}`).then((r) => r.data.data),
        enabled:  !!id,
    });

export const useReassignJob = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, workerId, note }) =>
            adminApi.patch(`/admin/jobs/${id}/reassign`, { workerId, note }).then((r) => r.data),
        onSuccess: () => {
            toast.success('Job reassigned successfully');
            qc.invalidateQueries({ queryKey: ['admin-jobs'] });
            qc.invalidateQueries({ queryKey: ['admin-jobs-live'] });
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Reassignment failed'),
    });
};
