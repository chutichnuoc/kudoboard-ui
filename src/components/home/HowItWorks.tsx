import React from 'react';
import { Box, Container, Typography, Paper, Stack, Chip } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <CreateIcon fontSize="large" />,
      title: '1. Create a Board',
      description: 'Set up a new Kudoboard in seconds. Choose a theme and customize your board.'
    },
    {
      icon: <GroupAddIcon fontSize="large" />,
      title: '2. Invite Contributors',
      description: 'Share a link with friends, family, or colleagues so they can add their messages.'
    },
    {
      icon: <CardGiftcardIcon fontSize="large" />,
      title: '3. Deliver the Surprise',
      description: 'Share the final board with the recipient when you are ready to celebrate!'
    }
  ];

  return (
    <Box
      sx={{
        py: { xs: 8, sm: 12 },
        bgcolor: 'background.paper',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Chip
            label="SIMPLE PROCESS"
            color="primary"
            size="small"
            sx={{ mb: 2 }}
          />
          <Typography
            component="h2"
            variant="h3"
            color="text.primary"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            How Kudoboard Works
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: 'auto' }}
          >
            Create a memorable group card in just three easy steps
          </Typography>
        </Box>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={6}
        >
          {steps.map((step, index) => (
            <Box key={index} sx={{ flex: 1 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: '50%',
                    width: 80,
                    height: 80,
                  }}
                >
                  {step.icon}
                </Box>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  {step.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {step.description}
                </Typography>
              </Paper>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default HowItWorks;
