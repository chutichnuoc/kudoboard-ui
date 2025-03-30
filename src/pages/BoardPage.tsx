// This is a partial update. Focus is on enhancing the BoardPage component to handle post reordering
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  CircularProgress, 
  Alert,
  Paper,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ShareIcon from '@mui/icons-material/Share';
import BoardGrid from '../components/board/BoardGrid';
import CreatePostForm from '../components/board/CreatePostForm';
import ShareBoardDialog from '../components/board/ShareBoardDialog';
import { boardApi } from '../api/boardApi';
import { postApi } from '../api/postApi';
import { useAuth } from '../contexts/AuthContext';
import { Board } from '../types/boardTypes';
import { Post, CreatePostRequest } from '../types/postTypes';

const BoardPage: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  // State variables
  const [board, setBoard] = useState<Board | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  // Dialog state
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  
  // Snackbar state for notifications
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Fetch board and posts
  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!boardId) {
          throw new Error('Board ID is required');
        }

        // Fetch board details using the slug endpoint
        const data = await boardApi.getBoardBySlug(boardId);

        if (data && data.board) {
          setBoard(data.board);

          // Check if current user is the board owner
          setIsOwner(isAuthenticated && currentUser?.id === data.board.creator_id);

          // Transform backend posts to frontend format
          const mappedPosts: Post[] = data.posts.map((backendPost: any) => {
            // Extract authorId with fallbacks
            let authorId = undefined;
            if (backendPost.author_id) {
              authorId = backendPost.author_id.toString();
            }

            return {
              id: backendPost.id ? backendPost.id.toString() : '0',
              board_id: (backendPost.board_id || '0').toString(),
              author: backendPost.author_name || 'Unknown',
              author_id: authorId,
              message: backendPost.content || '',
              background_color: backendPost.background_color || '#ffffff',
              text_color: backendPost.text_color || '#000000',
              image_url: backendPost.media?.length > 0 ? backendPost.media[0].source_url : undefined,
              created_at: backendPost.created_at || new Date().toISOString(),
              updated_at: backendPost.updated_at || new Date().toISOString()
            };
          });

          // Sort posts by position_order (if available) or createdAt
          const sortedPosts = mappedPosts.sort((a, b) => {
            // If posts have position_order, use that for sorting
            if ('position_order' in a && 'position_order' in b) {
              return (a.position_order || 0) - (b.position_order || 0);
            }
            // Otherwise, sort by creation date (newest first)
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });

          setPosts(sortedPosts);
        } else {
          throw new Error('Board not found');
        }
      } catch (err) {
        console.error('Error fetching board data:', err);
        setError('Failed to load the board. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoardData();
  }, [boardId, isAuthenticated, currentUser]);

  // Handler for post reordering
  const handleReorderPosts = async (postOrders: { id: string, positionOrder: number }[]) => {
    if (!board?.id) return;
    
    try {
      await postApi.reorderPosts(board.id.toString(), postOrders);
      
      // Show success message
      setSnackbarMessage('Posts reordered successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Update local state to reflect the new order
      // This keeps the UI in sync with the backend without requiring a full reload
      const reorderedPosts = [...posts];
      postOrders.forEach(order => {
        const postIndex = reorderedPosts.findIndex(p => p.id === order.id);
        if (postIndex !== -1) {
          reorderedPosts[postIndex] = {
            ...reorderedPosts[postIndex],
            position_order: order.positionOrder
          };
        }
      });
      
      setPosts(reorderedPosts);
    } catch (err) {
      console.error('Error reordering posts:', err);
      setSnackbarMessage('Failed to reorder posts. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Handler for closing the snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Check if current user can modify a post
  const canModifyPost = (post: Post) => {
    if (!isAuthenticated || !currentUser) return false;
    
    // Board owners can modify all posts
    if (board && currentUser.id === board.creator_id) return true;
    
    // Post authors can modify their own posts
    if (!post.author_id) return false;
    
    return post.author_id === currentUser.id.toString();
  };

  // Handler functions
  const handleOpenCreatePost = () => {
    setEditingPost(undefined);
    setSubmissionError(null);
    setCreatePostOpen(true);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setSubmissionError(null);
    setCreatePostOpen(true);
  };

  const handleDeletePost = async (post: Post) => {
    if (window.confirm(`Are you sure you want to delete this message from ${post.author}?`)) {
      try {
        setIsLoading(true);
        await postApi.deletePost(post.id);
        
        // Update local state by removing the deleted post
        setPosts(posts.filter(p => p.id !== post.id));
        
        // Show success message
        setSnackbarMessage('Post deleted successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } catch (err) {
        console.error('Error deleting post:', err);
        setSnackbarMessage('Failed to delete the message. Please try again.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmitPost = async (postData: CreatePostRequest) => {
    setIsSubmitting(true);
    setSubmissionError(null);

    // Make sure we're using the numeric board ID, not the slug
    const actualBoardId = board?.id ? board.id.toString() : '';

    if (!actualBoardId) {
      setSubmissionError('Missing board ID. Please try again.');
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingPost) {
        // Update existing post
        const updatedPost = await postApi.updatePost(
          editingPost.id, 
          {
            message: postData.message,
            background_color: postData.background_color
          }
        );
        
        // Update posts state
        setPosts(posts.map(post => post.id === updatedPost.id ? updatedPost : post));
        
        // Show success message
        setSnackbarMessage('Post updated successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        // Create new post
        const createPostRequest = {
          ...postData,
          boardId: actualBoardId
        };

        let newPost;
        if (isAuthenticated) {
          newPost = await postApi.createPost(createPostRequest);
        } else {
          newPost = await postApi.createAnonymousPost(createPostRequest);
        }

        // Add new post to state
        setPosts([...posts, newPost]);
        
        // Show success message
        setSnackbarMessage('Post created successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }

      // Close the dialog
      setCreatePostOpen(false);
    } catch (err) {
      console.error('Error submitting post:', err);
      setSubmissionError('Failed to save your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShareBoard = () => {
    setShareDialogOpen(true);
  };

  const handleDeleteBoard = async () => {
    try {
      await boardApi.deleteBoard(board?.id || '');
      setDeleteDialogOpen(false);
      
      // Show success message
      setSnackbarMessage('Board deleted successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Navigate to home after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Error deleting board:', err);
      setSnackbarMessage('Failed to delete the board. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate('/')}>
          Return to Home
        </Button>
      </Container>
    );
  }

  // If board not found
  if (!board) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom>
          Board Not Found
        </Typography>
        <Typography paragraph>
          The board you're looking for does not exist or has been removed.
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/')}>
          Return to Home
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f7fa'
    }}>
      {/* Board Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          py: 3, 
          px: 4,
          mb: 4, 
          borderRadius: 0,
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'white'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              {board.title}
            </Typography>
            {board.description && (
              <Typography variant="body1" color="text.secondary">
                {board.description}
              </Typography>
            )}
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center' 
          }}>
            <Typography variant="subtitle1">
              {posts.length} {posts.length === 1 ? 'message' : 'messages'}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={handleShareBoard}
              >
                Share
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpenCreatePost}
              >
                Add a Message
              </Button>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Board Content */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <BoardGrid
          posts={posts}
          isLoading={isLoading}
          error={error}
          isOwner={isOwner}
          onAddPost={handleOpenCreatePost}
          onEditPost={handleEditPost}
          onDeletePost={handleDeletePost}
          onReorderPosts={isOwner ? handleReorderPosts : undefined}
        />
      </Container>

      {/* Create/Edit Post Dialog */}
      <CreatePostForm
        open={createPostOpen}
        onClose={() => setCreatePostOpen(false)}
        onSubmit={handleSubmitPost}
        boardId={board?.id?.toString() || ''}
        editPost={editingPost}
        isSubmitting={isSubmitting}
        error={submissionError}
      />

      {/* Share Board Dialog */}
      <ShareBoardDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        boardId={boardId!}
        boardTitle={board.title}
      />

      {/* Delete Board Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{board.title}"? This action cannot be undone and all messages will be permanently lost.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteBoard} color="error">
            Delete Board
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BoardPage;