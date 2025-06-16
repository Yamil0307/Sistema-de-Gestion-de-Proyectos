import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Grid, Tabs, Tab, Button, 
  CircularProgress, Alert, Divider, Card, CardContent, 
  CardActions, List, ListItem, ListItemText, ListItemIcon,
  ListItemSecondaryAction, IconButton, Chip, Tooltip, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
  PriorityHigh as PriorityIcon
} from '@mui/icons-material';
import { managementService } from '../../services/managementService';
import { projectService } from '../../services/projectService';
import { teamService } from '../../services/teamService';
import { workerService } from '../../services/workerService';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`management-tabpanel-${index}`}
      aria-labelledby={`management-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Management = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [workers, setWorkers] = useState([]);
  
  // Estados para diálogo de asignación
  const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [assignmentFormData, setAssignmentFormData] = useState({
    project_id: '',
    team_id: '',
    fecha_asignacion: '',
    fecha_limite: '',
    estado: 'Asignado'
  });
  
  const assignmentStates = ['Asignado', 'En Progreso', 'Completado', 'Cancelado'];

  useEffect(() => {
    // Cargar datos iniciales cuando se monta el componente
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await Promise.all([
      loadAssignments(),
      loadProjects(),
      loadTeams(),
      loadWorkers(),
      loadStatistics()
    ]);
  };

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const data = await managementService.getAllAssignments();
      setAssignments(data);
    } catch (error) {
      setError(error.userMessage || 'Error al cargar las asignaciones');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const data = await managementService.getStatistics();
      setStatistics(data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const loadProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
    }
  };

  const loadTeams = async () => {
    try {
      const data = await teamService.getAll();
      setTeams(data);
    } catch (error) {
      console.error('Error al cargar equipos:', error);
    }
  };

  const loadWorkers = async () => {
    try {
      const data = await workerService.getAll();
      setWorkers(data);
    } catch (error) {
      console.error('Error al cargar trabajadores:', error);
    }
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  // Manejo de formulario de asignación
  const handleOpenAssignmentDialog = (assignment = null) => {
    if (assignment) {
      setCurrentAssignment(assignment);
      setAssignmentFormData({
        project_id: assignment.project_id || '',
        team_id: assignment.team_id || '',
        fecha_asignacion: assignment.fecha_asignacion ? assignment.fecha_asignacion.substr(0, 10) : '',
        fecha_limite: assignment.fecha_limite ? assignment.fecha_limite.substr(0, 10) : '',
        estado: assignment.estado || 'Asignado'
      });
    } else {
      setCurrentAssignment(null);
      setAssignmentFormData({
        project_id: '',
        team_id: '',
        fecha_asignacion: new Date().toISOString().substr(0, 10),
        fecha_limite: '',
        estado: 'Asignado'
      });
    }
    setOpenAssignmentDialog(true);
  };

  const handleCloseAssignmentDialog = () => {
    setOpenAssignmentDialog(false);
    setCurrentAssignment(null);
  };

  const handleAssignmentFormChange = (e) => {
    const { name, value } = e.target;
    setAssignmentFormData({ ...assignmentFormData, [name]: value });
  };

  const handleSaveAssignment = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (currentAssignment) {
        await managementService.updateAssignment(currentAssignment.id, assignmentFormData);
      } else {
        await managementService.createAssignment(assignmentFormData);
      }
      
      await loadAssignments();
      handleCloseAssignmentDialog();
    } catch (error) {
      setError(error.userMessage || 'Error al guardar la asignación');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssignment = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta asignación?')) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await managementService.deleteAssignment(id);
      
      await loadAssignments();
    } catch (error) {
      setError(error.userMessage || 'Error al eliminar la asignación');
    } finally {
      setLoading(false);
    }
  };

  // Obtener nombres para mostrar en lugar de IDs
  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.nombre : 'Proyecto desconocido';
  };

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.nombre : 'Equipo desconocido';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Asignado': '#ff9800',
      'En Progreso': '#2196f3',
      'Completado': '#4caf50',
      'Cancelado': '#f44336'
    };
    return colors[status] || '#9e9e9e';
  };

  if (loading && !assignments.length && !statistics) {
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
            <SettingsIcon sx={{ mr: 1 }} /> Lógica de Negocio
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleChangeTab} aria-label="management tabs">
            <Tab label="Asignaciones" icon={<AssignmentIcon />} iconPosition="start" />
            <Tab label="Seguimiento" icon={<TimelineIcon />} iconPosition="start" />
            <Tab label="Reportes" icon={<AssessmentIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Tab de Asignaciones */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Asignaciones de Proyectos a Equipos</Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => handleOpenAssignmentDialog()}
            >
              Nueva Asignación
            </Button>
          </Box>
          
          {assignments.length === 0 ? (
            <Alert severity="info">
              No hay asignaciones registradas. Cree una nueva asignación para comenzar.
            </Alert>
          ) : (
            <List>
              {assignments.map((assignment) => (
                <Paper 
                  key={assignment.id} 
                  elevation={1} 
                  sx={{ mb: 2, borderLeft: `4px solid ${getStatusColor(assignment.estado)}` }}
                >
                  <ListItem>
                    <ListItemIcon>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle1">
                            {getProjectName(assignment.project_id)}
                          </Typography>
                          <Chip 
                            label={assignment.estado} 
                            size="small"
                            sx={{ 
                              bgcolor: getStatusColor(assignment.estado),
                              color: 'white'
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span">
                            Equipo: {getTeamName(assignment.team_id)}
                          </Typography>
                          <Typography variant="body2" component="div">
                            Asignado: {new Date(assignment.fecha_asignacion).toLocaleDateString()}
                            {assignment.fecha_limite && (
                              <> | Límite: {new Date(assignment.fecha_limite).toLocaleDateString()}</>
                            )}
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="Editar">
                        <IconButton 
                          edge="end" 
                          aria-label="edit"
                          onClick={() => handleOpenAssignmentDialog(assignment)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton 
                          edge="end" 
                          aria-label="delete"
                          onClick={() => handleDeleteAssignment(assignment.id)}
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Paper>
              ))}
            </List>
          )}
        </TabPanel>

        {/* Tab de Seguimiento */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Seguimiento de Proyectos
          </Typography>
          
          {projects.length === 0 ? (
            <Alert severity="info">
              No hay proyectos disponibles para seguimiento.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {projects.map((project) => (
                <Grid item key={project.id} xs={12} md={6}>
                  <Card elevation={2}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {project.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Estado: {project.estado}
                      </Typography>
                      
                      {/* Aquí se podría mostrar el progreso del proyecto */}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          Progreso (simulado):
                        </Typography>
                        <Box sx={{ 
                          width: '100%', 
                          height: 8, 
                          bgcolor: '#e0e0e0', 
                          borderRadius: 5,
                          mt: 1 
                        }}>
                          <Box sx={{ 
                            width: `${Math.floor(Math.random() * 100)}%`, 
                            height: '100%', 
                            bgcolor: 'primary.main',
                            borderRadius: 5 
                          }} />
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="primary">
                        Ver Detalles
                      </Button>
                      <Button size="small" color="primary">
                        Actualizar Estado
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        {/* Tab de Reportes */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Reportes y Estadísticas
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Resumen de Proyectos
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Proyectos Activos" 
                        secondary={projects.filter(p => p.estado === 'En Progreso').length} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Proyectos Pendientes" 
                        secondary={projects.filter(p => p.estado === 'Planificación').length} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Proyectos Completados" 
                        secondary={projects.filter(p => p.estado === 'Completado').length} 
                      />
                    </ListItem>
                  </List>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Ver Reporte Completo
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Equipos
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Total de Equipos" 
                        secondary={teams.length} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Equipos con Asignaciones" 
                        secondary={new Set(assignments.map(a => a.team_id)).size} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Proyectos por Equipo (Promedio)" 
                        secondary={teams.length ? (assignments.length / teams.length).toFixed(1) : 0} 
                      />
                    </ListItem>
                  </List>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Ver Reporte Completo
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Trabajadores
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Total de Trabajadores" 
                        secondary={workers.length} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Líderes" 
                        secondary={workers.filter(w => w.rol === 'Líder').length} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Programadores" 
                        secondary={workers.filter(w => w.rol === 'Programador').length} 
                      />
                    </ListItem>
                  </List>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Ver Reporte Completo
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Diálogo de asignación */}
      <Dialog 
        open={openAssignmentDialog} 
        onClose={handleCloseAssignmentDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentAssignment ? 'Editar Asignación' : 'Nueva Asignación'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="project-select-label">Proyecto</InputLabel>
              <Select
                labelId="project-select-label"
                name="project_id"
                value={assignmentFormData.project_id}
                label="Proyecto"
                onChange={handleAssignmentFormChange}
                required
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="dense">
              <InputLabel id="team-select-label">Equipo</InputLabel>
              <Select
                labelId="team-select-label"
                name="team_id"
                value={assignmentFormData.team_id}
                label="Equipo"
                onChange={handleAssignmentFormChange}
                required
              >
                {teams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              name="fecha_asignacion"
              label="Fecha de Asignación"
              type="date"
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              value={assignmentFormData.fecha_asignacion}
              onChange={handleAssignmentFormChange}
              required
            />

            <TextField
              margin="dense"
              name="fecha_limite"
              label="Fecha Límite"
              type="date"
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              value={assignmentFormData.fecha_limite}
              onChange={handleAssignmentFormChange}
            />

            <FormControl fullWidth margin="dense">
              <InputLabel id="estado-select-label">Estado</InputLabel>
              <Select
                labelId="estado-select-label"
                name="estado"
                value={assignmentFormData.estado}
                label="Estado"
                onChange={handleAssignmentFormChange}
              >
                {assignmentStates.map((estado) => (
                  <MenuItem key={estado} value={estado}>{estado}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignmentDialog} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveAssignment} 
            variant="contained"
            disabled={loading || !assignmentFormData.project_id || !assignmentFormData.team_id}
          >
            {loading ? <CircularProgress size={24} /> : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Management;