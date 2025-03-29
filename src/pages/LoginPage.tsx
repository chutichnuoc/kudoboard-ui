import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Stack,
  Link,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { LoginRequest } from '../types/authTypes';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form state
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Call login through the auth context
      await login(formData.email, formData.password);
      console.log("Login completed, redirecting...");

      // Redirect to home page
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
        }}
      >
        <Typography component="h1" variant="h5" fontWeight="bold">
          Log in to Kudoboard
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={24} /> : null}
          >
            Log In
          </Button>

          <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
            <Link component={RouterLink} to="/register" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
