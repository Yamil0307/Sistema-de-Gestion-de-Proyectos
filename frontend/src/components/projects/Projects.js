import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Dialog,
  Alert,
  CircularProgress,
  Fab
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Assignment,
  CalendarToday,
  Group,
  TrendingUp
} from '@mui/icons-material';
import { projectService } from '../../services/projectService';
import ProjectForm from './ProjectForm';
import ProjectDetails from './ProjectDetails';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create' o 'edit'

  // Datos mock para desarrollo
  const mockProjects = [
    {
      id: 1,
      nombre: 'Sistema de Inventario',
      descripcion: 'Sistema web para gestión de inventarios con React y Node.js',
      estado: 'En Progreso',
      fecha_inicio: '2024-01-15',
      fecha_fin: '2024-06-30',
      presupuesto: 50000,
      cliente: 'Empresa ABC',
      tecnologias: ['React', 'Node.js', 'MongoDB']
    },
    {
      id: 2,
      nombre: 'App Móvil E-commerce',
      descripcion: 'Aplicación móvil para ventas online con React Native',
      estado: 'Planificación',
      fecha_inicio: '2024-02-01',
      fecha_fin: '2024-08-15',
      presupuesto: 75000,
      cliente: 'TechStore',
      tecnologias: ['React Native', 'Firebase', 'Stripe']
    },
    {
      id: 3,
      nombre: 'Dashboard Analítico',
      descripcion: 'Dashboard para análisis de datos con visualizaciones interactivas',
      estado: 'Completado',
      fecha_inicio: '2023-10-01',
      fecha_fin: '2024-01-30',
      presupuesto: 30000,
      cliente: 'DataCorp',
      tecnologias: ['React', 'D3.js', 'Python']
    }
  ];

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      // Intentar cargar desde API
      const data = await projectService.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.log('Error al cargar proyectos desde API, usando datos mock:', error);
      // Fallback a datos mock
      setProjects(mockProjects);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = () => {
    setSelectedProject(null);
    setFormMode('create');
    setOpenForm(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setFormMode('edit');
    setOpenForm(true);
  };

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setOpenDetails(true);
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este proyecto?')) {
      try {
        await projectService.deleteProject(projectId);
        setProjects(projects.filter(p => p.id !== projectId));
      } catch (error) {
        console.error('Error al eliminar proyecto:', error);
        setError('Error al eliminar el proyecto');
      }
    }
  };

  const handleFormSubmit = async (projectData) => {
    try {
      if (formMode === 'create') {
        const newProject = await projectService.createProject(projectData);
        setProjects([...projects, newProject]);
      } else {
        const updatedProject = await projectService.updateProject(selectedProject.id, projectData);
        setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
      }
      setOpenForm(false);
    } catch (error) {
      console.error('Error al guardar proyecto:', error);
      setError('Error al guardar el proyecto');
    }
  };

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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Gestión de Proyectos
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Administra todos los proyectos de software de la empresa
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateProject}
            size="large"
          >
            Nuevo Proyecto
          </Button>
        </Box>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Estadísticas rápidas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', bgcolor: '#e3f2fd' }}>
            <CardContent>
              <Assignment sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
              <Typography variant="h4" color="#1976d2">
                {projects.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Proyectos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', bgcolor: '#e8f5e8' }}>
            <CardContent>
              <TrendingUp sx={{ fontSize: 40, color: '#2e7d32', mb: 1 }} />
              <Typography variant="h4" color="#2e7d32">
                {projects.filter(p => p.estado === 'En Progreso').length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                En Progreso
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', bgcolor: '#fff3e0' }}>
            <CardContent>
              <CalendarToday sx={{ fontSize: 40, color: '#f57c00', mb: 1 }} />
              <Typography variant="h4" color="#f57c00">
                {projects.filter(p => p.estado === 'Planificación').length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Planificación
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', bgcolor: '#e8f5e8' }}>
            <CardContent>
              <Group sx={{ fontSize: 40, color: '#388e3c', mb: 1 }} />
              <Typography variant="h4" color="#388e3c">
                {projects.filter(p => p.estado === 'Completado').length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Completados
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de Proyectos */}
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {project.nombre}
                  </Typography>
                  <Chip
                    label={project.estado}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(project.estado),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2, minHeight: 40 }}>
                  {project.descripcion}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Cliente:</strong> {project.cliente}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Presupuesto:</strong> {formatCurrency(project.presupuesto)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Inicio:</strong> {new Date(project.fecha_inicio).toLocaleDateString('es-AR')}
                  </Typography>
                </Box>

                {project.tecnologias && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {project.tecnologias.slice(0, 3).map((tech, index) => (
                      <Chip
                        key={index}
                        label={tech}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                    {project.tecnologias.length > 3 && (
                      <Chip
                        label={`+${project.tecnologias.length - 3}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                )}
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Box>
                  <IconButton
                    onClick={() => handleViewProject(project)}
                    color="primary"
                    title="Ver detalles"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    onClick={() => handleEditProject(project)}
                    color="primary"
                    title="Editar"
                  >
                    <Edit />
                  </IconButton>
                </Box>
                <IconButton
                  onClick={() => handleDeleteProject(project.id)}
                  color="error"
                  title="Eliminar"
                >
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Mensaje si no hay proyectos */}
      {projects.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
          <Assignment sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No hay proyectos registrados
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Comienza creando tu primer proyecto
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleCreateProject}>
            Crear Primer Proyecto
          </Button>
        </Paper>
      )}

      {/* FAB para crear proyecto */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={handleCreateProject}
      >
        <Add />
      </Fab>

      {/* Dialogs */}
      <ProjectForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        project={selectedProject}
        mode={formMode}
      />

      <ProjectDetails
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        project={selectedProject}
      />
    </Container>
  );
};

export default Projects;