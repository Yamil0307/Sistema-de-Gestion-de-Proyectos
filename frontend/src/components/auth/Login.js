import React, { useState, useEffect } from 'react';
import { 
  Container, Paper, Typography, TextField, Button, Box, 
  Alert, CircularProgress, Link, Grid
} from '@mui/material';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  
  // Mostrar mensaje si viene de registro exitoso
  useEffect(() => {
    if (location.state?.message) {
      setFormError('');
    }
  }, [location]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setFormError('Por favor complete todos los campos');
      return;
    }
    
    setFormError('');
    
    try {
      console.log("Intentando login con:", email);
      const result = await login({ email, password });
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setFormError(typeof result.error === 'object' ? 
          'Error en las credenciales.' : result.error);
      }
    } catch (error) {
      console.error('Error detallado:', error);
      setFormError(typeof error === 'object' ? 
        (error.message || 'Error al iniciar sesión') : String(error));
    }
  };
  
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Iniciar Sesión
        </Typography>
        
        <Typography variant="body1" align="center" color="textSecondary" paragraph>
          Acceda al Sistema de Gestión
        </Typography>
        
        {/* Mostrar mensajes de registro exitoso */}
        {location.state?.message && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {location.state.message}
          </Alert>
        )}
        
        {formError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {typeof formError === 'object' ? JSON.stringify(formError) : formError}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Usuario"
            name="usuario"
            // autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
          </Button>
          
          <Grid container justifyContent="center" sx={{ mt: 3 }}>
            <Grid item>
              <Link component={RouterLink} to="/register" variant="body2">
                ¿No tiene una cuenta? Registrarse
              </Link>
            </Grid>
          </Grid>
        </Box>
        
        <Typography variant="body2" align="center" color="textSecondary" sx={{ mt: 4 }}>
          Sistema de Gestión para Empresas de Software
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;