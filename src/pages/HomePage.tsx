// src/pages/HomePage.tsx
import React from 'react';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';
import CTASection from '../components/home/CTASection';
import { Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
const HomePage: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
  console.log("HomePage auth state:", { isAuthenticated, currentUser });

  return (
    <Box>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </Box>
  );
};

export default HomePage;
