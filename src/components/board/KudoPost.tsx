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
  CardMedia
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
      className="kudo-post"
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: post.background_color || '#ffffff',
        borderRadius: 2,
        overflow: 'visible',
        position: 'relative',
        mb: 3,
      }}
    >
      {isOwner && (
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
          <IconButton
            aria-label="post-options"
            size="small"
            onClick={handleClick}
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' }
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

      <CardContent>
        {post.imageUrl && (
          <CardMedia
            component="img"
            image={post.imageUrl}
            alt="Post image"
            sx={{
              borderRadius: 1,
              mb: 2,
              maxHeight: 200,
              objectFit: 'cover',
            }}
          />
        )}

        <Typography
          variant="body1"
          component="div"
          sx={{
            mb: 3,
            fontStyle: 'italic',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {post.message}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', mr: 1.5 }}>
            {getInitials(post.author)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" component="div">
              {post.author}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(post.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default KudoPost;