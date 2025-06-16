import api from '../utils/axios';

export const projectService = {
  // Obtener todos los proyectos
  getAll: async () => {
    const res = await api.get('/projects/');
    return res.data;
  },
  
  // Crear nuevo proyecto
  create: async (data) => {
    const res = await api.post('/projects/', data);
    return res.data;
  },
  
  // Actualizar proyecto existente
  update: async (id, data) => {
    const res = await api.put(`/projects/${id}`, data);
    return res.data;
  },
  
  // Eliminar proyecto
  delete: async (id) => {
    const res = await api.delete(`/projects/${id}`);
    return res.data;
  }
};