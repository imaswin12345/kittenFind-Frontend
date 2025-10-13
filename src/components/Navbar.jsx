import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton } from '@mui/material';
import { Add, Home, Pets, Login, Logout, PersonAdd, Dashboard as DashboardIcon } from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ px: { xs: 0 }, py: 1.5 }}>
          {/* Logo */}
          <Box 
            component={Link} 
            to="/" 
            sx={{ 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexGrow: { xs: 1, md: 0 },
              mr: { md: 6 }
            }}
          >
            <Pets sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 800,
                color: 'text.primary',
                letterSpacing: '-0.5px'
              }}
            >
              KittyFind
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, flexGrow: 1 }}>
            <Button
              component={Link}
              to="/"
              startIcon={<Home />}
              sx={{
                color: isActive('/') ? 'primary.main' : 'text.secondary',
                fontWeight: isActive('/') ? 700 : 500,
                textTransform: 'none',
                fontSize: '1rem',
                px: 2,
                bgcolor: isActive('/') ? 'primary.lighter' : 'transparent',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              Home
            </Button>

            {isAuthenticated && (
              <>
                <Button
                  component={Link}
                  to="/post"
                  startIcon={<Add />}
                  sx={{
                    color: isActive('/post') ? 'primary.main' : 'text.secondary',
                    fontWeight: isActive('/post') ? 700 : 500,
                    textTransform: 'none',
                    fontSize: '1rem',
                    px: 2,
                    bgcolor: isActive('/post') ? 'primary.lighter' : 'transparent',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  Post Cat
                </Button>
                <Button
                  component={Link}
                  to="/dashboard"
                  startIcon={<DashboardIcon />}
                  sx={{
                    color: isActive('/dashboard') ? 'primary.main' : 'text.secondary',
                    fontWeight: isActive('/dashboard') ? 700 : 500,
                    textTransform: 'none',
                    fontSize: '1rem',
                    px: 2,
                    bgcolor: isActive('/dashboard') ? 'primary.lighter' : 'transparent',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  Dashboard
                </Button>
              </>
            )}
          </Box>

          {/* Auth Buttons - Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5 }}>
            {isAuthenticated ? (
              <Button
                onClick={handleLogout}
                startIcon={<Logout />}
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 3,
                  borderColor: 'divider',
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: 'error.main',
                    color: 'error.main',
                    bgcolor: 'error.lighter'
                  }
                }}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  startIcon={<Login />}
                  variant="outlined"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 3,
                    borderColor: 'divider',
                    color: 'text.secondary',
                    '&:hover': {
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      bgcolor: 'primary.lighter'
                    }
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  startIcon={<PersonAdd />}
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 3,
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Navigation */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            {isAuthenticated ? (
              <>
                <IconButton
                  component={Link}
                  to="/post"
                  color={isActive('/post') ? 'primary' : 'default'}
                  sx={{
                    bgcolor: isActive('/post') ? 'primary.lighter' : 'transparent'
                  }}
                >
                  <Add />
                </IconButton>
                <IconButton
                  component={Link}
                  to="/dashboard"
                  color={isActive('/dashboard') ? 'primary' : 'default'}
                  sx={{
                    bgcolor: isActive('/dashboard') ? 'primary.lighter' : 'transparent'
                  }}
                >
                  <DashboardIcon />
                </IconButton>
                <IconButton
                  onClick={handleLogout}
                  color="default"
                >
                  <Logout />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton
                  component={Link}
                  to="/login"
                  color="default"
                >
                  <Login />
                </IconButton>
                <IconButton
                  component={Link}
                  to="/register"
                  color="primary"
                >
                  <PersonAdd />
                </IconButton>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;