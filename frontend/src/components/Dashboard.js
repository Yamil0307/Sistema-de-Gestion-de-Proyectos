import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Business
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    // Simulamos una carga
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome header */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          mb: 4
        }}
      >
        <Typography variant="h4" gutterBottom>
          Bienvenido al Sistema de Gestión
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Software de Administración de Proyectos y Equipos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Administre proyectos, equipos y recursos de la empresa de software de manera eficiente.
          Utilice la barra de navegación superior para acceder a los diferentes módulos del sistema.
        </Typography>
      </Paper>
      
      {/* Main section */}
      <Grid container spacing={3} justifyContent="center">
        {/* Company Overview */}
        <Grid item xs={12} md={10}>
          <Paper
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 400
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Business color="primary" sx={{ mr: 2, fontSize: 36 }} />
              <Typography component="h1" variant="h4" color="primary">
                Vista General
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 4 }} />
            
            <Typography variant="h6" paragraph>
              Sistema de Gestión Empresarial
            </Typography>
            
            <Typography variant="body1" paragraph>
              Esta plataforma centraliza la administración de todos los recursos de su empresa de desarrollo de software.
              Navegue a través de los diferentes módulos utilizando la barra de navegación superior.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Los módulos disponibles incluyen:
            </Typography>
            
            <ul>
              <li>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Proyectos:</strong> Gestión completa del ciclo de vida de los proyectos.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Trabajadores:</strong> Administración del personal y sus habilidades.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Equipos:</strong> Formación y supervisión de equipos de desarrollo.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Lógica de Negocio:</strong> Asignaciones, seguimiento y reportes del sistema.
                </Typography>
              </li>
            </ul>
            
            <Box sx={{ mt: 'auto', pt: 4 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                © 2024 Sistema de Gestión - Empresa de Software. Todos los derechos reservados.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;