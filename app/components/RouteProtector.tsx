'use client';
import React, { useEffect } from 'react';
import { useAppSelector } from '../store';
import { usePathname, useRouter } from 'next/navigation';
import { Box, Skeleton } from '@mui/material';
import { grey } from '@mui/material/colors';

// import { Amplify, Auth } from 'aws-amplify';
// import awsExports from '@/src/aws-exports';
// Amplify.configure({ ...awsExports, ssr: true });

export default function RouteProtector({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAppSelector((state) => state.auth);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isLoading && !auth.authInfo) {
      router.push('/');
    }
  }, [auth.isLoading, auth.authInfo]);

  if (auth.isLoading && pathname === '/profile')
    return (
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexFlow: 'column',
          p: { xs: '2rem', md: '5rem' },
        }}
      >
        <Box
          sx={{
            mt: '2rem',
            width: '100%',
            maxWidth: '1000px',
            display: 'flex',
            flexFlow: { xs: 'column', md: 'row' },
            gap: '1.5rem',
            justifyContent: { xs: 'unset', md: 'center' },
          }}
        >
          <Skeleton
            variant="rounded"
            sx={{
              height: { xs: '56px', md: '120px' },
              width: { xs: '100%', md: '30%' },
            }}
          />
          <Skeleton
            variant="rounded"
            sx={{
              height: { xs: '240px', md: '320px' },
              width: { xs: '100%', md: '70%' },
            }}
          />
        </Box>
      </Box>
    );

  if (auth.isLoading && pathname === '/admin')
    return (
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          position: 'relative',
          display: 'flex',
          flexFlow: 'column',
          overflow: 'auto',
          zIndex: 1250,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexFlow: 'column nowrap',
            width: '240px',
            height: '100vh',
            p: '0.8rem',
            rowGap: '1rem',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1250,
            bgcolor: grey['50'],
          }}
        >
          <Skeleton
            variant="rounded"
            sx={{
              height: '320px',
              width: '100%',
            }}
          />
        </Box>
        <Box
          sx={{
            // border: '1px solid black',
            width: 'calc(100% - 240px)',
            height: '100vh',
            p: '0.8rem',
            overflow: 'auto',
            display: 'flex',
            flexFlow: 'column',
            rowGap: '1rem',
            position: 'fixed',
            top: 0,
            left: 240,
            zIndex: 1250,
            bgcolor: grey['50'],
          }}
        >
          <Skeleton
            variant="rounded"
            sx={{
              height: '240px',
              width: '100%',
            }}
          />
          <Skeleton
            variant="rounded"
            sx={{
              height: '240px',
              width: '100%',
            }}
          />
          <Skeleton
            variant="rounded"
            sx={{
              height: '240px',
              width: '100%',
            }}
          />
        </Box>
      </Box>
    );

  if (!auth.isLoading && auth.authInfo) return <>{children}</>;
}
