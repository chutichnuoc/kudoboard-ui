// src/pages/BoardPage.tsx
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
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ShareIcon from '@mui/icons-material/Share';
import KudoPost from '../components/board/KudoPost';
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
          setIsOwner(isAuthenticated && currentUser?.id === data.board.creatorID);

          // Transform backend posts to frontend format
          const mappedPosts: Post[] = data.posts.map((backendPost: any) => {
            // Extract authorId with fallbacks
            let authorId = undefined;
            if (backendPost.author_id) {
              authorId = backendPost.author_id.toString();
            } else if (backendPost.authorID) {
              authorId = backendPost.authorID.toString();
            } else if (backendPost.authorId) {
              authorId = backendPost.authorId.toString();
            }

            return {
              id: backendPost.id ? backendPost.id.toString() : '0',
              boardId: (backendPost.board_id || backendPost.boardID || backendPost.boardId || '0').toString(),
              author: backendPost.author_name || backendPost.authorName || 'Unknown',
              authorId: authorId,
              message: backendPost.content || '',
              backgroundColor: backendPost.background_color || backendPost.backgroundColor || '#ffffff',
              textColor: backendPost.text_color || backendPost.textColor || '#000000',
              imageUrl: backendPost.media?.length > 0 ? backendPost.media[0].source_url || backendPost.media[0].sourceURL : undefined,
              createdAt: backendPost.created_at || backendPost.createdAt || new Date().toISOString(),
              updatedAt: backendPost.updated_at || backendPost.updatedAt || new Date().toISOString()
            };
          });

          setPosts(mappedPosts);
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

  // Check if current user can modify a post
  const canModifyPost = (post: Post) => {
    if (!isAuthenticated || !currentUser) return false;
    
    // Board owners can modify all posts
    if (board && currentUser.id === board.creatorID) return true;
    
    // Post authors can modify their own posts
    if (!post.authorId) return false;
    
    return post.authorId === currentUser.id.toString();
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
      } catch (err) {
        console.error('Error deleting post:', err);
        alert('Failed to delete the message. Please try again.');
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
      navigate('/');
    } catch (err) {
      console.error('Error deleting board:', err);
      alert('Failed to delete the board. Please try again.');
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
        {posts.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              py: 10,
              px: 4,
              textAlign: 'center',
              borderRadius: 2,
              backgroundColor: 'white',
              border: '1px dashed',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" gutterBottom>
              No messages yet
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Be the first to add a message to this board!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenCreatePost}
              sx={{ mt: 2 }}
            >
              Add a Message
            </Button>
          </Paper>
        ) : (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: {
              xs: '1fr',            // 1 column on mobile
              sm: 'repeat(2, 1fr)', // 2 columns on tablet
              md: 'repeat(3, 1fr)'  // 3 columns on desktop
            },
            gap: 3
          }}>
            {posts.map((post) => (
              <KudoPost
                key={post.id}
                post={post}
                isOwner={canModifyPost(post)}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            ))}
          </Box>
        )}
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
    </Box>
  );
};

export default BoardPage;