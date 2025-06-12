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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  Card,
  CardContent
} from '@mui/material';
import {
  Close,
  Groups,
  Person,
  Assignment,
  CalendarToday,
  Code,
  Star,
  TrendingUp,
  Schedule,
  CheckCircle
} from '@mui/icons-material';

const TeamDetails = ({ open, onClose, team }) => {
  if (!team) return null;

  const getStatusColor = (status) => {
    const colors = {
      'Activo': '#4caf50',
      'Disponible': '#2196f3',
      'Inactivo': '#9e9e9e',
      'En Formación': '#ff9800'
    };
    return colors[status] || '#9e9e9e';
  };

  const getProductivityColor = (productivity) => {
    if (productivity >= 90) return '#4caf50';
    if (productivity >= 75) return '#ff9800';
    return '#f44336';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calculateTeamAge = () => {
    const created = new Date(team.fecha_creacion);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} días`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'mes' : 'meses'}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const months = Math.floor((diffDays % 365) / 30);
      return months > 0 ? `${years} años, ${months} meses` : `${years} años`;
    }
  };

  const getTotalMembers = () => {
    return team.miembros.length + 1; // +1 por el líder
  };

  const getProjectStatusIcon = (status) => {
    switch (status) {
      case 'Completado':
        return <CheckCircle sx={{ color: '#4caf50', mr: 1 }} />;
      case 'En Progreso':
        return <Schedule sx={{ color: '#2196f3', mr: 1 }} />;
      case 'Planificación':
        return <Assignment sx={{ color: '#ff9800', mr: 1 }} />;
      default:
        return <Assignment sx={{ color: '#9e9e9e', mr: 1 }} />;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{ sx: { minHeight: '80vh' } }}
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
              bgcolor: '#1976d2',
              width: 50,
              height: 50
            }}
          >
            <Groups />
          </Avatar>
          <Box>
            <Typography variant="h5" component="h2">
              {team.nombre}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Chip
                label={team.estado}
                sx={{
                  backgroundColor: getStatusColor(team.estado),
                  color: 'white',
                  fontWeight: 'bold'
                }}
                size="small"
              />
              <Chip
                label={`${team.productividad}% Productividad`}
                sx={{
                  backgroundColor: getProductivityColor(team.productividad),
                  color: 'white',
                  fontWeight: 'bold'
                }}
                size="small"
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
          {/* Descripción del equipo */}
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Descripción del Equipo
              </Typography>
              <Typography variant="body1" paragraph>
                {team.descripcion}
              </Typography>
            </Paper>
          </Grid>

          {/* Información del líder */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person /> Líder del Equipo
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                <Avatar sx={{ bgcolor: '#f57c00', width: 50, height: 50 }}>
                  {team.lider.avatar}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {team.lider.nombre}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Líder de Equipo
                  </Typography>
                  <Chip 
                    label="Líder" 
                    size="small" 
                    color="warning" 
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Información general */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary">
                Información General
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Fecha de Creación
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(team.fecha_creacion)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({calculateTeamAge()} de antigüedad)
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Groups sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total de Integrantes
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {getTotalMembers()} personas
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Assignment sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Proyectos Completados
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {team.proyectos_completados}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Miembros del equipo */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Groups /> Miembros del Equipo ({team.miembros.length})
              </Typography>
              
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {team.miembros.map((member) => (
                  <ListItem key={member.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#1976d2' }}>
                        {member.avatar}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={member.nombre}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Chip 
                            label={member.tipo} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Proyecto actual */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assignment /> Proyecto Actual
              </Typography>
              
              {team.proyecto_actual ? (
                <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {getProjectStatusIcon(team.proyecto_actual.estado)}
                    <Typography variant="h6" fontWeight="bold">
                      {team.proyecto_actual.nombre}
                    </Typography>
                  </Box>
                  <Chip
                    label={team.proyecto_actual.estado}
                    color={team.proyecto_actual.estado === 'En Progreso' ? 'primary' : 'default'}
                    size="small"
                  />
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    El equipo está trabajando activamente en este proyecto
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ p: 2, bgcolor: '#f0f0f0', borderRadius: 2, textAlign: 'center' }}>
                  <Assignment sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body1" color="textSecondary">
                    No hay proyecto asignado
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Este equipo está disponible para nuevos proyectos
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Tecnologías del equipo */}
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Code /> Stack Tecnológico del Equipo
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {team.tecnologias.map((tech, index) => (
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

          {/* Métricas de rendimiento */}
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp /> Métricas de Rendimiento
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ textAlign: 'center', bgcolor: '#e3f2fd' }}>
                    <CardContent>
                      <Star sx={{ fontSize: 30, color: '#1976d2', mb: 1 }} />
                      <Typography variant="h4" color="#1976d2" fontWeight="bold">
                        {team.productividad}%
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Productividad
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={team.productividad} 
                        sx={{ 
                          mt: 1,
                          height: 6,
                          borderRadius: 3,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getProductivityColor(team.productividad)
                          }
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Card sx={{ textAlign: 'center', bgcolor: '#e8f5e8' }}>
                    <CardContent>
                      <Assignment sx={{ fontSize: 30, color: '#2e7d32', mb: 1 }} />
                      <Typography variant="h4" color="#2e7d32" fontWeight="bold">
                        {team.proyectos_completados}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Proyectos Completados
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Card sx={{ textAlign: 'center', bgcolor: '#fff3e0' }}>
                    <CardContent>
                      <Groups sx={{ fontSize: 30, color: '#f57c00', mb: 1 }} />
                      <Typography variant="h4" color="#f57c00" fontWeight="bold">
                        {getTotalMembers()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Integrantes
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Card sx={{ textAlign: 'center', bgcolor: '#fce4ec' }}>
                    <CardContent>
                      <Code sx={{ fontSize: 30, color: '#c2185b', mb: 1 }} />
                      <Typography variant="h4" color="#c2185b" fontWeight="bold">
                        {team.tecnologias.length}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Tecnologías
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Historial de proyectos (simulado) */}
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
              <Typography variant="h6" gutterBottom color="primary">
                Resumen de Actividad
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Tiempo en operación:</strong> {calculateTeamAge()}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Promedio de proyectos por año:</strong> {team.proyectos_completados > 0 ? Math.round(team.proyectos_completados / Math.max(1, Math.floor(new Date().getFullYear() - new Date(team.fecha_creacion).getFullYear() + 1))) : 0}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Eficiencia del equipo:</strong> {team.productividad >= 90 ? 'Excelente' : team.productividad >= 75 ? 'Buena' : 'Mejorable'}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Especialización principal:</strong> {team.tecnologias[0] || 'Por definir'}
                  </Typography>
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

export default TeamDetails;