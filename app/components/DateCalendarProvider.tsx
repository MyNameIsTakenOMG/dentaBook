'use client';
import React from 'react';
import { Amplify, Auth } from 'aws-amplify';
import awsExports from '@/src/aws-exports';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

Amplify.configure({ ...awsExports, ssr: true });

export default function DateCalendarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {children}
    </LocalizationProvider>
  );
}
