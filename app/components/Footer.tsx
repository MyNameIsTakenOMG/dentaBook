'use client';
import { Box, Stack, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
// import { Amplify, Auth } from 'aws-amplify';
import Link from 'next/link';
// import awsExports from '@/src/aws-exports';
import React from 'react';
import { usePathname } from 'next/navigation';

// Amplify.configure({ ...awsExports, ssr: true });

export default function Footer() {
  // not render the component when the admin page is being visited
  const pathname = usePathname();
  if (pathname === '/admin') return <></>;

  return (
    <Box
      sx={{
        backgroundColor: blue['600'],
        p: '1rem 5rem',
        display: 'flex',
        flexFlow: { xs: 'column-reverse nowrap', sm: 'row nowrap' },
        justifyContent: 'space-between',
        gap: '1rem',
      }}
    >
      <Box
        sx={{
          gap: '1rem',
          display: 'flex',
          flexFlow: { xs: 'column nowrap', sm: 'row nowrap' },
          alignItems: 'center',
        }}
      >
        <Typography variant="body2" color={'white'}>
          &copy; 2023, developed by Sean Fang
        </Typography>
        <Typography variant="body2" color={'white'}>
          Email: fangzhengonly@gmail.com
        </Typography>
      </Box>
      <Box
        sx={{
          gap: '1rem',
          color: 'white',
          display: 'flex',
          flexFlow: { xs: 'column nowrap', sm: 'row nowrap' },
          alignItems: 'center',
        }}
      >
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
      </Box>
    </Box>
  );
}
