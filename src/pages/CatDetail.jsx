import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, ImageList, ImageListItem, Grid, Button, Chip, Box } from '@mui/material';
import { catsApi } from '../Services/api'; // Fixed path
import LoadingSpinner from '../components/LoadingSpinner';

function CatDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    catsApi.getOne(id).then(res => {
      setCat(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Interested in ${cat.name}: ${cat.description}`);
    window.open(`https://wa.me/${cat.user.phone}?text=${msg}`);
  };

  return (
    <Container sx={{ py: 2 }}>
      <Typography variant="h3">{cat?.name}</Typography>
      {cat?.photos?.length > 0 && (
        <ImageList cols={3} sx={{ mb: 4 }}>
          {cat.photos.map((photo, i) => (
            <ImageListItem key={i}><img src={photo} alt="Cat" /></ImageListItem>
          ))}
        </ImageList>
      )}
      <Grid container spacing={2}>
        <Grid item xs={6}><Typography>Age: {cat?.age}</Typography></Grid>
        <Grid item xs={6}><Typography>Gender: {cat?.gender}</Typography></Grid>
        <Grid item xs={6}><Typography>Location: {cat?.location}</Typography></Grid>
        <Grid item xs={6}><Chip label={cat?.adopted ? 'Adopted' : 'Available'} /></Grid>
      </Grid>
      <Typography variant="body1">{cat?.description}</Typography>
      <Box sx={{ mt: 2 }}>
        <Button onClick={handleWhatsApp} variant="contained">Contact via WhatsApp</Button>
      </Box>
    </Container>
  );
}

export default CatDetail;