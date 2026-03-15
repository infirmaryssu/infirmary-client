import { api } from './api';

export const adminService = {
  createAdminUser: async (payload) => {
    const { data } = await api.post('/api/admin/users', payload);
    return data;
  },
};
