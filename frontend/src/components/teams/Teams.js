import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Button, TextField, Dialog, DialogTitle, 
  DialogContent, DialogActions, IconButton, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Tooltip, CircularProgress, 
  Alert, FormControl, InputLabel, Select, MenuItem, Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { teamService } from '../../services/teamService';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [availableLeaders, setAvailableLeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    lider_id: ''
  });

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await teamService.getAll();
      setTeams(data);
    } catch (error) {
      console.error("Error al cargar equipos:", error);
      setError('Error al cargar los equipos');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableLeaders = async () => {
    try {
      setError('');
      console.log("Cargando líderes disponibles...");
      const leaders = await teamService.getAvailableLeaders();
      setAvailableLeaders(leaders);
      console.log("Líderes disponibles cargados:", leaders);
    } catch (error) {
      console.error("Error al cargar líderes disponibles:", error);
      setError('Error al cargar los líderes disponibles');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      lider_id: ''
    });
  };

  const handleOpenDialog = async (team = null) => {
    // Cargar líderes disponibles antes de abrir el diálogo
    await loadAvailableLeaders();
    
    if (team) {
      // Modo edición
      setFormData({
        nombre: team.nombre || '',
        descripcion: team.descripcion || '',
        lider_id: team.lider_id || ''
      });
      setCurrentTeam(team);
      
      // Si estamos editando y el equipo ya tiene un líder, agregarlo a la lista de disponibles
      if (team.lider_id && !availableLeaders.find(leader => leader.id === team.lider_id)) {
        // Buscar el líder actual en todos los líderes para agregarlo temporalmente
        try {
          const allLeaders = await teamService.getAvailableLeaders();
          // Esto podría necesitar ajuste dependiendo de cómo manejes la edición
        } catch (error) {
          console.warn("No se pudo cargar el líder actual del equipo");
        }
      }
    } else {
      // Modo creación
      resetForm();
      setCurrentTeam(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
    setSuccess('');
    setError('');
  };

  const handleOpenDeleteDialog = (team) => {
    setCurrentTeam(team);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCurrentTeam(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveTeam = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Validación básica
      if (!formData.nombre.trim()) {
        setError('El nombre del equipo es requerido');
        setLoading(false);
        return;
      }

      // Preparar datos para enviar
      const dataToSend = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || '',
        lider_id: formData.lider_id || null
      };

      console.log("Guardando equipo:", dataToSend);

      if (currentTeam) {
        // Actualización
        await teamService.update(currentTeam.id, dataToSend);
        setSuccess('Equipo actualizado exitosamente');
      } else {
        // Creación
        await teamService.create(dataToSend);
        setSuccess('Equipo creado exitosamente');
      }

      await loadTeams();
      handleCloseDialog();
    } catch (error) {
      console.error("Error al guardar equipo:", error);
      
      // Manejo específico de errores
      if (error.response?.status === 400) {
        setError(error.response.data.detail || 'Datos inválidos para el equipo');
      } else if (error.response?.status === 409) {
        setError('Ya existe un equipo con ese nombre o el líder ya está asignado');
      } else {
        setError(error.message || 'Error al guardar el equipo');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async () => {
    try {
      setLoading(true);
      setError('');
      
      await teamService.delete(currentTeam.id);
      setSuccess('Equipo eliminado exitosamente');
      
      await loadTeams();
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error al eliminar equipo:", error);
      setError(error.message || 'Error al eliminar el equipo');
    } finally {
      setLoading(false);
    }
  };

  // Función para encontrar el nombre del líder por ID
  const getLeaderName = (leaderId) => {
    if (!leaderId) return 'Sin líder asignado';
    
    // Buscar en líderes disponibles primero
    const leader = availableLeaders.find(l => l.id === leaderId);
    if (leader) return leader.name;
    
    // Si no está en disponibles, podría estar asignado (para equipos existentes)
    return `Líder ID: ${leaderId}`;
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Equipos
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
        sx={{ mb: 3 }}
      >
        Nuevo Equipo
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Descripción</strong></TableCell>
              <TableCell><strong>Líder</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : teams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No hay equipos registrados
                </TableCell>
              </TableRow>
            ) : (
              teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell>{team.nombre}</TableCell>
                  <TableCell>{team.descripcion || 'Sin descripción'}</TableCell>
                  <TableCell>{getLeaderName(team.lider_id)}</TableCell>
                  <TableCell>
                    <Tooltip title="Editar">
                      <IconButton 
                        color="primary"
                        onClick={() => handleOpenDialog(team)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton 
                        color="error"
                        onClick={() => handleOpenDeleteDialog(team)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para crear/editar equipo */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentTeam ? 'Editar Equipo' : 'Crear Equipo'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="nombre"
            label="Nombre del Equipo"
            fullWidth
            variant="outlined"
            value={formData.nombre}
            onChange={handleChange}
            required
            autoFocus
          />
          <TextField
            margin="dense"
            name="descripcion"
            label="Descripción"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Descripción opcional del equipo"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Líder del Equipo</InputLabel>
            <Select
              name="lider_id"
              value={formData.lider_id}
              onChange={handleChange}
              label="Líder del Equipo"
            >
              <MenuItem value="">
                <em>Sin líder asignado</em>
              </MenuItem>
              {availableLeaders.map((leader) => (
                <MenuItem key={leader.id} value={leader.id}>
                  {leader.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {availableLeaders.length === 0 && (
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
              No hay líderes disponibles. Todos los líderes están asignados a otros equipos.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveTeam} 
            color="primary"
            disabled={loading}
            variant="contained"
          >
            {loading ? <CircularProgress size={24} /> : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para confirmar eliminación */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro que deseas eliminar el equipo 
            <strong>{currentTeam ? ` "${currentTeam.nombre}"` : ''}</strong>?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteTeam} 
            color="error"
            disabled={loading}
            variant="contained"
          >
            {loading ? <CircularProgress size={24} /> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Teams;
