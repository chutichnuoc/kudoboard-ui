import React from 'react';
import { Box, Container, Typography, Card, CardContent, Avatar, Rating, Stack } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

interface TestimonialProps {
  quote: string;
  name: string;
  title: string;
  avatar?: string;
  rating: number;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, name, title, avatar, rating }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', mb: 2 }}>
          <FormatQuoteIcon sx={{ color: 'primary.main', fontSize: 40, mr: 1 }} />
        </Box>
        <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', mb: 3 }}>
          "{quote}"
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={avatar} sx={{ mr: 2 }}>
            {name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
        <Rating value={rating} readOnly precision={0.5} sx={{ mt: 2 }} />
      </CardContent>
    </Card>
  );
};

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "Kudoboard made our remote team member's birthday so special! Everyone added personalized messages and photos, and we presented it during our virtual meeting. So much better than a simple card!",
      name: "Sarah Johnson",
      title: "HR Manager",
      rating: 5
    },
    {
      quote: "We used Kudoboard for my colleague's retirement after 25 years. Being able to collect messages from past and present teammates across the country made it truly meaningful.",
      name: "Michael Chen",
      title: "Department Director",
      rating: 5
    },
    {
      quote: "As a teacher, I created a Kudoboard with my students to thank our principal. The students loved adding their own creative messages, and it was a hit!",
      name: "Jessica Williams",
      title: "5th Grade Teacher",
      rating: 4.5
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
            What Our Users Say
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: 'auto' }}
          >
            Thousands of teams and individuals use Kudoboard to celebrate special moments
          </Typography>
        </Box>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
        >
          {testimonials.map((testimonial, index) => (
            <Box key={index} sx={{ flex: 1 }}>
              <Testimonial
                quote={testimonial.quote}
                name={testimonial.name}
                title={testimonial.title}
                rating={testimonial.rating}
              />
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default Testimonials;
