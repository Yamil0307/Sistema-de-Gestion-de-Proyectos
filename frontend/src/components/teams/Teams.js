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
  AvatarGroup,
  Dialog,
  Alert,
  CircularProgress,
  Fab,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Group,
  Person,
  Assignment,
  Star,
  Code,
  Groups,
  TrendingUp
} from '@mui/icons-material';
import { teamService } from '../../services/teamService';
import TeamForm from './TeamForm';
import TeamDetails from './TeamDetails';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [formMode, setFormMode] = useState('create');

  // Datos mock para desarrollo
  const mockTeams = [
    {
      id: 1,
      nombre: 'Team Alpha',
      descripcion: 'Equipo especializado en desarrollo frontend con React y tecnologías modernas',
      lider: {
        id: 2,
        nombre: 'María Fernanda González',
        avatar: 'MG'
      },
      miembros: [
        { id: 1, nombre: 'Juan Carlos Pérez', avatar: 'JP', tipo: 'Programador' },
        { id: 3, nombre: 'Carlos Eduardo Martínez', avatar: 'CM', tipo: 'Programador' },
        { id: 4, nombre: 'Ana Sofía Rodríguez', avatar: 'AR', tipo: 'Programador' }
      ],
      proyecto_actual: {
        id: 1,
        nombre: 'Sistema de Inventario',
        estado: 'En Progreso'
      },
      tecnologias: ['React', 'Node.js', 'MongoDB', 'Material-UI'],
      fecha_creacion: '2024-01-15',
      estado: 'Activo',
      productividad: 92,
      proyectos_completados: 5
    },
    {
      id: 2,
      nombre: 'Team Beta',
      descripcion: 'Equipo enfocado en desarrollo backend y arquitectura de sistemas',
      lider: {
        id: 5,
        nombre: 'Roberto Alejandro Silva',
        avatar: 'RS'
      },
      miembros: [
        { id: 1, nombre: 'Juan Carlos Pérez', avatar: 'JP', tipo: 'Programador' },
        { id: 3, nombre: 'Carlos Eduardo Martínez', avatar: 'CM', tipo: 'Programador' }
      ],
      proyecto_actual: {
        id: 2,
        nombre: 'App Móvil E-commerce',
        estado: 'Planificación'
      },
      tecnologias: ['C#', '.NET', 'Azure', 'SQL Server'],
      fecha_creacion: '2024-02-01',
      estado: 'Activo',
      productividad: 88,
      proyectos_completados: 3
    },
    {
      id: 3,
      nombre: 'Team Gamma',
      descripcion: 'Equipo multidisciplinario para proyectos de análisis de datos',
      lider: {
        id: 2,
        nombre: 'María Fernanda González',
        avatar: 'MG'
      },
      miembros: [
        { id: 4, nombre: 'Ana Sofía Rodríguez', avatar: 'AR', tipo: 'Programador' }
      ],
      proyecto_actual: null,
      tecnologias: ['Python', 'React', 'D3.js', 'PostgreSQL'],
      fecha_creacion: '2023-12-10',
      estado: 'Disponible',
      productividad: 95,
      proyectos_completados: 8
    }
  ];

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      // Intentar cargar desde API
      const data = await teamService.getAllTeams();
      setTeams(data);
    } catch (error) {
      console.log('Error al cargar equipos desde API, usando datos mock:', error);
      // Fallback a datos mock
      setTeams(mockTeams);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = () => {
    setSelectedTeam(null);
    setFormMode('create');
    setOpenForm(true);
  };

  const handleEditTeam = (team) => {
    setSelectedTeam(team);
    setFormMode('edit');
    setOpenForm(true);
  };

  const handleViewTeam = (team) => {
    setSelectedTeam(team);
    setOpenDetails(true);
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este equipo?')) {
      try {
        await teamService.deleteTeam(teamId);
        setTeams(teams.filter(t => t.id !== teamId));
      } catch (error) {
        console.error('Error al eliminar equipo:', error);
        setError('Error al eliminar el equipo');
      }
    }
  };

  const handleFormSubmit = async (teamData) => {
    try {
      if (formMode === 'create') {
        const newTeam = {
          ...teamData,
          id: Date.now(),
          fecha_creacion: new Date().toISOString().split('T')[0],
          proyectos_completados: 0,
          productividad: 85
        };
        setTeams([...teams, newTeam]);
      } else {
        const updatedTeam = { ...selectedTeam, ...teamData };
        setTeams(teams.map(t => t.id === selectedTeam.id ? updatedTeam : t));
      }
      setOpenForm(false);
    } catch (error) {
      console.error('Error al guardar equipo:', error);
      setError('Error al guardar el equipo');
    }
  };

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
    return new Date(dateString).toLocaleDateString('es-AR');
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
              Gestión de Equipos
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Forma y administra equipos de desarrollo
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateTeam}
            size="large"
          >
            Nuevo Equipo
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
              <Groups sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
              <Typography variant="h4" color="#1976d2">
                {teams.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Equipos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', bgcolor: '#e8f5e8' }}>
            <CardContent>
              <TrendingUp sx={{ fontSize: 40, color: '#2e7d32', mb: 1 }} />
              <Typography variant="h4" color="#2e7d32">
                {teams.filter(t => t.estado === 'Activo').length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Equipos Activos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', bgcolor: '#fff3e0' }}>
            <CardContent>
              <Assignment sx={{ fontSize: 40, color: '#f57c00', mb: 1 }} />
              <Typography variant="h4" color="#f57c00">
                {teams.filter(t => t.proyecto_actual).length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Con Proyectos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', bgcolor: '#fce4ec' }}>
            <CardContent>
              <Star sx={{ fontSize: 40, color: '#c2185b', mb: 1 }} />
              <Typography variant="h4" color="#c2185b">
                {teams.length > 0 ? Math.round(teams.reduce((acc, t) => acc + t.productividad, 0) / teams.length) : 0}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Productividad Promedio
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de Equipos */}
      <Grid container spacing={3}>
        {teams.map((team) => (
          <Grid item xs={12} md={6} lg={4} key={team.id}>
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
                {/* Header del equipo */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {team.nombre}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Chip
                        label={team.estado}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(team.estado),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                      <Chip
                        label={`${team.productividad}%`}
                        size="small"
                        sx={{
                          backgroundColor: getProductivityColor(team.productividad),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Descripción */}
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2, minHeight: 40 }}>
                  {team.descripcion}
                </Typography>

                {/* Líder */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#f57c00', mr: 1, width: 32, height: 32 }}>
                    {team.lider.avatar}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Líder
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {team.lider.nombre}
                    </Typography>
                  </Box>
                </Box>

                {/* Miembros */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Miembros ({team.miembros.length})
                  </Typography>
                  <AvatarGroup max={4} sx={{ justifyContent: 'flex-start' }}>
                    {team.miembros.map((member) => (
                      <Tooltip key={member.id} title={member.nombre}>
                        <Avatar sx={{ bgcolor: '#1976d2', width: 32, height: 32 }}>
                          {member.avatar}
                        </Avatar>
                      </Tooltip>
                    ))}
                  </AvatarGroup>
                </Box>

                {/* Proyecto actual */}
                {team.proyecto_actual ? (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Proyecto Actual
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {team.proyecto_actual.nombre}
                    </Typography>
                    <Chip
                      label={team.proyecto_actual.estado}
                      size="small"
                      variant="outlined"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                ) : (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Sin proyecto asignado
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ mb: 2 }} />

                {/* Tecnologías principales */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Tecnologías:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {team.tecnologias.slice(0, 3).map((tech, index) => (
                      <Chip
                        key={index}
                        label={tech}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                    {team.tecnologias.length > 3 && (
                      <Chip
                        label={`+${team.tecnologias.length - 3}`}
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
                      {team.proyectos_completados}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Proyectos
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="primary">
                      {team.miembros.length + 1}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Integrantes
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="primary">
                      {formatDate(team.fecha_creacion)}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Creado
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Box>
                  <IconButton
                    onClick={() => handleViewTeam(team)}
                    color="primary"
                    title="Ver detalles"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    onClick={() => handleEditTeam(team)}
                    color="primary"
                    title="Editar"
                  >
                    <Edit />
                  </IconButton>
                </Box>
                <IconButton
                  onClick={() => handleDeleteTeam(team.id)}
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

      {/* Mensaje si no hay equipos */}
      {teams.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
          <Groups sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No hay equipos registrados
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Comienza formando tu primer equipo de desarrollo
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleCreateTeam}>
            Formar Primer Equipo
          </Button>
        </Paper>
      )}

      {/* FAB para crear equipo */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={handleCreateTeam}
      >
        <Add />
      </Fab>

      {/* Dialogs */}
      <TeamForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        team={selectedTeam}
        mode={formMode}
      />

      <TeamDetails
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        team={selectedTeam}
      />
    </Container>
  );
};

export default Teams;