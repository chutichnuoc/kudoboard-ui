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


const CreatePostForm: React.FC<CreatePostFormProps> = ({
  open,
  onClose,
  onSubmit,
  boardId,
  editPost,
  isSubmitting,
  error,
}) => {
  // Ensure boardId is being used correctly
  console.log('CreatePostForm received boardId:', boardId);
  
  const [formData, setFormData] = useState<CreatePostRequest>({
    boardId: boardId,
    author: '',
    message: '',
    imageUrl: '',
    backgroundColor: '#ffffff',
  });

  // Load data from editPost if provided
  useEffect(() => {
    if (editPost) {
      setFormData({
        boardId: boardId, // This should be the numeric ID, not the slug
        author: editPost.author,
        message: editPost.message,
        imageUrl: editPost.imageUrl || '',
        backgroundColor: editPost.backgroundColor || '#ffffff',
      });
    } else {
      // Reset form when not editing
      setFormData({
        boardId: boardId, // This should be the numeric ID, not the slug
        author: '',
        message: '',
        imageUrl: '',
        backgroundColor: '#ffffff',
      });
    }
  }, [editPost, boardId]);

  // Color options for post background
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
      maxWidth="sm"
      fullWidth
      aria-labelledby="create-post-dialog-title"
    >
      <DialogTitle id="create-post-dialog-title">
        {editPost ? 'Edit Message' : 'Add a Message'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

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
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            id="message"
            name="message"
            label="Your Message"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={formData.message}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
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
            sx={{ mb: 3 }}
          />

          <Typography variant="subtitle2" gutterBottom>
            Post Color:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {colorOptions.map(color => (
              <Box
                key={color}
                onClick={() => handleColorChange(color)}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: color,
                  border: '2px solid',
                  borderColor: formData.backgroundColor === color ? 'primary.main' : 'divider',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.9,
                  },
                }}
              />
            ))}
          </Box>

          {formData.imageUrl && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" gutterBottom>
                Image Preview:
              </Typography>
              <Box
                component="img"
                src={formData.imageUrl}
                alt="Preview"
                sx={{
                  maxWidth: '100%',
                  maxHeight: 200,
                  objectFit: 'contain',
                  borderRadius: 1,
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isValid || isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={24} /> : null}
          >
            {editPost ? 'Update' : 'Add'} Message
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreatePostForm;
