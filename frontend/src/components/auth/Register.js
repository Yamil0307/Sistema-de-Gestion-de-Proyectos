import React, { useState } from 'react';
import { 
  Container, Paper, Typography, TextField, Button, Box, 
  Alert, CircularProgress, Link, Grid, Divider
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre || !formData.email || !formData.password || !formData.confirmPassword) {
      setFormError('Por favor complete todos los campos');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setFormError('Las contraseñas no coinciden');
      return;
    }
    
    setFormError('');
    
    // No enviamos confirmPassword al API
    const { confirmPassword, ...userData } = formData;
    
    const result = await register(userData);
    
    if (result.success) {
      // Redirigir al login después del registro exitoso
      navigate('/login', { 
        state: { message: 'Registro exitoso. Por favor inicie sesión.' } 
      });
    } else {
      setFormError(result.error);
    }
  };
  
  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Registro de Usuario
        </Typography>
        
        <Typography variant="body1" align="center" color="textSecondary" paragraph>
          Cree una nueva cuenta para acceder al sistema
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
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
            id="nombre"
            label="Usuario"
            name="usuario"
            autoFocus
            value={formData.nombre}
            onChange={handleChange}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo Electrónico"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirmar Contraseña"
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Registrarse'}
          </Button>
          
          <Grid container justifyContent="center" sx={{ mt: 3 }}>
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                ¿Ya tiene una cuenta? Iniciar Sesión
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

export default Register;