import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Box, Grid, Card, CardContent, CardActions,
  IconButton, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, InputLabel, Select, MenuItem, Alert, CircularProgress, Paper, Divider, Chip, Tooltip
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Info as InfoIcon, People as PeopleIcon
} from '@mui/icons-material';
import { workerService } from '../../services/workerService';

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentWorker, setCurrentWorker] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    especialidad: '',
    experiencia: '',
    rol: 'Programador'  // Valor por defecto
  });

  const roles = ['Programador', 'Líder'];

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    try {
      setLoading(true);
      setError('');
      console.log("Iniciando carga de todos los trabajadores...");
      
      // Usar el método combinado que obtiene tanto programadores como líderes
      const data = await workerService.getAll();
      console.log("Todos los trabajadores cargados:", data);
      setWorkers(data);
    } catch (error) {
      console.error("Error al cargar trabajadores:", error);
      setError('Error al cargar los trabajadores');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenDialog = (worker = null) => {
    if (worker) {
      // Edición - Copia todos los campos necesarios
      setFormData({
        nombre: worker.nombre || '',
        especialidad: worker.especialidad || '',
        experiencia: worker.experiencia || '',
        rol: worker.rol || 'Programador'
      });
      setCurrentWorker(worker);
    } else {
      // Creación - Resetear a valores iniciales
      setFormData({
        nombre: '',
        especialidad: '',
        experiencia: '',
        rol: 'Programador'
      });
      setCurrentWorker(null);
    }
    
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentWorker(null);
  };

  const handleSaveWorker = async () => {
    try {
      setLoading(true);
      setError('');

      // Validación básica
      if (!formData.nombre || !formData.rol) {
        setError('Por favor, completa los campos requeridos');
        setLoading(false);
        return;
      }

      console.log("Guardando trabajador:", formData);

      if (currentWorker) {
        // Actualización
        await workerService.update(currentWorker.id, formData);
      } else {
        // Creación
        await workerService.create(formData);
      }

      await loadWorkers();
      handleCloseDialog();
    } catch (error) {
      console.error("Error al guardar trabajador:", error);
      setError(error.message || 'Error al guardar el trabajador');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = (worker) => {
    console.log("Preparando eliminación del trabajador:", worker);
    setCurrentWorker(worker);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCurrentWorker(null);
  };

  const handleDeleteWorker = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!currentWorker || !currentWorker.id) {
        setError('Error: Información del trabajador incompleta');
        setLoading(false);
        return;
      }
      
      // Verificar explícitamente el rol
      console.log("Datos completos del trabajador a eliminar:", currentWorker);
      
      if (!currentWorker.rol) {
        setError('Error: El trabajador no tiene un rol definido');
        setLoading(false);
        return;
      }
      
      // Llamar al servicio con ID y rol claramente definidos
      await workerService.delete(currentWorker.id, currentWorker.rol);
      
      // Recargar la lista después de eliminar
      await loadWorkers();
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error completo:", error);
      setError(error.message || 'Error al eliminar el trabajador');
    } finally {
      setLoading(false);
    }
  };

  if (loading && workers.length === 0) {
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
            <PeopleIcon sx={{ mr: 1 }} /> Trabajadores
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nuevo Trabajador
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {workers.length === 0 && !loading ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              No hay trabajadores disponibles
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ mt: 1 }}
            >
              Crear Primer Trabajador
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {workers.map((worker) => (
              <Grid item key={worker.id} xs={12} md={6} lg={4}>
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
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {worker.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {worker.email}
                    </Typography>
                    <Chip 
                      label={worker.rol}
                      color={worker.rol === 'Líder' ? 'secondary' : 'primary'}
                      sx={{ mb: 1 }}
                    />
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                    <Tooltip title="Editar">
                      <IconButton 
                        color="primary" 
                        aria-label="editar trabajador"
                        onClick={() => handleOpenDialog(worker)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton 
                        color="error" 
                        aria-label="eliminar trabajador"
                        onClick={() => handleOpenDeleteDialog(worker)}
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

      {/* Diálogo de creación/edición de trabajador */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentWorker ? 'Editar Trabajador' : 'Nuevo Trabajador'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="nombre"
            label="Nombre"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="email"
            label="Correo Electrónico"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="especialidad"
            label="Especialidad"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.especialidad}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="experiencia"
            label="Años de Experiencia"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.experiencia}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="rol-label">Rol</InputLabel>
            <Select
              labelId="rol-label"
              name="rol"
              value={formData.rol}
              label="Rol"
              onChange={handleChange}
            >
              {roles.map((rol) => (
                <MenuItem key={rol} value={rol}>{rol}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSaveWorker} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Eliminar Trabajador</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de que desea eliminar a "{currentWorker?.nombre}"? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleDeleteWorker} color="error" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Workers;