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
import { Card as CardType } from '../../types/cardTypes';

interface KudoCardProps {
  card: CardType;
  onEdit?: (card: CardType) => void;
  onDelete?: (card: CardType) => void;
  isOwner: boolean;
}

const KudoCard: React.FC<KudoCardProps> = ({ card, onEdit, onDelete, isOwner }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    if (onEdit) onEdit(card);
    handleClose();
  };

  const handleDelete = () => {
    if (onDelete) onDelete(card);
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
      className="kudo-card"
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: card.backgroundColor || '#ffffff',
        borderRadius: 2,
        overflow: 'visible',
        position: 'relative',
        mb: 3,
      }}
    >
      {isOwner && (
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
          <IconButton
            aria-label="card-options"
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
            id="card-menu"
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
        {card.imageUrl && (
          <CardMedia
            component="img"
            image={card.imageUrl}
            alt="Card image"
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
          {card.message}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', mr: 1.5 }}>
            {getInitials(card.author)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" component="div">
              {card.author}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(card.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default KudoCard;
