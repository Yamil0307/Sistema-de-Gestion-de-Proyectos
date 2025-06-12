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
  IconButton,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  Close,
  Person,
  Email,
  Phone,
  Work,
  CalendarToday,
  AttachMoney,
  Code,
  Star,
  TrendingUp,
  Groups,
  Assignment
} from '@mui/icons-material';

const WorkerDetails = ({ open, onClose, worker }) => {
  if (!worker) return null;

  const getLevelColor = (level) => {
    const colors = {
      'Junior': '#ff9800',
      'Mid': '#2196f3',
      'Senior': '#4caf50'
    };
    return colors[level] || '#9e9e9e';
  };

  const getTypeColor = (type) => {
    return type === 'Líder' ? '#f57c00' : '#1976d2';
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

  const calculateSeniority = () => {
    const start = new Date(worker.fecha_ingreso);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    
    if (diffMonths < 12) {
      return `${diffMonths} meses`;
    } else {
      const years = Math.floor(diffMonths / 12);
      const months = diffMonths % 12;
      return months > 0 ? `${years} años, ${months} meses` : `${years} años`;
    }
  };

  const getExperienceLevel = (years) => {
    if (years <= 2) return { level: 'Principiante', progress: 25, color: '#ff9800' };
    if (years <= 5) return { level: 'Intermedio', progress: 50, color: '#2196f3' };
    if (years <= 8) return { level: 'Avanzado', progress: 75, color: '#4caf50' };
    return { level: 'Experto', progress: 100, color: '#9c27b0' };
  };

  const experienceInfo = getExperienceLevel(worker.experiencia);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ sx: { minHeight: '70vh' } }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        bgcolor: '#f5f5f5',
        pb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: getTypeColor(worker.tipo),
              width: 50,
              height: 50
            }}
          >
            {worker.tipo === 'Líder' ? <Groups /> : <Code />}
          </Avatar>
          <Box>
            <Typography variant="h5" component="h2">
              {worker.nombre}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Chip
                label={worker.tipo}
                color={worker.tipo === 'Líder' ? 'warning' : 'primary'}
                size="small"
              />
              <Chip
                label={worker.nivel}
                size="small"
                sx={{
                  backgroundColor: getLevelColor(worker.nivel),
                  color: 'white'
                }}
              />
              <Chip
                label={worker.estado}
                size="small"
                color={worker.estado === 'Activo' ? 'success' : 'default'}
              />
            </Box>
          </Box>
        </Box>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Información de contacto */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person /> Información de Contacto
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Email sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {worker.email}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Phone sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Teléfono
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {worker.telefono}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarToday sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Fecha de Ingreso
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(worker.fecha_ingreso)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({calculateSeniority()} en la empresa)
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Información profesional */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Work /> Información Profesional
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Nivel de Experiencia
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography variant="body1" fontWeight="medium">
                    {experienceInfo.level}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({worker.experiencia} años)
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={experienceInfo.progress} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: experienceInfo.color
                    }
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Salario Mensual
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {formatCurrency(worker.salario)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Tecnologías */}
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Code /> Tecnologías y Habilidades
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {worker.tecnologias.map((tech, index) => (
                  <Chip
                    key={index}
                    label={tech}
                    color="primary"
                    variant="outlined"
                    sx={{ fontSize: '0.9rem', mb: 1 }}
                  />
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Estadísticas y rendimiento */}
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp /> Estadísticas y Rendimiento
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                    <Assignment sx={{ fontSize: 30, color: '#1976d2', mb: 1 }} />
                    <Typography variant="h4" color="#1976d2" fontWeight="bold">
                      {worker.proyectos_completados}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Proyectos Completados
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fff3e0', borderRadius: 2 }}>
                    <Star sx={{ fontSize: 30, color: '#f57c00', mb: 1 }} />
                    <Typography variant="h4" color="#f57c00" fontWeight="bold">
                      {worker.calificacion}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Calificación
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e8f5e8', borderRadius: 2 }}>
                    <Code sx={{ fontSize: 30, color: '#2e7d32', mb: 1 }} />
                    <Typography variant="h4" color="#2e7d32" fontWeight="bold">
                      {worker.tecnologias.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tecnologías
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fce4ec', borderRadius: 2 }}>
                    {worker.tipo === 'Líder' ? (
                      <>
                        <Groups sx={{ fontSize: 30, color: '#c2185b', mb: 1 }} />
                        <Typography variant="h4" color="#c2185b" fontWeight="bold">
                          {worker.equipos_liderados || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Equipos Liderados
                        </Typography>
                      </>
                    ) : (
                      <>
                        <CalendarToday sx={{ fontSize: 30, color: '#c2185b', mb: 1 }} />
                        <Typography variant="h4" color="#c2185b" fontWeight="bold">
                          {calculateSeniority().split(' ')[0]}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Antigüedad
                        </Typography>
                      </>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Información adicional para líderes */}
          {worker.tipo === 'Líder' && (
            <Grid item xs={12}>
              <Paper elevation={1} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Groups /> Información de Liderazgo
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Equipos bajo su liderazgo:</strong> {worker.equipos_liderados || 0}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Proyectos dirigidos:</strong> {Math.floor(worker.proyectos_completados * 0.8)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Años en posición de liderazgo:</strong> {Math.max(1, worker.experiencia - 3)}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Especialización:</strong> Gestión de equipos y arquitectura
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}
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

export default WorkerDetails;