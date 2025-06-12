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
  Typography,
  InputAdornment
} from '@mui/material';
import { Close, Add } from '@mui/icons-material';

const WorkerForm = ({ open, onClose, onSubmit, worker, mode }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    tipo: 'Programador',
    nivel: 'Junior',
    experiencia: '',
    salario: '',
    tecnologias: [],
    estado: 'Activo'
  });

  const [newTech, setNewTech] = useState('');
  const [errors, setErrors] = useState({});

  const tipos = ['Programador', 'Líder'];
  const niveles = ['Junior', 'Mid', 'Senior'];
  const estados = ['Activo', 'Inactivo', 'Licencia'];

  const tecnologiasComunes = [
    'React', 'Angular', 'Vue.js', 'Node.js', 'Express',
    'Python', 'Django', 'Flask', 'Java', 'Spring',
    'C#', '.NET', 'PHP', 'Laravel', 'Ruby', 'Rails',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
    'AWS', 'Azure', 'Docker', 'Kubernetes',
    'Git', 'Jenkins', 'React Native', 'Flutter'
  ];

  useEffect(() => {
    if (worker && mode === 'edit') {
      setFormData({
        nombre: worker.nombre || '',
        email: worker.email || '',
        telefono: worker.telefono || '',
        tipo: worker.tipo || 'Programador',
        nivel: worker.nivel || 'Junior',
        experiencia: worker.experiencia || '',
        salario: worker.salario || '',
        tecnologias: worker.tecnologias || [],
        estado: worker.estado || 'Activo'
      });
    } else {
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        tipo: 'Programador',
        nivel: 'Junior',
        experiencia: '',
        salario: '',
        tecnologias: [],
        estado: 'Activo'
      });
    }
    setErrors({});
  }, [worker, mode, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddTechnology = (tech = null) => {
    const techToAdd = tech || newTech.trim();
    if (techToAdd && !formData.tecnologias.includes(techToAdd)) {
      setFormData(prev => ({
        ...prev,
        tecnologias: [...prev.tecnologias, techToAdd]
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

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    if (!formData.experiencia || formData.experiencia < 0) {
      newErrors.experiencia = 'La experiencia debe ser un número positivo';
    }

    if (!formData.salario || formData.salario <= 0) {
      newErrors.salario = 'El salario debe ser mayor a 0';
    }

    if (formData.tecnologias.length === 0) {
      newErrors.tecnologias = 'Debe agregar al menos una tecnología';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const dataToSubmit = {
        ...formData,
        experiencia: parseInt(formData.experiencia),
        salario: parseFloat(formData.salario)
      };
      onSubmit(dataToSubmit);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newTech.trim()) {
      e.preventDefault();
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
          {mode === 'edit' ? 'Editar Trabajador' : 'Agregar Nuevo Trabajador'}
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Información personal */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre Completo"
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
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                error={!!errors.telefono}
                helperText={errors.telefono}
                placeholder="+54 11 1234-5678"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
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

            {/* Información profesional */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  label="Tipo"
                >
                  {tipos.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Nivel</InputLabel>
                <Select
                  name="nivel"
                  value={formData.nivel}
                  onChange={handleChange}
                  label="Nivel"
                >
                  {niveles.map((nivel) => (
                    <MenuItem key={nivel} value={nivel}>
                      {nivel}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Años de Experiencia"
                name="experiencia"
                type="number"
                value={formData.experiencia}
                onChange={handleChange}
                error={!!errors.experiencia}
                helperText={errors.experiencia}
                required
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Salario Mensual"
                name="salario"
                type="number"
                value={formData.salario}
                onChange={handleChange}
                error={!!errors.salario}
                helperText={errors.salario}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
              />
            </Grid>

            {/* Tecnologías */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Tecnologías *
              </Typography>
              
              {/* Tecnologías comunes */}
              <Typography variant="subtitle2" gutterBottom color="textSecondary">
                Tecnologías comunes:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {tecnologiasComunes.filter(tech => !formData.tecnologias.includes(tech)).map((tech) => (
                  <Chip
                    key={tech}
                    label={tech}
                    variant="outlined"
                    size="small"
                    onClick={() => handleAddTechnology(tech)}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>

              {/* Agregar tecnología personalizada */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Agregar tecnología personalizada"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyPress={handleKeyPress}
                  error={!!errors.tecnologias}
                  helperText={errors.tecnologias}
                />
                <Button
                  variant="outlined"
                  onClick={() => handleAddTechnology()}
                  disabled={!newTech.trim()}
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  <Add />
                </Button>
              </Box>
              
              {/* Tecnologías seleccionadas */}
              <Typography variant="subtitle2" gutterBottom>
                Tecnologías seleccionadas:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: 40 }}>
                {formData.tecnologias.map((tech, index) => (
                  <Chip
                    key={index}
                    label={tech}
                    onDelete={() => handleRemoveTechnology(tech)}
                    color="primary"
                  />
                ))}
                {formData.tecnologias.length === 0 && (
                  <Typography variant="body2" color="textSecondary" sx={{ alignSelf: 'center' }}>
                    Selecciona al menos una tecnología
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            {mode === 'edit' ? 'Actualizar' : 'Agregar'} Trabajador
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default WorkerForm;