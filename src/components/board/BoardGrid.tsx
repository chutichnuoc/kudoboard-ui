import React, { useState } from 'react';
import { Box, Container, Typography, Button, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import KudoPost from './KudoPost';
import { Post } from '../../types/postTypes';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface BoardGridProps {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  isOwner: boolean;
  onAddPost: () => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (post: Post) => void;
  onReorderPosts?: (postOrders: {id: string, positionOrder: number}[]) => void;
}

const BoardGrid: React.FC<BoardGridProps> = ({
  posts,
  isLoading,
  error,
  isOwner,
  onAddPost,
  onEditPost,
  onDeletePost,
  onReorderPosts,
}) => {
  // State to track posts (including their order)
  const [orderedPosts, setOrderedPosts] = useState<Post[]>(posts);

  // Update local state when posts prop changes
  React.useEffect(() => {
    setOrderedPosts(posts);
  }, [posts]);

  // Handle the end of a drag operation
  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    // If there's no destination or if the item was dropped back in its original position, do nothing
    if (!destination || (destination.index === source.index)) {
      return;
    }

    // Reorder the posts array
    const newOrderedPosts = Array.from(orderedPosts);
    const [movedPost] = newOrderedPosts.splice(source.index, 1);
    newOrderedPosts.splice(destination.index, 0, movedPost);

    // Update the local state
    setOrderedPosts(newOrderedPosts);

    // Generate the position order data for the API
    const postOrders = newOrderedPosts.map((post, index) => ({
      id: post.id,
      positionOrder: index + 1
    }));

    // Call the onReorderPosts callback if it exists
    if (onReorderPosts) {
      onReorderPosts(postOrders);
    }
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

  // If there are no posts, show the empty state
  if (orderedPosts.length === 0) {
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
              0 Messages
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
        </Container>
      </Box>
    );
  }

  // With drag-and-drop for non-empty boards
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
            {orderedPosts.length} {orderedPosts.length === 1 ? 'Message' : 'Messages'}
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

        {/* Only enable drag and drop if user is the owner */}
        {isOwner ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="board-posts" direction="vertical">
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)'
                    },
                    gap: 3
                  }}
                >
                  {orderedPosts.map((post, index) => (
                    <Draggable 
                      key={post.id} 
                      draggableId={String(post.id)} 
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            transform: snapshot.isDragging ? 'scale(1.02)' : 'scale(1)',
                            transition: 'transform 0.2s',
                            height: '100%',
                          }}
                        >
                          <KudoPost
                            post={post}
                            isOwner={isOwner}
                            onEdit={onEditPost}
                            onDelete={onDeletePost}
                          />
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          // For non-owners, just display the posts without drag functionality
          <Box
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)'
              },
              gap: 3
            }}
          >
            {orderedPosts.map((post) => (
              <Box key={post.id}>
                <KudoPost
                  post={post}
                  isOwner={isOwner}
                  onEdit={onEditPost}
                  onDelete={onDeletePost}
                />
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default BoardGrid;