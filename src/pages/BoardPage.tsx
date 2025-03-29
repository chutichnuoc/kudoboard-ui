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

        // Optional: Show success message with a toast notification
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
        const updateData: UpdatePostRequest = {
          message: postData.message,
          background_color: postData.background_color,
          text_color: postData.text_color
        };

        const updatedPost = await postApi.updatePost(editingPost.id, updateData);

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

  const handleReorderPosts = async (postOrders: { id: string, positionOrder: number }[]) => {
    if (!board) return;

    try {
      // Check if reorderPosts is available in the API
      if (typeof postApi.reorderPosts !== 'function') {
        console.error('reorderPosts function is not available in postApi');
        alert('Post reordering is not available at this time');
        return;
      }

      await postApi.reorderPosts(board.id, postOrders);

      // Update the local state with new order
      const reorderedPosts = [...posts];
      reorderedPosts.sort((a, b) => {
        const aIndex = postOrders.findIndex(order => order.id === a.id);
        const bIndex = postOrders.findIndex(order => order.id === b.id);
        return aIndex - bIndex;
      });

      setPosts(reorderedPosts);
    } catch (err) {
      console.error('Error reordering posts:', err);
      alert('Failed to reorder posts. Please try again.');
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