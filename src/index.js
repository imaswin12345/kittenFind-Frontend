import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import App from './App';

const theme = createTheme({
  palette: {
    primary: { main: '#4a90e2' },
    secondary: { main: '#f5a623' },
  },
  typography: { fontFamily: 'Roboto, Arial, sans-serif' },
});

// Create Emotion cache for MUI (fixes hydration)
const cache = createCache({ key: 'css', prepend: true });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CacheProvider value={cache}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </CacheProvider>
);