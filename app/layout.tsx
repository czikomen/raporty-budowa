import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Raporty Budowa',
  description: 'System zarządzania kontrolami budowlanymi',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl">
      <body className="bg-gray-50 text-gray-900 font-sans">
        <main className="max-w-7xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
