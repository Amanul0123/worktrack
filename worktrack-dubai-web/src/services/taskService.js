import api from './apiClient';

export const taskService = {
  list: (params) => api.get('/tasks', { params }).then((r) => r.data),
  create: (data) => api.post('/tasks', data).then((r) => r.data.task),
  update: (id, data) => api.put(`/tasks/${id}`, data).then((r) => r.data.task),
  toggleStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }).then((r) => r.data.task),
  delete: (id) => api.delete(`/tasks/${id}`).then((r) => r.data),
};
