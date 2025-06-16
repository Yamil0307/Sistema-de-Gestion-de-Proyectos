import api from '../utils/axios';

export const authService = {
  // Login con FormData (como espera tu backend FastAPI)
  login: async (credentials) => {
    try {
      // Preparar los datos para OAuth2 Password Flow
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('username', credentials.email);
      formData.append('password', credentials.password);
      
      // Ruta estándar para FastAPI OAuth2
      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      console.log('Login exitoso:', response.data);
      
      // Guardar el token según el formato de respuesta
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
      } else if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en login:', error);
      console.error('Detalles de la respuesta:', error.response?.data);
      throw error;
    }
  },
  
  // Registro de nuevo usuario
  register: async (userData) => {
    try {
      // Adaptar los datos al formato esperado por la API
      const dataToSend = {
        username: userData.nombre, // Convertimos nombre a username
        email: userData.email,
        password: userData.password,
        is_active: true, // Por defecto activo
        role: "user" // Rol por defecto
      };
      
      const response = await api.post('/auth/register', dataToSend);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener información del usuario actual
  getCurrentUser: async () => {
    try {
      // Cambiamos la ruta para obtener el usuario actual
      // Probamos con /auth/me basándonos en la estructura del API
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
  }
};