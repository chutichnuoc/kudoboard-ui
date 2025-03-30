// src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';
import CTASection from '../components/home/CTASection';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../contexts/AuthContext';
import { boardApi } from '../api/boardApi';
import { Board } from '../types/boardTypes';
import { Link as RouterLink } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [recentBoards, setRecentBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch recent boards if user is authenticated
  useEffect(() => {
    const fetchRecentBoards = async () => {
      if (isAuthenticated) {
        setIsLoading(true);
        try {
          const result = await boardApi.getBoards(1, 3); // Get first page with 3 boards
          setRecentBoards(Array.isArray(result.boards) ? result.boards : []);
        } catch (error) {
          console.error('Error fetching recent boards:', error);
          setRecentBoards([]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRecentBoards();
  }, [isAuthenticated]);

  return (
    <Box>
      <Hero />
      
      {/* Display recent boards for authenticated users */}
      {isAuthenticated && (
        <Box sx={{ py: 6, bgcolor: 'background.paper' }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
              Your Recent Boards
            </Typography>
            
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : recentBoards.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2, mx: -1.5 }}>
                {recentBoards.map((board) => (
                  <Box 
                    key={board.id} 
                    sx={{ 
                      width: { xs: '100%', sm: '50%', md: '33.333%' }, 
                      p: 1.5 
                    }}
                  >
                    <Box
                      component={RouterLink}
                      to={`/boards/${board.slug}`}
                      sx={{
                        display: 'block',
                        p: 3,
                        bgcolor: 'white',
                        borderRadius: 2,
                        boxShadow: 1,
                        textDecoration: 'none',
                        color: 'text.primary',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 3,
                        },
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        {board.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {board.description || 'No description'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        Created: {new Date(board.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                You don't have any boards yet. Create your first board to get started!
              </Typography>
            )}
          </Container>
        </Box>
      )}
      
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </Box>
  );
};

export default HomePage;