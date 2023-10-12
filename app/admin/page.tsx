'use client';
import { Amplify, Auth } from 'aws-amplify';
import awsExports from '@/src/aws-exports';
import React from 'react';
import styles from './page.module.css';

Amplify.configure({ ...awsExports, ssr: true });

export default function AdminPage() {
  return <main className={styles.main}>AdminPage</main>;
}
