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
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  TextField,
  Tab,
  Tabs
} from '@mui/material';
import { 
  Assessment, 
  People, 
  Work, 
  TrendingUp, 
  BarChart,
  PieChart,
  TableChart,
  CloudDownload,
  FilterList,
  DateRange
} from '@mui/icons-material';
import { managementService } from '../../services/managementService';

const Reports = () => {
  const [reportType, setReportType] = useState('performance');
  const [timeRange, setTimeRange] = useState('mensual');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportData, setReportData] = useState({});
  const [reportTab, setReportTab] = useState(0);

  // Datos mock para los reportes
  const mockReportData = {
    performance: {
      summary: {
        totalProjects: 15,
        completedProjects: 8,
        onTimeProjects: 6,
        delayedProjects: 2,
        averageDelay: 12, // días
        averageCompletion: 87 // porcentaje
      },
      projectsCompletion: [
        { nombre: 'Sistema de Inventario', progreso: 45, estado: 'En Progreso', tiempoRestante: 50 },
        { nombre: 'App Móvil E-commerce', progreso: 10, estado: 'Planificación', tiempoRestante: 107 },
        { nombre: 'Portal de Clientes', progreso: 65, estado: 'Retrasado', tiempoRestante: -5 },
        { nombre: 'Sistema de Facturación', progreso: 100, estado: 'Completado', tiempoRestante: 0 },
        { nombre: 'Intranet Corporativa', progreso: 100, estado: 'Completado', tiempoRestante: 0 },
        { nombre: 'Plataforma de Capacitación', progreso: 78, estado: 'En Progreso', tiempoRestante: 20 },
        { nombre: 'App Gestión de Gastos', progreso: 92, estado: 'En Progreso', tiempoRestante: 5 },
        { nombre: 'Portal de Proveedores', progreso: 100, estado: 'Completado', tiempoRestante: 0 }
      ]
    },
    teams: {
      summary: {
        totalTeams: 6,
        activeTeams: 3,
        averagePerformance: 88,
        teamWithMostProjects: 'Team Alpha',
        mostUsedTechnologies: ['React', 'Node.js', 'MongoDB']
      },
      teamsPerformance: [
        { nombre: 'Team Alpha', productividad: 92, proyectos_completados: 5, miembros: 4 },
        { nombre: 'Team Beta', productividad: 88, proyectos_completados: 3, miembros: 3 },
        { nombre: 'Team Gamma', productividad: 95, proyectos_completados: 8, miembros: 2 },
        { nombre: 'Team Delta', productividad: 75, proyectos_completados: 2, miembros: 5 },
        { nombre: 'Team Epsilon', productividad: 82, proyectos_completados: 4, miembros: 3 },
        { nombre: 'Team Zeta', productividad: 90, proyectos_completados: 3, miembros: 4 }
      ]
    },
    workers: {
      summary: {
        totalWorkers: 25,
        programmers: 20,
        leaders: 5,
        averageExperience: 4.7,
        mostFrequentTechnologies: ['JavaScript', 'React', 'SQL']
      },
      topPerformers: [
        { nombre: 'María Fernanda González', tipo: 'Líder', productividad: 96, proyectos: 13 },
        { nombre: 'Roberto Alejandro Silva', tipo: 'Líder', productividad: 94, proyectos: 11 },
        { nombre: 'Juan Carlos Pérez', tipo: 'Programador', productividad: 90, proyectos: 7 },
        { nombre: 'Ana Sofía Rodríguez', tipo: 'Programador', productividad: 89, proyectos: 6 },
        { nombre: 'Carlos Eduardo Martínez', tipo: 'Programador', productividad: 85, proyectos: 8 }
      ],
      experienceDistribution: {
        'Junior': 9,
        'Mid': 11,
        'Senior': 5
      }
    },
    economics: {
      summary: {
        totalCost: 1250000,
        averageProjectCost: 83333,
        mostExpensiveProject: 'Sistema de Inventario',
        avgMonthlyExpenses: 125000
      },
      projectCosts: [
        { nombre: 'Sistema de Inventario', costo: 250000, estado: 'En Progreso' },
        { nombre: 'App Móvil E-commerce', costo: 180000, estado: 'Planificación' },
        { nombre: 'Portal de Clientes', costo: 150000, estado: 'Retrasado' },
        { nombre: 'Sistema de Facturación', costo: 200000, estado: 'Completado' },
        { nombre: 'Intranet Corporativa', costo: 120000, estado: 'Completado' },
        { nombre: 'Plataforma de Capacitación', costo: 90000, estado: 'En Progreso' },
        { nombre: 'App Gestión de Gastos', costo: 110000, estado: 'En Progreso' }
      ],
      monthlyExpenses: [
        { month: 'Enero', salarios: 85000, infraestructura: 12000, software: 5000, otros: 3000 },
        { month: 'Febrero', salarios: 85000, infraestructura: 12000, software: 5000, otros: 4500 },
        { month: 'Marzo', salarios: 92000, infraestructura: 12000, software: 8000, otros: 3200 },
        { month: 'Abril', salarios: 92000, infraestructura: 12000, software: 5000, otros: 2800 },
        { month: 'Mayo', salarios: 98000, infraestructura: 13500, software: 5000, otros: 3700 },
        { month: 'Junio', salarios: 98000, infraestructura: 13500, software: 7500, otros: 4100 }
      ]
    }
  };

  useEffect(() => {
    loadReportData();
  }, [reportType, timeRange]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      // Intentar cargar desde API
      const data = await managementService.getReports(reportType, { timeRange });
      setReportData(data);
    } catch (error) {
      console.log('Error al cargar reporte desde API, usando datos mock:', error);
      // Fallback a datos mock
      setReportData(mockReportData[reportType] || {});
    } finally {
      setLoading(false);
    }
  };

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setReportTab(newValue);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', { 
      style: 'currency', 
      currency: 'ARS',
      maximumFractionDigits: 0 
    }).format(amount);
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

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return '#4caf50';
    if (performance >= 75) return '#ff9800';
    return '#f44336';
  };

  // Función para generar el contenido según el tipo de reporte
  const renderReportContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      );
    }

    switch (reportType) {
      case 'performance':
        return renderPerformanceReport();
      case 'teams':
        return renderTeamsReport();
      case 'workers':
        return renderWorkersReport();
      case 'economics':
        return renderEconomicsReport();
      default:
        return (
          <Typography variant="body1" color="textSecondary">
            Seleccione un tipo de informe
          </Typography>
        );
    }
  };

  // Renderizar reporte de rendimiento de proyectos
  const renderPerformanceReport = () => {
    const { summary, projectsCompletion } = reportData;
    
    return (
      <>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#e3f2fd' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="primary" variant="h4">
                  {summary.totalProjects}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Proyectos Totales
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#e8f5e9' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="success.main" variant="h4">
                  {summary.completedProjects}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Proyectos Completados
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#fffde7' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="warning.main" variant="h4">
                  {summary.onTimeProjects}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  A Tiempo
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#ffebee' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="error" variant="h4">
                  {summary.delayedProjects}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Retrasados
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 2, mb: 4 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Rendimiento de Proyectos
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Completado promedio: {summary.averageCompletion}%
            </Typography>
          </Box>
          
          <TableContainer>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Proyecto</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="center">Progreso</TableCell>
                  <TableCell align="center">Tiempo Restante (Días)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projectsCompletion.map((project, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {project.nombre}
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={project.estado} 
                        size="small"
                        sx={{ 
                          bgcolor: getStatusColor(project.estado),
                          color: 'white'
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <Box sx={{ 
                            width: '100%', 
                            height: 8, 
                            bgcolor: 'rgba(0, 0, 0, 0.1)', 
                            borderRadius: 5,
                            overflow: 'hidden' 
                          }}>
                            <Box sx={{ 
                              width: `${project.progreso}%`, 
                              height: '100%', 
                              bgcolor: project.progreso === 100 ? '#4caf50' : '#2196f3', 
                              borderRadius: 5 
                            }} />
                          </Box>
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2">{project.progreso}%</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        sx={{
                          color: project.tiempoRestante < 0 ? 'error.main' : 
                                project.tiempoRestante === 0 ? 'success.main' : 'inherit'
                        }}
                      >
                        {project.tiempoRestante < 0 ? `${Math.abs(project.tiempoRestante)} días atrasado` :
                         project.tiempoRestante === 0 ? 'Completado' : `${project.tiempoRestante} días`}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            startIcon={<CloudDownload />}
            onClick={() => alert('Descargando reporte de rendimiento...')}
          >
            Exportar Informe
          </Button>
        </Box>
      </>
    );
  };

  // Renderizar reporte de equipos
  const renderTeamsReport = () => {
    const { summary, teamsPerformance } = reportData;
    
    return (
      <>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#e3f2fd' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="primary" variant="h4">
                  {summary.totalTeams}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Equipos Totales
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#e8f5e9' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="success.main" variant="h4">
                  {summary.activeTeams}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Equipos Activos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#fffde7' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="warning.main" variant="h4">
                  {summary.averagePerformance}%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Rendimiento Promedio
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#e0f7fa' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="info.main" variant="h4">
                  {summary.teamWithMostProjects}
                </Typography>
                <Typography variant="body2" color="textSecondary" noWrap>
                  Equipo con Más Proyectos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 2, mb: 4 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Rendimiento por Equipo
            </Typography>
          </Box>
          
          <TableContainer>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Equipo</TableCell>
                  <TableCell align="center">Miembros</TableCell>
                  <TableCell align="center">Proyectos Completados</TableCell>
                  <TableCell align="center">Productividad</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teamsPerformance.map((team, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {team.nombre}
                    </TableCell>
                    <TableCell align="center">{team.miembros}</TableCell>
                    <TableCell align="center">{team.proyectos_completados}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <Box sx={{ 
                            width: '100%', 
                            height: 8, 
                            bgcolor: 'rgba(0, 0, 0, 0.1)', 
                            borderRadius: 5,
                            overflow: 'hidden' 
                          }}>
                            <Box sx={{ 
                              width: `${team.productividad}%`, 
                              height: '100%', 
                              bgcolor: getPerformanceColor(team.productividad), 
                              borderRadius: 5 
                            }} />
                          </Box>
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2">{team.productividad}%</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Paper sx={{ p: 2, mb: 4 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tecnologías más Utilizadas por Equipos
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {summary.mostUsedTechnologies.map((tech, index) => (
              <Chip 
                key={index} 
                label={tech} 
                color="primary" 
                variant="outlined" 
              />
            ))}
          </Box>
        </Paper>

        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            startIcon={<CloudDownload />}
            onClick={() => alert('Descargando reporte de equipos...')}
          >
            Exportar Informe
          </Button>
        </Box>
      </>
    );
  };

  // Renderizar reporte de trabajadores
  const renderWorkersReport = () => {
    const { summary, topPerformers, experienceDistribution } = reportData;
    
    return (
      <>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#e3f2fd' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="primary" variant="h4">
                  {summary.totalWorkers}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Trabajadores Totales
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#fff3e0' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="warning.dark" variant="h4">
                  {summary.programmers}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Programadores
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#fce4ec' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="secondary.main" variant="h4">
                  {summary.leaders}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Líderes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#e8f5e9' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="success.main" variant="h4">
                  {summary.averageExperience}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Años Exp. Prom.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 2, mb: 4 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Trabajadores con Mejor Desempeño
            </Typography>
          </Box>
          
          <TableContainer>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Trabajador</TableCell>
                  <TableCell align="center">Tipo</TableCell>
                  <TableCell align="center">Proyectos</TableCell>
                  <TableCell align="center">Productividad</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topPerformers.map((worker, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {worker.nombre}
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={worker.tipo} 
                        color={worker.tipo === 'Líder' ? 'secondary' : 'primary'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="center">{worker.proyectos}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <Box sx={{ 
                            width: '100%', 
                            height: 8, 
                            bgcolor: 'rgba(0, 0, 0, 0.1)', 
                            borderRadius: 5,
                            overflow: 'hidden' 
                          }}>
                            <Box sx={{ 
                              width: `${worker.productividad}%`, 
                              height: '100%', 
                              bgcolor: getPerformanceColor(worker.productividad), 
                              borderRadius: 5 
                            }} />
                          </Box>
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2">{worker.productividad}%</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Distribución por Nivel
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Junior"
                    secondary={`${experienceDistribution.Junior} trabajadores`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Mid"
                    secondary={`${experienceDistribution.Mid} trabajadores`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Senior"
                    secondary={`${experienceDistribution.Senior} trabajadores`}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Tecnologías más Comunes
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {summary.mostFrequentTechnologies.map((tech, index) => (
                  <Chip 
                    key={index} 
                    label={tech} 
                    color="primary" 
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            startIcon={<CloudDownload />}
            onClick={() => alert('Descargando reporte de personal...')}
          >
            Exportar Informe
          </Button>
        </Box>
      </>
    );
  };

  // Renderizar reporte económico
  const renderEconomicsReport = () => {
    const { summary, projectCosts, monthlyExpenses } = reportData;
    
    return (
      <>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#e3f2fd' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="primary" variant="h6">
                  {formatCurrency(summary.totalCost)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Costo Total Proyectos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#fff3e0' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="warning.dark" variant="h6">
                  {formatCurrency(summary.averageProjectCost)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Costo Promedio
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#e8f5e9' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="success.main" variant="h6" noWrap>
                  {summary.mostExpensiveProject}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Proyecto más Costoso
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#fce4ec' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="secondary.main" variant="h6">
                  {formatCurrency(summary.avgMonthlyExpenses)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Gastos Mensuales Prom.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mb: 2 }}>
          <Tabs value={reportTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab icon={<BarChart fontSize="small" />} label="Costos por Proyecto" />
            <Tab icon={<TableChart fontSize="small" />} label="Gastos Mensuales" />
          </Tabs>
        </Box>

        <Box sx={{ p: 2, mb: 4 }}>
          {reportTab === 0 && (
            <TableContainer component={Paper} variant="outlined">
              <Table sx={{ minWidth: 650 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Proyecto</TableCell>
                    <TableCell align="center">Estado</TableCell>
                    <TableCell align="right">Costo</TableCell>
                    <TableCell align="right">% del Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projectCosts.map((project, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {project.nombre}
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={project.estado} 
                          size="small"
                          sx={{ 
                            bgcolor: getStatusColor(project.estado),
                            color: 'white'
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(project.costo)}
                      </TableCell>
                      <TableCell align="right">
                        {Math.round((project.costo / summary.totalCost) * 100)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {reportTab === 1 && (
            <TableContainer component={Paper} variant="outlined">
              <Table sx={{ minWidth: 650 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Mes</TableCell>
                    <TableCell align="right">Salarios</TableCell>
                    <TableCell align="right">Infraestructura</TableCell>
                    <TableCell align="right">Software</TableCell>
                    <TableCell align="right">Otros</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {monthlyExpenses.map((month, index) => {
                    const totalMonth = month.salarios + month.infraestructura + month.software + month.otros;
                    return (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {month.month}
                        </TableCell>
                        <TableCell align="right">{formatCurrency(month.salarios)}</TableCell>
                        <TableCell align="right">{formatCurrency(month.infraestructura)}</TableCell>
                        <TableCell align="right">{formatCurrency(month.software)}</TableCell>
                        <TableCell align="right">{formatCurrency(month.otros)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          {formatCurrency(totalMonth)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            startIcon={<CloudDownload />}
            onClick={() => alert('Descargando reporte económico...')}
          >
            Exportar Informe
          </Button>
        </Box>
      </>
    );
  };

  return (
    <>
      <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Assessment /> Informes y Estadísticas
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Tipo de Informe</InputLabel>
              <Select
                value={reportType}
                onChange={handleReportTypeChange}
                label="Tipo de Informe"
                startAdornment={<Box pr={1}><FilterList fontSize="small" /></Box>}
              >
                <MenuItem value="performance">Rendimiento de Proyectos</MenuItem>
                <MenuItem value="teams">Equipos de Trabajo</MenuItem>
                <MenuItem value="workers">Personal</MenuItem>
                <MenuItem value="economics">Económico</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Periodo</InputLabel>
              <Select
                value={timeRange}
                onChange={handleTimeRangeChange}
                label="Periodo"
                startAdornment={<Box pr={1}><DateRange fontSize="small" /></Box>}
              >
                <MenuItem value="mensual">Último Mes</MenuItem>
                <MenuItem value="trimestral">Último Trimestre</MenuItem>
                <MenuItem value="semestral">Último Semestre</MenuItem>
                <MenuItem value="anual">Último Año</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Contenido del reporte */}
        {renderReportContent()}
      </Paper>
    </>
  );
};

export default Reports;