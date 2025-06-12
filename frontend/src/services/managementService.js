import api from './api';

export const managementService = {
  // Obtener estadísticas generales
  getDashboardStats: async () => {
    const response = await api.get('/management/dashboard-stats');
    return response.data;
  },

  // Asignaciones
  getAssignments: async () => {
    const response = await api.get('/management/assignments');
    return response.data;
  },

  createAssignment: async (assignmentData) => {
    const response = await api.post('/management/assignments', assignmentData);
    return response.data;
  },

  updateAssignment: async (id, assignmentData) => {
    const response = await api.put(`/management/assignments/${id}`, assignmentData);
    return response.data;
  },

  deleteAssignment: async (id) => {
    const response = await api.delete(`/management/assignments/${id}`);
    return response.data;
  },

  // Seguimiento
  getTracking: async (filters) => {
    const response = await api.get('/management/tracking', { params: filters });
    return response.data;
  },

  updateTracking: async (id, trackingData) => {
    const response = await api.put(`/management/tracking/${id}`, trackingData);
    return response.data;
  },

  // Reportes
  getReports: async (type, params) => {
    const response = await api.get(`/management/reports/${type}`, { params });
    return response.data;
  },

  // Asignar proyecto a equipo
  assignProjectToTeam: async (projectId, teamId) => {
    const response = await api.post('/management/assign-project', { project_id: projectId, team_id: teamId });
    return response.data;
  },

  // Obtener logs de actividad
  getActivityLogs: async (params) => {
    const response = await api.get('/management/activity-logs', { params });
    return response.data;
  }
};