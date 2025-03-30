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
  Divider,
  Tooltip
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
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
  
  // State to track if the card is being hovered
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Prevent drag from starting when clicking menu
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
        position: 'relative', // Important for positioning the drag handle
        '&:hover': {
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag Handle - Only visible on hover and when user is owner */}
      {isOwner && isHovered && (
        <Tooltip title="Drag to reorder">
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              backgroundColor: 'rgba(0,0,0,0.1)',
              borderRadius: '0 0 8px 0',
              zIndex: 2,
              cursor: 'grab',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 30,
              height: 30,
            }}
          >
            <DragIndicatorIcon fontSize="small" />
          </Box>
        </Tooltip>
      )}

      {post.image_url && (
        <CardMedia
          component="img"
          image={post.image_url}
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
                {new Date(post.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          {isOwner && (
            <Box onClick={(e) => e.stopPropagation()}>
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
                onClick={(e) => e.stopPropagation()}
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