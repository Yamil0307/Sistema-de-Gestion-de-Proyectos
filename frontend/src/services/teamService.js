import api from '../utils/axios';

export const teamService = {
  // Método para obtener todos los equipos
  getAll: async () => {
    try {
      console.log("Obteniendo todos los equipos...");
      const res = await api.get('/teams/');
      console.log("Equipos obtenidos:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error al obtener equipos:", error);
      throw error;
    }
  },

  // Método para obtener líderes disponibles (no asignados a equipos)
  getAvailableLeaders: async () => {
    try {
      console.log("Obteniendo líderes disponibles...");
      const res = await api.get('/teams/available-leaders/');
      console.log("Líderes disponibles:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error al obtener líderes disponibles:", error);
      // Fallback: obtener todos los líderes si el endpoint específico no existe
      try {
        const allLeadersRes = await api.get('/workers/leaders/');
        const allTeamsRes = await api.get('/teams/');
        
        const allLeaders = allLeadersRes.data;
        const allTeams = allTeamsRes.data;
        
        // Filtrar líderes que no están asignados a ningún equipo
        const assignedLeaderIds = allTeams.map(team => team.lider_id).filter(id => id !== null);
        const availableLeaders = allLeaders.filter(leader => !assignedLeaderIds.includes(leader.id));
        
        console.log("Líderes disponibles (calculados):", availableLeaders);
        return availableLeaders;
      } catch (fallbackError) {
        console.error("Error en fallback para líderes disponibles:", fallbackError);
        throw fallbackError;
      }
    }
  },

  // Método para crear un equipo
  create: async (data) => {
    try {
      console.log("Creando equipo con datos:", data);
      const res = await api.post('/teams/', data);
      console.log("Equipo creado:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error al crear equipo:", error);
      console.error("Detalles:", error.response?.data);
      throw error;
    }
  },

  // Método para actualizar un equipo
  update: async (id, data) => {
    try {
      console.log(`Actualizando equipo ${id} con datos:`, data);
      const res = await api.put(`/teams/${id}`, data);
      console.log("Equipo actualizado:", res.data);
      return res.data;
    } catch (error) {
      console.error(`Error al actualizar equipo ${id}:`, error);
      console.error("Detalles:", error.response?.data);
      throw error;
    }
  },

  // Método para eliminar un equipo
  delete: async (id) => {
    try {
      console.log(`Eliminando equipo ${id}`);
      const res = await api.delete(`/teams/${id}`);
      console.log("Equipo eliminado:", res.data);
      return res.data;
    } catch (error) {
      console.error(`Error al eliminar equipo ${id}:`, error);
      console.error("Detalles:", error.response?.data);
      throw error;
    }
  }
};