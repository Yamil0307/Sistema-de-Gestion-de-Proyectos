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
import { workerService } from '../../services/workerService';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [workers, setWorkers] = useState([]); // Para el selector de trabajadores
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    lider_id: '',
  });

  useEffect(() => {
    loadTeams();
    loadWorkers(); // Cargar los trabajadores para el selector
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await teamService.getAll();
      console.log("Equipos cargados:", data);
      console.log("Trabajadores cargados:", data);
      setTeams(data);
    } catch (error) {
      console.error("Error al cargar equipos:", error);
      setError('Error al cargar los equipos');
    } finally {
      setLoading(false);
    }
  };

  const loadWorkers = async () => {
    try {
      // Intentar cargar todos los trabajadores
      const data = await workerService.getAll();
      console.log("Trabajadores cargados:", data);
      setWorkers(data);
    } catch (error) {
      console.error("Error al cargar trabajadores:", error);
    }
  };

  const handleOpenDialog = (team = null) => {
    if (team) {
      // Modo edición
      setFormData({
        nombre: team.nombre || '',
        descripcion: team.descripcion || '',
        lider_id: team.lider_id || '',
      });
      setCurrentTeam(team);
    } else {
      // Modo creación
      setFormData({
        nombre: '',
        descripcion: '',
        lider_id: '',
      });
      setCurrentTeam(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDeleteDialog = (team) => {
    setCurrentTeam(team);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
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

      // Validación básica
      if (!formData.nombre) {
        setError('Por favor, completa el nombre del equipo');
        setLoading(false);
        return;
      }

      if (currentTeam) {
        // Actualización
        await teamService.update(currentTeam.id, formData);
      } else {
        // Creación
        await teamService.create(formData);
      }

      await loadTeams();
      handleCloseDialog();
    } catch (error) {
      console.error("Error al guardar equipo:", error);
      setError(error.message || 'Error al guardar el equipo');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async () => {
    try {
      setLoading(true);
      setError('');
      await teamService.delete(currentTeam.id);
      
      await loadTeams();
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error al eliminar equipo:", error);
      setError(error.message || 'Error al eliminar el equipo');
    } finally {
      setLoading(false);
    }
  };

  // Función para encontrar el trabajador líder por ID
  const findLeaderById = (leaderId) => {
    if (!leaderId) return null;
    return workers.find(worker => worker.id === leaderId);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Equipos
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Líder</TableCell>
              <TableCell>Acciones</TableCell>
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
              teams.map((team) => {
                // Encontrar el líder para este equipo
                const leader = findLeaderById(team.lider_id);
                
                return (
                  <TableRow key={team.id}>
                    <TableCell>{team.nombre}</TableCell>
                    <TableCell>{team.descripcion}</TableCell>
                    <TableCell>
                      {/* Aquí está la corrección para evitar el error */}
                      {leader ? leader.nombre : 'Sin líder asignado'}
                    </TableCell>
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
                );
              })
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
                <em>Sin líder</em>
              </MenuItem>
              {workers.map((worker) => (
                // Solo mostrar trabajadores con rol de líder
                worker.rol === 'Líder' && (
                  <MenuItem key={worker.id} value={worker.id}>
                    {worker.nombre}
                  </MenuItem>
                )
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveTeam} 
            color="primary"
            disabled={loading}
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
            {currentTeam ? ` "${currentTeam.nombre}"` : ''}?
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
          >
            {loading ? <CircularProgress size={24} /> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Teams;
