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
import { workerService } from '../../services/workerService';

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentWorker, setCurrentWorker] = useState(null);
  
  // Estado del formulario con campos separados para programador y líder
  const [workerType, setWorkerType] = useState('Programador'); // Tipo de trabajador a crear
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    base_salary: '',
    // Campos específicos para programador
    category: '',
    languages: [],
    // Campos específicos para líder
    experience_years: '',
    directed_projects: ''
  });

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await workerService.getAll();
      setWorkers(data);
    } catch (error) {
      console.error("Error al cargar trabajadores:", error);
      setError('Error al cargar los trabajadores');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      gender: '',
      base_salary: '',
      category: '',
      languages: [],
      experience_years: '',
      directed_projects: ''
    });
    setWorkerType('Programador');
  };

  const handleOpenDialog = (worker = null) => {
    if (worker) {
      // Modo edición
      setFormData({
        name: worker.name || '',
        age: worker.age || '',
        gender: worker.gender || '',
        base_salary: worker.base_salary || '',
        category: worker.category || '',
        languages: worker.languages || [],
        experience_years: worker.experience_years || '',
        directed_projects: worker.directed_projects || ''
      });
      // Determinar el tipo basado en los campos que tiene
      setWorkerType(worker.category ? 'Programador' : 'Líder');
      setCurrentWorker(worker);
    } else {
      // Modo creación
      resetForm();
      setCurrentWorker(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
  };

  const handleOpenDeleteDialog = (worker) => {
    console.log("=== ABRIENDO DIÁLOGO DE ELIMINACIÓN ===");
    console.log("Trabajador seleccionado:", worker);
    
    if (!worker) {
      console.error("No se proporcionó un trabajador para eliminar");
      setError("Error: No se pudo seleccionar el trabajador");
      return;
    }
    
    if (!worker.id) {
      console.error("El trabajador no tiene ID:", worker);
      setError("Error: El trabajador no tiene un ID válido");
      return;
    }
    
    setCurrentWorker(worker);
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

  const handleLanguagesChange = (e) => {
    const value = e.target.value;
    const languagesArray = value ? value.split(',').map(lang => lang.trim()).filter(lang => lang) : [];
    setFormData(prev => ({
      ...prev,
      languages: languagesArray
    }));
  };

  const handleWorkerTypeChange = (e) => {
    setWorkerType(e.target.value);
    // Limpiar campos específicos cuando cambia el tipo
    setFormData(prev => ({
      ...prev,
      category: '',
      languages: [],
      experience_years: '',
      directed_projects: ''
    }));
  };

  const handleSaveWorker = async () => {
    try {
      setLoading(true);
      setError('');

      // Validación básica común
      if (!formData.name || !formData.age || !formData.gender || !formData.base_salary) {
        setError('Por favor, completa todos los campos básicos requeridos');
        setLoading(false);
        return;
      }

      let dataToSend = {};

      if (workerType === 'Programador') {
        // Validación específica para programador
        if (!formData.category || !formData.languages.length) {
          setError('Por favor, completa la categoría y al menos un lenguaje para programadores');
          setLoading(false);
          return;
        }

        // Datos para programador
        dataToSend = {
          name: formData.name,
          age: parseInt(formData.age),
          gender: formData.gender,
          base_salary: parseFloat(formData.base_salary),
          category: formData.category,
          languages: formData.languages
        };

        console.log("Creando programador:", dataToSend);
        await workerService.createProgrammer(dataToSend);
      } else {
        // Validación específica para líder
        if (!formData.experience_years || !formData.directed_projects) {
          setError('Por favor, completa los años de experiencia y proyectos dirigidos para líderes');
          setLoading(false);
          return;
        }

        // Datos para líder
        dataToSend = {
          name: formData.name,
          age: parseInt(formData.age),
          gender: formData.gender,
          base_salary: parseFloat(formData.base_salary),
          experience_years: parseInt(formData.experience_years),
          directed_projects: parseInt(formData.directed_projects)
        };

        console.log("Creando líder:", dataToSend);
        await workerService.createLeader(dataToSend);
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

  const handleDeleteWorker = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log("=== INICIANDO ELIMINACIÓN ===");
      console.log("Trabajador a eliminar:", currentWorker);
      
      if (!currentWorker) {
        throw new Error("No hay trabajador seleccionado para eliminar");
      }
      
      if (!currentWorker.id) {
        throw new Error("El trabajador no tiene un ID válido");
      }
      
      // Pasar tanto el ID como el objeto completo del trabajador
      await workerService.delete(currentWorker.id, currentWorker);
      
      console.log("=== ELIMINACIÓN COMPLETADA ===");
      
      // Recargar la lista de trabajadores
      await loadWorkers();
      
      // Cerrar el diálogo
      handleCloseDeleteDialog();
      
      // Opcional: mostrar mensaje de éxito
      // setSuccess("Trabajador eliminado exitosamente");
      
    } catch (error) {
      console.error("=== ERROR EN handleDeleteWorker ===");
      console.error("Error:", error);
      
      setError(error.message || 'Error al eliminar el trabajador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Trabajadores
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
        sx={{ mb: 3 }}
      >
        Nuevo Trabajador
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Edad</TableCell>
              <TableCell>Género</TableCell>
              <TableCell>Salario Base</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Detalles</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : workers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No hay trabajadores registrados
                </TableCell>
              </TableRow>
            ) : (
              workers.map((worker) => (
                <TableRow key={worker.id}>
                  <TableCell>{worker.name}</TableCell>
                  <TableCell>{worker.age}</TableCell>
                  <TableCell>{worker.gender}</TableCell>
                  <TableCell>${worker.base_salary}</TableCell>
                  <TableCell>{worker.category ? 'Programador' : 'Líder'}</TableCell>
                  <TableCell>
                    {worker.category ? (
                      <div>
                        <div>Categoría: {worker.category}</div>
                        <div>Lenguajes: {worker.languages?.join(', ')}</div>
                      </div>
                    ) : (
                      <div>
                        <div>Experiencia: {worker.experience_years} años</div>
                        <div>Proyectos: {worker.directed_projects}</div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Editar">
                      <IconButton 
                        color="primary"
                        onClick={() => handleOpenDialog(worker)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton 
                        color="error"
                        onClick={() => handleOpenDeleteDialog(worker)}
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

      {/* Diálogo para crear/editar trabajador */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentWorker ? 'Editar Trabajador' : 'Crear Trabajador'}
        </DialogTitle>
        <DialogContent>
          {/* Selector de tipo de trabajador (solo en modo creación) */}
          {!currentWorker && (
            <FormControl fullWidth margin="dense">
              <InputLabel>Tipo de Trabajador</InputLabel>
              <Select
                value={workerType}
                onChange={handleWorkerTypeChange}
                label="Tipo de Trabajador"
              >
                <MenuItem value="Programador">Programador</MenuItem>
                <MenuItem value="Líder">Líder</MenuItem>
              </Select>
            </FormControl>
          )}

          {/* Campos comunes */}
          <TextField
            margin="dense"
            name="name"
            label="Nombre"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="age"
            label="Edad"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.age}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Género</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              label="Género"
              required
            >
              <MenuItem value="Masculino">Masculino</MenuItem>
              <MenuItem value="Femenino">Femenino</MenuItem>
              <MenuItem value="Otro">Otro</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="base_salary"
            label="Salario Base"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.base_salary}
            onChange={handleChange}
            required
          />

          {/* Campos específicos para programador */}
          {workerType === 'Programador' && (
            <>
              <TextField
                margin="dense"
                name="category"
                label="Categoría"
                fullWidth
                variant="outlined"
                value={formData.category}
                onChange={handleChange}
                required
              />
              <TextField
                margin="dense"
                name="languages"
                label="Lenguajes de Programación (separados por comas)"
                fullWidth
                variant="outlined"
                value={formData.languages.join(', ')}
                onChange={handleLanguagesChange}
                placeholder="JavaScript, Python, Java"
                required
              />
            </>
          )}

          {/* Campos específicos para líder */}
          {workerType === 'Líder' && (
            <>
              <TextField
                margin="dense"
                name="experience_years"
                label="Años de Experiencia"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.experience_years}
                onChange={handleChange}
                required
              />
              <TextField
                margin="dense"
                name="directed_projects"
                label="Proyectos Dirigidos"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.directed_projects}
                onChange={handleChange}
                required
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveWorker} 
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
            ¿Estás seguro que deseas eliminar al trabajador 
            {currentWorker ? ` "${currentWorker.name}"` : ''}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteWorker} 
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

export default Workers;