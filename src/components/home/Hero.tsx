import React from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import heroImage from '../../assets/hero-image.png'; // You'll need to add this image

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        pt: { xs: 8, sm: 12 },
        pb: { xs: 8, sm: 12 },
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          alignItems="center"
        >
          <Box sx={{ flex: 1, width: '100%' }}>
            <Typography
              component="h1"
              variant="h2"
              color="text.primary"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1.2,
              }}
            >
              Group cards that make an impact
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              paragraph
              sx={{ mb: 4, maxWidth: '90%' }}
            >
              Celebrate birthdays, work anniversaries, farewells, and more with
              meaningful group greetings that stand out.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate('/create-board')}
                sx={{ mr: 2, py: 1.5, px: 3, borderRadius: 30 }}
              >
                Create a Board
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={() => navigate('/examples')}
                sx={{ py: 1.5, px: 3, borderRadius: 30 }}
              >
                See Examples
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              width: '100%',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            <Box
              component="img"
              src={heroImage}
              alt="Kudoboard Example"
              sx={{
                width: '100%',
                maxWidth: 600,
                height: 'auto',
                borderRadius: 2,
                boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
              }}
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Hero;
