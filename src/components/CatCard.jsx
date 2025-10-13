import React from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Button, 
  CardActions, 
  Chip, 
  Box,
  useTheme, 
  Stack, 
} from '@mui/material';
import { Link } from 'react-router-dom';
import { LocationOn, CalendarToday, Male, Female } from '@mui/icons-material';

function CatCard({ cat, isDashboard = false }) {
  const theme = useTheme();

  // Determine the photo URL, using the base URL for local development
  const firstPhoto = cat.photos && cat.photos.length > 0 
    ? `http://localhost:5000${cat.photos[0]}`
    : 'https://via.placeholder.com/400x400?text=No+Photo';

  const genderIcon = cat.gender === 'Male' ? <Male fontSize="small" color="info" /> : <Female fontSize="small" color="error" />;
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        borderRadius: 3, 
        boxShadow: theme.shadows[6], // Slightly deeper shadow for a 'bigger' feel
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-6px)', // Increased lift on hover
          boxShadow: theme.shadows[12],
        },
        overflow: 'hidden',
      }}
    >
      
      {/* 🖼️ Square Aspect Ratio Enforced Here (1:1) */}
      <Box sx={{ 
        width: '100%', 
        position: 'relative',
        paddingTop: '100%', 
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}>
        <CardMedia
          component="img"
          image={firstPhoto}
          alt={cat.name}
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%',
            objectFit: 'cover', 
            objectPosition: 'center',
          }}
        />
      </Box>

      {/* Card Content - Improved Readability and Spacing */}
      <CardContent sx={{ flexGrow: 1, p: 2.5 }}> {/* Increased padding here (p: 2.5) */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography 
            gutterBottom 
            variant="h5" // Increased font size for cat name
            component="div" 
            sx={{ fontWeight: 800, lineHeight: 1.2, color: theme.palette.text.primary }}
          >
            {cat.name}
          </Typography>
          <Chip 
            label={cat.age} 
            size="medium" // Slightly larger chip
            color="primary" 
            variant="filled" // Use filled for more visual weight
            icon={<CalendarToday fontSize="small" />}
          />
        </Stack>
        
        <Stack direction="column" spacing={0.5} mb={1.5}>
          {/* Location */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <LocationOn fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              {cat.location}
            </Typography>
          </Stack>
          
          {/* Gender */}
          <Stack direction="row" alignItems="center" spacing={1}>
            {genderIcon}
            <Typography variant="body2" color="text.secondary">
              {cat.gender}
            </Typography>
          </Stack>
        </Stack>

        {/* Short description - Ensure it fills space gracefully */}
        <Box sx={{ minHeight: 45, mb: 1.5 }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              display: '-webkit-box',
              WebkitLineClamp: 2, 
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontStyle: 'italic',
            }}
          >
            {cat.description || 'No detailed sighting description available.'}
          </Typography>
        </Box>

        {!isDashboard && cat.user?.name && (
          <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
            Posted by: **{cat.user.name}**
          </Typography>
        )}

      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          component={Link} 
          to={`/cats/${cat._id}`} 
          fullWidth 
          variant="contained" 
          color="primary"
          size="large" // Use large size for a chunkier button
          sx={{ 
            fontWeight: 700, 
            py: 1.2, 
            borderRadius: 2,
            transition: 'background-color 0.3s, transform 0.2s',
            '&:hover': {
              transform: 'scale(1.01)',
            }
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}

export default CatCard;