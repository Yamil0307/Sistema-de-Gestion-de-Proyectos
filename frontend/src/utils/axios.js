import axios from 'axios';

// Crear una instancia de axios con la URL base
const instance = axios.create({
  baseURL: 'http://localhost:8000',  // Ajusta esto según la URL de tu API FastAPI
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token a las peticiones
instance.interceptors.request.use(
  (config) => {
    console.log(`Solicitud a: ${config.url}`, config.method);
    
    // No modificar los headers si ya se está enviando form-urlencoded
    if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      return config;
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      console.log("Token añadido a la solicitud");
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No hay token disponible para la solicitud");
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Mejorar el interceptor de respuesta
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detallado del error
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    
    return Promise.reject(error);
  }
);

export default instance;