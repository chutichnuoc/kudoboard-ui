// src/components/common/Header.tsx
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Stack,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import logo from '../../assets/logo.png'; // You'll need to add a logo image
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  title: string;
  path: string;
  authRequired?: boolean;
  guestOnly?: boolean;
}

const navItems: NavItem[] = [
  { title: 'How It Works', path: '/how-it-works' },
  { title: 'Examples', path: '/examples' },
  { title: 'Pricing', path: '/pricing' },
  { title: 'My Boards', path: '/my-boards', authRequired: true },
];

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCreateBoard = () => {
    navigate('/create-board');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredNavItems = navItems.filter(item => {
    if (item.authRequired && !isAuthenticated) return false;
    if (item.guestOnly && isAuthenticated) return false;
    return true;
  });

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
          Kudoboard
        </Typography>
        <IconButton edge="end" color="inherit" aria-label="close drawer" onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {filteredNavItems.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton
              sx={{ textAlign: 'center' }}
              component={RouterLink}
              to={item.path}
            >
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          {isAuthenticated ? (
            <ListItemButton
              sx={{ textAlign: 'center' }}
              onClick={handleLogout}
            >
              <ListItemText primary="Logout" />
            </ListItemButton>
          ) : (
            <ListItemButton
              sx={{ textAlign: 'center' }}
              onClick={handleLogin}
            >
              <ListItemText primary="Login" />
            </ListItemButton>
          )}
        </ListItem>
        {isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                textAlign: 'center',
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                borderRadius: 2,
                m: 1,
              }}
              onClick={handleCreateBoard}
            >
              <ListItemText primary="Create a Board" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" color="default" elevation={0} sx={{ bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo and title for larger screens */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 700,
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Kudoboard Logo"
              sx={{ height: 40, mr: 1 }}
            />
            Kudoboard
          </Typography>

          {/* Mobile menu button */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexGrow: 1 }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 700,
              }}
            >
              <Box
                component="img"
                src={logo}
                alt="Kudoboard Logo"
                sx={{ height: 32, mr: 1 }}
              />
              Kudoboard
            </Typography>
          </Box>

          {/* Navigation links for larger screens */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
            {filteredNavItems.map((item) => (
              <Link
                key={item.title}
                component={RouterLink}
                to={item.path}
                sx={{
                  mx: 1.5,
                  color: 'text.primary',
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {item.title}
              </Link>
            ))}

            {isAuthenticated && (
              <Box sx={{ display: 'flex', alignItems: 'center', mx: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Hi, {currentUser?.name || 'User'}
                </Typography>
              </Box>
            )}

            {/* Change from Create Board to Login/Logout button */}
            {isAuthenticated ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogout}
                sx={{ ml: 2 }}
              >
                Logout
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogin}
                sx={{ ml: 2 }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;