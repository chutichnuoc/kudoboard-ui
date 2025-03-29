import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  Paper,
  Stack,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Link as RouterLink } from 'react-router-dom';
import { boardApi } from '../api/boardApi';
import { CreateBoardRequest } from '../types/boardTypes';

// Pre-made templates for boards
const boardTemplates = [
  { title: 'Birthday Celebration', description: 'Celebrate a birthday with messages and memories', coverImage: 'https://source.unsplash.com/random/300x200/?birthday' },
  { title: 'Work Anniversary', description: 'Recognize a work anniversary with congratulatory messages', coverImage: 'https://source.unsplash.com/random/300x200/?celebration' },
  { title: 'Farewell', description: 'Say goodbye to a colleague or friend', coverImage: 'https://source.unsplash.com/random/300x200/?farewell' },
  { title: 'Congratulations', description: 'Celebrate an achievement or milestone', coverImage: 'https://source.unsplash.com/random/300x200/?congratulations' },
  { title: 'Thank You', description: 'Express gratitude to someone special', coverImage: 'https://source.unsplash.com/random/300x200/?thankyou' },
  { title: 'Welcome', description: 'Welcome a new team member or friend', coverImage: 'https://source.unsplash.com/random/300x200/?welcome' },
];

const CreateBoardPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState<CreateBoardRequest>({
    title: '',
    description: '',
    coverImage: '',
    isPublic: true,
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleTemplateSelect = (index: number) => {
    const template = boardTemplates[index];
    setSelectedTemplate(index);
    setFormData(prev => ({
      ...prev,
      title: template.title,
      description: template.description,
      coverImage: template.coverImage,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim()) {
      setError('Board title is required');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Create the board
      const newBoard = await boardApi.createBoard(formData);
      
      // Redirect to the new board
      navigate(`/boards/${newBoard.slug}`);
    } catch (err: any) {
      console.error('Error creating board:', err);
      setError(err?.message || 'Failed to create your board. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link component={RouterLink} to="/" underline="hover" color="inherit">
            Home
          </Link>
          <Typography color="text.primary">Create Board</Typography>
        </Breadcrumbs>

        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Create a New Kudoboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Start by filling out the details for your board. You can add messages after creating it.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={4} 
          sx={{ mt: 2 }}
        >
          {/* Board Creation Form */}
          <Box sx={{ flex: 7 }}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <form onSubmit={handleSubmit}>
                <TextField
                  name="title"
                  label="Board Title"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.title}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                />

                <TextField
                  name="description"
                  label="Description (optional)"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                />

                <TextField
                  name="coverImage"
                  label="Cover Image URL (optional)"
                  variant="outlined"
                  fullWidth
                  value={formData.coverImage}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <AddPhotoAlternateIcon color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                  helperText="Add a URL to an image that represents your board"
                  sx={{ mb: 3 }}
                />

                {formData.coverImage && (
                  <Box sx={{ mb: 3, textAlign: 'center' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Cover Image Preview:
                    </Typography>
                    <Box
                      component="img"
                      src={formData.coverImage}
                      alt="Cover Preview"
                      sx={{
                        width: '100%',
                        maxHeight: 200,
                        objectFit: 'cover',
                        borderRadius: 1,
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </Box>
                )}

                <FormControlLabel
                  control={
                    <Switch
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="Make this board public"
                  sx={{ mb: 3 }}
                />

                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => navigate('/')}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!formData.title.trim() || isLoading}
                    startIcon={isLoading ? <CircularProgress size={24} /> : null}
                  >
                    Create Board
                  </Button>
                </Stack>
              </form>
            </Paper>
          </Box>

          {/* Template Selection */}
          <Box sx={{ flex: 5 }}>
            <Typography variant="h6" gutterBottom>
              Or choose a template to get started:
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Stack spacing={2}>
                {boardTemplates.map((template, index) => (
                  <Card
                    key={index}
                    sx={{
                      cursor: 'pointer',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                      },
                      border: selectedTemplate === index ? '2px solid' : 'none',
                      borderColor: 'primary.main',
                    }}
                    onClick={() => handleTemplateSelect(index)}
                  >
                    <Box
                      sx={{
                        height: 120,
                        backgroundImage: `url(${template.coverImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        {template.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {template.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default CreateBoardPage;
