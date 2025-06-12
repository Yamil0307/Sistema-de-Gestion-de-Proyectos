import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider
} from '@mui/material';
import { ExitToApp, Person } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    navigate('/login');
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isActive = (path) => location.pathname === path;

  if (!user) return null;

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}
        >
          Sistema de Gestión - Empresa de Software
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button 
            color="inherit" 
            onClick={() => navigate('/dashboard')}
            variant={isActive('/dashboard') ? 'outlined' : 'text'}
            sx={{ 
              borderColor: isActive('/dashboard') ? 'white' : 'transparent',
              color: 'white'
            }}
          >
            Dashboard
          </Button>
          
          <Button 
            color="inherit" 
            onClick={() => navigate('/projects')}
            variant={isActive('/projects') ? 'outlined' : 'text'}
            sx={{ 
              borderColor: isActive('/projects') ? 'white' : 'transparent',
              color: 'white'
            }}
          >
            Proyectos
          </Button>

          <Button 
            color="inherit" 
            onClick={() => navigate('/workers')}
            variant={isActive('/workers') ? 'outlined' : 'text'}
            sx={{ 
              borderColor: isActive('/workers') ? 'white' : 'transparent',
              color: 'white'
            }}
          >
            Trabajadores
          </Button>

          <Button 
            color="inherit" 
            onClick={() => navigate('/teams')}
            variant={isActive('/teams') ? 'outlined' : 'text'}
            sx={{ 
              borderColor: isActive('/teams') ? 'white' : 'transparent',
              color: 'white'
            }}
          >
            Equipos
          </Button>

          <Button 
            color="inherit" 
            onClick={() => navigate('/management')}
            variant={isActive('/management') ? 'outlined' : 'text'}
            sx={{ 
              borderColor: isActive('/management') ? 'white' : 'transparent',
              color: 'white'
            }}
          >
            Lógica de Negocio
          </Button>
          
          <IconButton
            onClick={handleMenu}
            sx={{ ml: 2 }}
            color="inherit"
          >
            <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
              {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 3,
              sx: { mt: 1.5, minWidth: 180 }
            }}
          >
            <MenuItem disabled>
              <Person sx={{ mr: 1 }} />
              {user.nombre || 'Usuario'}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} />
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;