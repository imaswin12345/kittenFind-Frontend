import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  ImageList,
  ImageListItem,
  Grid,
  Button,
  Chip,
  Box
} from '@mui/material';
import { catsApi } from '../Services/api';
import LoadingSpinner from '../components/LoadingSpinner';

function CatDetail() {
  const { id } = useParams();
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = 'https://kittenfind-backend-5.onrender.com'; // Updated for production

  useEffect(() => {
    catsApi
      .getOne(id)
      .then((res) => {
        console.log('Cat data:', res.data);
        setCat(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching cat:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!cat) return <Typography>No cat found.</Typography>;

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Interested in ${cat.name}: ${cat.description}`);
    window.open(`https://wa.me/${cat.user?.phone}?text=${msg}`);
  };

  const getPhotoUrl = (photo) => {
    if (!photo) return '';
    if (typeof photo === 'object' && photo.url) return `${BASE_URL}${photo.url}`;
    if (typeof photo === 'string') {
      return photo.startsWith('http') ? photo : `${BASE_URL}${photo}`;
    }
    return '';
  };

  return (
    <Container sx={{ py: 2 }}>
      <Typography variant="h3" sx={{ mb: 2 }}>
        {cat.name}
      </Typography>

      <Grid container spacing={3}>
        {/* Left Side - Images */}
        <Grid item xs={12} md={7}>
          {cat.photos && cat.photos.length > 0 && (
            <ImageList cols={3} sx={{ mb: 2 }}>
              {cat.photos.map((photo, i) => (
                <ImageListItem key={i}>
                  <img
                    src={getPhotoUrl(photo)}
                    alt={`Cat ${i}`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      console.error('Image failed to load:', getPhotoUrl(photo));
                      e.target.src = 'https://via.placeholder.com/300?text=Image+Not+Found';
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </Grid>

        {/* Right Side - Details */}
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Chip
              label={cat.adopted ? 'Adopted' : 'Available'}
              color={cat.adopted ? 'default' : 'success'}
              sx={{ width: 'fit-content', mb: 1 }}
            />
            <Typography variant="body1">
              <strong>Age:</strong> {cat.age}
            </Typography>
            <Typography variant="body1">
              <strong>Gender:</strong> {cat.gender}
            </Typography>
            <Typography variant="body1">
              <strong>Location:</strong> {cat.location}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {cat.description}
            </Typography>

            <Button
              onClick={handleWhatsApp}
              variant="contained"
              color="success"
              sx={{ mt: 2, width: 'fit-content' }}
              disabled={!cat.user?.phone}
            >
              Contact via WhatsApp
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CatDetail;