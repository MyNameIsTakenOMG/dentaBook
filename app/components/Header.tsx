'use client';
import { Amplify, Auth } from 'aws-amplify';
// import awsExports from '@/src/aws-exports';
import React from 'react';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import createTheme from '@mui/material/styles/createTheme'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import MenuIcon from '@mui/icons-material/Menu';
import { blue } from '@mui/material/colors';
import Link from 'next/link';

// Amplify.configure({ ...awsExports, ssr: true });

const typographyTheme = createTheme({
  typography: {
    fontFamily: ["Rubik", "sans-serif"].join(','),
  }
})

export default function Header() {
  return (
    <AppBar
      position="fixed"
      color="transparent"
      sx={{
        // maxWidth: '1200px',
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.9)',
        boxShadow: 'unset',
        backdropFilter: 'blur(8px)',
        // opacity: 0.9,
        // left: { xs: 0, lg: 'calc((100% - 1200px) / 2)' },
      }}
    >
      <Toolbar
        sx={{
          px: { xs: '16px', md: '24px', lg: '48px' },
          width: '100%',
          maxWidth: '1200px',
          marginLeft: { xs: 0, lg: 'calc((100% - 1200px) / 2)' }
        }}
      >
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <ThemeProvider theme={typographyTheme}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#1a73e8' }}>
            Dr.Gao Family Dentistry
          </Typography>
        </ThemeProvider>
        <Box sx={{ display: 'flex', flexFlow: 'row nowrap', columnGap: 6, flexGrow: 1 }}>
          <Link href='#landing'>
            <Typography variant="body1" component="div" >
              Home
            </Typography>
          </Link>
          <Link href='#services'>
            <Typography variant="body1" component="div" >
              Services
            </Typography>
          </Link>
          <Link href='#about'>
            <Typography variant="body1" component="div" >
              About
            </Typography>
          </Link>
          {/* <Typography variant="body1" component="div" >
            Reviews
          </Typography> */}
        </Box>
        <Button color="inherit" size='medium' variant='outlined' disableElevation sx={{ borderRadius: '50px' }}>Login</Button>
      </Toolbar>
    </AppBar>
  );
}
