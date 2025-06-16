import api from '../utils/axios';

export const teamService = {
  getAll: async () => {
    const res = await api.get('/teams/');
    return res.data;
  },
  
  getById: async (id) => {
    const res = await api.get(`/teams/${id}`);
    return res.data;
  },
  
  create: async (data) => {
    const res = await api.post('/teams/', data);
    return res.data;
  },
  
  update: async (id, data) => {
    const res = await api.put(`/teams/${id}`, data);
    return res.data;
  },
  
  delete: async (id) => {
    const res = await api.delete(`/teams/${id}`);
    return res.data;
  },
  
  // Métodos para gestionar miembros del equipo
  getMembers: async (teamId) => {
    const res = await api.get(`/teams/${teamId}/members`);
    return res.data;
  },
  
  addMember: async (teamId, workerId) => {
    const res = await api.post(`/teams/${teamId}/members`, { worker_id: workerId });
    return res.data;
  },
  
  removeMember: async (teamId, workerId) => {
    const res = await api.delete(`/teams/${teamId}/members/${workerId}`);
    return res.data;
  }
};