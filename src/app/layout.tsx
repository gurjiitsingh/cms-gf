import './globals.css';
import Sidebar from './Sidebar';
import type { Metadata } from 'next';

import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard layout',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 bg-gray-100 p-6">{children}</main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}


