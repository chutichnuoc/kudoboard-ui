import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem,
  Breadcrumbs,
  Link,
  Chip
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Link as RouterLink } from 'react-router-dom';
import { Board } from '../../types/boardTypes';

interface BoardHeaderProps {
  board: Board;
  isOwner: boolean;
  onShare: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onTogglePrivacy?: () => void;
}

const BoardHeader: React.FC<BoardHeaderProps> = ({
  board,
  isOwner,
  onShare,
  onEdit,
  onDelete,
  onTogglePrivacy
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    if (onEdit) onEdit();
    handleClose();
  };

  const handleDelete = () => {
    if (onDelete) onDelete();
    handleClose();
  };

  const handleTogglePrivacy = () => {
    if (onTogglePrivacy) onTogglePrivacy();
    handleClose();
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        py: 4,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link component={RouterLink} to="/" color="inherit" underline="hover">
            Home
          </Link>
          <Link component={RouterLink} to="/boards" color="inherit" underline="hover">
            Boards
          </Link>
          <Typography color="text.primary">{board.title}</Typography>
        </Breadcrumbs>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ mr: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              {board.title}
            </Typography>
            {board.description && (
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {board.description}
              </Typography>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Chip 
                icon={!board.is_private ? <LockOpenIcon fontSize="small" /> : <LockIcon fontSize="small" />}
                label={!board.is_private ? 'Public' : 'Private'}
                size="small"
                color={!board.is_private ? 'success' : 'default'}
                sx={{ mr: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                Created {new Date(board.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: { xs: 2, sm: 0 } }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ShareIcon />}
              onClick={onShare}
              sx={{ mr: 1 }}
            >
              Share
            </Button>

            {isOwner && (
              <>
                <IconButton
                  aria-label="board-options"
                  onClick={handleClick}
                  size="large"
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="board-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleEdit}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Edit Board
                  </MenuItem>
                  <MenuItem onClick={handleTogglePrivacy}>
                    {!board.is_private ? (
                      <>
                        <LockIcon fontSize="small" sx={{ mr: 1 }} />
                        Make Private
                      </>
                    ) : (
                      <>
                        <LockOpenIcon fontSize="small" sx={{ mr: 1 }} />
                        Make Public
                      </>
                    )}
                  </MenuItem>
                  <MenuItem onClick={handleDelete}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Delete Board
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default BoardHeader;
