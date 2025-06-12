import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
  Paper,
  IconButton
} from '@mui/material';
import {
  Close,
  Assignment,
  Person,
  CalendarToday,
  AttachMoney,
  Code
} from '@mui/icons-material';

const ProjectDetails = ({ open, onClose, project }) => {
  if (!project) return null;

  const getStatusColor = (status) => {
    const statusColors = {
      'Planificación': '#ff9800',
      'En Progreso': '#2196f3',
      'Completado': '#4caf50',
      'Pausado': '#9e9e9e',
      'Cancelado': '#f44336'
    };
    return statusColors[status] || '#9e9e9e';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calculateDuration = () => {
    const start = new Date(project.fecha_inicio);
    const end = new Date(project.fecha_fin);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ sx: { minHeight: '60vh' } }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        bgcolor: '#f5f5f5'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Assignment color="primary" />
          <Typography variant="h5" component="h2">
            {project.nombre}
          </Typography>
          <Chip
            label={project.estado}
            sx={{
              backgroundColor: getStatusColor(project.estado),
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </Box>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Información principal */}
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Descripción del Proyecto
              </Typography>
              <Typography variant="body1" paragraph>
                {project.descripcion}
              </Typography>
            </Paper>
          </Grid>

          {/* Detalles del cliente y fechas */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary">
                Información General
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Person sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Cliente
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {project.cliente}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Presupuesto
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatCurrency(project.presupuesto)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Assignment sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    ID del Proyecto
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    #{project.id}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Cronograma */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary">
                Cronograma
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Fecha de Inicio
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(project.fecha_inicio)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Fecha de Finalización
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(project.fecha_fin)}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Duración Total
                </Typography>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {calculateDuration()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  días
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Tecnologías */}
          {project.tecnologias && project.tecnologias.length > 0 && (
            <Grid item xs={12}>
              <Paper elevation={1} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Code sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6" color="primary">
                    Tecnologías Utilizadas
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {project.tecnologias.map((tech, index) => (
                    <Chip
                      key={index}
                      label={tech}
                      color="primary"
                      variant="outlined"
                      sx={{ fontSize: '0.9rem' }}
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>
          )}

          {/* Estadísticas adicionales */}
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
              <Typography variant="h6" gutterBottom color="primary">
                Resumen del Proyecto
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                      {project.estado === 'Completado' ? '100%' : '50%'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Progreso
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                      {project.tecnologias ? project.tecnologias.length : 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tecnologías
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                      0
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Equipos Asignados
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                      0
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tareas Completadas
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectDetails;