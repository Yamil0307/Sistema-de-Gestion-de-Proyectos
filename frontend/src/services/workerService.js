import api from './api';

export const workerService = {
  // Obtener todos los trabajadores
  getAllWorkers: async () => {
    const response = await api.get('/workers/');
    return response.data;
  },
  
  // Obtener trabajador específico
  getWorker: async (id) => {
    const response = await api.get(`/workers/${id}`);
    return response.data;
  },
  
  // Crear nuevo trabajador
  createWorker: async (workerData) => {
    const response = await api.post('/workers/', workerData);
    return response.data;
  },
  
  // Actualizar trabajador
  updateWorker: async (id, workerData) => {
    const response = await api.put(`/workers/${id}`, workerData);
    return response.data;
  },
  
  // Eliminar trabajador
  deleteWorker: async (id) => {
    const response = await api.delete(`/workers/${id}`);
    return response.data;
  },

  // Obtener programadores
  getProgramadores: async () => {
    const response = await api.get('/workers/programadores/');
    return response.data;
  },

  // Obtener líderes
  getLideres: async () => {
    const response = await api.get('/workers/lideres/');
    return response.data;
  }
};