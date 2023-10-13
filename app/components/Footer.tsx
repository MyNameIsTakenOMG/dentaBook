'use client';
import { Box, Stack, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import { Amplify, Auth } from 'aws-amplify';
import Link from 'next/link';
import awsExports from '@/src/aws-exports';
import React from 'react';

Amplify.configure({ ...awsExports, ssr: true });

export default function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: blue['600'],
        p: '1rem 5rem',
        display: 'flex',
        flexFlow: 'row nowrap',
        justifyContent: 'space-between',
      }}
    >
      <Stack direction={'row'} sx={{ columnGap: '1rem' }}>
        <Typography variant="body2" color={'white'}>
          &copy; 2023, developed by Sean Fang
        </Typography>
        <Typography variant="body2" color={'white'}>
          email: fangzhengonly@gmail.com
        </Typography>
      </Stack>
      <Stack direction={'row'} sx={{ columnGap: '1rem', color: 'white' }}>
        <Link href="/#landing">
          <Typography variant="body1" component="div">
            Home
          </Typography>
        </Link>
        <Link href="/#services">
          <Typography variant="body1" component="div">
            Services
          </Typography>
        </Link>
        <Link href="/#about">
          <Typography variant="body1" component="div">
            About
          </Typography>
        </Link>
      </Stack>
    </Box>
  );
}
