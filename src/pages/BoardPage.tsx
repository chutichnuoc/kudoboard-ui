// src/pages/BoardPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Alert } from '@mui/material';
import BoardHeader from '../components/board/BoardHeader';
import BoardGrid from '../components/board/BoardGrid';
import CreateCardForm from '../components/board/CreateCardForm';
import ShareBoardDialog from '../components/board/ShareBoardDialog';
import { boardApi } from '../api/boardApi';
import { cardApi } from '../api/cardApi';
import { Board } from '../types/boardTypes';
import { Card, CreateCardRequest, UpdateCardRequest } from '../types/cardTypes';

const BoardPage: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  
  // State variables
  const [board, setBoard] = useState<Board | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false); // In a real app, this would be determined by auth
  
  // Dialog state
  const [createCardOpen, setCreateCardOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Fetch board and cards
  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!boardId) {
          throw new Error('Board ID is required');
        }
        
        // Fetch board details
        const boardData = await boardApi.getBoard(boardId);
        setBoard(boardData);
        
        // For demo purposes, we'll assume the user is the owner
        // In a real app, you would check if the current user's ID matches the board's ownerId
        setIsOwner(true);
        
        // Fetch cards for the board
        const cardsData = await cardApi.getBoardCards(boardId);
        setCards(cardsData);
      } catch (err) {
        console.error('Error fetching board data:', err);
        setError('Failed to load the board. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBoardData();
  }, [boardId]);

  // Handler functions
  const handleOpenCreateCard = () => {
    setEditingCard(undefined);
    setSubmissionError(null);
    setCreateCardOpen(true);
  };

  const handleEditCard = (card: Card) => {
    setEditingCard(card);
    setSubmissionError(null);
    setCreateCardOpen(true);
  };

  const handleDeleteCard = (card: Card) => {
    if (window.confirm(`Are you sure you want to delete this message from ${card.author}?`)) {
      deleteCard(card.id);
    }
  };

  const handleSubmitCard = async (cardData: CreateCardRequest) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    
    try {
      if (editingCard) {
        // Update existing card
        const { author, message, imageUrl, backgroundColor } = cardData;
        const updateData: UpdateCardRequest = { author, message, imageUrl, backgroundColor };
        
        const updatedCard = await cardApi.updateCard(boardId!, editingCard.id, updateData);
        
        // Update cards state
        setCards(cards.map(card => card.id === updatedCard.id ? updatedCard : card));
      } else {
        // Create new card
        const newCard = await cardApi.createCard(cardData);
        
        // Add new card to state
        setCards([...cards, newCard]);
      }
      
      // Close the dialog
      setCreateCardOpen(false);
    } catch (err) {
      console.error('Error submitting card:', err);
      setSubmissionError('Failed to save your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCard = async (cardId: string) => {
    try {
      await cardApi.deleteCard(boardId!, cardId);
      
      // Update state
      setCards(cards.filter(card => card.id !== cardId));
    } catch (err) {
      console.error('Error deleting card:', err);
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
        isPublic: !board.isPublic
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

      {/* Board Grid with Cards */}
      <BoardGrid
        cards={cards}
        isLoading={isLoading}
        error={error}
        isOwner={isOwner}
        onAddCard={handleOpenCreateCard}
        onEditCard={handleEditCard}
        onDeleteCard={handleDeleteCard}
      />

      {/* Create/Edit Card Dialog */}
      <CreateCardForm
        open={createCardOpen}
        onClose={() => setCreateCardOpen(false)}
        onSubmit={handleSubmitCard}
        boardId={boardId!}
        editCard={editingCard}
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
