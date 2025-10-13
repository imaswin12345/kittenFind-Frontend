import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Remove BrowserRouter import
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PostCat from './pages/PostCat';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CatDetail from './pages/CatDetail';
import ProtectedRoute from './components/ProtectedRoute';
import CatForm from './components/CatForm';
import Footer from './components/Footer';

const theme = createTheme({
  palette: { primary: { main: '#4CAF50' } },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar />
        <Routes>  {/* No <Router> here—index.js handles it */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post" element={<ProtectedRoute><CatForm /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/cats/:id" element={<CatDetail />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;