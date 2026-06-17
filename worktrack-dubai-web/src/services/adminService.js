import api from './apiClient';

export const adminService = {
  listUsers: (params) => api.get('/admin/users', { params }).then((r) => r.data),
  getUserDetail: (id) => api.get(`/admin/users/${id}`).then((r) => r.data),
  setUserStatus: (id, isActive) => api.patch(`/admin/users/${id}/status`, { isActive }).then((r) => r.data.user),
  getStats: () => api.get('/admin/stats').then((r) => r.data),
  getDashboardSummary: () => api.get('/dashboard/summary').then((r) => r.data),
  getActivity: (params) => api.get('/activity', { params }).then((r) => r.data),
  exportUrl: (format, params) => {
    const qs = new URLSearchParams({ ...params, format }).toString();
    return `/api/admin/export?${qs}`;
  },
};
