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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Checkbox,
  Divider
} from '@mui/material';
import { Close, Add, Remove, Person, Groups } from '@mui/icons-material';

const TeamForm = ({ open, onClose, onSubmit, team, mode }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    lider_id: '',
    miembros_ids: [],
    tecnologias: [],
    estado: 'En Formación'
  });

  const [newTech, setNewTech] = useState('');
  const [errors, setErrors] = useState({});

  // Mock data de trabajadores disponibles
  const availableWorkers = [
    { id: 1, nombre: 'Juan Carlos Pérez', tipo: 'Programador', avatar: 'JP' },
    { id: 2, nombre: 'María Fernanda González', tipo: 'Líder', avatar: 'MG' },
    { id: 3, nombre: 'Carlos Eduardo Martínez', tipo: 'Programador', avatar: 'CM' },
    { id: 4, nombre: 'Ana Sofía Rodríguez', tipo: 'Programador', avatar: 'AR' },
    { id: 5, nombre: 'Roberto Alejandro Silva', tipo: 'Líder', avatar: 'RS' }
  ];

  const estados = ['En Formación', 'Activo', 'Disponible', 'Inactivo'];
  const lideres = availableWorkers.filter(w => w.tipo === 'Líder');
  const programadores = availableWorkers.filter(w => w.tipo === 'Programador');

  const tecnologiasComunes = [
    'React', 'Angular', 'Vue.js', 'Node.js', 'Express',
    'Python', 'Django', 'Java', 'Spring', 'C#', '.NET',
    'MongoDB', 'PostgreSQL', 'MySQL', 'AWS', 'Azure'
  ];

  useEffect(() => {
    if (team && mode === 'edit') {
      setFormData({
        nombre: team.nombre || '',
        descripcion: team.descripcion || '',
        lider_id: team.lider?.id || '',
        miembros_ids: team.miembros?.map(m => m.id) || [],
        tecnologias: team.tecnologias || [],
        estado: team.estado || 'En Formación'
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        lider_id: '',
        miembros_ids: [],
        tecnologias: [],
        estado: 'En Formación'
      });
    }
    setErrors({});
  }, [team, mode, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleMemberToggle = (memberId) => {
    setFormData(prev => ({
      ...prev,
      miembros_ids: prev.miembros_ids.includes(memberId)
        ? prev.miembros_ids.filter(id => id !== memberId)
        : [...prev.miembros_ids, memberId]
    }));
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
      newErrors.nombre = 'El nombre del equipo es requerido';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    if (!formData.lider_id) {
      newErrors.lider_id = 'Debe seleccionar un líder';
    }

    if (formData.miembros_ids.length === 0) {
      newErrors.miembros = 'Debe agregar al menos un miembro';
    }

    if (formData.tecnologias.length === 0) {
      newErrors.tecnologias = 'Debe agregar al menos una tecnología';
    }

    // Verificar que el líder no esté en la lista de miembros
    if (formData.lider_id && formData.miembros_ids.includes(formData.lider_id)) {
      newErrors.miembros = 'El líder no puede estar en la lista de miembros';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Construir objetos completos para el equipo
      const lider = lideres.find(l => l.id === formData.lider_id);
      const miembros = programadores.filter(p => formData.miembros_ids.includes(p.id));
      
      const dataToSubmit = {
        ...formData,
        lider,
        miembros
      };
      onSubmit(dataToSubmit);
    }
  };

  const getSelectedLider = () => {
    return lideres.find(l => l.id === formData.lider_id);
  };

  const getSelectedMiembros = () => {
    return programadores.filter(p => formData.miembros_ids.includes(p.id));
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ sx: { minHeight: '80vh' } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {mode === 'edit' ? 'Editar Equipo' : 'Formar Nuevo Equipo'}
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
                label="Nombre del Equipo"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.estado}>
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

            {/* Selección de líder */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person /> Seleccionar Líder
              </Typography>
              <FormControl fullWidth error={!!errors.lider_id}>
                <InputLabel>Líder del Equipo</InputLabel>
                <Select
                  name="lider_id"
                  value={formData.lider_id}
                  onChange={handleChange}
                  label="Líder del Equipo"
                >
                  {lideres.map((lider) => (
                    <MenuItem key={lider.id} value={lider.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#f57c00', width: 32, height: 32 }}>
                          {lider.avatar}
                        </Avatar>
                        {lider.nombre}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.lider_id && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {errors.lider_id}
                  </Typography>
                )}
              </FormControl>

              {/* Mostrar líder seleccionado */}
              {getSelectedLider() && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Líder seleccionado:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#f57c00' }}>
                      {getSelectedLider().avatar}
                    </Avatar>
                    <Typography variant="body1">
                      {getSelectedLider().nombre}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Grid>

            {/* Selección de miembros */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Groups /> Seleccionar Miembros
              </Typography>
              
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Selecciona los programadores que formarán parte del equipo:
              </Typography>

              <List sx={{ maxHeight: 300, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1 }}>
                {programadores.map((programador) => (
                  <ListItem 
                    key={programador.id} 
                    button 
                    onClick={() => handleMemberToggle(programador.id)}
                    disabled={programador.id === formData.lider_id}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#1976d2' }}>
                        {programador.avatar}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={programador.nombre}
                      secondary={programador.tipo}
                    />
                    <ListItemSecondaryAction>
                      <Checkbox
                        checked={formData.miembros_ids.includes(programador.id)}
                        onChange={() => handleMemberToggle(programador.id)}
                        disabled={programador.id === formData.lider_id}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>

              {errors.miembros && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  {errors.miembros}
                </Typography>
              )}

              {/* Mostrar miembros seleccionados */}
              {getSelectedMiembros().length > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Miembros seleccionados ({getSelectedMiembros().length}):
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {getSelectedMiembros().map((member) => (
                      <Chip
                        key={member.id}
                        avatar={<Avatar sx={{ bgcolor: '#1976d2' }}>{member.avatar}</Avatar>}
                        label={member.nombre}
                        onDelete={() => handleMemberToggle(member.id)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>

            {/* Tecnologías */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Tecnologías del Equipo
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
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTechnology();
                    }
                  }}
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
                Tecnologías del equipo:
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
            {mode === 'edit' ? 'Actualizar' : 'Formar'} Equipo
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TeamForm;