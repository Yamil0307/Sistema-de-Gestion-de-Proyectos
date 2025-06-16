import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Box, Grid, Card, CardContent, CardActions,
  IconButton, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, InputLabel, Select, MenuItem, Alert, CircularProgress, Paper, Divider, Chip, Tooltip
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Info as InfoIcon, Assignment as AssignmentIcon
} from '@mui/icons-material';
import { projectService } from '../../services/projectService';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin_estimada: '',
    estado: 'Planificación'
  });

  const projectStates = [
    'Planificación', 'En Progreso', 'Pausado', 'Completado', 'Cancelado'
  ];

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await projectService.getAll();
      setProjects(data);
    } catch (error) {
      setError(error.userMessage || 'Error al cargar los proyectos');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenDialog = (project = null) => {
    if (project) {
      setCurrentProject(project);
      setFormData({
        nombre: project.nombre || '',
        descripcion: project.descripcion || '',
        fecha_inicio: project.fecha_inicio ? project.fecha_inicio.substr(0, 10) : '',
        fecha_fin_estimada: project.fecha_fin_estimada ? project.fecha_fin_estimada.substr(0, 10) : '',
        estado: project.estado || 'Planificación'
      });
    } else {
      setCurrentProject(null);
      setFormData({
        nombre: '',
        descripcion: '',
        fecha_inicio: '',
        fecha_fin_estimada: '',
        estado: 'Planificación'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentProject(null);
  };

  const handleSaveProject = async () => {
    try {
      setLoading(true);
      setError('');
      if (currentProject) {
        await projectService.update(currentProject.id, formData);
      } else {
        await projectService.create(formData);
      }
      await loadProjects();
      handleCloseDialog();
    } catch (error) {
      setError(error.userMessage || 'Error al guardar el proyecto');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = (project) => {
    setCurrentProject(project);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCurrentProject(null);
  };

  const handleDeleteProject = async () => {
    try {
      setLoading(true);
      setError('');
      await projectService.delete(currentProject.id);
      await loadProjects();
      handleCloseDeleteDialog();
    } catch (error) {
      setError(error.userMessage || 'Error al eliminar el proyecto');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Planificación': '#ff9800',
      'En Progreso': '#2196f3',
      'Pausado': '#9e9e9e',
      'Completado': '#4caf50',
      'Cancelado': '#f44336'
    };
    return colors[status] || '#9e9e9e';
  };

  if (loading && projects.length === 0) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <AssignmentIcon sx={{ mr: 1 }} /> Proyectos
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nuevo Proyecto
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {projects.length === 0 && !loading ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              No hay proyectos disponibles
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ mt: 1 }}
            >
              Crear Primer Proyecto
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item key={project.id} xs={12} md={6} lg={4}>
                <Card 
                  elevation={2}
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <Box sx={{ 
                    bgcolor: getStatusColor(project.estado),
                    p: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Chip 
                      label={project.estado} 
                      color="default"
                      sx={{ 
                        bgcolor: 'white',
                        fontWeight: 'medium',
                        color: getStatusColor(project.estado)
                      }} 
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {project.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                      {project.descripcion && project.descripcion.length > 100 
                        ? `${project.descripcion.substring(0, 100)}...` 
                        : project.descripcion}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Fecha Inicio:
                        </Typography>
                        <Typography variant="body2">
                          {project.fecha_inicio 
                            ? new Date(project.fecha_inicio).toLocaleDateString() 
                            : 'No definida'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Fecha Est. Fin:
                        </Typography>
                        <Typography variant="body2">
                          {project.fecha_fin_estimada 
                            ? new Date(project.fecha_fin_estimada).toLocaleDateString() 
                            : 'No definida'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                    <Tooltip title="Ver detalles">
                      <IconButton color="primary" aria-label="ver detalles">
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton 
                        color="primary" 
                        aria-label="editar proyecto"
                        onClick={() => handleOpenDialog(project)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton 
                        color="error" 
                        aria-label="eliminar proyecto"
                        onClick={() => handleOpenDeleteDialog(project)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Diálogo de creación/edición de proyecto */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="nombre"
            label="Nombre del Proyecto"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="descripcion"
            label="Descripción"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formData.descripcion}
            onChange={handleChange}
          />
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="fecha_inicio"
                label="Fecha de Inicio"
                type="date"
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.fecha_inicio}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="fecha_fin_estimada"
                label="Fecha estimada de finalización"
                type="date"
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.fecha_fin_estimada}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <FormControl fullWidth margin="dense">
            <InputLabel id="estado-label">Estado</InputLabel>
            <Select
              labelId="estado-label"
              name="estado"
              value={formData.estado}
              label="Estado"
              onChange={handleChange}
            >
              {projectStates.map((state) => (
                <MenuItem key={state} value={state}>{state}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSaveProject} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Eliminar Proyecto</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de que desea eliminar el proyecto "{currentProject?.nombre}"? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleDeleteProject} color="error" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Projects;