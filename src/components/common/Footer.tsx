import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Divider,
  Stack,
  Link,
  Typography,
  IconButton,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={4}
          flexWrap="wrap"
        >
          <Box sx={{ width: { xs: '100%', sm: '50%', md: '33%' } }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Kudoboard
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Group greeting posts for any occasion. Perfect for celebrating birthdays, 
              farewells, and recognizing team members in today's remote work environment.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton aria-label="facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton aria-label="twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton aria-label="instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton aria-label="linkedin">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Box>
          
          <Box sx={{ width: { xs: '50%', sm: '25%', md: '16.67%' } }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Product
            </Typography>
            <Link
              component={RouterLink}
              to="/examples"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Examples
            </Link>
            <Link
              component={RouterLink}
              to="/pricing"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Pricing
            </Link>
          </Box>
          
          <Box sx={{ width: { xs: '50%', sm: '25%', md: '16.67%' } }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Company
            </Typography>
            <Link
              component={RouterLink}
              to="/about"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              About Us
            </Link>
            <Link
              component={RouterLink}
              to="/blog"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Blog
            </Link>
            <Link
              component={RouterLink}
              to="/careers"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Careers
            </Link>
          </Box>
          
          <Box sx={{ width: { xs: '50%', sm: '25%', md: '16.67%' } }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Support
            </Typography>
            <Link
              component={RouterLink}
              to="/help"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Help Center
            </Link>
            <Link
              component={RouterLink}
              to="/contact"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Contact Us
            </Link>
            <Link
              component={RouterLink}
              to="/privacy"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Privacy Policy
            </Link>
          </Box>
        </Stack>
        
        <Divider sx={{ mt: 4, mb: 4 }} />
        
        <Typography variant="body2" color="text.secondary" align="center">
          &copy; {new Date().getFullYear()} Kudoboard. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
