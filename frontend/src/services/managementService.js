import api from '../utils/axios';

export const managementService = {
  // Asignaciones
  getAllAssignments: async () => {
    const res = await api.get('/management/assignments');
    return res.data;
  },
  
  getAssignmentById: async (id) => {
    const res = await api.get(`/management/assignments/${id}`);
    return res.data;
  },
  
  createAssignment: async (data) => {
    const res = await api.post('/management/assignments', data);
    return res.data;
  },
  
  updateAssignment: async (id, data) => {
    const res = await api.put(`/management/assignments/${id}`, data);
    return res.data;
  },
  
  deleteAssignment: async (id) => {
    const res = await api.delete(`/management/assignments/${id}`);
    return res.data;
  },
  
  // Seguimiento de proyectos
  getProjectProgress: async (projectId) => {
    const res = await api.get(`/management/progress/${projectId}`);
    return res.data;
  },
  
  updateProjectProgress: async (projectId, data) => {
    const res = await api.put(`/management/progress/${projectId}`, data);
    return res.data;
  },
  
  // Reportes
  getReports: async (type, params = {}) => {
    const res = await api.get(`/management/reports/${type}`, { params });
    return res.data;
  },
  
  // Estadísticas
  getStatistics: async () => {
    const res = await api.get('/management/statistics');
    return res.data;
  },
  
  // Recomendaciones (si la API las soporta)
  getRecommendations: async (type) => {
    const res = await api.get(`/management/recommendations/${type}`);
    return res.data;
  }
};