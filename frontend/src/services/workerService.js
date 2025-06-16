import api from '../utils/axios';

export const workerService = {
  // Métodos GET existentes (sin cambios)
  getProgrammers: async () => {
    try {
      const res = await api.get('/workers/programmers/');
      return res.data;
    } catch (error) {
      console.error("Error al obtener programadores:", error);
      throw error;
    }
  },
  
  getLeaders: async () => {
    try {
      const res = await api.get('/workers/leaders/');
      return res.data;
    } catch (error) {
      console.error("Error al obtener líderes:", error);
      throw error;
    }
  },
  
  getAll: async () => {
    try {
      const [programmersRes, leadersRes] = await Promise.all([
        workerService.getProgrammers(),
        workerService.getLeaders()
      ]);
      
      const allWorkers = [...programmersRes, ...leadersRes];
      return allWorkers;
    } catch (error) {
      console.error("Error al obtener todos los trabajadores:", error);
      throw error;
    }
  },

  // Métodos CREATE existentes (sin cambios)
  createProgrammer: async (data) => {
    try {
      console.log("Creando programador con datos:", data);
      const res = await api.post('/workers/programmers/', data);
      console.log("Programador creado:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error al crear programador:", error);
      throw error;
    }
  },

  createLeader: async (data) => {
    try {
      console.log("Creando líder con datos:", data);
      const res = await api.post('/workers/leaders/', data);
      console.log("Líder creado:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error al crear líder:", error);
      throw error;
    }
  },
  
  // MÉTODO DELETE SIMPLIFICADO Y CORRECTO
  delete: async (workerId, workerData) => {
    try {
      console.log(`Eliminando trabajador ID: ${workerId}`);
      
      if (!workerId) {
        throw new Error("ID del trabajador no proporcionado");
      }
      
      // Determinar el tipo de trabajador
      const isProgrammer = workerData.hasOwnProperty('category') && workerData.hasOwnProperty('languages');
      
      let endpoint = '';
      if (isProgrammer) {
        endpoint = `/workers/programmers/${workerId}`;
        console.log("Eliminando programador");
      } else {
        endpoint = `/workers/leaders/${workerId}`;
        console.log("Eliminando líder");
      }
      
      const res = await api.delete(endpoint);
      console.log("Trabajador eliminado exitosamente");
      return res.data;
      
    } catch (error) {
      console.error("Error al eliminar trabajador:", error);
      
      if (error.response?.status === 404) {
        throw new Error("El trabajador no fue encontrado");
      } else if (error.response?.status === 403) {
        throw new Error("No tienes permisos para eliminar este trabajador");
      } else {
        throw new Error("Error al eliminar el trabajador");
      }
    }
  }
};