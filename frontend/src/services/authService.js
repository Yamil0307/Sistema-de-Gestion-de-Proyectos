import api from './api';

export const authService = {
  // Login con FormData (como espera tu backend FastAPI)
  login: async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await api.post('/auth/login', formData, {
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded' 
      }
    });
    return response.data;
  },
  
  // Registro de nuevo usuario
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Obtener información del usuario actual
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Verificar si el token es válido
  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify-token');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};