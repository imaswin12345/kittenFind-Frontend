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

  const firstPhoto = cat.photos && cat.photos.length > 0 
    ? `http://localhost:5000${cat.photos[0]}`
    : 'https://via.placeholder.com/400x400?text=No+Photo'; // Updated placeholder for square

  const genderIcon = cat.gender === 'Male' ? <Male fontSize="small" /> : <Female fontSize="small" />;
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        borderRadius: 3, 
        boxShadow: theme.shadows[4],
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows[8],
        },
        overflow: 'hidden',
      }}
    >
      
      {/* 🖼️ Square Aspect Ratio Enforced Here */}
      <Box sx={{ 
        width: '100%', 
        position: 'relative',
        paddingTop: '100%', // Crucial: This creates the 1:1 aspect ratio (100% of the parent's width)
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}>
        <CardMedia
          component="img"
          image={firstPhoto}
          alt={cat.name}
          // Position absolute makes the image fill the aspect-ratio box created by padding-top
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

      {/* Card Content remains the same, filling the remaining height */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div" 
            sx={{ fontWeight: 700, lineHeight: 1.2 }}
          >
            {cat.name}
          </Typography>
          <Chip 
            label={cat.age} 
            size="small" 
            color="primary" 
            variant="outlined" 
            icon={<CalendarToday fontSize="small" />}
          />
        </Stack>
        
        <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
          <LocationOn fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {cat.location}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
          {genderIcon}
          <Typography variant="body2" color="text.secondary">
            {cat.gender}
          </Typography>
        </Stack>

        {/* Short description */}
        <Box sx={{ minHeight: 40, mb: 1.5 }}>
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
            {cat.description || 'No description provided.'}
          </Typography>
        </Box>

        {!isDashboard && cat.user?.name && (
          <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
            Posted by: {cat.user.name}
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
          sx={{ 
            fontWeight: 600, 
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