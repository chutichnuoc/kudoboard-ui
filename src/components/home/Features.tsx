import React from 'react';
import { Box, Container, Typography, Paper, Stack } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import CelebrationIcon from '@mui/icons-material/Celebration';
import DevicesIcon from '@mui/icons-material/Devices';
import SecurityIcon from '@mui/icons-material/Security';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: 2,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      <Box
        sx={{
          mb: 2,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'primary.light',
          color: 'primary.contrastText',
          borderRadius: '50%',
          width: 70,
          height: 70,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {description}
      </Typography>
    </Paper>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <GroupIcon fontSize="large" />,
      title: 'Collaborative',
      description: 'Invite an unlimited number of people to sign your Kudoboard. Perfect for remote teams.'
    },
    {
      icon: <CelebrationIcon fontSize="large" />,
      title: 'Customizable',
      description: 'Add photos, GIFs, videos, and heartfelt messages to create personalized cards.'
    },
    {
      icon: <DevicesIcon fontSize="large" />,
      title: 'Multi-platform',
      description: 'Create and view boards on any device - desktop, tablet, or mobile.'
    },
    {
      icon: <SecurityIcon fontSize="large" />,
      title: 'Private & Secure',
      description: 'Control who can view and contribute to your boards with privacy settings.'
    }
  ];

  return (
    <Box
      sx={{
        py: { xs: 8, sm: 12 },
        bgcolor: 'grey.50',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography
            component="h2"
            variant="h3"
            color="text.primary"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Why Choose Kudoboard?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: 'auto' }}
          >
            Make any celebration special with our easy-to-use group greeting platform.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                width: {
                  xs: '100%',
                  sm: 'calc(50% - 16px)',
                  md: 'calc(25% - 16px)'
                }
              }}
            >
              <Feature
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Features;
