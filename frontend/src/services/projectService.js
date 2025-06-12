import api from './api';

export const projectService = {
  // Obtener todos los proyectos
  getAllProjects: async () => {
    const response = await api.get('/projects/');
    return response.data;
  },
  
  // Obtener un proyecto específico
  getProject: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
  
  // Crear nuevo proyecto
  createProject: async (projectData) => {
    const response = await api.post('/projects/', projectData);
    return response.data;
  },
  
  // Actualizar proyecto existente
  updateProject: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },
  
  // Eliminar proyecto
  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  // Buscar proyectos por estado
  getProjectsByStatus: async (status) => {
    const response = await api.get(`/projects/status/${status}`);
    return response.data;
  }
};