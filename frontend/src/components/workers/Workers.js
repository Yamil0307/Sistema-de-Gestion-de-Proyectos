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
  Avatar,
  Dialog,
  Alert,
  CircularProgress,
  Fab,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  People,
  Code,
  Groups,
  Star,
  Email,
  Phone,
  Work
} from '@mui/icons-material';
import { workerService } from '../../services/workerService';
import WorkerForm from './WorkerForm';
import WorkerDetails from './WorkerDetails';

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [currentTab, setCurrentTab] = useState(0);

  // Datos mock para desarrollo
  const mockWorkers = [
    {
      id: 1,
      nombre: 'Juan Carlos Pérez',
      email: 'juan.perez@empresa.com',
      telefono: '+54 11 1234-5678',
      tipo: 'Programador',
      tecnologias: ['React', 'Node.js', 'Python', 'MongoDB'],
      experiencia: 5,
      nivel: 'Senior',
      salario: 120000,
      fecha_ingreso: '2019-03-15',
      estado: 'Activo',
      proyectos_completados: 12,
      calificacion: 4.8
    },
    {
      id: 2,
      nombre: 'María Fernanda González',
      email: 'maria.gonzalez@empresa.com',
      telefono: '+54 11 2345-6789',
      tipo: 'Líder',
      tecnologias: ['Java', 'Spring', 'Angular', 'PostgreSQL'],
      experiencia: 8,
      nivel: 'Senior',
      salario: 180000,
      fecha_ingreso: '2016-07-20',
      estado: 'Activo',
      proyectos_completados: 25,
      calificacion: 4.9,
      equipos_liderados: 3
    },
    {
      id: 3,
      nombre: 'Carlos Eduardo Martínez',
      email: 'carlos.martinez@empresa.com',
      telefono: '+54 11 3456-7890',
      tipo: 'Programador',
      tecnologias: ['Vue.js', 'PHP', 'Laravel', 'MySQL'],
      experiencia: 3,
      nivel: 'Mid',
      salario: 90000,
      fecha_ingreso: '2021-01-10',
      estado: 'Activo',
      proyectos_completados: 8,
      calificacion: 4.5
    },
    {
      id: 4,
      nombre: 'Ana Sofía Rodríguez',
      email: 'ana.rodriguez@empresa.com',
      telefono: '+54 11 4567-8901',
      tipo: 'Programador',
      tecnologias: ['React Native', 'Flutter', 'Firebase', 'Dart'],
      experiencia: 2,
      nivel: 'Junior',
      salario: 70000,
      fecha_ingreso: '2022-09-05',
      estado: 'Activo',
      proyectos_completados: 4,
      calificacion: 4.3
    },
    {
      id: 5,
      nombre: 'Roberto Alejandro Silva',
      email: 'roberto.silva@empresa.com',
      telefono: '+54 11 5678-9012',
      tipo: 'Líder',
      tecnologias: ['C#', '.NET', 'Azure', 'SQL Server'],
      experiencia: 10,
      nivel: 'Senior',
      salario: 200000,
      fecha_ingreso: '2014-02-12',
      estado: 'Activo',
      proyectos_completados: 35,
      calificacion: 4.9,
      equipos_liderados: 5
    }
  ];

  useEffect(() => {
    loadWorkers();
  }, []);

  useEffect(() => {
    filterWorkers();
  }, [workers, currentTab]);

  const loadWorkers = async () => {
    try {
      setLoading(true);
      // Intentar cargar desde API
      const data = await workerService.getAllWorkers();
      setWorkers(data);
    } catch (error) {
      console.log('Error al cargar trabajadores desde API, usando datos mock:', error);
      // Fallback a datos mock
      setWorkers(mockWorkers);
    } finally {
      setLoading(false);
    }
  };

  const filterWorkers = () => {
    switch (currentTab) {
      case 0: // Todos
        setFilteredWorkers(workers);
        break;
      case 1: // Programadores
        setFilteredWorkers(workers.filter(w => w.tipo === 'Programador'));
        break;
      case 2: // Líderes
        setFilteredWorkers(workers.filter(w => w.tipo === 'Líder'));
        break;
      default:
        setFilteredWorkers(workers);
    }
  };

  const handleCreateWorker = () => {
    setSelectedWorker(null);
    setFormMode('create');
    setOpenForm(true);
  };

  const handleEditWorker = (worker) => {
    setSelectedWorker(worker);
    setFormMode('edit');
    setOpenForm(true);
  };

  const handleViewWorker = (worker) => {
    setSelectedWorker(worker);
    setOpenDetails(true);
  };

  const handleDeleteWorker = async (workerId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este trabajador?')) {
      try {
        await workerService.deleteWorker(workerId);
        setWorkers(workers.filter(w => w.id !== workerId));
      } catch (error) {
        console.error('Error al eliminar trabajador:', error);
        setError('Error al eliminar el trabajador');
      }
    }
  };

  const handleFormSubmit = async (workerData) => {
    try {
      if (formMode === 'create') {
        const newWorker = {
          ...workerData,
          id: Date.now(), // Mock ID
          fecha_ingreso: new Date().toISOString().split('T')[0],
          proyectos_completados: 0,
          calificacion: 4.0
        };
        setWorkers([...workers, newWorker]);
      } else {
        const updatedWorker = { ...selectedWorker, ...workerData };
        setWorkers(workers.map(w => w.id === selectedWorker.id ? updatedWorker : w));
      }
      setOpenForm(false);
    } catch (error) {
      console.error('Error al guardar trabajador:', error);
      setError('Error al guardar el trabajador');
    }
  };

  const getLevelColor = (level) => {
    const colors = {
      'Junior': '#ff9800',
      'Mid': '#2196f3',
      'Senior': '#4caf50'
    };
    return colors[level] || '#9e9e9e';
  };

  const getTypeIcon = (type) => {
    return type === 'Líder' ? <Groups /> : <Code />;
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
              Gestión de Trabajadores
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Administra programadores y líderes de equipo
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateWorker}
            size="large"
          >
            Nuevo Trabajador
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
              <People sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
              <Typography variant="h4" color="#1976d2">
                {workers.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Trabajadores
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', bgcolor: '#e8f5e8' }}>
            <CardContent>
              <Code sx={{ fontSize: 40, color: '#2e7d32', mb: 1 }} />
              <Typography variant="h4" color="#2e7d32">
                {workers.filter(w => w.tipo === 'Programador').length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Programadores
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', bgcolor: '#fff3e0' }}>
            <CardContent>
              <Groups sx={{ fontSize: 40, color: '#f57c00', mb: 1 }} />
              <Typography variant="h4" color="#f57c00">
                {workers.filter(w => w.tipo === 'Líder').length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Líderes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', bgcolor: '#fce4ec' }}>
            <CardContent>
              <Star sx={{ fontSize: 40, color: '#c2185b', mb: 1 }} />
              <Typography variant="h4" color="#c2185b">
                {workers.length > 0 ? (workers.reduce((acc, w) => acc + w.calificacion, 0) / workers.length).toFixed(1) : '0'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Calificación Promedio
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs para filtrar */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs 
          value={currentTab} 
          onChange={(e, newValue) => setCurrentTab(newValue)}
          variant="fullWidth"
        >
          <Tab label={`Todos (${workers.length})`} />
          <Tab label={`Programadores (${workers.filter(w => w.tipo === 'Programador').length})`} />
          <Tab label={`Líderes (${workers.filter(w => w.tipo === 'Líder').length})`} />
        </Tabs>
      </Paper>

      {/* Lista de Trabajadores */}
      <Grid container spacing={3}>
        {filteredWorkers.map((worker) => (
          <Grid item xs={12} md={6} lg={4} key={worker.id}>
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
                {/* Header con avatar y tipo */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: worker.tipo === 'Líder' ? '#f57c00' : '#1976d2',
                      mr: 2 
                    }}
                  >
                    {getTypeIcon(worker.tipo)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {worker.nombre}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={worker.tipo}
                        size="small"
                        color={worker.tipo === 'Líder' ? 'warning' : 'primary'}
                      />
                      <Chip
                        label={worker.nivel}
                        size="small"
                        sx={{
                          backgroundColor: getLevelColor(worker.nivel),
                          color: 'white'
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Información de contacto */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="textSecondary">
                      {worker.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Phone sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="textSecondary">
                      {worker.telefono}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Work sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="textSecondary">
                      {worker.experiencia} años de experiencia
                    </Typography>
                  </Box>
                </Box>

                {/* Tecnologías */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Tecnologías:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {worker.tecnologias.slice(0, 3).map((tech, index) => (
                      <Chip
                        key={index}
                        label={tech}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                    {worker.tecnologias.length > 3 && (
                      <Chip
                        label={`+${worker.tecnologias.length - 3}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>

                {/* Estadísticas */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="primary">
                      {worker.proyectos_completados}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Proyectos
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Star sx={{ color: '#ffd700', fontSize: 20, mr: 0.5 }} />
                      <Typography variant="h6" color="primary">
                        {worker.calificacion}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="textSecondary">
                      Rating
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="primary">
                      {formatCurrency(worker.salario)}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Salario
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Box>
                  <IconButton
                    onClick={() => handleViewWorker(worker)}
                    color="primary"
                    title="Ver detalles"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    onClick={() => handleEditWorker(worker)}
                    color="primary"
                    title="Editar"
                  >
                    <Edit />
                  </IconButton>
                </Box>
                <IconButton
                  onClick={() => handleDeleteWorker(worker.id)}
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

      {/* Mensaje si no hay trabajadores */}
      {filteredWorkers.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
          <People sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No hay trabajadores registrados
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Comienza agregando tu primer trabajador
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleCreateWorker}>
            Agregar Primer Trabajador
          </Button>
        </Paper>
      )}

      {/* FAB para crear trabajador */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={handleCreateWorker}
      >
        <Add />
      </Fab>

      {/* Dialogs */}
      <WorkerForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        worker={selectedWorker}
        mode={formMode}
      />

      <WorkerDetails
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        worker={selectedWorker}
      />
    </Container>
  );
};

export default Workers;