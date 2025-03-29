// src/styles/GlobalStyles.ts
import { GlobalStyles as MuiGlobalStyles } from '@mui/material';
import React from 'react';

const GlobalStyles: React.FC = () => {
  return (
    <MuiGlobalStyles
      styles={{
        '*': {
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
        },
        html: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          height: '100%',
          width: '100%',
        },
        body: {
          height: '100%',
          width: '100%',
          backgroundColor: '#FAFAFA',
        },
        '#root': {
          height: '100%',
          width: '100%',
        },
        'a': {
          textDecoration: 'none',
          color: 'inherit',
        },
        '.masonry-grid': {
          display: 'flex',
          marginLeft: -16,
          width: 'auto',
        },
        '.masonry-grid-column': {
          paddingLeft: 16,
          backgroundClip: 'padding-box',
        },
        '.kudo-post': {
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
          },
        },
      }}
    />
  );
};

export default GlobalStyles;