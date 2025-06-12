import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Avatar,
  LinearProgress,
  Tabs,
  Tab
} from '@mui/material';
import {
  Timeline,
  Edit,
  Flag,
  CheckCircle,
  Warning,
  AccessTime,
  Person,
  Comment,
  CalendarToday,
  AssignmentTurnedIn,
  Assignment,
  Schedule
} from '@mui/icons-material';
import { managementService } from '../../services/managementService';

const ProjectTracking = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('todos');
  const [selectedProject, setSelectedProject] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updateData, setUpdateData] = useState({
    progress: '',
    status: '',
    comments: ''
  });

  // Datos mock
  const mockProjects = [
    {
      id: 1,
      nombre: 'Sistema de Inventario',
      descripcion: 'Sistema para gestión de inventario de productos',
      team: {
        id: 1,
        nombre: 'Team Alpha',
        lider: { nombre: 'María Fernanda González' }
      },
      start_date: '2024-05-15',
      end_date: '2024-07-30',
      estado: 'En Progreso',
      progreso: 45,
      priority: 'Alta',
      milestones: [
        { id: 1, name: 'Diseño de UI', completed: true, date: '2024-05-25' },
        { id: 2, name: 'Desarrollo Backend', completed: false, date: '2024-06-20' },
        { id: 3, name: 'Integración API', completed: false, date: '2024-07-10' },
        { id: 4, name: 'Pruebas', completed: false, date: '2024-07-25' }
      ],
      updates: [
        { date: '2024-05-20', comment: 'Inicio del proyecto', author: 'María F.', progress: 10, status: 'En Progreso' },
        { date: '2024-05-27', comment: 'Diseño UI completado', author: 'Ana R.', progress: 25, status: 'En Progreso' },
        { date: '2024-06-10', comment: 'Desarrollo de API en curso', author: 'Carlos M.', progress: 45, status: 'En Progreso' }
      ],
      risks: [
        { description: 'Retraso en la integración con SAP', severity: 'Media', mitigation: 'Programar sesiones adicionales' },
        { description: 'Falta de recursos para pruebas', severity: 'Baja', mitigation: 'Utilizar entornos simulados' }
      ]
    },
    {
      id: 2,
      nombre: 'App Móvil E-commerce',
      descripcion: 'Aplicación móvil para tienda en línea',
      team: {
        id: 2,
        nombre: 'Team Beta',
        lider: { nombre: 'Roberto Alejandro Silva' }
      },
      start_date: '2024-06-01',
      end_date: '2024-09-15',
      estado: 'Planificación',
      progreso: 10,
      priority: 'Media',
      milestones: [
        { id: 1, name: 'Diseño de Wireframes', completed: true, date: '2024-06-10' },
        { id: 2, name: 'Desarrollo Front-end', completed: false, date: '2024-07-15' },
        { id: 3, name: 'Integración con Pasarela de Pagos', completed: false, date: '2024-08-20' },
        { id: 4, name: 'Lanzamiento', completed: false, date: '2024-09-10' }
      ],
      updates: [
        { date: '2024-06-05', comment: 'Inicio del proyecto', author: 'Roberto S.', progress: 5, status: 'Planificación' },
        { date: '2024-06-12', comment: 'Wireframes completados', author: 'Juan P.', progress: 10, status: 'Planificación' }
      ],
      risks: [
        { description: 'Compatibilidad con sistemas iOS antiguos', severity: 'Alta', mitigation: 'Limitar soporte a versiones recientes' }
      ]
    },
    {
      id: 3,
      nombre: 'Portal de Clientes',
      descripcion: 'Portal web para clientes corporativos',
      team: {
        id: 3,
        nombre: 'Team Gamma',
        lider: { nombre: 'María Fernanda González' }
      },
      start_date: '2024-04-10',
      end_date: '2024-06-30',
      estado: 'Retrasado',
      progreso: 65,
      priority: 'Alta',
      milestones: [
        { id: 1, name: 'Diseño UX/UI', completed: true, date: '2024-04-25' },
        { id: 2, name: 'Desarrollo Frontend', completed: true, date: '2024-05-20' },
        { id: 3, name: 'Integración con CRM', completed: false, date: '2024-06-10' },
        { id: 4, name: 'Pruebas de Seguridad', completed: false, date: '2024-06-25' }
      ],
      updates: [
        { date: '2024-04-15', comment: 'Inicio del proyecto', author: 'María F.', progress: 10, status: 'En Progreso' },
        { date: '2024-04-28', comment: 'Diseño completado', author: 'Ana R.', progress: 25, status: 'En Progreso' },
        { date: '2024-05-22', comment: 'Frontend completo', author: 'Carlos M.', progress: 50, status: 'En Progreso' },
        { date: '2024-06-05', comment: 'Problemas con integración CRM', author: 'María F.', progress: 65, status: 'Retrasado' }
      ],
      risks: [
        { description: 'Problemas de compatibilidad con CRM legacy', severity: 'Alta', mitigation: 'Desarrollar adaptadores de integración' },
        { description: 'Vulnerabilidades de seguridad en login', severity: 'Alta', mitigation: 'Implementar autenticación de dos factores' }
      ]
    }
  ];

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      // Intentar cargar desde API
      const data = await managementService.getTracking();
      setProjects(data);
    } catch (error) {
      console.log('Error al cargar seguimiento desde API, usando datos mock:', error);
      // Fallback a datos mock
      setProjects(mockProjects);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleOpenUpdateDialog = (project) => {
    setSelectedProject(project);
    setUpdateData({
      progress: project.progreso.toString(),
      status: project.estado,
      comments: ''
    });
    setOpenUpdateDialog(true);
  };

  const handleUpdateProject = async () => {
    try {
      const updatedProject = {
        ...selectedProject,
        progreso: parseInt(updateData.progress),
        estado: updateData.status,
        updates: [
          {
            date: new Date().toISOString().split('T')[0],
            comment: updateData.comments,
            author: 'Usuario Actual',
            progress: parseInt(updateData.progress),
            status: updateData.status
          },
          ...selectedProject.updates
        ]
      };
      
      // Actualizar el proyecto en el estado
      setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
      setOpenUpdateDialog(false);
    } catch (error) {
      console.error('Error al actualizar proyecto:', error);
      setError('Error al actualizar el proyecto');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      'Completado': '#4caf50',
      'En Progreso': '#2196f3',
      'Planificación': '#ff9800',
      'Retrasado': '#f44336',
      'Pausado': '#9e9e9e'
    };
    return colors[status] || '#9e9e9e';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completado':
        return <CheckCircle fontSize="small" sx={{ color: getStatusColor(status) }} />;
      case 'En Progreso':
        return <Timeline fontSize="small" sx={{ color: getStatusColor(status) }} />;
      case 'Planificación':
        return <Schedule fontSize="small" sx={{ color: getStatusColor(status) }} />;
      case 'Retrasado':
        return <Warning fontSize="small" sx={{ color: getStatusColor(status) }} />;
      case 'Pausado':
        return <AccessTime fontSize="small" sx={{ color: getStatusColor(status) }} />;
      default:
        return <Flag fontSize="small" sx={{ color: getStatusColor(status) }} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  const getFilteredProjects = () => {
    if (filter === 'todos') {
      return projects;
    }
    return projects.filter(project => project.estado === filter);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Alta': '#f44336',
      'Media': '#ff9800',
      'Baja': '#4caf50'
    };
    return colors[priority] || '#9e9e9e';
  };

  const filteredProjects = getFilteredProjects();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Timeline /> Seguimiento de Proyectos
          </Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filtrar por Estado</InputLabel>
            <Select
              value={filter}
              onChange={handleFilterChange}
              label="Filtrar por Estado"
            >
              <MenuItem value="todos">Todos los Proyectos</MenuItem>
              <MenuItem value="En Progreso">En Progreso</MenuItem>
              <MenuItem value="Planificación">En Planificación</MenuItem>
              <MenuItem value="Retrasado">Retrasados</MenuItem>
              <MenuItem value="Completado">Completados</MenuItem>
              <MenuItem value="Pausado">Pausados</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Lista de Proyectos en Seguimiento */}
        <Grid container spacing={3}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} md={6} key={project.id}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">
                      {project.nombre}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        icon={getStatusIcon(project.estado)}
                        label={project.estado}
                        sx={{ 
                          bgcolor: getStatusColor(project.estado),
                          color: 'white'
                        }}
                      />
                      <Tooltip title="Actualizar estado">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenUpdateDialog(project)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {project.descripcion}
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        Progreso: {project.progreso}%
                      </Typography>
                      <Chip
                        label={`Prioridad: ${project.priority}`}
                        size="small"
                        sx={{
                          bgcolor: getPriorityColor(project.priority),
                          color: 'white'
                        }}
                      />
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={project.progreso} 
                      sx={{ 
                        height: 10, 
                        borderRadius: 1
                      }}
                    />
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          Inicio: {formatDate(project.start_date)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          Fin: {formatDate(project.end_date)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" gutterBottom>
                    Equipo: {project.team.nombre}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Líder: {project.team.lider.nombre}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" gutterBottom>
                    Hitos Clave
                  </Typography>
                  <Box sx={{ maxHeight: 150, overflow: 'auto', mb: 2 }}>
                    <List dense disablePadding>
                      {project.milestones.map((milestone) => (
                        <ListItem key={milestone.id} disablePadding sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            {milestone.completed ? (
                              <CheckCircle fontSize="small" color="success" />
                            ) : (
                              <Schedule fontSize="small" color="primary" />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={milestone.name}
                            secondary={formatDate(milestone.date)}
                            primaryTypographyProps={{ variant: 'body2' }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" gutterBottom>
                    Últimas Actualizaciones
                  </Typography>
                  <Box sx={{ maxHeight: 150, overflow: 'auto' }}>
                    <List dense disablePadding>
                      {project.updates.slice(0, 3).map((update, index) => (
                        <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Comment fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={update.comment}
                            secondary={
                              <>
                                {formatDate(update.date)} • {update.author} • {update.progress}%
                              </>
                            }
                            primaryTypographyProps={{ variant: 'body2' }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  {project.risks && project.risks.length > 0 && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" color="error" gutterBottom>
                        Riesgos Identificados: {project.risks.length}
                      </Typography>
                    </>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<Edit />}
                      size="small"
                      onClick={() => handleOpenUpdateDialog(project)}
                    >
                      Actualizar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredProjects.length === 0 && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary">
              No hay proyectos que coincidan con el filtro seleccionado
            </Typography>
          </Paper>
        )}
      </Paper>

      {/* Diálogo de Actualización de Proyecto */}
      <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Actualizar Estado del Proyecto
        </DialogTitle>
        <DialogContent dividers>
          {selectedProject && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Proyecto: {selectedProject.nombre}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Progreso (%)"
                  name="progress"
                  type="number"
                  value={updateData.progress}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    name="status"
                    value={updateData.status}
                    onChange={handleInputChange}
                    label="Estado"
                  >
                    <MenuItem value="Planificación">Planificación</MenuItem>
                    <MenuItem value="En Progreso">En Progreso</MenuItem>
                    <MenuItem value="Retrasado">Retrasado</MenuItem>
                    <MenuItem value="Pausado">Pausado</MenuItem>
                    <MenuItem value="Completado">Completado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Comentarios de Actualización"
                  name="comments"
                  value={updateData.comments}
                  onChange={handleInputChange}
                  placeholder="Detalle la situación actual del proyecto..."
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateDialog(false)} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleUpdateProject} 
            variant="contained"
            color="primary"
            startIcon={<CheckCircle />}
          >
            Guardar Actualización
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProjectTracking;