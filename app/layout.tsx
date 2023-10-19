import './globals.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@aws-amplify/ui-react/styles.css';
// import { Amplify } from 'aws-amplify';
// import awsExports from '../src/aws-exports';
import Header from './components/Header';
import Footer from './components/Footer';
import StoreProvider from './store/StoreProvider';
import DateCalendarProvider from './components/DateCalendarProvider';

// Amplify.configure({ ...awsExports, ssr: true });

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <DateCalendarProvider>
          <StoreProvider>
            <Header />
            {children}
            <Footer />
          </StoreProvider>
        </DateCalendarProvider>
      </body>
    </html>
  );
}
