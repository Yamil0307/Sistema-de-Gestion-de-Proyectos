import api from '../utils/axios';

export const workerService = {
  // Los métodos GET que ya corregimos
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
  
  // Corregir el método CREATE
  create: async (data) => {
    try {
      console.log("Creando trabajador con datos:", data);
      
      // Determinar la ruta basada en el rol
      let endpoint = '/workers/';
      if (data.rol === 'Programador') {
        endpoint = '/workers/programmer/';
      } else if (data.rol === 'Líder') {
        endpoint = '/workers/leader/';
      }
      
      const res = await api.post(endpoint, data);
      console.log("Trabajador creado:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error al crear trabajador:", error);
      console.error("Detalles:", error.response?.data);
      throw error;
    }
  },
  
  // Corregir el método UPDATE
  update: async (id, data) => {
    try {
      console.log(`Actualizando trabajador ${id} con datos:`, data);
      
      // Determinar la ruta basada en el rol
      let endpoint = `/workers/${id}`;
      if (data.rol === 'Programador') {
        endpoint = `/workers/programmer/${id}`;
      } else if (data.rol === 'Líder') {
        endpoint = `/workers/leader/${id}`;
      }
      
      const res = await api.put(endpoint, data);
      console.log("Trabajador actualizado:", res.data);
      return res.data;
    } catch (error) {
      console.error(`Error al actualizar trabajador ${id}:`, error);
      console.error("Detalles:", error.response?.data);
      throw error;
    }
  },
  
  // Corregir el método DELETE
  delete: async (id, role) => {
    try {
      console.log(`Eliminando trabajador ${id} con rol ${role}`);
      
      // Determinar la ruta basada en el rol
      let endpoint = `/workers/${id}`;
      if (role === 'Programador') {
        endpoint = `/workers/programmer/${id}`;
      } else if (role === 'Líder') {
        endpoint = `/workers/leader/${id}`;
      }
      
      const res = await api.delete(endpoint);
      console.log("Trabajador eliminado:", res.data);
      return res.data;
    } catch (error) {
      console.error(`Error al eliminar trabajador ${id}:`, error);
      console.error("Detalles:", error.response?.data);
      throw error;
    }
  }
};