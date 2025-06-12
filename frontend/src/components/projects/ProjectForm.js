import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  IconButton,
  Typography
} from '@mui/material';
import { Close, Add } from '@mui/icons-material';

const ProjectForm = ({ open, onClose, onSubmit, project, mode }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    cliente: '',
    estado: 'Planificación',
    fecha_inicio: '',
    fecha_fin: '',
    presupuesto: '',
    tecnologias: []
  });

  const [newTech, setNewTech] = useState('');
  const [errors, setErrors] = useState({});

  const estados = ['Planificación', 'En Progreso', 'Pausado', 'Completado', 'Cancelado'];

  useEffect(() => {
    if (project && mode === 'edit') {
      setFormData({
        nombre: project.nombre || '',
        descripcion: project.descripcion || '',
        cliente: project.cliente || '',
        estado: project.estado || 'Planificación',
        fecha_inicio: project.fecha_inicio || '',
        fecha_fin: project.fecha_fin || '',
        presupuesto: project.presupuesto || '',
        tecnologias: project.tecnologias || []
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        cliente: '',
        estado: 'Planificación',
        fecha_inicio: '',
        fecha_fin: '',
        presupuesto: '',
        tecnologias: []
      });
    }
    setErrors({});
  }, [project, mode, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddTechnology = () => {
    if (newTech.trim() && !formData.tecnologias.includes(newTech.trim())) {
      setFormData(prev => ({
        ...prev,
        tecnologias: [...prev.tecnologias, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const handleRemoveTechnology = (techToRemove) => {
    setFormData(prev => ({
      ...prev,
      tecnologias: prev.tecnologias.filter(tech => tech !== techToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    if (!formData.cliente.trim()) {
      newErrors.cliente = 'El cliente es requerido';
    }

    if (!formData.fecha_inicio) {
      newErrors.fecha_inicio = 'La fecha de inicio es requerida';
    }

    if (!formData.fecha_fin) {
      newErrors.fecha_fin = 'La fecha de fin es requerida';
    }

    if (formData.fecha_inicio && formData.fecha_fin && formData.fecha_inicio > formData.fecha_fin) {
      newErrors.fecha_fin = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    if (!formData.presupuesto || formData.presupuesto <= 0) {
      newErrors.presupuesto = 'El presupuesto debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const dataToSubmit = {
        ...formData,
        presupuesto: parseFloat(formData.presupuesto)
      };
      onSubmit(dataToSubmit);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newTech.trim()) {
      handleAddTechnology();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ sx: { minHeight: '70vh' } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {mode === 'edit' ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Información básica */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre del Proyecto"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cliente"
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
                error={!!errors.cliente}
                helperText={errors.cliente}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                error={!!errors.descripcion}
                helperText={errors.descripcion}
                multiline
                rows={3}
                required
              />
            </Grid>

            {/* Estado y fechas */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  label="Estado"
                >
                  {estados.map((estado) => (
                    <MenuItem key={estado} value={estado}>
                      {estado}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Fecha de Inicio"
                name="fecha_inicio"
                type="date"
                value={formData.fecha_inicio}
                onChange={handleChange}
                error={!!errors.fecha_inicio}
                helperText={errors.fecha_inicio}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Fecha de Fin"
                name="fecha_fin"
                type="date"
                value={formData.fecha_fin}
                onChange={handleChange}
                error={!!errors.fecha_fin}
                helperText={errors.fecha_fin}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            {/* Presupuesto */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Presupuesto"
                name="presupuesto"
                type="number"
                value={formData.presupuesto}
                onChange={handleChange}
                error={!!errors.presupuesto}
                helperText={errors.presupuesto}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                }}
                required
              />
            </Grid>

            {/* Tecnologías */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Tecnologías
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Agregar tecnología"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="ej: React, Node.js, MongoDB"
                />
                <Button
                  variant="outlined"
                  onClick={handleAddTechnology}
                  disabled={!newTech.trim()}
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  <Add />
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.tecnologias.map((tech, index) => (
                  <Chip
                    key={index}
                    label={tech}
                    onDelete={() => handleRemoveTechnology(tech)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            {mode === 'edit' ? 'Actualizar' : 'Crear'} Proyecto
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProjectForm;