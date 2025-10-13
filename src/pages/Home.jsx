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
  Stack, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
} from '@mui/material';
import { LocationOn, AccessTime, Search as SearchIcon, Add, FilterList } from '@mui/icons-material';
// Assume these imports exist in your project setup
import { catsApi, authApi } from '../Services/api'; 
import CatCard from '../components/CatCard'; // Make sure this path is correct
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterAge, setFilterAge] = useState('');
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
      
      const locationMatch = filterLocation === '' || (cat.location && cat.location.toLowerCase().includes(filterLocation.toLowerCase()));
      const ageMatch = filterAge === '' || (cat.age && cat.age.toLowerCase() === filterAge.toLowerCase());

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
    <Container maxWidth="xl" disableGutters sx={{ minHeight: '100vh' }}>
      
      {/* 🌟 Full-Width Minimalist Header */}
      <Box sx={{ 
        pt: { xs: 4, md: 8 }, 
        pb: { xs: 2, md: 4 }, 
        px: 4,
        textAlign: 'center',
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Typography 
          variant="h3" 
          component="h1"
          sx={{ 
            fontWeight: 900, 
            color: theme.palette.primary.main,
            letterSpacing: -1,
            mb: 1,
            fontSize: { xs: '2.5rem', md: '3.75rem' } 
          }}
        >
          Lost & Found Felines
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
          Browse the latest reported sightings or post a missing/found cat report.
        </Typography>
      </Box>

      {/* 🚀 Sticky Advanced Filter Bar - Highly Responsive */}
      <Box 
        sx={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 1000, 
          py: 2, 
          backgroundColor: theme.palette.background.default,
          boxShadow: theme.shadows[2], 
          px: 4,
        }}
      >
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={2} 
          alignItems="center" 
          justifyContent="space-between"
          sx={{ width: '100%' }} 
        >
          {/* Filters & Search */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            flexGrow={1} 
            sx={{ width: { xs: '100%', md: 'auto' } }} 
          >
            {/* Search Field */}
            <TextField
              size="small"
              placeholder="Quick search by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
              }}
              sx={{ minWidth: 200, width: { xs: '100%', sm: 'auto' } }}
            />
            
            {/* Location Filter */}
            <FormControl size="small" sx={{ minWidth: 150, width: { xs: '100%', sm: 'auto' } }}>
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

            {/* Age Filter */}
            <FormControl size="small" sx={{ minWidth: 120, width: { xs: '100%', sm: 'auto' } }}>
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
          
          {/* Actions */}
          <Stack 
            direction="row" 
            spacing={1.5} 
            alignItems="center"
            justifyContent={{ xs: 'space-between', md: 'flex-start' }} 
            sx={{ width: { xs: '100%', md: 'auto' } }} 
          >
            {isLoggedIn ? (
              <>
                <Button 
                  variant="contained" 
                  size="medium" 
                  onClick={() => navigate('/post')}
                  startIcon={<Add />}
                  sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  Post Sighting
                </Button>
                <Chip 
                  label={user?.name || 'User'}
                  avatar={<Avatar sx={{ bgcolor: theme.palette.secondary.main }}>{user?.name?.[0]}</Avatar>}
                  color="secondary"
                  size="medium"
                  onClick={() => navigate('/dashboard')} 
                  sx={{ cursor: 'pointer', fontWeight: 600, flexShrink: 1 }}
                />
              </>
            ) : (
              <>
                <Button 
                  variant="outlined" 
                  size="medium" 
                  onClick={() => navigate('/login')}
                  sx={{ width: { xs: '100%', sm: 'auto', md: 'auto' } }}
                >
                  Log In
                </Button>
                <Button 
                  variant="contained" 
                  size="medium" 
                  onClick={() => navigate('/register')}
                  sx={{ width: { xs: '100%', sm: 'auto', md: 'auto' }, display: { xs: 'none', sm: 'inline-flex' } }}
                >
                  Register
                </Button>
              </>
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
              opacity: 0.8,
              m: 2 
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
            {/* The responsive Grid configuration for 4 cards on desktop: */}
            {filteredCats.map((cat) => (
              <Grid 
                item 
                xs={12}    // 1 card per row on mobile
                sm={6}     // 2 cards per row on small screens
                md={4}     // 3 cards per row on medium screens
                lg={3}     // **4 cards per row on large screens** (12 / 3 = 4)
                key={cat._id}
              > 
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