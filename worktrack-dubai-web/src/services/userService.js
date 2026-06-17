import api from './apiClient';

export const userService = {
  getMe: () => api.get('/me').then((r) => r.data.user),
  updateMe: (data) => api.put('/me', data).then((r) => r.data.user),
  uploadAvatar: (file) => {
    const form = new FormData();
    form.append('avatar', file);
    return api.post('/me/avatar', form).then((r) => r.data.user);
  },
  updateLanguage: (language) => api.put('/me/language', { language }).then((r) => r.data.user),
  changePassword: (data) => api.put('/me/password', data).then((r) => r.data),
};
