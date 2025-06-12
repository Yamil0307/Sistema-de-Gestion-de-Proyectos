import api from './api';

export const teamService = {
  // Obtener todos los equipos
  getAllTeams: async () => {
    const response = await api.get('/teams/');
    return response.data;
  },
  
  // Obtener equipo específico
  getTeam: async (id) => {
    const response = await api.get(`/teams/${id}`);
    return response.data;
  },
  
  // Crear nuevo equipo
  createTeam: async (teamData) => {
    const response = await api.post('/teams/', teamData);
    return response.data;
  },
  
  // Actualizar equipo
  updateTeam: async (id, teamData) => {
    const response = await api.put(`/teams/${id}`, teamData);
    return response.data;
  },
  
  // Eliminar equipo
  deleteTeam: async (id) => {
    const response = await api.delete(`/teams/${id}`);
    return response.data;
  },

  // Asignar miembro al equipo
  addMember: async (teamId, memberId) => {
    const response = await api.post(`/teams/${teamId}/members`, { member_id: memberId });
    return response.data;
  },

  // Remover miembro del equipo
  removeMember: async (teamId, memberId) => {
    const response = await api.delete(`/teams/${teamId}/members/${memberId}`);
    return response.data;
  },

  // Asignar proyecto al equipo
  assignProject: async (teamId, projectId) => {
    const response = await api.post(`/teams/${teamId}/projects`, { project_id: projectId });
    return response.data;
  }
};