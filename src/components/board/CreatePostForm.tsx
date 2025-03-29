import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Avatar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import { CreatePostRequest, Post } from '../../types/postTypes';

interface CreatePostFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (postData: CreatePostRequest) => Promise<void>;
  boardId: string;
  editPost?: Post; // If provided, form will be in edit mode
  isSubmitting: boolean;
  error: string | null;
}

// Color options for post backgrounds
const colorOptions = [
  '#ffffff', // white
  '#f8f9fa', // light gray
  '#ffebee', // light red
  '#e8f5e9', // light green
  '#e3f2fd', // light blue
  '#fff8e1', // light yellow
  '#f3e5f5', // light purple
  '#fce4ec', // light pink
];

const CreatePostForm: React.FC<CreatePostFormProps> = ({
  open,
  onClose,
  onSubmit,
  boardId,
  editPost,
  isSubmitting,
  error,
}) => {
  // Form state
  const [formData, setFormData] = useState<CreatePostRequest>({
    boardId: boardId,
    author: '',
    message: '',
    imageUrl: '',
    background_color: '#ffffff',
  });

  // Load data from editPost if provided
  useEffect(() => {
    if (editPost) {
      setFormData({
        boardId: boardId,
        author: editPost.author,
        message: editPost.message,
        imageUrl: editPost.imageUrl || '',
        background_color: editPost.background_color || '#ffffff',
      });
    } else {
      // Reset form when not editing
      setFormData({
        boardId: boardId,
        author: '',
        message: '',
        imageUrl: '',
        background_color: '#ffffff',
      });
    }
  }, [editPost, boardId, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (color: string) => {
    setFormData(prev => ({ ...prev, backgroundColor: color }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      // Error will be handled by parent component
    }
  };

  const isValid = formData.author.trim() !== '' && formData.message.trim() !== '';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle 
        sx={{ 
          px: 3, 
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h6" fontWeight="medium">
          {editPost ? 'Edit Message' : 'Add a Message'}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ px: 3, py: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' },
            gap: 3
          }}>
            {/* Left column - Form fields */}
            <Box>
              <TextField
                autoFocus
                margin="dense"
                id="author"
                name="author"
                label="Your Name"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.author}
                onChange={handleChange}
                required
                disabled={editPost !== undefined}
                sx={{ mb: 3 }}
              />

              <TextField
                margin="dense"
                id="message"
                name="message"
                label="Your Message"
                multiline
                rows={10}
                fullWidth
                variant="outlined"
                value={formData.message}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
              />

              <TextField
                margin="dense"
                id="imageUrl"
                name="imageUrl"
                label="Image URL (optional)"
                type="url"
                fullWidth
                variant="outlined"
                value={formData.imageUrl}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <ImageIcon color="action" sx={{ mr: 1 }} />
                  ),
                }}
              />
            </Box>

            {/* Right column - Color picker and preview */}
            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight="medium">
                Card Color:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
                {colorOptions.map(color => (
                  <Box
                    key={color}
                    onClick={() => handleColorChange(color)}
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: color,
                      border: '2px solid',
                      borderColor: formData.background_color === color ? 'primary.main' : 'divider',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 0.9,
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                ))}
              </Box>

              <Typography variant="subtitle2" gutterBottom fontWeight="medium">
                Preview:
              </Typography>
              <Box
                sx={{
                  p: 3,
                  bgcolor: formData.background_color,
                  borderRadius: 2,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  height: '300px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {formData.imageUrl && (
                  <Box
                    component="img"
                    src={formData.imageUrl}
                    alt="Preview"
                    sx={{
                      width: '100%',
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 1,
                      mb: 2,
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <Typography
                  variant="body1"
                  sx={{
                    mb: 'auto',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flexGrow: 1,
                  }}
                >
                  {formData.message || 'Your message will appear here...'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Avatar sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: 'primary.main', 
                    mr: 1,
                    fontSize: '0.75rem',
                  }}>
                    {formData.author ? formData.author.charAt(0).toUpperCase() : '?'}
                  </Avatar>
                  <Typography variant="subtitle2">
                    {formData.author || 'Your Name'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button 
            onClick={onClose} 
            variant="outlined"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isValid || isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {editPost ? 'Update' : 'Post'} Message
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreatePostForm;