import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar si hay un token almacenado y cargar el usuario
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          // Asegurarnos de que todos los usuarios tengan rol de administrador
          const adminUser = {
            ...userData,
            role: 'admin', // Garantizar que todos los usuarios sean considerados admin
            isAdmin: true  // Flag adicional para facilitar verificaciones
          };
          setUser(adminUser);
        } catch (error) {
          console.error('Error al cargar usuario:', error);
          localStorage.removeItem('token');
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.login(credentials);
      
      // Añadir log para depuración
      console.log("Login exitoso, obteniendo información del usuario...");
      console.log("Token en localStorage:", localStorage.getItem('token'));
      
      // Intentar obtener la información del usuario actual
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        return { success: true };
      } catch (userError) {
        console.error("Error al obtener información del usuario:", userError);
        // Incluso si falla obtener el usuario, consideramos el login como exitoso
        return { success: true };
      }
    } catch (error) {
      console.error('Error en login:', error);
      
      // Manejar respuestas de error de la API
      let errorMessage = 'Error al iniciar sesión';
      if (error.response) {
        // Errores de la API
        if (error.response.data && error.response.data.detail) {
          if (typeof error.response.data.detail === 'string') {
            errorMessage = error.response.data.detail;
          } else if (Array.isArray(error.response.data.detail)) {
            errorMessage = error.response.data.detail[0].msg || errorMessage;
          }
        } else if (error.response.status === 401) {
          errorMessage = 'Credenciales incorrectas';
        } else if (error.response.status === 422) {
          errorMessage = 'Formato de datos incorrecto';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await authService.register(userData);
      return { success: true, data };
    } catch (error) {
      console.error('Error en registro:', error);
      // Manejo mejorado del error
      let errorMessage = 'Error al registrar usuario';
      
      if (error.response && error.response.data) {
        // Si es un error de validación de FastAPI
        if (error.response.data.detail) {
          if (Array.isArray(error.response.data.detail)) {
            // Si es un array de errores, tomamos el primero
            errorMessage = error.response.data.detail[0].msg || errorMessage;
          } else {
            // Si es un único error
            errorMessage = typeof error.response.data.detail === 'string' 
              ? error.response.data.detail 
              : errorMessage;
          }
        } else if (error.response.status === 409) {
          errorMessage = "El usuario ya existe";
        } else if (error.response.status === 422) {
          errorMessage = "Datos de registro inválidos";
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Añadir método utilitario para verificar permisos (siempre retorna true)
  const hasPermission = (permission) => {
    // Como todos son administradores, siempre tienen todos los permisos
    return true;
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    hasPermission, // Nuevo método utilitario
    isAdmin: !!user // Shorthand para verificar si hay un usuario (todos son admin)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};