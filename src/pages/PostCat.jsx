// import React, { useState } from 'react';
// import axios from 'axios';
// import { Container, Typography, TextField, Button, Box, Alert, Paper, MenuItem, Stack, IconButton } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { Send, CheckCircle, CloudUpload, Delete } from '@mui/icons-material';

// const PostCat = () => {
//   const [formData, setFormData] = useState({ 
//     name: '', 
//     age: 'kitten', 
//     location: 'Kochi', 
//     description: '',
//     photos: []
//   });
//   const [photosPreview, setPhotosPreview] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [fileErrors, setFileErrors] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handlePhotoChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 5) {
//       setFileErrors('Maximum 5 photos allowed');
//       return;
//     }
//     setFileErrors('');
//     const previews = files.map(file => URL.createObjectURL(file));
//     setPhotosPreview(previews);
//     setFormData({ ...formData, photos: files });
//   };

//   const removePhoto = (index) => {
//     const newPhotos = formData.photos.filter((_, i) => i !== index);
//     const newPreviews = photosPreview.filter((_, i) => i !== index);
//     setFormData({ ...formData, photos: newPhotos });
//     setPhotosPreview(newPreviews);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     const token = localStorage.getItem('token');
//     if (!token) {
//       setError('Please login first');
//       setLoading(false);
//       return;
//     }
    
//     try {
//       // Create FormData for file upload
//       const submitData = new FormData();
//       submitData.append('name', formData.name);
//       submitData.append('age', formData.age);
//       submitData.append('location', formData.location);
//       submitData.append('description', formData.description);
      
//       // Append all photos
//       formData.photos.forEach(photo => {
//         submitData.append('photos', photo);
//       });

//       await axios.post('http://localhost:5000/api/cats', submitData, { 
//         headers: { 
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data'
//         } 
//       });
//       setSuccess(true);
//       setTimeout(() => navigate('/'), 2000);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Post failed');
//     }
//     setLoading(false);
//   };

//   if (success) {
//     return (
//       <Container maxWidth="sm" sx={{ py: 8 }}>
//         <Paper 
//           elevation={0}
//           sx={{ 
//             p: 6, 
//             textAlign: 'center',
//             borderRadius: 3,
//             border: '2px solid',
//             borderColor: 'success.main',
//             bgcolor: 'success.lighter'
//           }}
//         >
//           <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
//           <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'success.dark' }}>
//             Success!
//           </Typography>
//           <Typography variant="body1" color="text.secondary">
//             Cat posted successfully. Redirecting to home...
//           </Typography>
//         </Paper>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="sm" sx={{ py: 6 }}>
//       <Box sx={{ mb: 4 }}>
//         <Typography 
//           variant="h3" 
//           sx={{ 
//             fontWeight: 700, 
//             mb: 1,
//             color: 'text.primary'
//           }}
//         >
//           Post a Found Cat
//         </Typography>
//         <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.05rem' }}>
//           Help a lost cat find its way home by sharing details
//         </Typography>
//       </Box>

//       {error && (
//         <Alert 
//           severity="error" 
//           sx={{ 
//             mb: 3,
//             borderRadius: 2,
//             '& .MuiAlert-message': {
//               fontSize: '0.95rem'
//             }
//           }}
//         >
//           {error}
//         </Alert>
//       )}

//       <Paper 
//         elevation={0}
//         sx={{ 
//           p: 4,
//           borderRadius: 3,
//           border: '1px solid',
//           borderColor: 'divider',
//           bgcolor: 'background.paper'
//         }}
//       >
//         <Box component="form" onSubmit={handleSubmit}>
//           <Stack spacing={3}>
//             <TextField 
//               fullWidth 
//               label="Cat Name" 
//               name="name" 
//               value={formData.name} 
//               onChange={handleChange} 
//               required
//               placeholder="e.g., Whiskers, Fluffy"
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: 2
//                 }
//               }}
//             />

//             <TextField 
//               fullWidth 
//               select
//               label="Age Category" 
//               name="age" 
//               value={formData.age} 
//               onChange={handleChange}
//               required
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: 2
//                 }
//               }}
//             >
//               <MenuItem value="kitten">Kitten (0-6 months)</MenuItem>
//               <MenuItem value="young">Young (6 months - 2 years)</MenuItem>
//               <MenuItem value="adult">Adult (2-10 years)</MenuItem>
//               <MenuItem value="senior">Senior (10+ years)</MenuItem>
//             </TextField>

