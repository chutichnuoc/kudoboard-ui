import React from 'react';
import { Box, Container, Typography, Button, Alert } from '@mui/material';
import Masonry from 'react-masonry-css';
import AddIcon from '@mui/icons-material/Add';
import KudoPost from './KudoPost';
import { Post } from '../../types/postTypes';

interface BoardGridProps {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  isOwner: boolean;
  onAddPost: () => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (post: Post) => void;
}

const BoardGrid: React.FC<BoardGridProps> = ({
  posts,
  isLoading,
  error,
  isOwner,
  onAddPost,
  onEditPost,
  onDeletePost,
}) => {
  // Breakpoints for the masonry grid
  const breakpoints = {
    default: 3, // 3 columns on desktop
    1100: 3,
    900: 2, // 2 columns on tablets
    600: 1, // 1 column on mobile
  };

  if (isLoading) {
    return (
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Typography>Loading messages...</Typography>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Alert severity="error">{error}</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography variant="h5" component="h2">
            {posts.length} {posts.length === 1 ? 'Message' : 'Messages'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onAddPost}
          >
            Add a Message
          </Button>
        </Box>

        {posts.length === 0 ? (
          <Box
            sx={{
              py: 8,
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px dashed',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" gutterBottom color="text.secondary">
              No messages yet
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Be the first to add a message to this board!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={onAddPost}
            >
              Add a Message
            </Button>
          </Box>
        ) : (
          <Masonry
            breakpointCols={breakpoints}
            className="masonry-grid"
            columnClassName="masonry-grid-column"
          >
            {posts.map((post) => (
              <KudoPost
                key={post.id}
                post={post}
                isOwner={isOwner}
                onEdit={onEditPost}
                onDelete={onDeletePost}
              />
            ))}
          </Masonry>
        )}
      </Container>
    </Box>
  );
};

export default BoardGrid;
