import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        py: { xs: 8, sm: 12 },
        bgcolor: 'primary.main',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Ready to Create Your First Kudoboard?
        </Typography>
        <Typography
          variant="h6"
          paragraph
          sx={{ mb: 4, opacity: 0.9, maxWidth: 700, mx: 'auto' }}
        >
          Start celebrating birthdays, work anniversaries, farewells, and more in a way that brings people together.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => navigate('/create-board')}
          sx={{ py: 1.5, px: 4, borderRadius: 30, fontSize: '1.1rem' }}
        >
          Create a Board
        </Button>
      </Container>
    </Box>
  );
};

export default CTASection;
