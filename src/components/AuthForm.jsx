import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../Services/api'; // Fix: Path to services/api.js
import ErrorMessage from './ErrorMessage'; // If missing, see below
import LoadingSpinner from './LoadingSpinner'; // If missing, see below

function AuthForm({ type }) { // 'register' or 'login'
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '', password: '', name: '', phone: '', location: 'Kochi',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const submitData = type === 'register' ? formData : { email: formData.email, password: formData.password };

    try {
      const res = type === 'register' ? await authApi.register(submitData) : await authApi.login(submitData);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const isRegister = type === 'register';

  if (loading) return <LoadingSpinner message={isRegister ? 'Registering...' : 'Logging in...'} />;

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box sx={{ maxWidth: 400, mx: 'auto' }}>
        <Typography variant="h4" align="center">{isRegister ? 'Register' : 'Login'}</Typography>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} required sx={{ mb: 2 }} />
              <TextField fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleChange} required sx={{ mb: 2 }} />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Location</InputLabel>
                <Select name="location" value={formData.location} onChange={handleChange}>
                  <MenuItem value="Kochi">Kochi</MenuItem>
                  <MenuItem value="Ernakulam">Ernakulam</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
          <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required sx={{ mb: 2 }} />
          <TextField fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required sx={{ mb: 2 }} />
          <Button type="submit" fullWidth variant="contained"> {isRegister ? 'Register' : 'Login'}</Button>
        </form>
        {error && <ErrorMessage message={error} />}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="text" onClick={() => navigate(isRegister ? '/login' : '/register')}>
            {isRegister ? 'Login' : 'Register'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default AuthForm;