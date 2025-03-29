// src/pages/BoardPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Alert } from '@mui/material';
import BoardHeader from '../components/board/BoardHeader';
import BoardGrid from '../components/board/BoardGrid';
import CreatePostForm from '../components/board/CreatePostForm';
import ShareBoardDialog from '../components/board/ShareBoardDialog';
import { boardApi } from '../api/boardApi';
import { postApi } from '../api/postApi';
import { useAuth } from '../contexts/AuthContext';
import { Board } from '../types/boardTypes';
import { Post, CreatePostRequest, UpdatePostRequest } from '../types/postTypes';

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
          const mappedPosts: Post[] = data.posts.map((backendPost: any) => ({
            id: backendPost.id.toString(),
            boardId: backendPost.boardID.toString(),
            author: backendPost.authorName,
            message: backendPost.content,
            backgroundColor: backendPost.backgroundColor || '#ffffff',
            imageUrl: backendPost.media?.length > 0 ? backendPost.media[0].sourceURL : undefined,
            createdAt: backendPost.createdAt,
            updatedAt: backendPost.updatedAt
          }));

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

  const handleDeletePost = (post: Post) => {
    if (window.confirm(`Are you sure you want to delete this message from ${post.author}?`)) {
      deletePost(post.id);
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
        const { author, message, imageUrl, backgroundColor } = postData;
        const updateData: UpdatePostRequest = { author, message, imageUrl, backgroundColor };

        const updatedPost = await postApi.updatePost(actualBoardId, editingPost.id, updateData);

        // Update posts state
        setPosts(posts.map(post => post.id === updatedPost.id ? updatedPost : post));
      } else {
        // Create new post
        // Make sure to use the actual board ID from the board object, not the URL parameter
        const createPostRequest = {
          ...postData,
          boardId: actualBoardId // Override with actual board ID
        };

        let newPost;

        // Use the appropriate endpoint based on authentication
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

  const deletePost = async (postId: string) => {
    try {
      await postApi.deletePost(boardId!, postId);

      // Update state
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete the message. Please try again.');
    }
  };

  const handleShareBoard = () => {
    setShareDialogOpen(true);
  };

  const handleEditBoard = () => {
    // For simplicity we're not implementing this in the demo
    alert('Edit board functionality will be implemented in a future update');
  };

  const handleToggleBoardPrivacy = async () => {
    if (!board) return;

    try {
      const updatedBoard = await boardApi.updateBoard(board.id, {
        isPublic: !board.isPrivate
      });

      setBoard(updatedBoard);
    } catch (err) {
      console.error('Error updating board privacy:', err);
      alert('Failed to update board privacy settings. Please try again.');
    }
  };

  const confirmDeleteBoard = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteBoard = async () => {
    try {
      await boardApi.deleteBoard(boardId!);
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
    <Box>
      {/* Board Header */}
      <BoardHeader
        board={board}
        isOwner={isOwner}
        onShare={handleShareBoard}
        onEdit={handleEditBoard}
        onDelete={confirmDeleteBoard}
        onTogglePrivacy={handleToggleBoardPrivacy}
      />

      {/* Board Grid with Posts */}
      <BoardGrid
        posts={posts}
        isLoading={isLoading}
        error={error}
        isOwner={isOwner}
        onAddPost={handleOpenCreatePost}
        onEditPost={handleEditPost}
        onDeletePost={handleDeletePost}
      />

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