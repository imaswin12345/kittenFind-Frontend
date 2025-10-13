import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Button, 
  Box, 
  TextField, 
  Chip, 
  Avatar, 
  InputAdornment,
  useTheme,
  Stack, // For horizontal alignment
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
} from '@mui/material';
import { LocationOn, AccessTime, Search as SearchIcon, Add, FilterList } from '@mui/icons-material';
import { catsApi, authApi } from '../Services/api'; 
import CatCard from '../components/CatCard'; // Assume CatCard has also been modernized
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterLocation, setFilterLocation] = useState(''); // New state for filter
  const [filterAge, setFilterAge] = useState('');         // New state for filter
  const [user, setUser] = useState(null);
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, userRes] = await Promise.all([
          catsApi.getAll(),
          isLoggedIn ? authApi.getMe() : Promise.resolve({ data: null }),
        ]);
        
        setCats(catsRes.data);
        if (isLoggedIn && userRes.data) {
          setUser(userRes.data);
        }
      } catch (err) {
        setError('Failed to load cats or user data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isLoggedIn]);

  // Combined Filtering Logic
  const filteredCats = useMemo(() => {
    return cats.filter(cat => {
      const searchMatch = (
        cat.name.toLowerCase().includes(search.toLowerCase()) ||
        cat.location.toLowerCase().includes(search.toLowerCase())
      );
      
      const locationMatch = filterLocation === '' || cat.location.toLowerCase().includes(filterLocation.toLowerCase());
      const ageMatch = filterAge === '' || cat.age.toLowerCase() === filterAge.toLowerCase();

      return searchMatch && locationMatch && ageMatch;
    });
  }, [cats, search, filterLocation, filterAge]);

  // Helper function to get unique locations (for the Select filter)
  const uniqueLocations = useMemo(() => {
    const locations = cats.map(cat => cat.location).filter(Boolean);
    return [...new Set(locations)];
  }, [cats]);

  if (loading) return <LoadingSpinner message="Loading the Feline Directory..." />;

  return (
    <Container maxWidth="xl" disableGutters sx={{ minHeight: '100vh' }}> {/* Full width container */}
      
      {/* 🌟 Full-Width Minimalist Header */}
      <Box sx={{ 
        pt: 8, 
        pb: 4, 
        px: 4,
        textAlign: 'center',
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Typography 
          variant="h2" 
          component="h1"
          sx={{ 
            fontWeight: 900, 
            color: theme.palette.primary.main,
            letterSpacing: -1,
            mb: 1
          }}
        >
          Lost & Found Felines
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Browse the latest reported sightings or post a missing/found cat report.
        </Typography>
      </Box>

      {/* 🚀 Sticky Advanced Filter Bar and User Actions */}
      <Box 
        sx={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 1000, 
          py: 2, 
          backgroundColor: theme.palette.background.default, // Ensures it stands out over content
          boxShadow: theme.shadows[2], 
          px: 4,
        }}
      >
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={2} 
          alignItems="center" 
          // *** THIS ACHIEVES LEFT/RIGHT ALIGNMENT ***
          justifyContent="space-between"
          // *****************************************
        >
          {/* Filters & Search (Left/Center) */}
          <Stack 
            direction="row" 
            spacing={2} 
            flexGrow={1} 
            sx={{ width: { xs: '100%', md: 'auto' } }}
          >
            <TextField
              size="small"
              placeholder="Quick search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
              }}
              sx={{ minWidth: 200 }}
            />
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="location-select-label">Location</InputLabel>
              <Select
                labelId="location-select-label"
                value={filterLocation}
                label="Location"
                onChange={(e) => setFilterLocation(e.target.value)}
              >
                <MenuItem value="">Any Location</MenuItem>
                {uniqueLocations.map(loc => (
                  <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="age-select-label">Age</InputLabel>
              <Select
                labelId="age-select-label"
                value={filterAge}
                label="Age"
                onChange={(e) => setFilterAge(e.target.value)}
              >
                <MenuItem value="">Any Age</MenuItem>
                <MenuItem value="Kitten">Kitten</MenuItem>
                <MenuItem value="Young">Young</MenuItem>
                <MenuItem value="Adult">Adult</MenuItem>
                <MenuItem value="Senior">Senior</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          
          {/* Actions (Right) */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {isLoggedIn ? (
              <>
                <Button 
                  variant="contained" 
                  size="small"
                  onClick={() => navigate('/post')}
                  startIcon={<Add />}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Post Sighting
                </Button>
                <Chip 
                  label={user?.name || 'User'}
                  avatar={<Avatar sx={{ bgcolor: theme.palette.secondary.main }}>{user?.name?.[0]}</Avatar>}
                  color="secondary"
                  size="medium"
                  onClick={() => navigate('/dashboard')} 
                  sx={{ cursor: 'pointer', fontWeight: 600 }}
                />
              </>
            ) : (
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => navigate('/login')}
              >
                Log In
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>

      {/* Cat Grid Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {error && <ErrorMessage message={error} />}
        
        {filteredCats.length === 0 ? (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 10,
              bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50],
              borderRadius: 3,
              border: `2px dashed ${theme.palette.divider}`,
              opacity: 0.8
            }}
          >
            <Typography variant="h5" gutterBottom color="text.secondary">
              {search || filterLocation || filterAge ? 'No matches found.' : 'No recent sightings posted yet.'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your filters or search terms.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {filteredCats.map((cat) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={cat._id}> {/* Added lg={3} for a denser, modern grid */}
                <CatCard cat={cat} /> 
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Container>
  );
};

export default Home;