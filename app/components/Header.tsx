'use client';
import { Amplify, Auth } from 'aws-amplify';
import awsExports from '@/src/aws-exports';
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
import MenuIcon from '@mui/icons-material/Menu';

Amplify.configure({ ...awsExports, ssr: true });

export default function Header() {
  return (
    <AppBar
      position="fixed"
      color="transparent"
      sx={{
        maxWidth: '1200px',
        backgroundColor: 'rgba(255,255,255,0.9)',
        boxShadow: 'unset',
        backdropFilter: 'blur(10px)',
        opacity: 0.7,
        left: { xs: 0, lg: 'calc((100% - 1200px) / 2)' },
      }}
    >
      <Toolbar
        sx={{
          px: { xs: '16px', md: '24px', lg: '48px' },
          width: '100%',
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
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          News
        </Typography>
        <Stack direction={'row'} columnGap={2}>
          <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
        </Stack>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
}