//             <TextField 
//               fullWidth 
//               label="Location Found" 
//               name="location" 
//               value={formData.location} 
//               onChange={handleChange} 
//               required
//               placeholder="e.g., Near Park, Street Name"
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: 2
//                 }
//               }}
//             />

//             <TextField 
//               fullWidth 
//               multiline 
//               rows={4} 
//               label="Description" 
//               name="description" 
//               value={formData.description} 
//               onChange={handleChange}
//               placeholder="Describe the cat's appearance, behavior, and any distinctive features..."
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: 2
//                 }
//               }}
//             />

//             {/* PHOTO UPLOAD SECTION */}
//             <Box 
//               sx={{ 
//                 p: 3, 
//                 backgroundColor: '#f0f7ff',
//                 border: '2px dashed #1976d2',
//                 borderRadius: 2,
//                 textAlign: 'center'
//               }}
//             >
//               <Typography 
//                 variant="h6" 
//                 gutterBottom 
//                 sx={{ 
//                   color: '#1976d2',
//                   fontWeight: 600,
//                   mb: 2
//                 }}
//               >
//                 📸 Upload Cat Photos (Optional, up to 5)
//               </Typography>
              
//               <Button
//                 component="label"
//                 variant="contained"
//                 startIcon={<CloudUpload />}
//                 size="large"
//                 sx={{ 
//                   py: 1.5, 
//                   px: 4,
//                   borderRadius: 2,
//                   textTransform: 'none',
//                   fontWeight: 600,
//                   mb: 2
//                 }}
//               >
//                 Choose Photos
//                 <input
//                   type="file"
//                   hidden
//                   multiple
//                   accept="image/*"
//                   onChange={handlePhotoChange}
//                 />
//               </Button>
              
//               {fileErrors && (
//                 <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
//                   {fileErrors}
//                 </Alert>
//               )}
              
//               {photosPreview.length > 0 ? (
//                 <Box sx={{ mt: 2 }}>
//                   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mb: 2 }}>
//                     {photosPreview.map((preview, idx) => (
//                       <Box key={idx} sx={{ position: 'relative' }}>
//                         <img 
//                           src={preview} 
//                           alt={`Preview ${idx + 1}`} 
//                           style={{ 
//                             width: 100, 
//                             height: 100, 
//                             objectFit: 'cover', 
//                             borderRadius: 8,
//                             border: '2px solid #ddd'
//                           }} 
//                         />
//                         <IconButton
//                           size="small"
//                           onClick={() => removePhoto(idx)}
//                           sx={{ 
//                             position: 'absolute', 
//                             top: -8, 
//                             right: -8, 
//                             bgcolor: 'error.main', 
//                             color: 'white',
//                             width: 28,
//                             height: 28,
//                             '&:hover': { bgcolor: 'error.dark' }
//                           }}
//                         >
//                           <Delete fontSize="small" />
//                         </IconButton>
//                       </Box>
//                     ))}
//                   </Box>
//                   <Typography variant="body2" color="success.main" fontWeight="600">
//                     ✓ {photosPreview.length} photo(s) selected
//                   </Typography>
//                 </Box>
//               ) : (
//                 <Typography variant="body2" color="text.secondary">
//                   No photos selected. Photos help identify the cat!
//                 </Typography>
//               )}
//             </Box>

//             <Button 
//               type="submit" 
//               variant="contained" 
//               size="large"
//               disabled={loading} 
//               fullWidth
//               startIcon={loading ? null : <Send />}
//               sx={{
//                 py: 1.5,
//                 borderRadius: 2,
//                 textTransform: 'none',
//                 fontSize: '1rem',
//                 fontWeight: 600,
//                 boxShadow: 'none',
//                 bgcolor: 'primary.main',
//                 '&:hover': {
//                   boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//                   bgcolor: 'primary.dark'
//                 }
//               }}
//             >
//               {loading ? 'Posting...' : 'Post Found Cat'}
//             </Button>
//           </Stack>
//         </Box>
//       </Paper>

//       <Box sx={{ mt: 3, textAlign: 'center' }}>
//         <Typography variant="body2" color="text.secondary">
//           Your post will be visible to everyone in the community
//         </Typography>
//       </Box>
//     </Container>
//   );
// };

// export default PostCat;