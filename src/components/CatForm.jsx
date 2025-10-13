import React, { useState } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText, 
  Alert, 
  Paper,
  useTheme, 
  Grid, 
  Stack,
  InputAdornment, // Added for alignment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CloudUpload, Delete, Pets, PinDrop, Info } from '@mui/icons-material';
import { catsApi } from '../Services/api'; 
import ErrorMessage from './ErrorMessage';
// Corrected path assumption (LoadingSpinner is a sibling component)
import LoadingSpinner from './LoadingSpinner'; 
import IconButton from '@mui/material/IconButton';

function CatForm({ initialData = {}, onSuccess }) {
  const navigate = useNavigate();
  const theme = useTheme(); 
  
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    age: initialData.age || '',
    gender: initialData.gender || '',
    location: initialData.location || 'Kochi',
    description: initialData.description || '',
    photos: initialData.photos || [],
  });
  const [photosPreview, setPhotosPreview] = useState(
    Array.isArray(initialData.photos) ? initialData.photos : []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileErrors, setFileErrors] = useState('');

  const isEditMode = !!initialData._id;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const newFiles = Array.from(e.target.files);
    
    // Filter out existing URLs (strings) and combine with new files
    const allPhotos = Array.isArray(formData.photos) 
      ? formData.photos.filter(f => typeof f !== 'string') 
      : [];
    
    const combinedPhotos = [...allPhotos, ...newFiles];
      
    if (combinedPhotos.length > 5) {
      setFileErrors('Max 5 photos allowed in total.');
      return;
    }

    setFileErrors('');
    const previews = combinedPhotos.map(file => 
        typeof file === 'string' ? file : URL.createObjectURL(file)
    );
    setPhotosPreview(previews);
    setFormData({ ...formData, photos: combinedPhotos });
  };

  const removePhoto = (index) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    const newPreviews = photosPreview.filter((_, i) => i !== index);
    setFormData({ ...formData, photos: newPhotos });
    setPhotosPreview(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.age || !formData.gender) {
      setError('All fields marked with (*) are required.');
      return;
    }
    setLoading(true);
    setError(null);

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'photos') {
        // Append only new files (File objects)
        formData.photos.forEach(photo => {
            if (typeof photo !== 'string') {
                submitData.append('photos', photo);
            }
        });
      } else if (key !== '_id') {
        submitData.append(key, formData[key]);
      }
    });

    try {
      if (isEditMode) {
        await catsApi.update(initialData._id, submitData);
      } else {
        await catsApi.create(submitData);
      }
      if (onSuccess) onSuccess();
      else navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || `${isEditMode ? 'Update' : 'Post'} failed—check fields/backend`;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message={`${isEditMode ? 'Updating' : 'Posting'} cat...`} />;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Paper 
        elevation={10} 
        sx={{ 
          p: { xs: 3, md: 5 }, 
          borderRadius: 3, 
          borderTop: `6px solid ${theme.palette.primary.main}` 
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} mb={4}>
          <Pets color="primary" sx={{ fontSize: 40 }} />
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ fontWeight: 700 }}
          >
            {isEditMode ? 'Edit Cat Post' : 'Post a Found Cat'}
          </Typography>
        </Stack>
        
        <form onSubmit={handleSubmit}>
          
          {/* 🐾 Basic Details Group */}
          <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2, color: theme.palette.text.primary }}>
            Cat Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              {/* Cat's Name TextField */}
              <TextField
                fullWidth
                label="Cat's Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                variant="filled"
                helperText="Use 'Unknown' if the name isn't clear."
                // Added slight vertical adjustment for consistency
                sx={{ '& .MuiFilledInput-root': { py: 1 } }} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required variant="filled">
                <InputLabel>Location Found</InputLabel>
                <Select 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  startAdornment={
                    <InputAdornment position="start">
                      <PinDrop color="action" />
                    </InputAdornment>
                  }
                  // FIX: Manual padding adjustment for alignment with filled TextField
                  sx={{ '& .MuiSelect-select': { pt: '27px', pb: '9px' } }}
                >
                  <MenuItem value="Kochi">Kochi</MenuItem>
                  <MenuItem value="Ernakulam">Ernakulam</MenuItem>
                  <MenuItem value="Thrissur">Thrissur</MenuItem>
                  <MenuItem value="Alappuzha">Alappuzha</MenuItem>
                </Select>
                <FormHelperText>Where was the cat last seen?</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required variant="filled">
                <InputLabel>Age</InputLabel>
                <Select 
                  name="age" 
                  value={formData.age} 
                  onChange={handleChange}
                  // FIX: Manual padding adjustment for alignment with filled TextField
                  sx={{ '& .MuiSelect-select': { pt: '27px', pb: '9px' } }}
                >
                  <MenuItem value="">-- Select Age Group --</MenuItem>
                  <MenuItem value="Kitten">Kitten (0-6 months)</MenuItem>
                  <MenuItem value="Young">Young (6-24 months)</MenuItem>
                  <MenuItem value="Adult">Adult (2+ years)</MenuItem>
                  <MenuItem value="Senior">Senior (7+ years)</MenuItem>
                </Select>
                {formData.age === '' && <FormHelperText error>Age is required.</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required variant="filled">
                <InputLabel>Gender</InputLabel>
                <Select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange}
                  // FIX: Manual padding adjustment for alignment with filled TextField
                  sx={{ '& .MuiSelect-select': { pt: '27px', pb: '9px' } }}
                >
                  <MenuItem value="">-- Select Gender --</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Unknown">Unknown</MenuItem>
                </Select>
                {formData.gender === '' && <FormHelperText error>Gender is required.</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>

          {/* 📝 Description */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2, color: theme.palette.text.primary }}>
            Detailed Description
          </Typography>
          <TextField
            fullWidth
            label="Description (Health, collar details, personality, etc.)"
            name="description"
            multiline
            rows={5}
            value={formData.description}
            onChange={handleChange}
            required
            variant="filled"
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Info color="action" sx={{ mr: 1 }}/>
                </InputAdornment>
              ),
            }}
          />
          
          {/* 📸 Photo Upload Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2, color: theme.palette.text.primary }}>
            Photos (Up to 5)
          </Typography>
          
          <Box 
            sx={{ 
              p: 4, 
              mb: 4, 
              backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
              border: `3px dashed ${theme.palette.primary.light}`,
              borderRadius: 2,
              textAlign: 'center'
            }}
          >
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUpload />}
              size="large"
              color="primary"
              sx={{ py: 1.5, px: 4, fontSize: '1rem', fontWeight: 'bold', mb: 2 }}
            >
              Choose High-Quality Photos
              <input
                type="file"
                hidden
                multiple
                accept="image/jpeg,image/png"
                onChange={handlePhotoChange}
                key={photosPreview.length} 
              />
            </Button>
            
            {fileErrors && (
              <Alert severity="error" sx={{ mb: 2, mt: 2 }}>{fileErrors}</Alert>
            )}
            
            {photosPreview.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2} justifyContent="center">
                  {photosPreview.map((preview, idx) => (
                    <Grid item key={idx}>
                      <Box sx={{ position: 'relative', width: 100, height: 100 }}>
                        <img 
                          src={preview} 
                          alt={`Preview ${idx + 1}`} 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover', 
                            borderRadius: 8,
                            border: `3px solid ${theme.palette.primary.main}` 
                          }} 
                        />
                        <IconButton
                          size="small"
                          onClick={() => removePhoto(idx)}
                          sx={{ 
                            position: 'absolute', 
                            top: -8, 
                            right: -8, 
                            bgcolor: theme.palette.error.main, 
                            color: 'white',
                            width: 28, height: 28,
                            boxShadow: theme.shadows[3],
                            '&:hover': { bgcolor: theme.palette.error.dark }
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {photosPreview.some(p => typeof p === 'string') && isEditMode && 'Images with primary borders are currently saved.'}
                </Typography>
              </Box>
            )}
            
            {!photosPreview.length && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                High-quality photos significantly increase the chances of finding the owner!
              </Typography>
            )}
          </Box>

          {error && <ErrorMessage message={error} sx={{ mb: 2 }} />}
          
          {/* 🌟 Focused Submission Block */}
          <Paper 
            elevation={4} 
            sx={{ 
              p: 2, 
              mt: 4, 
              borderRadius: 2,
              bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.background.paper, 
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              size="large"
              disabled={loading}
              color="primary" 
              sx={{ 
                py: 2, 
                fontSize: '1.2rem', 
                fontWeight: 700, 
                borderRadius: 1, 
                boxShadow: theme.shadows[6]
              }}
            >
              {isEditMode ? 'Save All Changes' : 'Submit Cat Post'}
            </Button>
            {isEditMode && (
                <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ mt: 1, py: 1.5, color: theme.palette.error.main }}
                    onClick={() => navigate('/dashboard')}
                >
                    Cancel / Back to Dashboard
                </Button>
            )}
          </Paper>
        </form>
      </Paper>
    </Container>
  );
}

export default CatForm;