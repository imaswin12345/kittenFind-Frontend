import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Button, 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Card, 
  CardActions,
  useTheme,
  Chip,
  Avatar,
  IconButton,
  Stack
} from '@mui/material';
import { AddCircle, Edit, Delete, Pets } from '@mui/icons-material'; // Added new icons
import { catsApi, authApi } from '../Services/api'; 
import CatCard from '../components/CatCard'; // Ensure CatCard is updated for a modern look
import CatForm from '../components/CatForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editCat, setEditCat] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  // Function to fetch and filter cats, made into a useCallback
  const fetchUserCats = useCallback(async (currentUser) => {
    setError(null); // Clear previous errors
    try {
      const catsRes = await catsApi.getAll();
      if (currentUser?._id) {
        // Filter posts owned by the current user
        const userCats = catsRes.data.filter(cat => cat.user?._id === currentUser._id);
        setCats(userCats);
      } else {
        setCats([]); 
      }
    } catch (err) {
      console.error('Fetch cats error:', err);
      setError('Failed to refresh cat list.');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userRes = await authApi.getMe();
        const currentUser = userRes.data;
        setUser(currentUser);
        await fetchUserCats(currentUser);

      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load user data or dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchUserCats]); // Dependency on stable fetchUserCats

  const handleEdit = (cat) => {
    setEditCat(cat);
    setOpenEdit(true);
  };

  const handleDelete = async (catId) => {
    if (!window.confirm('Are you sure you want to permanently delete this cat post?')) return;
    try {
      await catsApi.delete(catId);
      // Update list optimistically and then re-fetch for sync
      setCats(prevCats => prevCats.filter(cat => cat._id !== catId));
    } catch (err) {
      console.error('Delete error:', err.response?.data || err);
      setError('Delete failed. Check console for details.');
    }
  };

  const handleEditSuccess = () => {
    setOpenEdit(false);
    // Use the useCallback function to refresh the list
    fetchUserCats(user);
  };

  if (loading) return <LoadingSpinner message="Loading your dashboard..." />;
  if (error && !user) return <ErrorMessage message={error} />; // Show error only if user couldn't be loaded

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>

      {/* 🌟 Modern Header and Call-to-Action */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4, 
          pb: 2, 
          borderBottom: `2px solid ${theme.palette.divider}` 
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 56, height: 56 }}>
            <Pets fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Welcome Back, {user?.name || 'User'}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your {cats.length} reported sightings.
            </Typography>
          </Box>
        </Stack>
        
        <Button 
          variant="contained" 
          startIcon={<AddCircle />}
          onClick={() => navigate('/post')}
          sx={{ py: 1.5, px: 3, whiteSpace: 'nowrap', fontWeight: 600 }}
        >
          Post New Cat
        </Button>
      </Box>
      
      {error && <ErrorMessage message={error} />}

      {/* Cat Posts Grid */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Your Active Posts
        </Typography>

        {cats.length === 0 ? (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 8,
              bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
              borderRadius: 2,
              border: `1px dashed ${theme.palette.divider}`,
              opacity: 0.8
            }}
          >
            <Typography variant="h6" gutterBottom color="text.secondary">
              It looks like you haven't posted any cat sightings yet.
            </Typography>
            <Button 
              onClick={() => navigate('/post')} 
              variant="text" 
              startIcon={<AddCircle />}
              sx={{ mt: 1 }}
            >
              Start Posting Now
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {cats.map(cat => (
              // Enhanced structure for management within the grid item
              <Grid item xs={12} sm={6} md={4} key={cat._id}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    borderRadius: 2,
                    display: 'flex', 
                    flexDirection: 'column',
                    // Optional: subtle hover effect
                    transition: 'box-shadow 0.3s',
                    '&:hover': {
                      boxShadow: theme.shadows[6]
                    }
                  }}
                >
                  {/* CatCard component takes up the main body of the Card */}
                  <CatCard cat={cat} isDashboard={true} /> 
                  
                  {/* Action Bar integrated into the Card Footer */}
                  <CardActions sx={{ justifyContent: 'flex-end', p: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Chip 
                      label={cat.status || 'Active'} 
                      size="small" 
                      color={cat.status === 'Found' ? 'success' : 'info'} 
                      sx={{ mr: 'auto', ml: 1, fontWeight: 600 }} 
                    />
                    <IconButton aria-label="edit" onClick={() => handleEdit(cat)} color="primary">
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDelete(cat._id)} color="error">
                      <Delete fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Edit Dialog remains simple and functional */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
          Edit Post: {editCat?.name || 'Cat Details'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {editCat && <CatForm initialData={editCat} onSuccess={handleEditSuccess} />}
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default Dashboard;