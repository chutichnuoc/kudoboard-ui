// src/components/board/KudoPost.tsx
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Avatar,
  CardMedia,
  Divider
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Post } from '../../types/postTypes';

interface KudoPostProps {
  post: Post;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
  isOwner: boolean;
}

const KudoPost: React.FC<KudoPostProps> = ({ post, onEdit, onDelete, isOwner }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    if (onEdit) onEdit(post);
    handleClose();
  };

  const handleDelete = () => {
    if (onDelete) onDelete(post);
    handleClose();
  };

  // Get initials for avatar if no image is provided
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: post.background_color || '#ffffff',
        borderRadius: 2,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        },
      }}
    >
      {post.imageUrl && (
        <CardMedia
          component="img"
          image={post.imageUrl}
          alt="Post image"
          sx={{
            maxHeight: 180,
            objectFit: 'cover',
          }}
        />
      )}

      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="body1"
          sx={{
            mb: 3,
            lineHeight: 1.6,
            color: post.text_color || '#000000',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {post.message}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36, 
                bgcolor: 'primary.main', 
                mr: 1.5,
                fontSize: '0.875rem', 
                fontWeight: 'bold' 
              }}
            >
              {getInitials(post.author)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight="medium">
                {post.author}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(post.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          {isOwner && (
            <Box>
              <IconButton
                aria-label="post-options"
                size="small"
                onClick={handleClick}
                sx={{ 
                  color: 'text.secondary',
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu
                id="post-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleEdit}>
                  <EditIcon fontSize="small" sx={{ mr: 1 }} />
                  Edit
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                  <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                  Delete
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default KudoPost;