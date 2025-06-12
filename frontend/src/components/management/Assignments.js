import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Button,
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
  IconButton,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Check,
  Close,
  Assignment,
  Person,
  Group
} from '@mui/icons-material';
import { managementService } from '../../services/managementService';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [formData, setFormData] = useState({
    project_id: '',
    team_id: '',
    start_date: '',
    end_date: '',
    priority: 'Media',
    notes: ''
  });

  // Datos mock
  const mockAssignments = [
    {
      id: 1,
      project: {
        id: 1,
        nombre: 'Sistema de Inventario',
        descripcion: 'Sistema para gestión de inventario de productos',
        estado: 'En Progreso'
      },
      team: {
        id: 1,
        nombre: 'Team Alpha',
        lider: { nombre: 'María Fernanda González' },
        miembros: [
          { nombre: 'Juan Carlos Pérez' },
          { nombre: 'Carlos Eduardo Martínez' },
          { nombre: 'Ana Sofía Rodríguez' }
        ]
      },
      start_date: '2024-05-15',
      end_date: '2024-07-30',
      priority: 'Alta',
      status: 'Activo',
      completion: 45,
      notes: 'Priorizar el módulo de reportes'
    },
    {
      id: 2,
      project: {
        id: 2,
        nombre: 'App Móvil E-commerce',
        descripcion: 'Aplicación móvil para tienda en línea',
        estado: 'Planificación'
      },
      team: {
        id: 2,
        nombre: 'Team Beta',
        lider: { nombre: 'Roberto Alejandro Silva' },
        miembros: [
          { nombre: 'Juan Carlos Pérez' },
          { nombre: 'Carlos Eduardo Martínez' }
        ]
      },
      start_date: '2024-06-01',
      end_date: '2024-09-15',
      priority: 'Media',
      status: 'Planificación',
      completion: 10,
      notes: 'Reunión inicial programada para el 01/06'
    }
  ];

  // Mock data de proyectos y equipos disponibles
  const availableProjects = [
    { id: 1, nombre: 'Sistema de Inventario', estado: 'En Progreso' },
    { id: 2, nombre: 'App Móvil E-commerce', estado: 'Planificación' },
    { id: 3, nombre: 'Sistema de Facturación', estado: 'Pendiente' },
    { id: 4, nombre: 'Portal de Clientes', estado: 'Pendiente' }
  ];

  const availableTeams = [
    { id: 1, nombre: 'Team Alpha', estado: 'Activo', miembros_count: 4 },
    { id: 2, nombre: 'Team Beta', estado: 'Activo', miembros_count: 3 },
    { id: 3, nombre: 'Team Gamma', estado: 'Disponible', miembros_count: 2 }
  ];

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      // Intentar cargar desde API
      const data = await managementService.getAssignments();
      setAssignments(data);
    } catch (error) {
      console.log('Error al cargar asignaciones desde API, usando datos mock:', error);
      // Fallback a datos mock
      setAssignments(mockAssignments);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = () => {
    setSelectedAssignment(null);
    setFormData({
      project_id: '',
      team_id: '',
      start_date: '',
      end_date: '',
      priority: 'Media',
      notes: ''
    });
    setFormMode('create');
    setOpenForm(true);
  };

  const handleEditAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setFormData({
      project_id: assignment.project.id,
      team_id: assignment.team.id,
      start_date: assignment.start_date,
      end_date: assignment.end_date,
      priority: assignment.priority,
      notes: assignment.notes
    });
    setFormMode('edit');
    setOpenForm(true);
  };

  const handleDeleteAssignment = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta asignación?')) {
      try {
        await managementService.deleteAssignment(id);
        setAssignments(assignments.filter(a => a.id !== id));
      } catch (error) {
        console.error('Error al eliminar asignación:', error);
        setError('Error al eliminar la asignación');
      }
    }
  };

  const handleFormSubmit = async () => {
    try {
      if (formMode === 'create') {
        // Simulamos la creación
        const selectedProject = availableProjects.find(p => p.id === formData.project_id);
        const selectedTeam = availableTeams.find(t => t.id === formData.team_id);
        
        const newAssignment = {
          id: Date.now(),
          project: selectedProject,
          team: selectedTeam,
          start_date: formData.start_date,
          end_date: formData.end_date,
          priority: formData.priority,
          status: 'Planificación',
          completion: 0,
          notes: formData.notes
        };
        setAssignments([...assignments, newAssignment]);
      } else {
        // Simulamos la actualización
        const updatedAssignment = {
          ...selectedAssignment,
          project: availableProjects.find(p => p.id === formData.project_id),
          team: availableTeams.find(t => t.id === formData.team_id),
          start_date: formData.start_date,
          end_date: formData.end_date,
          priority: formData.priority,
          notes: formData.notes
        };
        setAssignments(assignments.map(a => a.id === selectedAssignment.id ? updatedAssignment : a));
      }
      setOpenForm(false);
    } catch (error) {
      console.error('Error al guardar asignación:', error);
      setError('Error al guardar la asignación');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Alta': '#f44336',
      'Media': '#ff9800',
      'Baja': '#4caf50'
    };
    return colors[priority] || '#9e9e9e';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Activo': '#4caf50',
      'Completado': '#2196f3',
      'Planificación': '#ff9800',
      'Detenido': '#f44336'
    };
    return colors[status] || '#9e9e9e';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

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
            <Assignment /> Asignaciones
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateAssignment}
          >
            Nueva Asignación
          </Button>
        </Box>
        
        <Divider sx={{ mb: 3 }} />

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Vista Tarjetas */}
        <Grid container spacing={3}>
          {assignments.map((assignment) => (
            <Grid item xs={12} md={6} key={assignment.id}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">
                        {assignment.project.nombre}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={assignment.priority}
                          size="small"
                          sx={{
                            bgcolor: getPriorityColor(assignment.priority),
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                        <Chip
                          label={assignment.status}
                          size="small"
                          sx={{
                            bgcolor: getStatusColor(assignment.status),
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                    </Box>
                  }
                  subheader={assignment.project.descripcion}
                />

                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Group fontSize="small" /> Equipo Asignado
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                      {assignment.team.nombre}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Líder: {assignment.team.lider.nombre}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Miembros: {assignment.team.miembros.length}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Fecha Inicio
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(assignment.start_date)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Fecha Fin
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(assignment.end_date)}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Progreso: {assignment.completion}%
                    </Typography>
                    <Box sx={{ 
                      width: '100%', 
                      height: 8, 
                      bgcolor: 'rgba(0, 0, 0, 0.1)', 
                      borderRadius: 5,
                      overflow: 'hidden' 
                    }}>
                      <Box sx={{ 
                        width: `${assignment.completion}%`, 
                        height: '100%', 
                        bgcolor: 'primary.main', 
                        borderRadius: 5 
                      }} />
                    </Box>
                  </Box>

                  {assignment.notes && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Notas:
                      </Typography>
                      <Typography variant="body2">
                        {assignment.notes}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Tooltip title="Editar">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEditAssignment(assignment)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteAssignment(assignment.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {assignments.length === 0 && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary">
              No hay asignaciones registradas
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={handleCreateAssignment}
              sx={{ mt: 2 }}
            >
              Crear Nueva Asignación
            </Button>
          </Paper>
        )}
      </Paper>

      {/* Formulario de Asignación */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {formMode === 'create' ? 'Crear Nueva Asignación' : 'Editar Asignación'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Proyecto</InputLabel>
                <Select
                  name="project_id"
                  value={formData.project_id}
                  onChange={handleInputChange}
                  label="Proyecto"
                >
                  {availableProjects.map(project => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.nombre} ({project.estado})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Equipo</InputLabel>
                <Select
                  name="team_id"
                  value={formData.team_id}
                  onChange={handleInputChange}
                  label="Equipo"
                >
                  {availableTeams.map(team => (
                    <MenuItem key={team.id} value={team.id}>
                      {team.nombre} ({team.miembros_count} miembros)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Fecha Inicio"
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Fecha Fin"
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Prioridad</InputLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  label="Prioridad"
                >
                  <MenuItem value="Alta">Alta</MenuItem>
                  <MenuItem value="Media">Media</MenuItem>
                  <MenuItem value="Baja">Baja</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notas"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleFormSubmit} 
            variant="contained"
            startIcon={formMode === 'create' ? <Add /> : <Check />}
          >
            {formMode === 'create' ? 'Crear' : 'Actualizar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Assignments;