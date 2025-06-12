import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          // Verificar si el token sigue siendo válido
          try {
            await authService.verifyToken();
            setUser(JSON.parse(userData));
          } catch (error) {
            // Token inválido, limpiar datos
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_data');
          }
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      // Intentar login con API real
      const response = await authService.login(username, password);
      
      // Guardar token
      localStorage.setItem('access_token', response.access_token);
      
      // Obtener datos del usuario
      try {
        const userData = await authService.getCurrentUser();
        localStorage.setItem('user_data', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      } catch (userError) {
        // Si no se pueden obtener datos del usuario, usar datos básicos
        const basicUser = { username, nombre: username };
        localStorage.setItem('user_data', JSON.stringify(basicUser));
        setUser(basicUser);
        return { success: true };
      }
      
    } catch (error) {
      console.error('Error en login:', error);
      
      // Fallback a login simulado para desarrollo
      if (username === 'admin' && password === 'admin') {
        const mockUser = {
          id: 1,
          nombre: 'Administrador (Modo Demo)',
          username: 'admin',
          rol: 'admin'
        };
        
        const mockToken = 'demo-token-' + Date.now();
        localStorage.setItem('access_token', mockToken);
        localStorage.setItem('user_data', JSON.stringify(mockUser));
        setUser(mockUser);
        
        return { success: true };
      }
      
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Error de conexión. Verificar que el backend esté corriendo.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};