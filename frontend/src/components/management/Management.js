import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Assignment,
  Timeline,
  Assessment,
  History,
  TrendingUp
} from '@mui/icons-material';
import { managementService } from '../../services/managementService';
import Assignments from './Assignments';
import ProjectTracking from './ProjectTracking';
import Reports from './Reports';
import ActivityLog from './ActivityLog';

const Management = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    projects: {
      total: 0,
      active: 0,
      completed: 0,
      delayed: 0
    },
    teams: {
      total: 0,
      active: 0,
      available: 0
    },
    workers: {
      total: 0,
      assigned: 0,
      available: 0
    },
    performance: {
      onTimeProjects: 0,
      delayedProjects: 0,
      averageTeamPerformance: 0,
      projectCompletionRate: 0
    }
  });

  // Datos mock para las estadísticas
  const mockStats = {
    projects: {
      total: 15,
      active: 8,
      completed: 5,
      delayed: 2
    },
    teams: {
      total: 6,
      active: 3,
      available: 3
    },
    workers: {
      total: 25,
      assigned: 18,
      available: 7
    },
    performance: {
      onTimeProjects: 12,
      delayedProjects: 3,
      averageTeamPerformance: 88,
      projectCompletionRate: 78
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      // Intentar cargar desde API
      const data = await managementService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.log('Error al cargar estadísticas desde API, usando datos mock:', error);
      // Fallback a datos mock
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return <Assignments />;
      case 1:
        return <ProjectTracking />;
      case 2:
        return <Reports />;
      case 3:
        return <ActivityLog />;
      default:
        return <Assignments />;
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Gestión del Sistema
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Administre asignaciones, seguimiento y reportes
          </Typography>
        </Box>
      </Paper>

      {/* Resumen de Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: '#e3f2fd' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assignment /> Proyectos
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Total:</Typography>
                <Typography variant="body1" fontWeight="bold">{stats.projects.total}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Activos:</Typography>
                <Typography variant="body1" fontWeight="bold" color="primary">{stats.projects.active}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Completados:</Typography>
                <Typography variant="body1" fontWeight="bold" color="success.main">{stats.projects.completed}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Demorados:</Typography>
                <Typography variant="body1" fontWeight="bold" color="error">{stats.projects.delayed}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: '#e8f5e8' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="#2e7d32" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assignment /> Equipos
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Total:</Typography>
                <Typography variant="body1" fontWeight="bold">{stats.teams.total}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Activos:</Typography>
                <Typography variant="body1" fontWeight="bold" color="#2e7d32">{stats.teams.active}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Disponibles:</Typography>
                <Typography variant="body1" fontWeight="bold" color="info.main">{stats.teams.available}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: '#fff3e0' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="#f57c00" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assignment /> Personal
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Total:</Typography>
                <Typography variant="body1" fontWeight="bold">{stats.workers.total}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Asignados:</Typography>
                <Typography variant="body1" fontWeight="bold" color="#f57c00">{stats.workers.assigned}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Disponibles:</Typography>
                <Typography variant="body1" fontWeight="bold" color="info.main">{stats.workers.available}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: '#fce4ec' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="#c2185b" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp /> Rendimiento
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Proyectos a tiempo:</Typography>
                <Typography variant="body1" fontWeight="bold" color="success.main">{stats.performance.onTimeProjects}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Proyectos demorados:</Typography>
                <Typography variant="body1" fontWeight="bold" color="error">{stats.performance.delayedProjects}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Rendimiento equipos:</Typography>
                <Typography variant="body1" fontWeight="bold" color="primary">{stats.performance.averageTeamPerformance}%</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Tabs de Secciones */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={currentTab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab 
            icon={<Assignment />} 
            label="Asignaciones" 
            iconPosition="start"
          />
          <Tab 
            icon={<Timeline />} 
            label="Seguimiento" 
            iconPosition="start"
          />
          <Tab 
            icon={<Assessment />}
            label="Informes" 
            iconPosition="start"
          />
          <Tab 
            icon={<History />} 
            label="Actividad" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Contenido del Tab seleccionado */}
      {renderTabContent()}
    </Container>
  );
};

export default Management;