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

// Mejorar el interceptor de respuesta existente:
instance.interceptors.response.use(
  (response) => {
    console.log(`✅ Respuesta exitosa para ${response.config.method?.toUpperCase()} ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error(`❌ Error en ${error.config?.method?.toUpperCase()} ${error.config?.url}:`);
    console.error('Código de estado:', error.response?.status);
    console.error('Mensaje del servidor:', error.response?.data);
    console.error('Headers de respuesta:', error.response?.headers);
    
    return Promise.reject(error);
  }
);

export default instance;