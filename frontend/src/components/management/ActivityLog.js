import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Alert,
  CircularProgress,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  History,
  Person,
  AssignmentTurnedIn,
  Event,
  Build,
  Search,
  FilterList,
  Business,
  Group,
  MoreHoriz
} from '@mui/icons-material';
import { managementService } from '../../services/managementService';

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Datos mock
  const mockActivities = [
    {
      id: 1,
      user: { id: 1, nombre: 'Administrador', avatar: 'A' },
      action: 'project_created',
      entity: 'Sistema de Inventario',
      description: 'Creó un nuevo proyecto: Sistema de Inventario',
      timestamp: '2024-06-10T10:30:00',
      category: 'projects'
    },
    {
      id: 2,
      user: { id: 2, nombre: 'María Fernanda González', avatar: 'MG' },
      action: 'team_assigned',
      entity: 'Team Alpha',
      description: 'Asignó al equipo Team Alpha al proyecto Sistema de Inventario',
      timestamp: '2024-06-10T11:15:00',
      category: 'teams'
    },
    {
      id: 3,
      user: { id: 3, nombre: 'Roberto Alejandro Silva', avatar: 'RS' },
      action: 'worker_joined',
      entity: 'Ana Sofía Rodríguez',
      description: 'Añadió a Ana Sofía Rodríguez al equipo Team Alpha',
      timestamp: '2024-06-11T09:45:00',
      category: 'workers'
    },
    {
      id: 4,
      user: { id: 2, nombre: 'María Fernanda González', avatar: 'MG' },
      action: 'project_updated',
      entity: 'Sistema de Inventario',
      description: 'Actualizó el estado del proyecto Sistema de Inventario a "En Progreso"',
      timestamp: '2024-06-11T14:22:00',
      category: 'projects'
    },
    {
      id: 5,
      user: { id: 1, nombre: 'Administrador', avatar: 'A' },
      action: 'worker_created',
      entity: 'Carlos Eduardo Martínez',
      description: 'Registró un nuevo trabajador: Carlos Eduardo Martínez',
      timestamp: '2024-06-12T08:30:00',
      category: 'workers'
    },
    {
      id: 6,
      user: { id: 3, nombre: 'Roberto Alejandro Silva', avatar: 'RS' },
      action: 'project_milestone',
      entity: 'App Móvil E-commerce',
      description: 'Completó el hito "Diseño de Wireframes" del proyecto App Móvil E-commerce',
      timestamp: '2024-06-12T11:05:00',
      category: 'projects'
    },
    {
      id: 7,
      user: { id: 2, nombre: 'María Fernanda González', avatar: 'MG' },
      action: 'team_created',
      entity: 'Team Gamma',
      description: 'Creó un nuevo equipo: Team Gamma',
      timestamp: '2024-06-12T15:40:00',
      category: 'teams'
    },
    {
      id: 8,
      user: { id: 1, nombre: 'Administrador', avatar: 'A' },
      action: 'system_maintenance',
      entity: 'Sistema',
      description: 'Realizó mantenimiento programado del sistema',
      timestamp: '2024-06-13T07:00:00',
      category: 'system'
    },
    {
      id: 9,
      user: { id: 3, nombre: 'Roberto Alejandro Silva', avatar: 'RS' },
      action: 'project_comment',
      entity: 'Portal de Clientes',
      description: 'Añadió un comentario sobre "Problemas con integración CRM" en Portal de Clientes',
      timestamp: '2024-06-13T10:15:00',
      category: 'projects'
    },
    {
      id: 10,
      user: { id: 2, nombre: 'María Fernanda González', avatar: 'MG' },
      action: 'project_completed',
      entity: 'Sistema de Facturación',
      description: 'Marcó el proyecto Sistema de Facturación como completado',
      timestamp: '2024-06-13T16:50:00',
      category: 'projects'
    }
  ];

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      // Intentar cargar desde API
      const data = await managementService.getActivityLogs();
      setActivities(data);
    } catch (error) {
      console.log('Error al cargar actividades desde API, usando datos mock:', error);
      // Fallback a datos mock
      setActivities(mockActivities);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const getActionColor = (action) => {
    const colors = {
      project_created: '#1976d2',
      project_updated: '#2196f3',
      project_completed: '#4caf50',
      project_milestone: '#00bcd4',
      project_comment: '#9c27b0',
      team_created: '#ff9800',
      team_assigned: '#ff5722',
      worker_created: '#8bc34a',
      worker_joined: '#cddc39',
      system_maintenance: '#607d8b'
    };
    return colors[action] || '#9e9e9e';
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'project_created':
      case 'project_updated':
      case 'project_completed':
      case 'project_milestone':
      case 'project_comment':
        return <AssignmentTurnedIn />;
      case 'team_created':
      case 'team_assigned':
        return <Group />;
      case 'worker_created':
      case 'worker_joined':
        return <Person />;
      case 'system_maintenance':
        return <Build />;
      default:
        return <Event />;
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('es-AR', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
      return `hace ${diffDay} ${diffDay === 1 ? 'día' : 'días'}`;
    } else if (diffHour > 0) {
      return `hace ${diffHour} ${diffHour === 1 ? 'hora' : 'horas'}`;
    } else if (diffMin > 0) {
      return `hace ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`;
    } else {
      return 'hace unos segundos';
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      projects: 'Proyectos',
      teams: 'Equipos',
      workers: 'Personal',
      system: 'Sistema'
    };
    return labels[category] || 'Otro';
  };

  const getFilteredActivities = () => {
    return activities
      .filter(activity => {
        // Filtrar por categoría
        if (filter !== 'all' && activity.category !== filter) {
          return false;
        }
        
        // Filtrar por búsqueda
        if (searchTerm.trim() !== '') {
          const searchLower = searchTerm.toLowerCase();
          return (
            activity.description.toLowerCase().includes(searchLower) ||
            activity.entity.toLowerCase().includes(searchLower) ||
            activity.user.nombre.toLowerCase().includes(searchLower)
          );
        }
        
        return true;
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const filteredActivities = getFilteredActivities();

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
            <History /> Registro de Actividad
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Filtrar por Tipo</InputLabel>
              <Select
                value={filter}
                onChange={handleFilterChange}
                label="Filtrar por Tipo"
                startAdornment={<Box pr={1}><FilterList fontSize="small" /></Box>}
              >
                <MenuItem value="all">Todas las Actividades</MenuItem>
                <MenuItem value="projects">Proyectos</MenuItem>
                <MenuItem value="teams">Equipos</MenuItem>
                <MenuItem value="workers">Personal</MenuItem>
                <MenuItem value="system">Sistema</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              placeholder="Buscar actividad..."
              size="small"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250 }}
            />
          </Box>
        </Box>
        
        <Divider sx={{ mb: 3 }} />

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Lista de actividades */}
        <List>
          {filteredActivities.map((activity) => (
            <React.Fragment key={activity.id}>
              <ListItem 
                alignItems="flex-start"
                sx={{
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                    borderRadius: 1
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: getActionColor(activity.action) }}>
                    {getActionIcon(activity.action)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography 
                          variant="body1" 
                          component="span"
                          sx={{ fontWeight: 'medium' }}
                        >
                          {activity.user.nombre}
                        </Typography>
                        <Chip 
                          label={getCategoryLabel(activity.category)}
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1, fontSize: '0.75rem' }}
                        />
                      </Box>
                      <Typography 
                        variant="caption" 
                        color="textSecondary"
                        title={formatDateTime(activity.timestamp)}
                      >
                        {getTimeAgo(activity.timestamp)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        variant="body2"
                        color="text.primary"
                        gutterBottom
                      >
                        {activity.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Chip 
                          icon={
                            activity.category === 'projects' ? <AssignmentTurnedIn fontSize="small" /> :
                            activity.category === 'teams' ? <Group fontSize="small" /> :
                            activity.category === 'workers' ? <Person fontSize="small" /> :
                            <Business fontSize="small" />
                          }
                          label={activity.entity}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      </Box>
                    </>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>

        {filteredActivities.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <History fontSize="large" color="action" sx={{ mb: 2 }} />
            <Typography variant="body1" color="textSecondary" gutterBottom>
              No hay actividades que coincidan con los filtros seleccionados
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setFilter('all');
                setSearchTerm('');
              }}
              sx={{ mt: 1 }}
            >
              Mostrar todas las actividades
            </Button>
          </Box>
        )}

        {filteredActivities.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
            <Button 
              variant="outlined" 
              endIcon={<MoreHoriz />}
              onClick={() => alert('Cargando más actividades...')}
            >
              Cargar más actividades
            </Button>
          </Box>
        )}
      </Paper>
    </>
  );
};

export default ActivityLog;